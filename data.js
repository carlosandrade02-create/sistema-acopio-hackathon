/* Datos de ejemplo (semilla). Versión de simulación: contraseñas en texto plano. */
window.SEED = function seed() {
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Math.random().toString(36).slice(2));

  const campaign = {
    id: uid(),
    name: 'Huracán Otília 2026',
    startDate: '2026-08-20', endDate: '2026-10-31',
    description: 'Coordinación de acopio por afectaciones del huracán en la zona costa.',
    active: true, liderId: null,
  };

  const centers = [
    { id: uid(), name: 'Centro Norte — Cruz Roja', institution: 'Cruz Roja Mexicana', location: 'Av. Hidalgo 120, Centro', encargadoId: null, campaignIds: [campaign.id], active: true },
    { id: uid(), name: 'Escuela Benito Juárez', institution: 'SEP', location: 'Calle 5 de Mayo 44, Col. Obrera', encargadoId: null, campaignIds: [campaign.id], active: true },
    { id: uid(), name: 'Parroquia San José', institution: 'Diócesis local', location: 'Plaza Juárez s/n', encargadoId: null, campaignIds: [campaign.id], active: true },
  ];
  const [norte, escuela, parroquia] = centers;

  const articles = [
    { id: uid(), name: 'Agua embotellada', category: 'no_perecedero', unit: 'l' },
    { id: uid(), name: 'Despensa básica', category: 'no_perecedero', unit: 'caja' },
    { id: uid(), name: 'Cobijas', category: 'ropa', unit: 'pieza' },
    { id: uid(), name: 'Ropa de abrigo', category: 'ropa', unit: 'bolsa' },
    { id: uid(), name: 'Kit de limpieza', category: 'limpieza', unit: 'caja' },
    { id: uid(), name: 'Paracetamol', category: 'medicamento', unit: 'caja' },
    { id: uid(), name: 'Pañales', category: 'otro', unit: 'bolsa' },
  ];
  const A = Object.fromEntries(articles.map(a => [a.name, a.id]));

  const users = [
    { id: uid(), name: 'Coordinación General', email: 'coord@demo.com', password: 'demo123', role: 'coordinador', centerId: null, color: '#EE6A1E' },
    { id: uid(), name: 'Laura Méndez', email: 'norte@demo.com', password: 'demo123', role: 'encargado', centerId: norte.id, color: '#1A1A1A' },
    { id: uid(), name: 'Diego Ramírez', email: 'vol.norte@demo.com', password: 'demo123', role: 'voluntario', centerId: norte.id, color: '#C8530F' },
    { id: uid(), name: 'Prof. Martín Ruiz', email: 'escuela@demo.com', password: 'demo123', role: 'encargado', centerId: escuela.id, color: '#3A3A3A' },
    { id: uid(), name: 'Sofía Nava', email: 'vol.escuela@demo.com', password: 'demo123', role: 'voluntario', centerId: escuela.id, color: '#EE6A1E' },
    { id: uid(), name: 'Hna. Guadalupe', email: 'parroquia@demo.com', password: 'demo123', role: 'encargado', centerId: parroquia.id, color: '#1A1A1A' },
    { id: uid(), name: 'DIF Municipal', email: 'dif@demo.com', password: 'demo123', role: 'institucion', centerId: null, color: '#C8530F' },
    { id: uid(), name: 'Coord. Campaña', email: 'lider@demo.com', password: 'demo123', role: 'lider', centerId: null, color: '#3A3A3A' },
  ];
  const U = Object.fromEntries(users.map(u => [u.email, u.id]));
  norte.encargadoId = U['norte@demo.com'];
  escuela.encargadoId = U['escuela@demo.com'];
  parroquia.encargadoId = U['parroquia@demo.com'];
  campaign.liderId = U['lider@demo.com'];
  const dif = U['dif@demo.com'];
  const actor = c => ({ actorId: c.encargadoId, actorName: users.find(u => u.id === c.encargadoId).name });

  const M = [];
  const mv = (o) => M.push({ id: uid(), campaignId: campaign.id, motive: null, donor: null, note: null, ...o });
  const d = (day, h = 10) => `2026-09-${String(day).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00.000Z`;

  mv({ type: 'recepcion', centerId: norte.id, articleId: A['Agua embotellada'], quantity: 500, date: d(1), donor: 'Anónimo', ...actor(norte) });
  mv({ type: 'recepcion', centerId: norte.id, articleId: A['Despensa básica'], quantity: 40, date: d(2), donor: 'Supermercado La Central', ...actor(norte) });
  mv({ type: 'recepcion', centerId: norte.id, articleId: A['Cobijas'], quantity: 60, date: d(3), donor: 'Anónimo', ...actor(norte) });
  mv({ type: 'entrega', centerId: norte.id, articleId: A['Despensa básica'], quantity: 15, date: d(6), institutionUserId: dif, status: 'pendiente', ...actor(norte) });
  mv({ type: 'merma', centerId: norte.id, articleId: A['Agua embotellada'], quantity: 20, date: d(7), motive: 'daño', ...actor(norte) });
  mv({ type: 'ajuste', centerId: norte.id, articleId: A['Agua embotellada'], quantity: -5, date: d(8), motive: 'correccion', ...actor(norte) });

  const pair = uid();
  mv({ type: 'transferencia-salida', centerId: norte.id, toCenterId: escuela.id, pairId: pair, articleId: A['Cobijas'], quantity: 20, date: d(5), ...actor(norte) });
  mv({ type: 'transferencia-entrada', centerId: escuela.id, toCenterId: norte.id, pairId: pair, articleId: A['Cobijas'], quantity: 20, date: d(5), ...actor(escuela) });

  mv({ type: 'recepcion', centerId: escuela.id, articleId: A['Kit de limpieza'], quantity: 30, date: d(2), donor: 'Anónimo', ...actor(escuela) });
  mv({ type: 'recepcion', centerId: escuela.id, articleId: A['Ropa de abrigo'], quantity: 25, date: d(4), donor: 'Familia Torres', ...actor(escuela) });
  mv({ type: 'entrega', centerId: escuela.id, articleId: A['Kit de limpieza'], quantity: 10, date: d(9), institutionUserId: dif, status: 'recibida', confirmedAt: d(10), ...actor(escuela) });

  mv({ type: 'recepcion', centerId: parroquia.id, articleId: A['Paracetamol'], quantity: 12, date: d(3), donor: 'Farmacia del Pueblo', ...actor(parroquia) });
  mv({ type: 'recepcion', centerId: parroquia.id, articleId: A['Pañales'], quantity: 40, date: d(4), donor: 'Anónimo', ...actor(parroquia) });
  mv({ type: 'recepcion', centerId: parroquia.id, articleId: A['Agua embotellada'], quantity: 200, date: d(5), donor: 'Anónimo', ...actor(parroquia) });

  // pendientes fijados (personales)
  const pins = [
    { id: uid(), userId: U['norte@demo.com'], text: 'Pedir más tarimas al almacén central', done: false, date: d(8, 9) },
    { id: uid(), userId: U['coord@demo.com'], text: 'Confirmar sede para el 2.º acopio', done: false, date: d(8, 8) },
  ];

  // chats
  const msg = (from, to, text, day, h) => ({ id: uid(), fromId: U[from], toId: U[to], text, date: d(day, h), read: true });
  const messages = [
    msg('coord@demo.com', 'norte@demo.com', 'Hola Laura, ¿cómo va el acopio en el Centro Norte?', 7, 9),
    msg('norte@demo.com', 'coord@demo.com', 'Bien. Ya recibimos 500 L de agua y 40 cajas de despensa. Nos falta ropa de abrigo.', 7, 10),
    msg('coord@demo.com', 'norte@demo.com', 'Perfecto. Te transferimos cobijas de la Escuela.', 7, 11),
    { id: uid(), fromId: U['coord@demo.com'], toId: U['dif@demo.com'], text: 'DIF: les canalizamos 15 cajas de despensa desde el Centro Norte, favor de confirmarlas al recibir.', date: d(9, 12), read: false },
    { id: uid(), fromId: U['norte@demo.com'], toId: U['vol.norte@demo.com'], text: 'Diego, hoy llegan donativos a las 4pm, ¿puedes apoyar en recepción?', date: d(9, 15), read: false },
  ];

  return { campaigns: [campaign], centers, articles, users, movements: M, pins, messages };
};
