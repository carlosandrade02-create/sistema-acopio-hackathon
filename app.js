'use strict';

const state = { user: null, boot: null, route: null, unread: 0, chatWith: null };

const ROLE_LABEL = {
  coordinador: 'Coordinador general', encargado: 'Encargado de centro',
  voluntario: 'Voluntario de centro', institucion: 'Institución receptora', lider: 'Líder de campaña',
};
const MOTIVES = { caducidad: 'Caducidad', daño: 'Daño', perdida: 'Pérdida', correccion: 'Corrección' };
const TYPE_LABEL = {
  recepcion: 'Recepción', entrega: 'Entrega', merma: 'Merma', ajuste: 'Ajuste',
  'transferencia-salida': 'Transf. salida', 'transferencia-entrada': 'Transf. entrada',
};

// ---------- iconos (trazo, heredan currentColor) ----------
const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  refresh: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  swap: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
  archive: '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>',
  trend: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  eye: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9z"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  sitemap: '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4M5 16v-2h14v2M12 12v2"/>',
  pin: '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  send2: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  whatsapp: '<path d="M3 21l1.6-4A9 9 0 1 1 12 21a8.9 8.9 0 0 1-3.6-.8L3 21z"/><path d="M8.8 8.4c.2 0 .5 0 .6.4l.7 1.6c.1.2 0 .4-.1.5l-.5.6c-.1.2-.2.3-.1.5.4 1 1.3 1.9 2.3 2.3.2.1.4 0 .5-.1l.5-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.4.4.6 0 1-.7 1.8-1.7 1.9-1 .1-2.4-.3-4.2-1.9-1.5-1.5-2-2.9-1.9-3.9.1-1 .8-2.5 1.8-2.6z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1.1"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><line x1="7.5" y1="10" x2="7.5" y2="17"/><circle cx="7.5" cy="7.2" r="0.6"/><path d="M11 17v-4a3 3 0 0 1 6 0v4"/><line x1="11" y1="17" x2="11" y2="10"/>',
};
const icon = (name, cls = '') =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

const NAV_EXTRA = [['organizacion', 'Organización', 'sitemap'], ['mensajes', 'Mensajes', 'message']];
const NAV = {
  coordinador: [['dashboard', 'Panel global', 'grid'], ['centros', 'Centros', 'home'], ['campanas', 'Campañas', 'flag'], ['movimientos', 'Movimientos', 'list'], ['cuentas', 'Cuentas', 'users'], ...NAV_EXTRA],
  encargado: [['centro', 'Mi centro', 'box'], ['registrar', 'Registrar', 'plus'], ['historial', 'Historial', 'clock'], ...NAV_EXTRA],
  voluntario: [['registrar', 'Registrar', 'plus'], ['historial', 'Historial', 'clock'], ...NAV_EXTRA],
  institucion: [['entregas', 'Entregas', 'inbox'], ...NAV_EXTRA],
  lider: [['campana', 'Mi campaña', 'flag'], ...NAV_EXTRA],
};
const HOME_VIEW = { coordinador: 'dashboard', encargado: 'centro', voluntario: 'registrar', institucion: 'entregas', lider: 'campana' };

// ---------- infra ----------
function toast(msg, err) {
  const t = document.createElement('div');
  t.className = 'toast' + (err ? ' err' : '');
  t.innerHTML = `${icon(err ? 'alert' : 'check')}<span>${esc(msg)}</span>`;
  document.getElementById('toasts').appendChild(t);
  setTimeout(() => t.remove(), 3800);
}
const h = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '';
const opt = (v, label, sel) => `<option value="${esc(v)}"${sel === v ? ' selected' : ''}>${esc(label)}</option>`;
const initials = (name) => (name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const avatar = (u, cls = '') => `<span class="avatar ${cls}" style="background:${esc(u.color || '#EE6A1E')}">${esc(initials(u.name))}</span>`;

const LOGO = `<span class="brand-logo" aria-hidden="true"></span>`;

// ---------- tema ----------
const currentTheme = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('cda_theme', t); } catch (e) {}
  document.querySelectorAll('[data-theme-btn]').forEach(b => b.innerHTML = icon(t === 'dark' ? 'sun' : 'moon'));
}
const toggleTheme = () => applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
const themeBtnHtml = (extra = '') =>
  `<button class="icon-btn ${extra}" data-theme-btn title="Cambiar tema claro / oscuro">${icon(currentTheme() === 'dark' ? 'sun' : 'moon')}</button>`;

function logout() { logoutSession(); state.user = null; state.boot = null; go('/'); }

// ---------- componentes ----------
function pageHead(title, sub, actions = '') {
  return `<div class="topbar">
    <div class="topbar-txt"><h2>${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ''}</div>
    <div class="topbar-actions">${actions}${themeBtnHtml()}</div>
  </div>`;
}
const page = (headHtml, body) => headHtml + `<div class="page"><div class="stack">${body}</div></div>`;

function statcard(iconName, label, value, color) {
  return `<div class="statcard">
    <div class="statcard-ic ${color}">${icon(iconName)}</div>
    <div class="statcard-txt"><div class="statcard-label">${esc(label)}</div><div class="statcard-value">${value}</div></div>
  </div>`;
}
function bar(label, value, max, color) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return `<div class="bar-row">
    <span class="bar-label" title="${esc(label)}">${esc(label)}</span>
    <span class="bar-track"><span class="bar-fill ${color}" style="width:${pct}%"></span></span>
    <span class="bar-val">${value}</span>
  </div>`;
}
const panel = (title, inner, headExtra = '') =>
  `<section class="panel"><div class="panel-head"><h3>${esc(title)}</h3>${headExtra}</div>${inner}</section>`;

// ---------- login ----------
const DEMO = [
  ['coord@demo.com', 'Coordinador general', '#EE6A1E'],
  ['norte@demo.com', 'Encargado · Centro Norte', '#1A1A1A'],
  ['vol.norte@demo.com', 'Voluntario · Centro Norte', '#C8530F'],
  ['dif@demo.com', 'Institución receptora (DIF)', '#C8530F'],
  ['lider@demo.com', 'Líder de campaña', '#3A3A3A'],
];
// Para Google real: pon aquí tu OAuth Client ID (Google Cloud → Credenciales → ID de
// cliente de OAuth) y descomenta el <script> de GIS en index.html.
const GOOGLE_CLIENT_ID = '';
// Para reCAPTCHA real: pon aquí tu clave de sitio (google.com/recaptcha, reCAPTCHA v2
// "No soy un robot") y descomenta el <script> de la API en index.html. Si queda vacío se
// usa una verificación propia (casilla + operación) que igual bloquea el envío.
const RECAPTCHA_SITE_KEY = '';

const GOOGLE_G = `<svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.8 6.1C12.2 13.2 17.6 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9c4.4-4.1 7.1-10.1 7.1-17.6z"/><path fill="#FBBC05" d="M10.4 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.8-6.1C1 16.5 0 20.1 0 24s1 7.5 2.6 10.7l7.8-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.4 0-11.8-3.7-13.6-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/></svg>`;

// ---- captcha (reCAPTCHA real si hay clave; si no, verificación propia funcional) ----
let _capAnswer = null;
function captchaHtml(id) {
  if (RECAPTCHA_SITE_KEY && window.grecaptcha) {
    return `<div class="captcha"><div class="g-recaptcha" data-sitekey="${RECAPTCHA_SITE_KEY}" id="${id}"></div></div>`;
  }
  const a = 2 + Math.floor(Math.random() * 7), b = 1 + Math.floor(Math.random() * 6);
  _capAnswer = a + b;
  return `<div class="captcha" id="${id}" data-a="${a}" data-b="${b}">
    <label class="cap-check"><input type="checkbox" class="cap-chk"><span>No soy un robot</span></label>
    <div class="cap-q">¿Cuánto es <b>${a} + ${b}</b>?<input type="number" class="cap-a" inputmode="numeric" autocomplete="off"></div>
    <span class="cap-badge">${icon('shield')}<span>Verificación de seguridad</span></span>
  </div>`;
}
function wireCaptcha(box) {
  if (!box) return;
  const chk = box.querySelector('.cap-chk');
  if (!chk) { if (window.grecaptcha && window.grecaptcha.render) try { grecaptcha.render(box.querySelector('.g-recaptcha')); } catch (e) {} return; }
  chk.addEventListener('change', () => { box.querySelector('.cap-q').classList.toggle('on', chk.checked); if (chk.checked) box.querySelector('.cap-a').focus(); });
}
function captchaOK(box) {
  if (RECAPTCHA_SITE_KEY && window.grecaptcha) return !!grecaptcha.getResponse();
  if (!box) return false;
  const chk = box.querySelector('.cap-chk');
  const a = Number(box.dataset.a) + Number(box.dataset.b);
  return chk && chk.checked && Number(box.querySelector('.cap-a').value) === a;
}

function renderLogin() {
  const roleOpts = Object.entries(ROLE_LABEL).map(([k, l]) => opt(k, l)).join('');
  document.getElementById('root').innerHTML = `
    <button class="back-fab" data-go="/dashboard">${icon('arrowLeft')}<span>Atrás</span></button>
    ${themeBtnHtml('theme-fab')}
    <div class="login-wrap"><div class="login-card">
      ${LOGO}
      <h1>Prothymía</h1>
      <p class="sub">Registro y coordinación de centros de acopio</p>
      <button class="gbtn" id="googleBtn">${GOOGLE_G}<span>Continuar con Google</span></button>
      <div class="or-sep">o con tu correo</div>

      <div class="auth-tabs">
        <button data-tab="login" class="on">Entrar</button>
        <button data-tab="register">Crear cuenta</button>
      </div>

      <form id="loginForm">
        <label class="f"><span>Correo</span><input name="email" type="email" required autocomplete="username" placeholder="tu@correo.com" /></label>
        <label class="f"><span>Contraseña</span><input name="password" type="password" required autocomplete="current-password" placeholder="••••••" /></label>
        ${captchaHtml('capLogin')}
        <button class="btn block" style="margin-top:2px">Entrar</button>
      </form>

      <form id="regForm" hidden>
        <label class="f"><span>Nombre completo</span><input name="name" required autocomplete="name" placeholder="Tu nombre" /></label>
        <label class="f"><span>Correo</span><input name="email" type="email" required autocomplete="username" placeholder="tu@correo.com" /></label>
        <label class="f"><span>Contraseña</span><input name="password" type="password" required minlength="6" autocomplete="new-password" placeholder="mínimo 6 caracteres" /></label>
        <label class="f"><span>Rol</span><select name="role">${roleOpts}</select></label>
        ${captchaHtml('capReg')}
        <button class="btn block" style="margin-top:2px">${icon('check')}<span>Crear cuenta y entrar</span></button>
      </form>

      <div class="demo-list">
        <p>Cuentas de prueba · contraseña <b>demo123</b></p>
        ${DEMO.map(([e, l]) => `<button class="demo-chip" data-email="${e}"><b>${l}</b><span>${e}</span></button>`).join('')}
      </div>
    </div></div>`;

  const enter = (user) => { state.user = user; if (location.hash === '#/app') enterApp(); else location.hash = '/app'; };
  const loginForm = document.getElementById('loginForm');
  const regForm = document.getElementById('regForm');
  const capLogin = document.getElementById('capLogin');
  const capReg = document.getElementById('capReg');
  wireCaptcha(capLogin); wireCaptcha(capReg);

  document.querySelectorAll('.auth-tabs button').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.auth-tabs button').forEach(x => x.classList.toggle('on', x === t));
    const reg = t.dataset.tab === 'register';
    loginForm.hidden = reg; regForm.hidden = !reg;
  }));

  loginForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!captchaOK(capLogin)) return toast('Completa la verificación de seguridad.', true);
    const f = new FormData(ev.target);
    try {
      const { user } = await api('/login', { body: { email: f.get('email'), password: f.get('password') } });
      enter(user);
    } catch (e) { toast(e.message, true); }
  });

  regForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!captchaOK(capReg)) return toast('Completa la verificación de seguridad.', true);
    const f = Object.fromEntries(new FormData(ev.target).entries());
    try {
      const { user } = await api('/register', { body: f });
      toast('Cuenta creada. ¡Bienvenida/o!');
      enter(user);
    } catch (e) { toast(e.message, true); }
  });

  document.getElementById('googleBtn').addEventListener('click', () => googleFlow(enter));
  document.querySelectorAll('.demo-chip').forEach(b => b.addEventListener('click', () => {
    loginForm.email.value = b.dataset.email;
    loginForm.password.value = 'demo123';
    const chk = capLogin && capLogin.querySelector('.cap-chk');
    if (chk && !chk.checked) { chk.checked = true; chk.dispatchEvent(new Event('change')); }
    if (capLogin) { const ca = capLogin.querySelector('.cap-a'); if (ca) ca.value = Number(capLogin.dataset.a) + Number(capLogin.dataset.b); }
  }));
}

function googleFlow(onLogin) {
  // Google real (si hay Client ID y la librería GIS cargó)
  if (GOOGLE_CLIENT_ID && window.google && google.accounts && google.accounts.id) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (resp) => {
        try {
          const payload = JSON.parse(atob(resp.credential.split('.')[1]));
          const { user } = await api('/google-login', { body: { email: payload.email, name: payload.name } });
          onLogin(user);
        } catch (e) { toast(e.message, true); }
      },
    });
    google.accounts.id.prompt();
    return;
  }
  // Simulación para la demo: selector de cuenta estilo Google
  modalPlain('Elige una cuenta de Google', `
    <div class="gpick">
      ${DEMO.map(([email, label, color]) => `<button type="button" data-g="${email}">
        <span class="avatar" style="background:${color}">${esc(initials(label))}</span>
        <span><b>${esc(label)}</b><span>${esc(email)}</span></span></button>`).join('')}
      <button type="button" data-g="new"><span class="avatar" style="background:var(--muted)">+</span><span><b>Usar otra cuenta</b><span>crear acceso de coordinador</span></span></button>
    </div>`, (root, close) => {
    root.querySelectorAll('[data-g]').forEach(b => b.addEventListener('click', async () => {
      try {
        let email = b.dataset.g, name;
        if (email === 'new') {
          email = (prompt('Correo de Google:') || '').trim().toLowerCase();
          if (!email) return;
          name = (prompt('Tu nombre:') || email.split('@')[0]).trim();
        } else {
          name = DEMO.find(d => d[0] === email)[1];
        }
        const { user } = await api('/google-login', { body: { email, name } });
        close();
        onLogin(user);
      } catch (e) { toast(e.message, true); }
    }));
  });
}

// modal sin formulario (contenido libre + wiring)
function modalPlain(title, html, wire) {
  const bg = h(`<div class="modal-bg"><div class="modal"><h3>${esc(title)}</h3>${html}
    <div class="row-actions" style="margin-top:14px"><button class="btn ghost" id="mpCancel">Cancelar</button></div></div></div>`);
  document.body.appendChild(bg);
  const close = () => bg.remove();
  bg.addEventListener('click', e => { if (e.target === bg) close(); });
  bg.querySelector('#mpCancel').addEventListener('click', close);
  if (wire) wire(bg, close);
}

// ---------- landing ----------
const LP_FEATURES = [
  ['layers', 'Un sistema por centro', 'Cada centro tiene su cuenta y registra recepciones, entregas, merma y transferencias sin pisarse con los demás.'],
  ['trend', 'Stock automático y confiable', 'El inventario se calcula solo por centro y campaña. Las correcciones se hacen con un ajuste con motivo, nunca editando números.'],
  ['eye', 'Trazabilidad total', 'Todo movimiento guarda quién, qué, cuánto y cuándo. El historial completo siempre está a un clic.'],
  ['grid', 'Dashboards por rol', 'La coordinación ve el panel global; cada centro ve el suyo; el líder ve el agregado de su campaña.'],
  ['shield', 'Roles y permisos', 'Coordinador, encargado, voluntario e institución receptora: cada quien ve y hace exactamente lo que le toca.'],
  ['inbox', 'Canalización con acuse', 'Las entregas a instituciones receptoras se confirman como recibidas, cerrando el ciclo de la donación.'],
];
const LP_ROLES = [
  ['Coordinador general', 'Registra centros y campañas, ve todo y consulta cada movimiento.'],
  ['Encargado de centro', 'Opera su centro: recepciones, entregas, merma, transferencias y ajustes.'],
  ['Voluntario', 'Apoya el registro de donaciones y entregas en el centro.'],
  ['Institución receptora', 'Recibe lo que se le canaliza y lo confirma.'],
];

const IMG = {
  zocalo: 'assets/acopio-1.jpg',
  bodega: 'assets/acopio-2.jpg',
  volunteers: 'assets/people-volunteers.jpg',
  care: 'assets/people-care.jpg',
  crowd: 'assets/people-crowd.jpg',
  team: 'assets/people-team.jpg',
  pharmacy: 'assets/people-pharmacy.jpg',
  hand: 'assets/hand-open.jpg',
};
const IMG1 = IMG.zocalo;
const IMG2 = IMG.bodega;
// Galería circular (React Bits) de la sección "Quiénes participan"
const CG_ITEMS = [
  { image: IMG.team, text: 'Coordinación' },
  { image: IMG.care, text: 'Instituciones' },
  { image: IMG.pharmacy, text: 'Familias' },
  { image: IMG.volunteers, text: 'Voluntariado' },
  { image: IMG.crowd, text: 'Comunidad' },
];
const go = (hash) => { if (location.hash === '#' + hash) route(); else location.hash = hash; };

const CONTACT = {
  email: 'prothymia@gmail.com',
  tel: '+52 833 530 9449',
  wa: '528335309449',
  ig: 'prothymia.mx',
  li: 'company/prothymia',
};

// Control de sesión en el header: avatar si ya iniciaste, botón si no.
function authControl() {
  let u = null;
  try { u = (typeof currentUser === 'function') ? currentUser() : null; } catch (e) { u = null; }
  if (u) {
    return `<span class="nav-auth">
      <button class="nav-profile" data-go="/app" title="${esc(u.name)} · ir al panel">${avatar(u, 'sm')}</button>
      <button class="nav-logout" data-logout title="Cerrar sesión">${icon('logout')}</button>
    </span>`;
  }
  return `<button class="btn sm ghost nav-login" data-go="/entrar">${icon('users')}<span>Iniciar sesión</span></button>`;
}

const siteNav = (links) => `
  <header class="site-nav">
    <div class="site-nav-in">
      <div class="brand" data-go="/">${LOGO}<span>Prothymía</span></div>
      <nav class="site-links">${links}<span class="sep"></span>${authControl()}${themeBtnHtml()}</nav>
    </div>
  </header>`;

const siteFoot = `
  <footer class="foot">
    <div class="foot-in">
      <div class="foot-brand">
        <div class="brand" data-go="/">${LOGO}<span>Prothymía</span></div>
        <p>Plataforma de registro y coordinación de centros de acopio para contingencias.</p>
      </div>
      <div class="foot-col">
        <h4>Contacto</h4>
        <a href="mailto:${CONTACT.email}">${icon('inbox')}${CONTACT.email}</a>
        <a href="tel:${CONTACT.tel.replace(/\s/g, '')}">${icon('phone')}${CONTACT.tel}</a>
        <a href="https://wa.me/${CONTACT.wa}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp</a>
      </div>
      <div class="foot-col">
        <h4>Redes</h4>
        <a href="https://instagram.com/${CONTACT.ig}" target="_blank" rel="noopener">${icon('instagram')}Instagram</a>
        <a href="https://linkedin.com/${CONTACT.li}" target="_blank" rel="noopener">${icon('linkedin')}LinkedIn</a>
      </div>
    </div>
    <div class="foot-bottom"><div class="wrap">Prothymía · Proyecto integrador — Sistema de Registro y Coordinación de Centros de Acopio · Demo, los datos se guardan en este navegador.</div></div>
  </footer>`;

// pasos, sin numeración; cada uno con su color
const STEPS = (two) => `
  <div class="steps">
    <div class="step reveal" style="--k:var(--accent)"><h3>La coordinación arma la red</h3><p>Registra la campaña y da de alta cada centro con su encargado.</p></div>
    <div class="step reveal" style="--k:var(--sky);--d:.06s"><h3>Cada centro registra</h3><p>${two}</p></div>
    <div class="step reveal" style="--k:var(--clay);--d:.12s"><h3>Todos ven el panorama</h3><p>El stock se actualiza solo y los dashboards muestran dónde están los recursos.</p></div>
  </div>`;

const CHIP_TONES = ['green', 'sky', 'clay', 'sand', 'gold', 'green'];
const cards = (list) => `<div class="cards">${list.map(([ic, t, d], i) =>
  `<div class="card2 reveal" style="--d:${(0.04 * i).toFixed(2)}s"><div class="ic-chip ${CHIP_TONES[i % CHIP_TONES.length]}">${icon(ic)}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`;

// ===== Página 1: Landing del proyecto =====
function renderLanding() {
  document.getElementById('root').innerHTML = `
    <div class="site">
      ${siteNav(`
        <a href="#reto">El reto</a>
        <a href="#plataforma">La plataforma</a>
        <button class="btn sm" data-go="/dashboard">${icon('grid')}<span>Dashboard</span></button>`)}

      <section class="hero cover"><div class="wrap"><div class="hero-grid">
        <div>
          <span class="kicker reveal">${icon('leaf')} Coordinación humanitaria</span>
          <h1 class="reveal" style="--d:.05s">Coordinar la ayuda cuando todo es <em>urgencia</em>.</h1>
          <p class="hero-lead reveal" style="--d:.1s">Ante un huracán o una contingencia, decenas de centros de acopio —escuelas, parroquias, organizaciones civiles— reúnen donativos a la vez. Prothymía los conecta con la coordinación general para saber, en tiempo real, qué hay y a dónde mandarlo.</p>
          <div class="hero-cta reveal" style="--d:.15s">
            <button class="btn lg" data-go="/dashboard">${icon('arrowRight')}<span>Conocer la plataforma</span></button>
            <a class="link-arrow" href="#reto">Ver el reto ${icon('arrowRight')}</a>
          </div>
        </div>
      </div></div></section>

      <section class="cg-band">
        <div class="cg" id="cgMount" data-cg='${JSON.stringify(CG_ITEMS).replace(/'/g, "&#39;")}'>
          <div class="photos">
            <figure><img src="${IMG.team}" alt="Equipo coordinando el acopio" onerror="this.closest('figure').remove()"><figcaption>Coordinación</figcaption></figure>
            <figure><img src="${IMG.care}" alt="Personal de una institución receptora" onerror="this.closest('figure').remove()"><figcaption>Instituciones</figcaption></figure>
            <figure><img src="${IMG.pharmacy}" alt="Familia recibiendo apoyo" onerror="this.closest('figure').remove()"><figcaption>Familias</figcaption></figure>
          </div>
        </div>
      </section>

      <section class="sec tint" id="reto"><div class="wrap">
        <div class="media rev">
          <div>
            <span class="sec-label reveal" style="--k:var(--accent)">El reto</span>
            <h2 class="reveal" style="--d:.04s">Hoy cada centro trabaja a ciegas.</h2>
            <p class="sec-lead reveal" style="--d:.08s">Cada punto de acopio resguarda sus donativos con sus propias reglas. Sin un control central, la coordinación no tiene el panorama completo.</p>
            <ul class="checks reveal" style="--d:.12s">
              <li>${icon('alert')} Nadie sabe en tiempo real qué tiene cada centro.</li>
              <li>${icon('alert')} No hay trazabilidad de entradas, entregas, merma ni transferencias.</li>
              <li>${icon('alert')} La central no puede decidir con datos a dónde enviar los recursos.</li>
            </ul>
          </div>
          <div class="media-img reveal" style="--d:.06s"><img src="${IMG2}" alt="Centro de acopio con agua, despensa y cobijas" onerror="this.closest('.media-img').style.display='none'"></div>
        </div>
      </div></section>

      <section class="band">
        <div class="wrap"><div class="reveal">
          <h2>De la donación a quien la necesita.</h2>
          <p>Trazabilidad completa: cada movimiento queda registrado con autor, fecha y motivo.</p>
        </div></div>
      </section>

      <section class="sec" id="plataforma"><div class="wrap">
        <span class="sec-label reveal" style="--k:var(--accent)">La plataforma</span>
        <h2 class="reveal" style="--d:.04s">Cada centro opera su inventario. La coordinación ve el conjunto.</h2>
        ${cards(LP_FEATURES)}
      </div></section>

      <section class="sec tint"><div class="wrap">
        <span class="sec-label reveal" style="--k:var(--accent)">Cómo funciona</span>
        ${STEPS('Recepciones, entregas, merma y transferencias, en pocos clics.')}
      </div></section>

      <section class="cta-band"><div class="wrap">
        <h2>Conoce la herramienta.</h2>
        <p>Mira qué hace el dashboard, cómo funciona y entra a probarlo con datos de ejemplo.</p>
        <button class="btn lg ghost" data-go="/dashboard">${icon('grid')}<span>Ir al dashboard</span></button>
      </div></section>

      ${siteFoot}
    </div>`;
  siteFx();
}

// ===== Página 2: Qué es la herramienta =====
function renderAbout() {
  document.getElementById('root').innerHTML = `
    <div class="site">
      ${siteNav(`
        <a data-go="/">Inicio</a>
        <a href="#como">Cómo funciona</a>
        <button class="btn sm" data-go="/app">${icon('arrowRight')}<span>Entrar</span></button>`)}

      <section class="hero cover about"><div class="wrap"><div class="hero-grid">
        <div>
          <span class="kicker reveal">${icon('grid')} La herramienta</span>
          <h1 class="reveal" style="--d:.05s">El dashboard de <em>Prothymía</em>.</h1>
          <p class="hero-lead reveal" style="--d:.1s">Un sistema web donde la coordinación registra centros y campañas, y cada centro —con su propia cuenta— registra recepciones, entregas, merma y transferencias. El stock se calcula solo, por centro y campaña.</p>
          <div class="hero-cta reveal" style="--d:.15s">
            <button class="btn lg" data-go="/app">${icon('arrowRight')}<span>Entrar / Comenzar</span></button>
            <a class="link-arrow" href="#como">Cómo funciona ${icon('arrowRight')}</a>
          </div>
          <p class="hero-note reveal" style="--d:.2s">Demo abierta · <code>coord@demo.com</code> · <code>demo123</code></p>
        </div>
      </div></div></section>

      <section class="sec tint"><div class="wrap">
        <span class="sec-label reveal" style="--k:var(--accent)">Qué hace</span>
        <h2 class="reveal" style="--d:.04s">Un modelo basado 100% en movimientos.</h2>
        <p class="sec-lead reveal" style="--d:.08s">Cada número tiene autor, fecha y motivo. Nada se edita a mano.</p>
        ${cards(LP_FEATURES)}
      </div></section>

      <section class="sec" id="como"><div class="wrap">
        <span class="sec-label reveal" style="--k:var(--accent)">Cómo funciona</span>
        ${STEPS('Recepciones (anónimas o con datos), entregas, merma, transferencias y ajustes.')}
      </div></section>

      <section class="sec"><div class="wrap">
        <span class="sec-label reveal" style="--k:var(--accent)">Roles</span>
        <h2 class="reveal" style="--d:.04s">Cada quien ve y hace lo que le toca.</h2>
        <div class="roles">
          ${LP_ROLES.map(([r, d], i) => `<div class="role reveal" style="--d:${(0.04 * i).toFixed(2)}s">${icon('arrowRight')}<div><b>${r}</b><span>${d}</span></div></div>`).join('')}
        </div>
      </div></section>

      <section class="cta-band"><div class="wrap">
        <h2>Entra a probarlo.</h2>
        <p>Una campaña, tres centros y movimientos de ejemplo listos para explorar.</p>
        <button class="btn lg ghost" data-go="/app">${icon('arrowRight')}<span>Entrar / Comenzar</span></button>
      </div></section>

      ${siteFoot}
    </div>`;
  siteFx();
}

// ===== Aparición suave al hacer scroll =====
function siteFx() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = [...document.querySelectorAll('.reveal')];
  if (reduce) { items.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  items.forEach(el => io.observe(el));
  const showVisible = () => items.forEach(el => {
    if (!el.classList.contains('in') && el.getBoundingClientRect().top < innerHeight * 0.96) el.classList.add('in');
  });
  requestAnimationFrame(showVisible);
  window.addEventListener('scroll', showVisible, { passive: true });
  setTimeout(() => items.forEach(el => el.classList.add('in')), 2500);
  if (window.CircularGallery) window.CircularGallery.mountAll();
}

// ===== Router por hash =====
async function enterApp() {
  try { await api('/me'); await boot(); }
  catch (e) { if (location.hash !== '#/entrar') location.hash = '/entrar'; else renderLogin(); }
}
function route() {
  const p = (location.hash || '').replace(/^#/, '') || '/';
  if (p === '/') return renderLanding();
  if (p === '/dashboard') return renderAbout();
  if (p === '/entrar') return renderLogin();
  if (p === '/app') return enterApp();
  // cualquier otro hash (#reto, #stock…) es un ancla dentro de la página: no re-renderizar
  if (!document.getElementById('root').children.length) renderLanding();
}
document.addEventListener('click', (e) => {
  const g = e.target.closest && e.target.closest('[data-go]');
  if (g) { e.preventDefault(); go(g.dataset.go); }
});
window.addEventListener('hashchange', route);

// ---------- shell ----------
async function boot() {
  state.boot = await api('/bootstrap');
  state.user = state.boot.user;
  state.route = HOME_VIEW[state.user.role] || (NAV[state.user.role] || [])[0]?.[0] || null;
  const sec = new URLSearchParams(location.search).get('sec');
  if (sec && (NAV[state.user.role] || []).some(n => n[0] === sec)) state.route = sec;
  try { state.unread = (await api('/chat/unread')).count; } catch (e) { state.unread = 0; }
  renderShell();
}
async function refreshUnread() {
  try {
    state.unread = (await api('/chat/unread')).count;
    document.querySelectorAll('.nav button[data-route="mensajes"] .badge').forEach(b => b.remove());
    const btn = document.querySelector('.nav button[data-route="mensajes"]');
    if (btn && state.unread) btn.insertAdjacentHTML('beforeend', `<span class="badge">${state.unread}</span>`);
  } catch (e) {}
}
function renderShell() {
  const nav = NAV[state.user.role] || [];
  document.getElementById('root').innerHTML = `
    <div class="shell">
      <aside class="side">
        <div class="brand" data-go="/" role="link" tabindex="0" title="Volver al inicio">${LOGO}<b>Prothymía</b></div>
        <nav class="nav">
          ${nav.map(([r, l, ic]) => `<button data-route="${r}" class="${r === state.route ? 'active' : ''}">${icon(ic)}<span>${l}</span>${r === 'mensajes' && state.unread ? `<span class="badge">${state.unread}</span>` : ''}</button>`).join('')}
        </nav>
        <div class="who">
          <div class="id">
            <b>${esc(state.user.name)}</b>
            <span>${ROLE_LABEL[state.user.role] || state.user.role}</span>
          </div>
          <button class="btn ghost sm block" id="logoutBtn">${icon('logout')}<span>Cerrar sesión</span></button>
          <button class="reset" id="resetBtn" title="Borra los cambios y vuelve a los datos de ejemplo">${icon('refresh')}<span>Reiniciar demo</span></button>
        </div>
      </aside>
      <main class="main" id="view"></main>
    </div>`;
  document.querySelectorAll('.nav button').forEach(b => b.addEventListener('click', () => { state.route = b.dataset.route; renderShell(); }));
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('¿Reiniciar todos los datos a los de ejemplo?')) { resetDB(); location.reload(); }
  });
  renderView();
}
const view = () => document.getElementById('view');

const VIEWS = {
  dashboard: viewGlobal, centros: viewCentros, campanas: viewCampanas, movimientos: viewMovimientos,
  cuentas: viewCuentas, registrar: viewRegistrar, historial: viewHistorial, entregas: viewEntregas,
  campana: viewCampana, organizacion: viewOrg, mensajes: viewChat,
  centro: (v) => viewCentro(v, state.user.centerId),
};
async function renderView() {
  const v = view();
  v.innerHTML = `<div class="page"><p class="empty">Cargando…</p></div>`;
  try {
    const r = state.route;
    const fn = VIEWS[r];
    if (!fn) { v.innerHTML = `<div class="page"><p class="empty">Selecciona una sección.</p></div>`; return; }
    await fn(v);
    if (r === HOME_VIEW[state.user.role]) await mountPinned(v.querySelector('.stack'));
  } catch (e) { v.innerHTML = `<div class="page"><p class="empty">${esc(e.message)}</p></div>`; }
}

// ---------- modal ----------
function modal(title, fieldsHtml, onSubmit) {
  const bg = h(`<div class="modal-bg"><div class="modal"><h3>${esc(title)}</h3>
    <form id="mForm">${fieldsHtml}
    <div class="row-actions" style="margin-top:6px"><button class="btn" type="submit">Guardar</button>
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

// ---------- tablas / listas ----------
const pillFor = (t) => ({
  recepcion: 'green', 'transferencia-entrada': 'gray', 'transferencia-salida': 'gray',
  entrega: 'gray', merma: 'clay', ajuste: 'gold',
}[t] || 'gray');
function detailFor(m) {
  if (m.type === 'recepcion') return 'Donante: ' + esc(m.donor || 'Anónimo');
  if (m.type === 'entrega') return esc(m.institutionName || '') + ' · <span class="pill ' + (m.status === 'recibida' ? 'green' : 'gold') + '">' + esc(m.status || '') + '</span>';
  if (m.type === 'merma' || m.type === 'ajuste') return 'Motivo: ' + esc(MOTIVES[m.motive] || m.motive || '—');
  if (m.type.startsWith('transferencia')) return (m.type === 'transferencia-salida' ? '→ ' : '← ') + esc(m.toCenterName || '');
  return '—';
}
function movsPanel(movs, title = 'Movimientos') {
  const inner = !movs.length
    ? '<p class="empty">Sin movimientos</p>'
    : `<div class="table-wrap"><table>
      <thead><tr><th>Fecha</th><th>Tipo</th><th>Centro</th><th>Artículo</th><th>Cant.</th><th>Detalle</th><th>Actor</th></tr></thead>
      <tbody>${movs.map(m => `<tr>
        <td>${fmtDate(m.date)}</td>
        <td><span class="pill ${pillFor(m.type)}">${TYPE_LABEL[m.type] || m.type}</span></td>
        <td>${esc(m.centerName)}</td>
        <td>${esc(m.articleName)}</td>
        <td class="num"><b>${m.quantity}</b> <span class="unit">${esc(m.articleUnit)}</span></td>
        <td>${detailFor(m)}</td>
        <td>${esc(m.actorName || '—')}</td></tr>`).join('')}</tbody></table></div>`;
  return panel(title, inner);
}

// ---------- pendientes fijados ----------
async function mountPinned(stackEl) {
  if (!stackEl) return;
  let d;
  try { d = await api('/pending'); } catch (e) { return; }
  const activePins = d.pins.filter(p => !p.done).length;
  const total = d.system.length + activePins;
  const nothing = !total && !d.pins.length;
  const el = h(`<section class="pinned">
    <div class="pinned-head">${icon('pin')}<span>Pendientes</span>${total ? `<span class="count">${total}</span>` : ''}</div>
    <div class="pinned-body">
      ${d.system.map(s => `<div class="pending-item ${s.tone === 'gray' ? 'gray' : ''}"><span class="dot"></span><b>${esc(s.text)}</b>${s.route ? `<span class="go" data-goto="${s.route}">Ir →</span>` : ''}</div>`).join('')}
      ${d.pins.map(p => `<div class="pending-item ${p.done ? 'done' : ''}" data-pin="${p.id}"><input type="checkbox" ${p.done ? 'checked' : ''}><b>${esc(p.text)}</b><span class="x" data-del="${p.id}">✕</span></div>`).join('')}
      ${nothing ? '<div class="pending-item"><span class="dot" style="background:var(--muted)"></span><b>Sin pendientes por ahora.</b></div>' : ''}
      <form class="pin-add" id="pinAdd"><input placeholder="Agregar un pendiente…" name="text" autocomplete="off"><button class="btn sm" type="submit">Fijar</button></form>
    </div>
  </section>`);
  stackEl.insertBefore(el, stackEl.firstChild);
  el.querySelectorAll('[data-goto]').forEach(g => g.addEventListener('click', () => { state.route = g.dataset.goto; renderShell(); }));
  el.querySelectorAll('[data-pin] input').forEach(cb => cb.addEventListener('change', async () => {
    try { await api('/pins/' + cb.closest('[data-pin]').dataset.pin, { method: 'PATCH', body: { done: cb.checked } }); renderView(); }
    catch (e) { toast(e.message, true); }
  }));
  el.querySelectorAll('[data-del]').forEach(x => x.addEventListener('click', async () => {
    try { await api('/pins/' + x.dataset.del, { method: 'DELETE' }); renderView(); } catch (e) { toast(e.message, true); }
  }));
  el.querySelector('#pinAdd').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const t = ev.target.text.value.trim();
    if (!t) return;
    try { await api('/pins', { body: { text: t } }); renderView(); } catch (e) { toast(e.message, true); }
  });
}

// ---------- organización ----------
const ROLE_PERMS = {
  coordinador: 'Registra centros y campañas, los activa o desactiva, da de alta cuentas y ve todo: dashboard global y todos los movimientos.',
  encargado: 'Registra recepciones, entregas, merma, transferencias y ajustes de su centro. Ve su inventario y su dashboard.',
  voluntario: 'Apoya el registro de recepciones y entregas de su centro. No registra merma ni configura nada.',
  institucion: 'Ve las entregas que se le canalizan y las confirma como recibidas.',
  lider: 'Gestiona su campaña (centros participantes, fechas, metas) y ve el agregado de esa campaña.',
};
const ROLE_COLOR = {
  coordinador: 'var(--accent)', lider: 'var(--ink)', encargado: 'var(--accent)',
  voluntario: '#9A9A97', institucion: 'var(--ink)',
};
const teamRow = (n, big) => `<div class="team-row${big ? ' big' : ''}">${avatar(n, big ? '' : 'sm')}<div><b>${esc(n.name)}</b><span>${esc(n.roleLabel)}${n.centerName ? ' · ' + esc(n.centerName) : ''}</span></div><button class="btn ghost sm msg" data-msg="${n.id}">${icon('message')}<span>Mensaje</span></button></div>`;

async function viewOrg(v) {
  const d = await api('/org');
  const t = d.totals || {};
  const nodeHtml = (n) => `<div class="org-node r-${n.role} ${n.id === d.me.id ? 'me' : ''}" data-node="${n.id}" tabindex="0">${avatar(n, 'sm')}<div class="on-txt"><b>${esc(n.name)}</b><span>${esc(n.roleLabel)}${n.centerName ? ' · ' + esc(n.centerName) : ''}</span></div>${n.children && n.children.length ? `<button class="org-caret" data-caret="${n.id}" title="Contraer o expandir">−</button>` : ''}</div>`;
  const treeHtml = (n) => `<li>${nodeHtml(n)}${n.children && n.children.length ? `<ul>${n.children.map(treeHtml).join('')}</ul>` : ''}</li>`;
  const legend = `<div class="org-legend">${d.roles.map(r => `<span><i style="background:${ROLE_COLOR[r.key] || 'var(--muted)'}"></i>${esc(r.label)} · ${r.count}</span>`).join('')}</div>`;

  v.innerHTML = pageHead('Organización', 'Quién es quién, quién reporta a quién y qué puede hacer cada rol') +
    `<div class="page"><div class="stack org-stack">
    <div class="org-strip">
      <div class="org-mini"><div class="ic-chip">${icon('users')}</div><div><b>${t.users ?? d.roles.reduce((s, r) => s + r.count, 0)}</b><span>Personas</span></div></div>
      <div class="org-mini"><div class="ic-chip">${icon('home')}</div><div><b>${t.activeCenters ?? '—'}</b><span>Centros activos</span></div></div>
      <div class="org-mini"><div class="ic-chip">${icon('flag')}</div><div><b>${t.campaigns ?? '—'}</b><span>Campañas activas</span></div></div>
      <div class="org-mini"><div class="ic-chip">${icon('shield')}</div><div><b>${d.roles.length}</b><span>Roles</span></div></div>
    </div>

    ${panel('Mi lugar en la organización', `<div class="panel-body">
      <p class="muted" style="margin:0 0 4px;font-weight:700">${d.manager ? 'Reportas a' : 'Tu posición'}</p>
      ${d.manager
        ? `<div class="team-list" style="grid-template-columns:1fr">${teamRow(d.manager, true)}</div>`
        : `<div class="team-row big"><div class="on-txt"><b>Estás en la cima de la organización</b><span>Coordinación general — todos reportan aquí</span></div></div>`}
      <p class="muted" style="margin:18px 0 4px;font-weight:700">${d.team.length ? `A tu cargo · ${d.team.length}` : 'Personas a tu cargo'}</p>
      ${d.team.length ? `<div class="team-list">${d.team.map(n => teamRow(n)).join('')}</div>` : '<p class="muted" style="margin:0">Nadie te reporta directamente.</p>'}
    </div>`)}

    ${d.tree ? panel('Organigrama general · interactivo', `${legend}<div class="org-layout">
      <div class="org-wrap"><ul class="org-tree">${treeHtml(d.tree)}</ul></div>
      <aside class="org-detail" id="orgDetail"><div class="org-detail-empty">Toca una persona<br>para ver su ficha</div></aside>
    </div>`) : ''}

    ${panel('Tipos de usuario y permisos', `<div class="table-wrap"><table>
      <thead><tr><th>Rol</th><th>Personas</th><th>Qué puede hacer</th></tr></thead>
      <tbody>${d.roles.map(r => `<tr><td><span class="pill" style="background:${ROLE_COLOR[r.key] || 'var(--muted)'};color:#fff">${esc(r.label)}</span></td><td class="num">${r.count}</td><td>${esc(ROLE_PERMS[r.key] || '')}</td></tr>`).join('')}</tbody>
    </table></div>`)}
  </div></div>`;

  const gotoChat = (id) => { state.chatWith = id; state.route = 'mensajes'; renderShell(); };
  v.querySelectorAll('.team-row [data-msg]').forEach(b => b.addEventListener('click', () => gotoChat(b.dataset.msg)));

  // ----- organigrama interactivo -----
  if (d.tree) {
    const flat = {}, parentOf = {};
    (function walk(n, p) { flat[n.id] = n; if (p) parentOf[n.id] = p.id; (n.children || []).forEach(c => walk(c, n)); })(d.tree, null);
    const detail = v.querySelector('#orgDetail');

    const selectNode = (id) => {
      const n = flat[id]; if (!n) return;
      v.querySelectorAll('.org-node').forEach(x => x.classList.remove('sel', 'lineage'));
      let cur = id, first = true;
      while (cur) {
        const el = v.querySelector(`.org-node[data-node="${cur}"]`);
        if (el) el.classList.add(first ? 'sel' : 'lineage');
        first = false; cur = parentOf[cur];
      }
      const mgr = parentOf[id] ? flat[parentOf[id]] : null;
      const reports = (n.children || []).length;
      detail.innerHTML = `<div class="od-card">
        ${avatar(n, 'lg')}
        <div class="od-name">${esc(n.name)}</div>
        <div class="od-role">${esc(n.roleLabel)}</div>
        <dl class="od-kv">
          ${n.centerName ? `<div><dt>Centro</dt><dd>${esc(n.centerName)}</dd></div>` : ''}
          <div><dt>Correo</dt><dd>${esc(n.email || '—')}</dd></div>
          <div><dt>Reporta a</dt><dd>${mgr ? esc(mgr.name) : '— (cima de la organización)'}</dd></div>
          <div><dt>A su cargo</dt><dd>${reports} ${reports === 1 ? 'persona' : 'personas'}</dd></div>
        </dl>
        ${n.id !== d.me.id ? `<button class="btn sm block" data-msgd="${n.id}">${icon('message')}<span>Enviar mensaje</span></button>` : '<p class="muted" style="margin:0">Esta persona eres tú.</p>'}
      </div>`;
      const mb = detail.querySelector('[data-msgd]');
      if (mb) mb.addEventListener('click', () => gotoChat(mb.dataset.msgd));
    };

    v.querySelectorAll('.org-node').forEach(el => {
      el.addEventListener('click', () => selectNode(el.dataset.node));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode(el.dataset.node); } });
    });
    v.querySelectorAll('.org-caret').forEach(c => c.addEventListener('click', e => {
      e.stopPropagation();
      const collapsed = c.closest('li').classList.toggle('collapsed');
      c.textContent = collapsed ? '+' : '−';
    }));
    selectNode(d.me.id);
  }
}

// ---------- mensajes / chat ----------
async function viewChat(v) {
  const contacts = await api('/chat/contacts');
  const activeId = state.chatWith || (contacts[0] && contacts[0].id) || null;
  state.chatWith = activeId;
  v.innerHTML = page(pageHead('Mensajes', 'Comunicación entre usuarios de la plataforma'), `
    <div class="chat">
      <div class="chat-list">${contacts.length ? contacts.map(c => `
        <button class="chat-contact ${c.id === activeId ? 'active' : ''}" data-chat="${c.id}">
          ${avatar(c)}
          <div class="cc-txt"><b>${esc(c.name)}</b><span class="cc-last">${c.last ? (c.last.mine ? 'Tú: ' : '') + esc(c.last.text) : esc(ROLE_LABEL[c.role] || c.role)}</span></div>
          ${c.unread ? `<span class="cc-badge">${c.unread}</span>` : ''}
        </button>`).join('') : '<p class="empty">Sin contactos</p>'}
      </div>
      <div class="chat-pane" id="chatPane"><div class="chat-empty">Elige una conversación</div></div>
    </div>`);
  v.querySelectorAll('[data-chat]').forEach(b => b.addEventListener('click', () => { state.chatWith = b.dataset.chat; renderView(); }));
  if (activeId) openConversation(activeId);
}

async function openConversation(otherId) {
  const pane = document.getElementById('chatPane');
  if (!pane) return;
  let d;
  try { d = await api('/chat/' + otherId); } catch (e) { pane.innerHTML = `<div class="chat-empty">${esc(e.message)}</div>`; return; }
  pane.innerHTML = `
    <div class="chat-pane-head">${avatar(d.other)}<div><b>${esc(d.other.name)}</b><div class="muted" style="font-size:11px">${esc(ROLE_LABEL[d.other.role] || d.other.role)}</div></div></div>
    <div class="chat-msgs" id="chatMsgs">${d.messages.length ? d.messages.map(m => `<div class="bubble ${m.mine ? 'me' : 'them'}">${esc(m.text)}<span class="t">${fmtTime(m.date)}</span></div>`).join('') : '<div class="chat-empty">Aún no hay mensajes. Escribe el primero.</div>'}</div>
    <form class="chat-form" id="chatForm"><input placeholder="Escribe un mensaje…" name="text" autocomplete="off" /><button class="btn" type="submit">${icon('send2')}</button></form>`;
  const msgs = document.getElementById('chatMsgs'); if (msgs) msgs.scrollTop = msgs.scrollHeight;
  document.getElementById('chatForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const t = ev.target.text.value.trim();
    if (!t) return;
    ev.target.text.value = '';
    try { await api('/chat', { body: { toId: otherId, text: t } }); await openConversation(otherId); } catch (e) { toast(e.message, true); }
  });
  refreshUnread();
  // refresca el contacto activo en la lista (último mensaje)
  document.querySelectorAll('.chat-contact').forEach(b => b.classList.toggle('active', b.dataset.chat === otherId));
}

// ---------- coordinador: panel global ----------
async function viewGlobal(v) {
  const d = await api('/dashboard/global');
  const activeCamp = d.campaigns.filter(c => c.active).length;
  const totalStock = d.centersComparison.reduce((s, c) => s + c.stock, 0);
  const maxStock = Math.max(1, ...d.centersComparison.map(c => c.stock));
  const maxTop = Math.max(1, ...d.topArticles.map(a => a.total));
  const maxFlow = Math.max(1, ...d.centersComparison.map(c => Math.max(c.entradas, c.salidas)));

  v.innerHTML = page(pageHead('Panel global', 'Visión de todas las campañas y centros'), `
    <div class="statgrid">
      ${statcard('flag', 'Campañas activas', activeCamp, 'green')}
      ${statcard('home', 'Centros', d.centersComparison.length, 'neutral')}
      ${statcard('box', 'Stock total', totalStock, 'green')}
      ${statcard('alert', 'Merma total', d.mermaTotal, 'clay')}
    </div>
    <div class="panels">
      ${panel('Totales por campaña', `<div class="table-wrap"><table>
        <thead><tr><th>Campaña</th><th>Centros</th><th>Recep.</th><th>Entregas</th><th>Merma</th><th>Stock</th></tr></thead>
        <tbody>${d.campaigns.map(c => `<tr>
          <td><b>${esc(c.name)}</b> ${c.active ? '<span class="pill green">activa</span>' : '<span class="pill gray">inactiva</span>'}</td>
          <td class="num">${c.centers}</td><td class="num">${c.recepciones}</td><td class="num">${c.entregas}</td>
          <td class="num">${c.merma}</td><td class="num"><b>${c.stock}</b></td></tr>`).join('')}</tbody></table></div>`)}

      ${panel('Stock por centro', `<div class="panel-body">${d.centersComparison.map(c => bar(c.name, c.stock, maxStock, 'green')).join('') || '<p class="empty">Sin datos</p>'}</div>`)}

      ${panel('Entradas vs. salidas por centro', `<div class="panel-body">${d.centersComparison.map(c =>
        `<div class="bar-group"><div class="bar-group-label">${esc(c.name)}</div>
          ${bar('Entradas', c.entradas, maxFlow, 'green')}
          ${bar('Salidas', c.salidas, maxFlow, 'neutral')}</div>`).join('') || '<p class="empty">Sin datos</p>'}</div>`)}

      ${panel('Artículos más donados', `<div class="panel-body">${d.topArticles.map(a => bar(a.name, a.total, maxTop, 'green')).join('') || '<p class="empty">Sin datos</p>'}</div>`)}
    </div>`);
}

// ---------- coordinador: centros ----------
async function viewCentros(v) {
  const [centers, users, campaigns] = await Promise.all([api('/centers'), api('/users'), api('/campaigns')]);
  const encargados = users.filter(u => u.role === 'encargado');
  v.innerHTML = page(
    pageHead('Centros de acopio', `${centers.length} centros registrados`,
      `<button class="btn sm" id="new">${icon('plus')}<span>Nuevo centro</span></button>`),
    `<div class="cardgrid">${centers.map(c => {
      const enc = users.find(u => u.id === c.encargadoId);
      return `<div class="card">
        <div class="card-top">
          <div><h3>${esc(c.name)}</h3><p class="muted">${esc(c.institution || '—')}${c.location ? ' · ' + esc(c.location) : ''}</p></div>
          <span class="pill ${c.active ? 'green' : 'gray'}">${c.active ? 'activo' : 'inactivo'}</span>
        </div>
        <dl class="kv">
          <div><dt>Encargado</dt><dd>${esc(enc ? enc.name : 'sin asignar')}</dd></div>
          <div><dt>Campañas</dt><dd>${c.campaignIds.map(id => esc((campaigns.find(x => x.id === id) || {}).name || '')).join(', ') || '—'}</dd></div>
        </dl>
        <div class="row-actions">
          <button class="btn sm ghost" data-edit="${c.id}">${icon('edit')}<span>Editar</span></button>
          <button class="btn sm ghost" data-toggle="${c.id}">${c.active ? 'Desactivar' : 'Activar'}</button>
        </div>
      </div>`;
    }).join('')}</div>`);

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
  const [campaigns, users, global] = await Promise.all([api('/campaigns'), api('/users'), api('/dashboard/global').catch(() => null)]);
  const lideres = users.filter(u => u.role === 'lider');
  const gmap = {};
  if (global) global.campaigns.forEach(g => { gmap[g.id] = g; });
  const activas = campaigns.filter(c => c.active).length;
  const totalStock = Object.values(gmap).reduce((s, g) => s + (g.stock || 0), 0);

  const timeline = (c) => {
    if (!c.startDate || !c.endDate) return '';
    const s = +new Date(c.startDate), e = +new Date(c.endDate), now = Date.now();
    const pct = Math.max(0, Math.min(100, Math.round(((now - s) / (e - s)) * 100)));
    const label = now < s ? 'Aún no inicia' : now > e ? 'Finalizada' : `Día ${Math.max(1, Math.round((now - s) / 86400000))} de ${Math.round((e - s) / 86400000)}`;
    return `<div class="camp-time">
      <div class="camp-time-bar"><div class="camp-time-fill" style="width:${pct}%"></div></div>
      <div class="camp-time-txt"><span>${fmtDate(c.startDate)}</span><span>${label}</span><span>${fmtDate(c.endDate)}</span></div>
    </div>`;
  };

  v.innerHTML = page(
    pageHead('Campañas', `${campaigns.length} campañas · ${activas} activas`,
      `<button class="btn sm" id="new">${icon('plus')}<span>Nueva campaña</span></button>`),
    `<div class="statgrid">
      ${statcard('flag', 'Campañas activas', activas, 'green')}
      ${statcard('box', 'Stock en campañas', totalStock, 'green')}
      ${statcard('users', 'Líderes asignados', campaigns.filter(c => c.liderId).length, 'neutral')}
    </div>
    <div class="cardgrid">${campaigns.map(c => {
      const g = gmap[c.id] || {};
      const lider = users.find(u => u.id === c.liderId);
      return `<div class="card camp-card">
      <div class="card-top">
        <div><h3>${esc(c.name)}</h3><p class="muted" style="margin:3px 0 0">${esc(c.description || 'Sin descripción')}</p></div>
        <span class="pill ${c.active ? 'green' : 'gray'}">${c.active ? 'activa' : 'inactiva'}</span>
      </div>
      <div class="camp-stats">
        <div class="camp-stat"><b>${g.centers ?? 0}</b><span>Centros</span></div>
        <div class="camp-stat"><b>${g.recepciones ?? 0}</b><span>Recep.</span></div>
        <div class="camp-stat"><b>${g.entregas ?? 0}</b><span>Entregas</span></div>
        <div class="camp-stat accent"><b>${g.stock ?? 0}</b><span>Stock</span></div>
      </div>
      ${timeline(c)}
      <dl class="kv">
        <div><dt>Líder</dt><dd>${lider ? esc(lider.name) : '<span class="muted">sin asignar</span>'}</dd></div>
        <div><dt>Merma</dt><dd>${g.merma ?? 0}</dd></div>
      </dl>
      <div class="row-actions">
        <button class="btn sm ghost" data-edit="${c.id}">${icon('edit')}<span>Editar</span></button>
        <button class="btn sm ghost" data-toggle="${c.id}">${c.active ? 'Desactivar' : 'Activar'}</button>
      </div>
    </div>`;
    }).join('')}</div>`);

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
  v.innerHTML = page(
    pageHead('Cuentas', 'Usuarios del sistema por rol',
      `<button class="btn sm" id="new">${icon('plus')}<span>Nueva cuenta</span></button>`),
    panel('Usuarios', `<div class="table-wrap"><table>
      <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Centro</th></tr></thead>
      <tbody>${users.map(u => `<tr><td><b>${esc(u.name)}</b></td><td>${esc(u.email)}</td>
        <td><span class="pill gray">${ROLE_LABEL[u.role] || u.role}</span></td>
        <td>${esc((centers.find(c => c.id === u.centerId) || {}).name || '—')}</td></tr>`).join('')}</tbody></table></div>`));
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

  v.innerHTML = page(
    pageHead('Movimientos', `${movs.length} registros`,
      `<button class="btn sm ghost" id="csv">${icon('download')}<span>Exportar CSV</span></button>`),
    `${panel('Filtros', `<div class="panel-body filters">
      <label class="f"><span>Centro</span><select id="fCenter"><option value="">Todos</option>${centers.map(c => opt(c.id, c.name, v.dataset.center)).join('')}</select></label>
      <label class="f"><span>Campaña</span><select id="fCamp"><option value="">Todas</option>${campaigns.map(c => opt(c.id, c.name, v.dataset.campaign)).join('')}</select></label>
    </div>`)}
    ${movsPanel(movs, 'Historial completo')}`);

  document.getElementById('fCenter').addEventListener('change', e => { v.dataset.center = e.target.value; renderView(); });
  document.getElementById('fCamp').addEventListener('change', e => { v.dataset.campaign = e.target.value; renderView(); });
  document.getElementById('csv').addEventListener('click', async () => {
    const r = await api('/movements?' + qs.toString() + (qs.toString() ? '&' : '') + 'format=csv');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([r.csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'movimientos.csv'; a.click();
  });
}

// ---------- encargado: mi centro ----------
async function viewCentro(v, centerId) {
  const d = await api('/dashboard/center/' + centerId);
  const maxStock = Math.max(1, ...d.stock.map(s => s.qty));
  v.innerHTML = page(pageHead(d.center.name, d.center.institution), `
    <div class="statgrid">
      ${statcard('trend', 'Entradas', d.entradas, 'green')}
      ${statcard('send', 'Salidas', d.salidas, 'neutral')}
      ${statcard('alert', 'Merma', d.merma, 'clay')}
    </div>
    <div class="panels">
      ${panel('Inventario actual', d.stock.length
        ? `<div class="panel-body">${d.stock.map(s => bar(`${s.article}`, s.qty, maxStock, 'green')).join('')}</div>
           <div class="table-wrap"><table><thead><tr><th>Artículo</th><th>Campaña</th><th>Stock</th></tr></thead>
           <tbody>${d.stock.map(s => `<tr><td>${esc(s.article)}</td><td>${esc(s.campaign)}</td><td class="num"><b>${s.qty}</b> <span class="unit">${esc(s.unit)}</span></td></tr>`).join('')}</tbody></table></div>`
        : '<p class="empty">Sin stock todavía</p>')}
      ${movsPanel(d.history, 'Últimos movimientos')}
    </div>`);
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

  v.innerHTML = page(pageHead('Registrar movimiento', myCenter ? myCenter.name : ''), `
    <section class="panel form-panel">
      <div class="panel-head"><h3>Nuevo movimiento</h3></div>
      <div class="panel-body">
        <label class="f"><span>Tipo de movimiento</span><select id="mtype">${types.map(([k, l]) => opt(k, l)).join('')}</select></label>
        <form id="mvForm"></form>
      </div>
    </section>`);

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
    fields += `<button class="btn block" style="margin-top:6px">${icon('check')}<span>Registrar</span></button>`;
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
  v.innerHTML = page(pageHead('Historial', 'Movimientos de tu centro'), movsPanel(movs, `${movs.length} movimientos`));
}

// ---------- institución ----------
async function viewEntregas(v) {
  const list = await api('/deliveries');
  const pend = list.filter(m => m.status === 'pendiente').length;
  const inner = list.length
    ? `<div class="table-wrap"><table>
      <thead><tr><th>Fecha</th><th>Centro</th><th>Artículo</th><th>Cantidad</th><th>Estado</th><th></th></tr></thead>
      <tbody>${list.map(m => `<tr><td>${fmtDate(m.date)}</td><td>${esc(m.centerName)}</td><td>${esc(m.articleName)}</td>
        <td class="num"><b>${m.quantity}</b> <span class="unit">${esc(m.articleUnit)}</span></td>
        <td><span class="pill ${m.status === 'recibida' ? 'green' : 'gold'}">${esc(m.status)}</span></td>
        <td>${m.status === 'pendiente' ? `<button class="btn sm" data-confirm="${m.id}">${icon('check')}<span>Confirmar</span></button>` : ''}</td></tr>`).join('')}</tbody></table></div>`
    : '<p class="empty">Aún no hay entregas canalizadas</p>';
  v.innerHTML = page(pageHead('Entregas recibidas', 'Confirma la recepción de lo que se te canaliza'), `
    <div class="statgrid">
      ${statcard('inbox', 'Total canalizadas', list.length, 'neutral')}
      ${statcard('clock', 'Pendientes de confirmar', pend, 'gold')}
    </div>
    ${panel('Entregas', inner)}`);
  document.querySelectorAll('[data-confirm]').forEach(b => b.addEventListener('click', async () => {
    await api(`/deliveries/${b.dataset.confirm}/confirm`, { method: 'POST' });
    toast('Entrega confirmada'); renderView();
  }));
}

// ---------- líder ----------
async function viewCampana(v) {
  const campaigns = await api('/campaigns');
  const mine = campaigns.find(c => c.liderId === state.user.id);
  if (!mine) { v.innerHTML = page(pageHead('Mi campaña', ''), '<p class="empty">No tienes una campaña asignada.</p>'); return; }
  const d = await api('/dashboard/campaign/' + mine.id);
  const maxC = Math.max(1, ...d.centers.map(c => c.stock));
  v.innerHTML = page(
    pageHead(mine.name, 'Agregado de tu campaña',
      `<button class="btn sm ghost" id="edit">${icon('edit')}<span>Editar campaña</span></button>`),
    `<div class="statgrid">
      ${statcard('trend', 'Recepciones', d.totals.recepciones, 'green')}
      ${statcard('send', 'Entregas', d.totals.entregas, 'neutral')}
      ${statcard('alert', 'Merma', d.totals.merma, 'clay')}
      ${statcard('box', 'Stock', d.totals.stock, 'green')}
    </div>
    ${panel('Stock por centro participante', `<div class="panel-body">${
      d.centers.map(c => bar(c.name, c.stock, maxC, 'green')).join('') || '<p class="empty">Sin centros</p>'}</div>`)}`);
  document.getElementById('edit').addEventListener('click', () => modal('Editar campaña', `
    <label class="f"><span>Nombre</span><input name="name" value="${esc(mine.name)}" required/></label>
    <label class="f"><span>Descripción</span><textarea name="description" rows="2">${esc(mine.description || '')}</textarea></label>
    <label class="f"><span>Inicio</span><input name="startDate" type="date" value="${(mine.startDate || '').slice(0, 10)}"/></label>
    <label class="f"><span>Fin</span><input name="endDate" type="date" value="${(mine.endDate || '').slice(0, 10)}"/></label>`,
    async (data) => { await api('/campaigns/' + mine.id, { method: 'PATCH', body: data }); toast('Campaña actualizada'); renderView(); }));
}

// ---------- aviso de cookies / almacenamiento ----------
function cookieNotice() {
  try { if (localStorage.getItem('cda_cookies')) return; } catch (e) { return; }
  const el = h(`<div class="cookie-bar">
    <p>Prothymía guarda datos en el <b>almacenamiento local de tu navegador</b> (tu sesión y los datos de la demo). No se comparten con terceros ni se usan para rastreo.</p>
    <button class="btn sm" id="cookieOk">Entendido</button>
  </div>`);
  document.body.appendChild(el);
  el.querySelector('#cookieOk').addEventListener('click', () => {
    try { localStorage.setItem('cda_cookies', '1'); } catch (e) {}
    el.remove();
  });
}

// ---------- start ----------
document.addEventListener('click', (e) => {
  const b = e.target.closest && e.target.closest('[data-theme-btn]');
  if (b) toggleTheme();
  const lo = e.target.closest && e.target.closest('[data-logout]');
  if (lo) logout();
});
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('brand') && e.target.dataset.go) {
    e.preventDefault(); go(e.target.dataset.go);
  }
});
route();
cookieNotice();
