'use strict';

const state = { user: null, boot: null, route: null };

const ROLE_LABEL = {
  coordinador: 'Coordinador general', encargado: 'Encargado de centro',
  voluntario: 'Voluntario de centro', institucion: 'Institución receptora', lider: 'Líder de campaña',
};
const MOTIVES = { caducidad: 'Caducidad', daño: 'Daño', perdida: 'Pérdida', correccion: 'Corrección' };
const TYPE_LABEL = {
  recepcion: 'Recepción', entrega: 'Entrega', merma: 'Merma', ajuste: 'Ajuste',
  'transferencia-salida': 'Transf. salida', 'transferencia-entrada': 'Transf. entrada',
};
const NAV = {
  coordinador: [['dashboard', 'Dashboard global'], ['centros', 'Centros'], ['campanas', 'Campañas'], ['movimientos', 'Movimientos'], ['cuentas', 'Cuentas']],
  encargado: [['centro', 'Mi centro'], ['registrar', 'Registrar movimiento'], ['historial', 'Historial']],
  voluntario: [['registrar', 'Registrar'], ['historial', 'Historial']],
  institucion: [['entregas', 'Entregas recibidas']],
  lider: [['campana', 'Mi campaña']],
};

// ---------- infra ----------
function toast(msg, err) {
  const t = document.createElement('div');
  t.className = 'toast' + (err ? ' err' : '');
  t.textContent = msg;
  document.getElementById('toasts').appendChild(t);
  setTimeout(() => t.remove(), 3800);
}
const h = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const opt = (v, label, sel) => `<option value="${esc(v)}"${sel === v ? ' selected' : ''}>${esc(label)}</option>`;

// marca (logo en SVG, hereda el color de acento)
const LOGO = `<span class="brand-mark" style="background:var(--accent)"><svg viewBox="0 0 32 32" aria-hidden="true">
  <path d="M16 26C16 26 6 20 6 12.8 6 9.1 8.9 6.3 12.4 6.3 14.4 6.3 16 7.9 16 7.9 16 7.9 17.6 6.3 19.6 6.3 23.1 6.3 26 9.1 26 12.8 26 20 16 26 16 26Z" fill="#fff"/>
</svg></span>`;

// ---------- tema ----------
function currentTheme() { return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'; }
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('cda_theme', t); } catch (e) {}
  document.querySelectorAll('[data-theme-btn]').forEach(b => b.textContent = t === 'dark' ? '☀️' : '🌙');
}
function toggleTheme() { applyTheme(currentTheme() === 'dark' ? 'light' : 'dark'); }
const themeBtnHtml = (extra = '') =>
  `<button class="icon-btn ${extra}" data-theme-btn title="Cambiar tema claro / oscuro">${currentTheme() === 'dark' ? '☀️' : '🌙'}</button>`;

function logout() { logoutSession(); state.user = null; state.boot = null; renderLogin(); }

// ---------- login ----------
const DEMO = [
  ['coord@demo.com', 'Coordinador general'],
  ['norte@demo.com', 'Encargado · Centro Norte'],
  ['vol.norte@demo.com', 'Voluntario · Centro Norte'],
  ['dif@demo.com', 'Institución receptora (DIF)'],
  ['lider@demo.com', 'Líder de campaña'],
];
function renderLogin() {
  document.getElementById('root').innerHTML = `
    ${themeBtnHtml('theme-fab')}
    <div class="login-wrap"><div class="login-card">
      ${LOGO}
      <h1>Acopia</h1>
      <p class="sub">Registro y coordinación de centros de acopio</p>
      <form id="loginForm">
        <label class="f"><span>Correo</span><input name="email" type="email" required autocomplete="username" placeholder="tu@correo.com" /></label>
        <label class="f"><span>Contraseña</span><input name="password" type="password" required autocomplete="current-password" placeholder="••••••" /></label>
        <button class="btn block" style="margin-top:6px">Entrar</button>
      </form>
      <div class="demo-list">
        <p>Cuentas de prueba · contraseña <b>demo123</b></p>
        ${DEMO.map(([e, l]) => `<button class="demo-chip" data-email="${e}"><b>${l}</b><span>${e}</span></button>`).join('')}
      </div>
    </div></div>`;
  document.getElementById('loginForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    try {
      const { user } = await api('/login', { body: { email: f.get('email'), password: f.get('password') } });
      state.user = user;
      await boot();
    } catch (e) { toast(e.message, true); }
  });
  document.querySelector('[data-theme-btn]').addEventListener('click', toggleTheme);
  document.querySelectorAll('.demo-chip').forEach(b => b.addEventListener('click', () => {
    const form = document.getElementById('loginForm');
    form.email.value = b.dataset.email;
    form.password.value = 'demo123';
  }));
}

// ---------- shell ----------
async function boot() {
  state.boot = await api('/bootstrap');
  state.user = state.boot.user;
  const nav = NAV[state.user.role] || [];
  state.route = nav[0] ? nav[0][0] : null;
  renderShell();
}
function renderShell() {
  const nav = NAV[state.user.role] || [];
  document.getElementById('root').innerHTML = `
    <div class="shell">
      <aside class="side">
        <div class="brand">${LOGO}<b>Acopia</b></div>
        <nav class="nav">
          ${nav.map(([r, l]) => `<button data-route="${r}" class="${r === state.route ? 'active' : ''}">${l}</button>`).join('')}
        </nav>
        <div class="who">
          <div class="id">
            <b>${esc(state.user.name)}</b>
            <span>${ROLE_LABEL[state.user.role] || state.user.role}</span>
          </div>
          <div class="who-actions">
            <button class="btn ghost sm" id="logoutBtn">Cerrar sesión</button>
            ${themeBtnHtml()}
          </div>
          <button class="reset" id="resetBtn" title="Borra los cambios y vuelve a los datos de ejemplo">↺ Reiniciar demo</button>
        </div>
      </aside>
      <main class="main" id="view"></main>
    </div>`;
  document.querySelectorAll('.nav button').forEach(b => b.addEventListener('click', () => { state.route = b.dataset.route; renderShell(); }));
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.querySelector('[data-theme-btn]').addEventListener('click', toggleTheme);
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('¿Reiniciar todos los datos a los de ejemplo?')) { resetDB(); location.reload(); }
  });
  renderView();
}
function header(title, sub) { return `<header><h2>${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ''}</header>`; }
const view = () => document.getElementById('view');

async function renderView() {
  const v = view();
  v.innerHTML = `<p class="empty">Cargando…</p>`;
  try {
    const r = state.route;
    if (r === 'dashboard') return viewGlobal(v);
    if (r === 'centros') return viewCentros(v);
    if (r === 'campanas') return viewCampanas(v);
    if (r === 'movimientos') return viewMovimientos(v);
    if (r === 'cuentas') return viewCuentas(v);
    if (r === 'centro') return viewCentro(v, state.user.centerId);
    if (r === 'registrar') return viewRegistrar(v);
    if (r === 'historial') return viewHistorial(v);
    if (r === 'entregas') return viewEntregas(v);
    if (r === 'campana') return viewCampana(v);
    v.innerHTML = `<p class="empty">Selecciona una sección.</p>`;
  } catch (e) { v.innerHTML = `<p class="empty">${esc(e.message)}</p>`; }
}

// ---------- modal ----------
function modal(title, fieldsHtml, onSubmit) {
  const bg = h(`<div class="modal-bg"><div class="modal"><h3>${esc(title)}</h3>
    <form id="mForm">${fieldsHtml}
    <div class="row-actions"><button class="btn" type="submit">Guardar</button>
    <button class="btn ghost" type="button" id="mCancel">Cancelar</button></div></form></div></div>`);
  document.body.appendChild(bg);
  const close = () => bg.remove();
  bg.addEventListener('click', e => { if (e.target === bg) close(); });
  bg.querySelector('#mCancel').addEventListener('click', close);
  bg.querySelector('#mForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(ev.target).entries());
    try { await onSubmit(data); close(); } catch (e) { toast(e.message, true); }
  });
}

// ---------- coordinador: global ----------
async function viewGlobal(v) {
  const d = await api('/dashboard/global');
  const activeCamp = d.campaigns.filter(c => c.active).length;
  const totalStock = d.centersComparison.reduce((s, c) => s + c.stock, 0);
  v.innerHTML = header('Dashboard global', 'Visión de todas las campañas y centros') + `
    <div class="grid cols-4">
      <div class="stat"><div class="label">Campañas activas</div><div class="value">${activeCamp}</div></div>
      <div class="stat"><div class="label">Centros</div><div class="value">${d.centersComparison.length}</div></div>
      <div class="stat"><div class="label">Stock total</div><div class="value">${totalStock}</div></div>
      <div class="stat"><div class="label">Merma total</div><div class="value">${d.mermaTotal}</div></div>
    </div>
    <div class="section-title"><h3>Totales por campaña</h3></div>
    <div class="card"><table><thead><tr><th>Campaña</th><th>Centros</th><th>Recepciones</th><th>Entregas</th><th>Merma</th><th>Stock</th></tr></thead>
      <tbody>${d.campaigns.map(c => `<tr><td><b>${esc(c.name)}</b> ${c.active ? '<span class="pill green">activa</span>' : '<span class="pill gray">inactiva</span>'}</td>
        <td>${c.centers}</td><td>${c.recepciones}</td><td>${c.entregas}</td><td>${c.merma}</td><td><b>${c.stock}</b></td></tr>`).join('')}</tbody></table></div>
    <div class="section-title"><h3>Comparativa entre centros</h3></div>
    <div class="card"><table><thead><tr><th>Centro</th><th>Entradas</th><th>Salidas</th><th>Stock actual</th></tr></thead>
      <tbody>${d.centersComparison.map(c => `<tr><td>${esc(c.name)} ${c.active ? '' : '<span class="pill gray">inactivo</span>'}</td>
        <td>${c.entradas}</td><td>${c.salidas}</td><td><b>${c.stock}</b></td></tr>`).join('')}</tbody></table></div>
    <div class="section-title"><h3>Artículos más donados</h3></div>
    <div class="card">${d.topArticles.length ? `<table><tbody>${d.topArticles.map(a => `<tr><td>${esc(a.name)}</td><td style="text-align:right"><b>${a.total}</b></td></tr>`).join('')}</tbody></table>` : '<p class="empty">Sin datos</p>'}</div>`;
}

// ---------- coordinador: centros ----------
async function viewCentros(v) {
  const [centers, users, campaigns] = await Promise.all([api('/centers'), api('/users'), api('/campaigns')]);
  const encargados = users.filter(u => u.role === 'encargado');
  v.innerHTML = header('Centros de acopio') + `
    <div class="row-actions" style="margin-bottom:16px"><button class="btn" id="new">+ Nuevo centro</button></div>
    <div class="grid cols-2">${centers.map(c => {
      const enc = users.find(u => u.id === c.encargadoId);
      return `<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div><h3>${esc(c.name)}</h3><p style="color:var(--muted);font-size:13px;margin:4px 0">${esc(c.institution || '—')} · ${esc(c.location || '')}</p></div>
          <span class="pill ${c.active ? 'green' : 'gray'}">${c.active ? 'activo' : 'inactivo'}</span>
        </div>
        <p style="font-size:13px">Encargado: <b>${esc(enc ? enc.name : 'sin asignar')}</b></p>
        <p style="font-size:13px">Campañas: ${c.campaignIds.map(id => esc((campaigns.find(x => x.id === id) || {}).name || '')).join(', ') || '—'}</p>
        <div class="row-actions"><button class="btn sm ghost" data-edit="${c.id}">Editar</button>
        <button class="btn sm ghost" data-toggle="${c.id}">${c.active ? 'Desactivar' : 'Activar'}</button></div>
      </div>`;
    }).join('')}</div>`;

  const campCheckboxes = (sel = []) => campaigns.map(c =>
    `<label class="f-inline"><input type="checkbox" name="camp" value="${c.id}" ${sel.includes(c.id) ? 'checked' : ''}/> ${esc(c.name)}</label>`).join('');
  const encOptions = (sel) => `<option value="">— sin asignar —</option>` + encargados.map(e => opt(e.id, e.name, sel)).join('');
  const saveCenter = (id) => async (data) => {
    const camps = [...document.querySelectorAll('input[name=camp]:checked')].map(x => x.value);
    const body = { name: data.name, institution: data.institution, location: data.location, encargadoId: data.encargadoId || null, campaignIds: camps };
    await api(id ? `/centers/${id}` : '/centers', { method: id ? 'PATCH' : 'POST', body });
    toast('Centro guardado'); renderView();
  };
  document.getElementById('new').addEventListener('click', () => modal('Nuevo centro', `
    <label class="f"><span>Nombre</span><input name="name" required/></label>
    <label class="f"><span>Institución</span><input name="institution"/></label>
    <label class="f"><span>Ubicación</span><input name="location"/></label>
    <label class="f"><span>Encargado</span><select name="encargadoId">${encOptions()}</select></label>
    <label class="f"><span>Campañas</span></label>${campCheckboxes()}`, saveCenter()));
  document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => {
    const c = centers.find(x => x.id === b.dataset.edit);
    modal('Editar centro', `
      <label class="f"><span>Nombre</span><input name="name" value="${esc(c.name)}" required/></label>
      <label class="f"><span>Institución</span><input name="institution" value="${esc(c.institution || '')}"/></label>
      <label class="f"><span>Ubicación</span><input name="location" value="${esc(c.location || '')}"/></label>
      <label class="f"><span>Encargado</span><select name="encargadoId">${encOptions(c.encargadoId)}</select></label>
      <label class="f"><span>Campañas</span></label>${campCheckboxes(c.campaignIds)}`, saveCenter(c.id));
  }));
  document.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', async () => {
    const c = centers.find(x => x.id === b.dataset.toggle);
    await api(`/centers/${c.id}`, { method: 'PATCH', body: { active: !c.active } });
    toast('Actualizado'); renderView();
  }));
}

// ---------- coordinador: campañas ----------
async function viewCampanas(v) {
  const [campaigns, users] = await Promise.all([api('/campaigns'), api('/users')]);
  const lideres = users.filter(u => u.role === 'lider');
  v.innerHTML = header('Campañas') + `
    <div class="row-actions" style="margin-bottom:16px"><button class="btn" id="new">+ Nueva campaña</button></div>
    <div class="grid cols-2">${campaigns.map(c => `<div class="card">
      <div style="display:flex;justify-content:space-between"><h3>${esc(c.name)}</h3><span class="pill ${c.active ? 'green' : 'gray'}">${c.active ? 'activa' : 'inactiva'}</span></div>
      <p style="color:var(--muted);font-size:13px">${esc(c.description || '')}</p>
      <p style="font-size:13px">${fmtDate(c.startDate)} – ${fmtDate(c.endDate)}</p>
      <p style="font-size:13px">Líder: <b>${esc((users.find(u => u.id === c.liderId) || {}).name || 'sin asignar')}</b></p>
      <div class="row-actions"><button class="btn sm ghost" data-edit="${c.id}">Editar</button>
      <button class="btn sm ghost" data-toggle="${c.id}">${c.active ? 'Desactivar' : 'Activar'}</button></div>
    </div>`).join('')}</div>`;

  const liderOpts = (sel) => `<option value="">— sin asignar —</option>` + lideres.map(l => opt(l.id, l.name, sel)).join('');
  const save = (id) => async (data) => {
    await api(id ? `/campaigns/${id}` : '/campaigns', { method: id ? 'PATCH' : 'POST', body: {
      name: data.name, description: data.description, startDate: data.startDate, endDate: data.endDate, liderId: data.liderId || null,
    } });
    toast('Campaña guardada'); renderView();
  };
  document.getElementById('new').addEventListener('click', () => modal('Nueva campaña', `
    <label class="f"><span>Nombre</span><input name="name" required/></label>
    <label class="f"><span>Descripción</span><textarea name="description" rows="2"></textarea></label>
    <label class="f"><span>Inicio</span><input name="startDate" type="date"/></label>
    <label class="f"><span>Fin</span><input name="endDate" type="date"/></label>
    <label class="f"><span>Líder</span><select name="liderId">${liderOpts()}</select></label>`, save()));
  document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => {
    const c = campaigns.find(x => x.id === b.dataset.edit);
    modal('Editar campaña', `
      <label class="f"><span>Nombre</span><input name="name" value="${esc(c.name)}" required/></label>
      <label class="f"><span>Descripción</span><textarea name="description" rows="2">${esc(c.description || '')}</textarea></label>
      <label class="f"><span>Inicio</span><input name="startDate" type="date" value="${(c.startDate || '').slice(0, 10)}"/></label>
      <label class="f"><span>Fin</span><input name="endDate" type="date" value="${(c.endDate || '').slice(0, 10)}"/></label>
      <label class="f"><span>Líder</span><select name="liderId">${liderOpts(c.liderId)}</select></label>`, save(c.id));
  }));
  document.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', async () => {
    const c = campaigns.find(x => x.id === b.dataset.toggle);
    await api(`/campaigns/${c.id}`, { method: 'PATCH', body: { active: !c.active } });
    toast('Actualizado'); renderView();
  }));
}

// ---------- coordinador: cuentas ----------
async function viewCuentas(v) {
  const [users, centers] = await Promise.all([api('/users'), api('/centers')]);
  v.innerHTML = header('Cuentas', 'Usuarios del sistema por rol') + `
    <div class="row-actions" style="margin-bottom:16px"><button class="btn" id="new">+ Nueva cuenta</button></div>
    <div class="card"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Centro</th></tr></thead><tbody>
      ${users.map(u => `<tr><td><b>${esc(u.name)}</b></td><td>${esc(u.email)}</td><td>${ROLE_LABEL[u.role] || u.role}</td>
        <td>${esc((centers.find(c => c.id === u.centerId) || {}).name || '—')}</td></tr>`).join('')}
    </tbody></table></div>`;
  document.getElementById('new').addEventListener('click', () => modal('Nueva cuenta', `
    <label class="f"><span>Nombre</span><input name="name" required/></label>
    <label class="f"><span>Correo</span><input name="email" type="email" required/></label>
    <label class="f"><span>Contraseña</span><input name="password" required/></label>
    <label class="f"><span>Rol</span><select name="role">${Object.entries(ROLE_LABEL).map(([k, l]) => opt(k, l)).join('')}</select></label>
    <label class="f"><span>Centro (encargado / voluntario)</span><select name="centerId"><option value="">—</option>${centers.map(c => opt(c.id, c.name)).join('')}</select></label>`,
    async (data) => { await api('/users', { body: data }); toast('Cuenta creada'); renderView(); }));
}

// ---------- coordinador: movimientos ----------
async function viewMovimientos(v) {
  const [centers, campaigns] = await Promise.all([api('/centers'), api('/campaigns')]);
  const qs = new URLSearchParams();
  if (v.dataset.center) qs.set('centerId', v.dataset.center);
  if (v.dataset.campaign) qs.set('campaignId', v.dataset.campaign);
  const movs = await api('/movements?' + qs.toString());
  v.innerHTML = header('Movimientos', 'Historial completo — todos los centros') + `
    <div class="card" style="margin-bottom:16px;display:flex;gap:12px;flex-wrap:wrap;align-items:end">
      <label class="f" style="margin:0;flex:1"><span>Centro</span><select id="fCenter"><option value="">Todos</option>${centers.map(c => opt(c.id, c.name, v.dataset.center)).join('')}</select></label>
      <label class="f" style="margin:0;flex:1"><span>Campaña</span><select id="fCamp"><option value="">Todas</option>${campaigns.map(c => opt(c.id, c.name, v.dataset.campaign)).join('')}</select></label>
      <button class="btn ghost sm" id="csv">Exportar CSV</button>
    </div>
    ${movsTable(movs)}`;
  document.getElementById('fCenter').addEventListener('change', e => { v.dataset.center = e.target.value; renderView(); });
  document.getElementById('fCamp').addEventListener('change', e => { v.dataset.campaign = e.target.value; renderView(); });
  document.getElementById('csv').addEventListener('click', async () => {
    const r = await api('/movements?' + qs.toString() + (qs.toString() ? '&' : '') + 'format=csv');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([r.csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'movimientos.csv'; a.click();
  });
}
function movsTable(movs) {
  if (!movs.length) return '<div class="card"><p class="empty">Sin movimientos</p></div>';
  return `<div class="card"><table><thead><tr><th>Fecha</th><th>Tipo</th><th>Centro</th><th>Artículo</th><th>Cant.</th><th>Detalle</th><th>Actor</th></tr></thead><tbody>
    ${movs.map(m => `<tr>
      <td>${fmtDate(m.date)}</td>
      <td><span class="pill ${pillFor(m.type)}">${TYPE_LABEL[m.type] || m.type}</span></td>
      <td>${esc(m.centerName)}</td>
      <td>${esc(m.articleName)}</td>
      <td><b>${m.quantity}</b> ${esc(m.articleUnit)}</td>
      <td>${detailFor(m)}</td>
      <td>${esc(m.actorName || '—')}</td></tr>`).join('')}
  </tbody></table></div>`;
}
const pillFor = (t) => t === 'recepcion' || t === 'transferencia-entrada' ? 'green'
  : t === 'merma' ? 'red' : t === 'ajuste' ? 'orange' : 'gray';
function detailFor(m) {
  if (m.type === 'recepcion') return 'Donante: ' + esc(m.donor || 'Anónimo');
  if (m.type === 'entrega') return esc(m.institutionName || '') + ' · ' + `<span class="pill ${m.status === 'recibida' ? 'green' : 'orange'}">${m.status || ''}</span>`;
  if (m.type === 'merma' || m.type === 'ajuste') return 'Motivo: ' + esc(MOTIVES[m.motive] || m.motive || '—');
  if (m.type.startsWith('transferencia')) return (m.type === 'transferencia-salida' ? '→ ' : '← ') + esc(m.toCenterName || '');
  return '—';
}

// ---------- encargado: mi centro ----------
async function viewCentro(v, centerId) {
  const d = await api('/dashboard/center/' + centerId);
  v.innerHTML = header(d.center.name, d.center.institution) + `
    <div class="grid cols-3">
      <div class="stat"><div class="label">Entradas</div><div class="value">${d.entradas}</div></div>
      <div class="stat"><div class="label">Salidas</div><div class="value">${d.salidas}</div></div>
      <div class="stat"><div class="label">Merma</div><div class="value">${d.merma}</div></div>
    </div>
    <div class="section-title"><h3>Inventario actual</h3></div>
    <div class="card">${d.stock.length ? `<table><thead><tr><th>Artículo</th><th>Campaña</th><th>Stock</th></tr></thead><tbody>
      ${d.stock.map(s => `<tr><td>${esc(s.article)}</td><td>${esc(s.campaign)}</td><td><b>${s.qty}</b> ${esc(s.unit)}</td></tr>`).join('')}
    </tbody></table>` : '<p class="empty">Sin stock todavía</p>'}</div>
    <div class="section-title"><h3>Últimos movimientos</h3></div>
    ${movsTable(d.history)}`;
}

// ---------- encargado / voluntario: registrar ----------
function viewRegistrar(v) {
  const role = state.user.role;
  const types = role === 'voluntario'
    ? [['recepcion', 'Recepción de donación'], ['entrega', 'Entrega / canalización']]
    : [['recepcion', 'Recepción de donación'], ['entrega', 'Entrega / canalización'],
       ['merma', 'Merma'], ['transferencia', 'Transferencia a otro centro'], ['ajuste', 'Ajuste de stock']];
  const b = state.boot;
  const myCenter = b.myCenter;
  const campOpts = b.campaigns.filter(c => c.active && (!myCenter || myCenter.campaignIds.includes(c.id)))
    .map(c => opt(c.id, c.name)).join('');
  const artOpts = b.articles.map(a => opt(a.id, `${a.name} (${a.unit})`)).join('');
  const instOpts = b.institutions.map(i => opt(i.id, i.name)).join('');
  const destOpts = b.centers.filter(c => c.id !== (myCenter && myCenter.id) && c.active).map(c => opt(c.id, c.name)).join('');

  v.innerHTML = header('Registrar movimiento', myCenter ? myCenter.name : '') + `
    <div class="card" style="max-width:480px">
      <label class="f"><span>Tipo de movimiento</span><select id="mtype">${types.map(([k, l]) => opt(k, l)).join('')}</select></label>
      <form id="mvForm"></form>
    </div>`;

  const render = () => {
    const t = document.getElementById('mtype').value;
    let fields = `<label class="f"><span>Campaña</span><select name="campaignId" required>${campOpts || '<option value="">Sin campañas activas</option>'}</select></label>
      <label class="f"><span>Artículo</span><select name="articleId" required>${artOpts}</select></label>`;
    if (t === 'ajuste') {
      fields += `<label class="f"><span>Cantidad (usa negativo para descontar)</span><input name="quantity" type="number" step="1" required/></label>
        <label class="f"><span>Motivo</span><select name="motive" required>${Object.entries(MOTIVES).map(([k, l]) => opt(k, l)).join('')}</select></label>`;
    } else {
      fields += `<label class="f"><span>Cantidad</span><input name="quantity" type="number" min="1" step="1" required/></label>`;
    }
    if (t === 'recepcion') fields += `<label class="f"><span>Donante (opcional)</span><input name="donor" placeholder="Nombre del donante"/></label>
      <label class="f-inline"><input type="checkbox" name="anon"/> Donación anónima</label>`;
    if (t === 'entrega') fields += `<label class="f"><span>Institución receptora</span><select name="institutionUserId" required>${instOpts || '<option value="">Sin instituciones</option>'}</select></label>`;
    if (t === 'merma') fields += `<label class="f"><span>Motivo</span><select name="motive" required>${['caducidad', 'daño', 'perdida'].map(k => opt(k, MOTIVES[k])).join('')}</select></label>`;
    if (t === 'transferencia') fields += `<label class="f"><span>Centro destino</span><select name="toCenterId" required>${destOpts || '<option value="">Sin centros</option>'}</select></label>`;
    fields += `<button class="btn" style="margin-top:6px">Registrar</button>`;
    document.getElementById('mvForm').innerHTML = fields;
  };
  document.getElementById('mtype').addEventListener('change', render);
  render();

  document.getElementById('mvForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const t = document.getElementById('mtype').value;
    const f = Object.fromEntries(new FormData(ev.target).entries());
    try {
      if (t === 'transferencia') {
        await api('/transfers', { body: { toCenterId: f.toCenterId, campaignId: f.campaignId, articleId: f.articleId, quantity: Number(f.quantity) } });
      } else {
        await api('/movements', { body: {
          type: t, campaignId: f.campaignId, articleId: f.articleId, quantity: Number(f.quantity),
          motive: f.motive, donor: f.donor, anon: !!f.anon, institutionUserId: f.institutionUserId,
        } });
      }
      toast('Movimiento registrado');
      ev.target.reset(); render();
    } catch (e) { toast(e.message, true); }
  });
}

// ---------- historial ----------
async function viewHistorial(v) {
  const movs = await api('/movements');
  v.innerHTML = header('Historial', 'Movimientos de tu centro') + movsTable(movs);
}

// ---------- institución ----------
async function viewEntregas(v) {
  const list = await api('/deliveries');
  v.innerHTML = header('Entregas recibidas', 'Confirma la recepción de lo que se te canaliza') + `
    <div class="card">${list.length ? `<table><thead><tr><th>Fecha</th><th>Centro</th><th>Artículo</th><th>Cantidad</th><th>Estado</th><th></th></tr></thead><tbody>
      ${list.map(m => `<tr><td>${fmtDate(m.date)}</td><td>${esc(m.centerName)}</td><td>${esc(m.articleName)}</td>
        <td><b>${m.quantity}</b> ${esc(m.articleUnit)}</td>
        <td><span class="pill ${m.status === 'recibida' ? 'green' : 'orange'}">${m.status}</span></td>
        <td>${m.status === 'pendiente' ? `<button class="btn sm" data-confirm="${m.id}">Confirmar</button>` : ''}</td></tr>`).join('')}
    </tbody></table>` : '<p class="empty">Aún no hay entregas canalizadas</p>'}</div>`;
  document.querySelectorAll('[data-confirm]').forEach(b => b.addEventListener('click', async () => {
    await api(`/deliveries/${b.dataset.confirm}/confirm`, { method: 'POST' });
    toast('Entrega confirmada'); renderView();
  }));
}

// ---------- líder ----------
async function viewCampana(v) {
  const campaigns = await api('/campaigns');
  const mine = campaigns.find(c => c.liderId === state.user.id);
  if (!mine) { v.innerHTML = header('Mi campaña') + '<p class="empty">No tienes una campaña asignada.</p>'; return; }
  const d = await api('/dashboard/campaign/' + mine.id);
  v.innerHTML = header(mine.name, 'Agregado de tu campaña') + `
    <div class="row-actions" style="margin-bottom:16px"><button class="btn ghost sm" id="edit">Editar campaña</button></div>
    <div class="grid cols-4">
      <div class="stat"><div class="label">Recepciones</div><div class="value">${d.totals.recepciones}</div></div>
      <div class="stat"><div class="label">Entregas</div><div class="value">${d.totals.entregas}</div></div>
      <div class="stat"><div class="label">Merma</div><div class="value">${d.totals.merma}</div></div>
      <div class="stat"><div class="label">Stock</div><div class="value">${d.totals.stock}</div></div>
    </div>
    <div class="section-title"><h3>Centros participantes</h3></div>
    <div class="card"><table><thead><tr><th>Centro</th><th>Stock</th></tr></thead><tbody>
      ${d.centers.map(c => `<tr><td>${esc(c.name)}</td><td><b>${c.stock}</b></td></tr>`).join('') || '<tr><td colspan="2">Sin centros</td></tr>'}
    </tbody></table></div>`;
  document.getElementById('edit').addEventListener('click', () => modal('Editar campaña', `
    <label class="f"><span>Nombre</span><input name="name" value="${esc(mine.name)}" required/></label>
    <label class="f"><span>Descripción</span><textarea name="description" rows="2">${esc(mine.description || '')}</textarea></label>
    <label class="f"><span>Inicio</span><input name="startDate" type="date" value="${(mine.startDate || '').slice(0, 10)}"/></label>
    <label class="f"><span>Fin</span><input name="endDate" type="date" value="${(mine.endDate || '').slice(0, 10)}"/></label>`,
    async (data) => { await api('/campaigns/' + mine.id, { method: 'PATCH', body: data }); toast('Campaña actualizada'); renderView(); }));
}

// ---------- start ----------
(async function init() {
  try {
    await api('/me');
    await boot();
  } catch (e) {
    renderLogin();
  }
})();
