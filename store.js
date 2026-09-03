/* Almacenamiento local + "API" simulada.
   Reemplaza al backend: todo corre en el navegador con localStorage. */

const LS_DB = 'cda_db_v2';
const LS_SESSION = 'cda_session_v1';

let DB;
function loadDB() {
  try { DB = JSON.parse(localStorage.getItem(LS_DB)); } catch (e) { DB = null; }
  if (!DB || !DB.users) { DB = window.SEED(); saveDB(); }
  DB.pins = DB.pins || [];
  DB.messages = DB.messages || [];
}
function saveDB() { localStorage.setItem(LS_DB, JSON.stringify(DB)); }
function resetDB() { DB = window.SEED(); saveDB(); localStorage.removeItem(LS_SESSION); }
loadDB();

// ---------- helpers ----------
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Math.random().toString(36).slice(2));
const byId = (arr, id) => arr.find(x => x.id === id);
const nameOf = (arr, id) => (byId(arr, id) || {}).name || '—';
const publicUser = u => ({ id: u.id, name: u.name, email: u.email, role: u.role, centerId: u.centerId, color: u.color || '#EE6A1E' });
const ROLE_LABELS = { coordinador: 'Coordinador general', encargado: 'Encargado de centro', voluntario: 'Voluntario', institucion: 'Institución receptora', lider: 'Líder de campaña' };

// ---- organigrama: quién manda a quién ----
function coordUser() { return DB.users.find(u => u.role === 'coordinador'); }
function orgNode(u) {
  const center = u.centerId ? byId(DB.centers, u.centerId) : null;
  return { id: u.id, name: u.name, role: u.role, roleLabel: ROLE_LABELS[u.role] || u.role, color: u.color || '#EE6A1E', centerName: center ? center.name : null, email: u.email, children: [] };
}
function buildOrgTree() {
  const coord = coordUser();
  if (!coord) return null;
  const root = orgNode(coord);
  // líderes de campaña
  DB.users.filter(u => u.role === 'lider').forEach(l => root.children.push(orgNode(l)));
  // encargados con sus voluntarios
  DB.users.filter(u => u.role === 'encargado').forEach(e => {
    const n = orgNode(e);
    DB.users.filter(v => v.role === 'voluntario' && v.centerId === e.centerId).forEach(v => n.children.push(orgNode(v)));
    root.children.push(n);
  });
  // instituciones receptoras
  DB.users.filter(u => u.role === 'institucion').forEach(i => root.children.push(orgNode(i)));
  return root;
}
function managerOf(u) {
  if (u.role === 'coordinador') return null;
  if (u.role === 'voluntario') {
    const e = DB.users.find(x => x.role === 'encargado' && x.centerId === u.centerId);
    return e || coordUser();
  }
  return coordUser(); // encargado, institución, líder reportan a coordinación
}
function teamOf(u) {
  if (u.role === 'coordinador') return DB.users.filter(x => x.id !== u.id);
  if (u.role === 'encargado') return DB.users.filter(x => x.role === 'voluntario' && x.centerId === u.centerId);
  if (u.role === 'lider') {
    const camp = DB.campaigns.find(c => c.liderId === u.id);
    if (!camp) return [];
    const centerIds = DB.centers.filter(c => c.campaignIds.includes(camp.id)).map(c => c.id);
    return DB.users.filter(x => x.role === 'encargado' && centerIds.includes(x.centerId));
  }
  return [];
}
const clone = x => JSON.parse(JSON.stringify(x));
const currentUser = () => DB.users.find(u => u.id === localStorage.getItem(LS_SESSION)) || null;

function signed(m) {
  if (m.type === 'ajuste') return m.quantity;
  if (m.type === 'recepcion' || m.type === 'transferencia-entrada') return m.quantity;
  if (m.type === 'entrega' || m.type === 'merma' || m.type === 'transferencia-salida') return -m.quantity;
  return 0;
}
function currentStock(centerId, campaignId, articleId) {
  return DB.movements
    .filter(m => m.centerId === centerId && m.campaignId === campaignId && m.articleId === articleId)
    .reduce((s, m) => s + signed(m), 0);
}
function stockRows(filter = {}) {
  const map = new Map();
  for (const m of DB.movements) {
    if (filter.centerId && m.centerId !== filter.centerId) continue;
    if (filter.campaignId && m.campaignId !== filter.campaignId) continue;
    const key = `${m.centerId}|${m.campaignId}|${m.articleId}`;
    map.set(key, (map.get(key) || 0) + signed(m));
  }
  return [...map].map(([k, qty]) => {
    const [centerId, campaignId, articleId] = k.split('|');
    return { centerId, campaignId, articleId, qty };
  });
}
function enrich(m) {
  return {
    ...m,
    articleName: nameOf(DB.articles, m.articleId),
    articleUnit: (byId(DB.articles, m.articleId) || {}).unit || '',
    centerName: nameOf(DB.centers, m.centerId),
    campaignName: nameOf(DB.campaigns, m.campaignId),
    toCenterName: m.toCenterId ? nameOf(DB.centers, m.toCenterId) : null,
    institutionName: m.institutionUserId ? nameOf(DB.users, m.institutionUserId) : null,
  };
}
const isNum = n => typeof n === 'number' && isFinite(n);
const fail = m => { throw new Error(m); };

// ---------- API simulada ----------
async function api(pathQ, opts = {}) {
  await new Promise(r => setTimeout(r, 60)); // pequeño delay realista
  const [path, qsRaw] = pathQ.split('?');
  const q = Object.fromEntries(new URLSearchParams(qsRaw || ''));
  const method = opts.method || (opts.body ? 'POST' : 'GET');
  const b = opts.body || {};
  const seg = path.split('/').filter(Boolean);

  // ---- login ----
  if (path === '/login' && method === 'POST') {
    const u = DB.users.find(x => x.email === (b.email || '').toLowerCase().trim());
    if (!u || u.password !== b.password) fail('Correo o contraseña incorrectos.');
    localStorage.setItem(LS_SESSION, u.id);
    return { token: 'local', user: publicUser(u) };
  }
  // ---- inicio de sesión con Google (simulado / real vía id_token) ----
  if (path === '/google-login' && method === 'POST') {
    const email = (b.email || '').toLowerCase().trim();
    const name = b.name || email.split('@')[0];
    if (!email) fail('No se recibió la cuenta de Google.');
    let u = DB.users.find(x => x.email === email);
    if (!u) {
      const palette = ['#EE6A1E', '#1A1A1A', '#C8530F', '#3A3A3A'];
      u = { id: uid(), name, email, password: uid(), role: b.role || 'coordinador', centerId: null, color: palette[DB.users.length % palette.length], google: true };
      DB.users.push(u); saveDB();
    }
    localStorage.setItem(LS_SESSION, u.id);
    return { token: 'google', user: publicUser(u) };
  }

  // ---- registro de usuario (autoservicio desde la pantalla de acceso) ----
  if (path === '/register' && method === 'POST') {
    const email = (b.email || '').toLowerCase().trim();
    const name = (b.name || '').trim();
    const pass = b.password || '';
    const role = b.role || 'voluntario';
    if (!name || !email || !pass) fail('Nombre, correo y contraseña son obligatorios.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fail('El correo no tiene un formato válido.');
    if (pass.length < 6) fail('La contraseña debe tener al menos 6 caracteres.');
    if (!ROLE_LABELS[role]) fail('Rol no válido.');
    if (DB.users.some(u => u.email === email)) fail('Ese correo ya está registrado. Inicia sesión.');
    const palette = ['#EE6A1E', '#1A1A1A', '#C8530F', '#3A3A3A', '#B85410'];
    const u = { id: uid(), name, email, password: pass, role, centerId: b.centerId || null, color: palette[DB.users.length % palette.length] };
    DB.users.push(u); saveDB();
    localStorage.setItem(LS_SESSION, u.id);
    return { token: 'local', user: publicUser(u) };
  }

  const me = currentUser();
  if (!me) fail('Sesión no válida. Inicia sesión de nuevo.');
  const isCoord = me.role === 'coordinador';
  const canSeeAll = isCoord || me.role === 'lider';

  // ---- me / bootstrap ----
  if (path === '/me') return publicUser(me);
  if (path === '/bootstrap') {
    const centers = canSeeAll ? DB.centers : DB.centers.filter(c => c.id === me.centerId);
    return clone({
      user: publicUser(me),
      campaigns: DB.campaigns,
      centers,
      articles: DB.articles,
      institutions: DB.users.filter(x => x.role === 'institucion').map(publicUser),
      myCenter: me.centerId ? byId(DB.centers, me.centerId) : null,
    });
  }

  // ---- campañas ----
  if (path === '/campaigns' && method === 'GET') return clone(DB.campaigns);
  if (path === '/campaigns' && method === 'POST') {
    if (!isCoord) fail('No tienes permiso.');
    if (!b.name) fail('El nombre es obligatorio.');
    const c = { id: uid(), name: b.name, startDate: b.startDate || null, endDate: b.endDate || null, description: b.description || '', active: true, liderId: b.liderId || null };
    DB.campaigns.push(c); saveDB();
    return clone(c);
  }
  if (seg[0] === 'campaigns' && seg.length === 2 && method === 'PATCH') {
    const c = byId(DB.campaigns, seg[1]);
    if (!c) fail('Campaña no encontrada.');
    const isLider = me.role === 'lider' && c.liderId === me.id;
    if (!isCoord && !isLider) fail('No tienes permiso.');
    ['name', 'startDate', 'endDate', 'description', 'liderId'].forEach(k => { if (k in b) c[k] = b[k]; });
    if ('active' in b && isCoord) c.active = !!b.active;
    saveDB();
    return clone(c);
  }

  // ---- centros ----
  if (path === '/centers' && method === 'GET')
    return clone(canSeeAll ? DB.centers : DB.centers.filter(c => c.id === me.centerId));
  if (path === '/centers' && method === 'POST') {
    if (!isCoord) fail('No tienes permiso.');
    if (!b.name) fail('El nombre es obligatorio.');
    const c = { id: uid(), name: b.name, institution: b.institution || '', location: b.location || '', encargadoId: b.encargadoId || null, campaignIds: b.campaignIds || [], active: true };
    DB.centers.push(c);
    if (b.encargadoId) { const e = byId(DB.users, b.encargadoId); if (e) e.centerId = c.id; }
    saveDB();
    return clone(c);
  }
  if (seg[0] === 'centers' && seg.length === 2 && method === 'PATCH') {
    if (!isCoord) fail('No tienes permiso.');
    const c = byId(DB.centers, seg[1]);
    if (!c) fail('Centro no encontrado.');
    ['name', 'institution', 'location', 'campaignIds'].forEach(k => { if (k in b) c[k] = b[k]; });
    if ('active' in b) c.active = !!b.active;
    if ('encargadoId' in b) {
      c.encargadoId = b.encargadoId || null;
      const e = byId(DB.users, b.encargadoId); if (e) e.centerId = c.id;
    }
    saveDB();
    return clone(c);
  }

  // ---- artículos ----
  if (path === '/articles' && method === 'GET') return clone(DB.articles);
  if (path === '/articles' && method === 'POST') {
    if (!isCoord) fail('No tienes permiso.');
    if (!b.name || !b.category || !b.unit) fail('Nombre, categoría y unidad son obligatorios.');
    const a = { id: uid(), name: b.name, category: b.category, unit: b.unit };
    DB.articles.push(a); saveDB();
    return clone(a);
  }

  // ---- cuentas ----
  if (path === '/users' && method === 'GET') {
    if (!isCoord) fail('No tienes permiso.');
    return DB.users.map(publicUser);
  }
  if (path === '/users' && method === 'POST') {
    if (!isCoord) fail('No tienes permiso.');
    if (!b.name || !b.email || !b.password || !b.role) fail('Nombre, correo, contraseña y rol son obligatorios.');
    if (DB.users.some(u => u.email === b.email.toLowerCase().trim())) fail('Ese correo ya está registrado.');
    const u = { id: uid(), name: b.name, email: b.email.toLowerCase().trim(), password: b.password, role: b.role, centerId: b.centerId || null };
    DB.users.push(u); saveDB();
    return publicUser(u);
  }

  // ---- movimientos ----
  const TYPE_ROLES = {
    recepcion: ['encargado', 'voluntario'],
    entrega: ['encargado', 'voluntario'],
    merma: ['encargado'],
    ajuste: ['encargado', 'coordinador'],
  };
  if (path === '/movements' && method === 'GET') {
    let list = DB.movements;
    if (!canSeeAll) list = list.filter(m => m.centerId === me.centerId);
    if (q.centerId) list = list.filter(m => m.centerId === q.centerId);
    if (q.campaignId) list = list.filter(m => m.campaignId === q.campaignId);
    list = [...list].sort((a, c) => (c.date || '').localeCompare(a.date || '')).map(enrich);
    if (q.format === 'csv') {
      const head = 'fecha,tipo,centro,campaña,artículo,cantidad,unidad,motivo,actor,donante,destino\n';
      const rows = list.map(m => [
        m.date, m.type, m.centerName, m.campaignName, m.articleName, m.quantity, m.articleUnit,
        m.motive || '', m.actorName || '', m.donor || '', m.toCenterName || m.institutionName || '',
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
      return { csv: head + rows };
    }
    return list;
  }
  if (path === '/movements' && method === 'POST') {
    const type = b.type;
    if (!TYPE_ROLES[type]) fail('Tipo de movimiento no válido.');
    if (!TYPE_ROLES[type].includes(me.role)) fail('Tu rol no puede registrar este movimiento.');
    const centerId = isCoord ? b.centerId : me.centerId;
    const center = byId(DB.centers, centerId);
    if (!center) fail('Centro no válido.');
    const campaign = byId(DB.campaigns, b.campaignId);
    if (!campaign || !campaign.active) fail('Selecciona una campaña activa.');
    if (!byId(DB.articles, b.articleId)) fail('Artículo no válido.');
    let quantity = Number(b.quantity);
    if (!isNum(quantity) || quantity === 0) fail('La cantidad debe ser un número distinto de cero.');
    if (type !== 'ajuste' && quantity < 0) fail('La cantidad debe ser positiva.');
    if (type !== 'ajuste') quantity = Math.abs(quantity);
    if ((type === 'merma' || type === 'ajuste') && !b.motive) fail('El motivo es obligatorio en merma y ajuste.');
    if (type === 'entrega' && !byId(DB.users, b.institutionUserId)) fail('Selecciona la institución receptora.');
    const stock = currentStock(centerId, b.campaignId, b.articleId);
    const delta = type === 'ajuste' ? quantity : (type === 'recepcion' ? quantity : -quantity);
    if (stock + delta < 0) fail(`Stock insuficiente. Disponible: ${stock}.`);
    const m = {
      id: uid(), type, centerId, campaignId: b.campaignId, articleId: b.articleId, quantity,
      date: new Date().toISOString(), actorId: me.id, actorName: me.name,
      motive: b.motive || null, note: b.note || null,
      donor: type === 'recepcion' ? (b.anon ? 'Anónimo' : (b.donor || 'Anónimo')) : null,
      institutionUserId: type === 'entrega' ? b.institutionUserId : null,
      status: type === 'entrega' ? 'pendiente' : null,
    };
    DB.movements.push(m); saveDB();
    return enrich(m);
  }

  // ---- transferencia ----
  if (path === '/transfers' && method === 'POST') {
    if (!['encargado', 'coordinador'].includes(me.role)) fail('No tienes permiso.');
    const fromId = isCoord ? b.fromCenterId : me.centerId;
    const from = byId(DB.centers, fromId);
    const to = byId(DB.centers, b.toCenterId);
    const campaign = byId(DB.campaigns, b.campaignId);
    if (!from || !to || from.id === to.id) fail('Centro de origen o destino no válido.');
    if (!campaign || !campaign.active) fail('Selecciona una campaña activa.');
    if (!from.campaignIds.includes(campaign.id) || !to.campaignIds.includes(campaign.id))
      fail('Ambos centros deben participar en la misma campaña.');
    if (!byId(DB.articles, b.articleId)) fail('Artículo no válido.');
    const quantity = Math.abs(Number(b.quantity));
    if (!isNum(quantity) || quantity === 0) fail('Cantidad no válida.');
    const stock = currentStock(from.id, campaign.id, b.articleId);
    if (stock - quantity < 0) fail(`Stock insuficiente en el centro origen. Disponible: ${stock}.`);
    const pairId = uid();
    const base = { campaignId: campaign.id, articleId: b.articleId, quantity, pairId, date: new Date().toISOString(), actorId: me.id, actorName: me.name, motive: null, note: b.note || null };
    const out = { id: uid(), type: 'transferencia-salida', centerId: from.id, toCenterId: to.id, ...base };
    const inc = { id: uid(), type: 'transferencia-entrada', centerId: to.id, toCenterId: from.id, ...base };
    DB.movements.push(out, inc); saveDB();
    return { out: enrich(out), in: enrich(inc) };
  }

  // ---- institución receptora ----
  if (path === '/deliveries' && method === 'GET') {
    if (me.role !== 'institucion') fail('No tienes permiso.');
    return DB.movements.filter(m => m.type === 'entrega' && m.institutionUserId === me.id)
      .sort((a, c) => (c.date || '').localeCompare(a.date || '')).map(enrich);
  }
  if (seg[0] === 'deliveries' && seg[2] === 'confirm' && method === 'POST') {
    if (me.role !== 'institucion') fail('No tienes permiso.');
    const m = byId(DB.movements, seg[1]);
    if (!m || m.institutionUserId !== me.id) fail('Entrega no encontrada.');
    m.status = 'recibida'; m.confirmedAt = new Date().toISOString();
    saveDB();
    return enrich(m);
  }

  // ---- dashboards ----
  if (path === '/dashboard/global') {
    if (!isCoord) fail('No tienes permiso.');
    const sum = pred => DB.movements.filter(pred).reduce((s, m) => s + m.quantity, 0);
    const campaigns = DB.campaigns.map(c => ({
      id: c.id, name: c.name, active: c.active,
      centers: DB.centers.filter(ct => ct.campaignIds.includes(c.id)).length,
      stock: stockRows({ campaignId: c.id }).reduce((s, r) => s + r.qty, 0),
      recepciones: sum(m => m.campaignId === c.id && m.type === 'recepcion'),
      entregas: sum(m => m.campaignId === c.id && m.type === 'entrega'),
      merma: sum(m => m.campaignId === c.id && m.type === 'merma'),
    }));
    const centersComparison = DB.centers.map(ct => ({
      id: ct.id, name: ct.name, active: ct.active,
      stock: stockRows({ centerId: ct.id }).reduce((s, r) => s + r.qty, 0),
      entradas: sum(m => m.centerId === ct.id && (m.type === 'recepcion' || m.type === 'transferencia-entrada')),
      salidas: sum(m => m.centerId === ct.id && ['entrega', 'merma', 'transferencia-salida'].includes(m.type)),
    }));
    const topMap = new Map();
    DB.movements.filter(m => m.type === 'recepcion').forEach(m => topMap.set(m.articleId, (topMap.get(m.articleId) || 0) + m.quantity));
    const topArticles = [...topMap].map(([id, total]) => ({ name: nameOf(DB.articles, id), total }))
      .sort((a, c) => c.total - a.total).slice(0, 5);
    return { campaigns, centersComparison, mermaTotal: sum(m => m.type === 'merma'), topArticles };
  }
  if (seg[0] === 'dashboard' && seg[1] === 'center' && seg.length === 3) {
    const centerId = seg[2];
    if (!isCoord && me.centerId !== centerId) fail('Solo puedes ver tu propio centro.');
    const center = byId(DB.centers, centerId);
    if (!center) fail('Centro no encontrado.');
    const sum = pred => DB.movements.filter(m => m.centerId === centerId && pred(m)).reduce((s, m) => s + m.quantity, 0);
    const stock = stockRows({ centerId }).filter(r => r.qty !== 0).map(r => ({
      article: nameOf(DB.articles, r.articleId),
      unit: (byId(DB.articles, r.articleId) || {}).unit || '',
      campaign: nameOf(DB.campaigns, r.campaignId),
      qty: r.qty,
    })).sort((a, c) => a.article.localeCompare(c.article));
    return {
      center: { id: center.id, name: center.name, institution: center.institution },
      stock,
      entradas: sum(m => m.type === 'recepcion' || m.type === 'transferencia-entrada'),
      salidas: sum(m => ['entrega', 'transferencia-salida'].includes(m.type)),
      merma: sum(m => m.type === 'merma'),
      history: DB.movements.filter(m => m.centerId === centerId)
        .sort((a, c) => (c.date || '').localeCompare(a.date || '')).slice(0, 25).map(enrich),
    };
  }
  if (seg[0] === 'dashboard' && seg[1] === 'campaign' && seg.length === 3) {
    if (!isCoord && me.role !== 'lider') fail('No tienes permiso.');
    const c = byId(DB.campaigns, seg[2]);
    if (!c) fail('Campaña no encontrada.');
    if (me.role === 'lider' && c.liderId !== me.id) fail('No gestionas esta campaña.');
    const sum = pred => DB.movements.filter(m => m.campaignId === c.id && pred(m)).reduce((s, m) => s + m.quantity, 0);
    const centers = DB.centers.filter(ct => ct.campaignIds.includes(c.id)).map(ct => ({
      name: ct.name,
      stock: stockRows({ centerId: ct.id, campaignId: c.id }).reduce((s, r) => s + r.qty, 0),
    }));
    return {
      campaign: clone(c), centers,
      totals: {
        stock: stockRows({ campaignId: c.id }).reduce((s, r) => s + r.qty, 0),
        recepciones: sum(m => m.type === 'recepcion'),
        entregas: sum(m => m.type === 'entrega'),
        merma: sum(m => m.type === 'merma'),
      },
    };
  }

  // ---- organigrama ----
  if (path === '/org') {
    const full = buildOrgTree();
    const mgr = managerOf(me);
    return {
      me: orgNode(me),
      manager: mgr ? orgNode(mgr) : null,
      team: teamOf(me).map(orgNode),
      tree: full,
      roles: Object.entries(ROLE_LABELS).map(([k, v]) => ({ key: k, label: v, count: DB.users.filter(u => u.role === k).length })),
      totals: {
        users: DB.users.length,
        centers: DB.centers.length,
        activeCenters: DB.centers.filter(c => c.active).length,
        campaigns: DB.campaigns.filter(c => c.active).length,
      },
    };
  }

  // ---- pendientes fijados (sistema + personales) ----
  if (path === '/pending') {
    const items = [];
    const push = (text, tone, route) => items.push({ id: 'sys-' + items.length, text, tone: tone || 'orange', route: route || null, system: true });
    if (isCoord) {
      const sinEnc = DB.centers.filter(c => c.active && !c.encargadoId).length;
      if (sinEnc) push(`${sinEnc} centro(s) sin encargado asignado`, 'orange', 'centros');
      const inact = DB.campaigns.filter(c => !c.active).length;
      if (inact) push(`${inact} campaña(s) inactiva(s)`, 'gray', 'campanas');
      const pend = DB.movements.filter(m => m.type === 'entrega' && m.status === 'pendiente').length;
      if (pend) push(`${pend} entrega(s) sin confirmar por instituciones`, 'orange', 'movimientos');
    }
    if (me.role === 'encargado') {
      const low = stockRows({ centerId: me.centerId }).filter(r => r.qty > 0 && r.qty <= 20).length;
      if (low) push(`${low} artículo(s) con stock bajo en tu centro`, 'orange', 'centro');
      const pend = DB.movements.filter(m => m.type === 'entrega' && m.centerId === me.centerId && m.status === 'pendiente').length;
      if (pend) push(`${pend} entrega(s) de tu centro esperan confirmación`, 'gray', 'historial');
    }
    if (me.role === 'voluntario') push('Registra las donaciones recibidas hoy', 'orange', 'registrar');
    if (me.role === 'institucion') {
      const pend = DB.movements.filter(m => m.type === 'entrega' && m.institutionUserId === me.id && m.status === 'pendiente').length;
      if (pend) push(`${pend} entrega(s) por confirmar como recibidas`, 'orange', 'entregas');
    }
    if (me.role === 'lider') {
      const camp = DB.campaigns.find(c => c.liderId === me.id);
      if (camp) {
        const centros = DB.centers.filter(c => c.campaignIds.includes(camp.id));
        const sinAct = centros.filter(c => !DB.movements.some(m => m.centerId === c.id)).length;
        if (sinAct) push(`${sinAct} centro(s) de tu campaña sin actividad`, 'orange', 'campana');
      }
    }
    const pins = DB.pins.filter(p => p.userId === me.id).map(clone);
    return { system: items, pins };
  }
  if (path === '/pins' && method === 'POST') {
    if (!b.text || !b.text.trim()) fail('Escribe el pendiente.');
    const p = { id: uid(), userId: me.id, text: b.text.trim(), done: false, date: new Date().toISOString() };
    DB.pins.push(p); saveDB();
    return clone(p);
  }
  if (seg[0] === 'pins' && seg.length === 2 && method === 'PATCH') {
    const p = byId(DB.pins, seg[1]);
    if (!p || p.userId !== me.id) fail('Pendiente no encontrado.');
    if ('done' in b) p.done = !!b.done;
    if ('text' in b) p.text = b.text;
    saveDB();
    return clone(p);
  }
  if (seg[0] === 'pins' && seg.length === 2 && method === 'DELETE') {
    const i = DB.pins.findIndex(p => p.id === seg[1] && p.userId === me.id);
    if (i < 0) fail('Pendiente no encontrado.');
    DB.pins.splice(i, 1); saveDB();
    return { ok: true };
  }

  // ---- chat entre usuarios ----
  const chatSummary = (otherId) => {
    const conv = DB.messages.filter(m => (m.fromId === me.id && m.toId === otherId) || (m.fromId === otherId && m.toId === me.id))
      .sort((a, c) => (a.date || '').localeCompare(c.date || ''));
    const last = conv[conv.length - 1];
    const unread = conv.filter(m => m.toId === me.id && !m.read).length;
    return { last: last ? { text: last.text, date: last.date, mine: last.fromId === me.id } : null, unread };
  };
  if (path === '/chat/contacts') {
    const list = DB.users.filter(u => u.id !== me.id).map(u => ({ ...publicUser(u), ...chatSummary(u.id) }));
    list.sort((a, c) => {
      const at = a.last ? a.last.date : '', ct = c.last ? c.last.date : '';
      return (ct || '').localeCompare(at || '');
    });
    return list;
  }
  if (path === '/chat/unread') {
    return { count: DB.messages.filter(m => m.toId === me.id && !m.read).length };
  }
  if (path === '/chat' && method === 'POST') {
    const to = byId(DB.users, b.toId);
    if (!to) fail('Destinatario no válido.');
    if (!b.text || !b.text.trim()) fail('Escribe un mensaje.');
    const m = { id: uid(), fromId: me.id, toId: to.id, text: b.text.trim(), date: new Date().toISOString(), read: false };
    DB.messages.push(m); saveDB();
    return clone(m);
  }
  if (seg[0] === 'chat' && seg.length === 2 && method === 'GET') {
    const otherId = seg[1];
    const other = byId(DB.users, otherId);
    if (!other) fail('Usuario no encontrado.');
    let changed = false;
    DB.messages.forEach(m => { if (m.fromId === otherId && m.toId === me.id && !m.read) { m.read = true; changed = true; } });
    if (changed) saveDB();
    const conv = DB.messages.filter(m => (m.fromId === me.id && m.toId === otherId) || (m.fromId === otherId && m.toId === me.id))
      .sort((a, c) => (a.date || '').localeCompare(c.date || ''))
      .map(m => ({ ...clone(m), mine: m.fromId === me.id }));
    return { other: publicUser(other), messages: conv };
  }

  fail('Ruta no encontrada: ' + method + ' ' + path);
}

function logoutSession() { localStorage.removeItem(LS_SESSION); }

// Expuesto para que la interfaz sepa si hay sesión sin llamar a la API.
window.currentUser = currentUser;
