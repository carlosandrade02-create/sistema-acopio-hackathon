# Documento de declaración y descripción del proyecto

## Equipo y proyecto
- **Proyecto:** Sistema de Registro y Coordinación de Centros de Acopio
- **Equipo:** _(nombre del equipo)_

## Descripción breve
Plataforma web donde una coordinación universitaria registra centros de acopio y campañas,
y cada centro (con cuenta propia) registra recepciones, entregas, merma y transferencias.
El stock se calcula automáticamente por centro + campaña y se corrige con movimientos de ajuste.

**Diferenciador:** operación en **pocos clics** con un modelo basado 100 % en movimientos
trazables (cada número tiene actor, fecha y motivo) — nunca se editan cantidades sueltas,
lo que da robustez y auditoría total sin complejidad para el usuario.

## Problema que resuelve e impacto
Hoy cada centro guarda sus donativos con reglas propias y sin control central: no se sabe
qué hay en tiempo real, no hay trazabilidad y la coordinación no puede decidir a dónde
enviar recursos. Beneficia a la coordinación universitaria, a los encargados/voluntarios
de cada centro y a las instituciones receptoras y beneficiarios finales.

## Alcance implementado (MVP)
- Autenticación real por rol (Coordinador, Encargado, Voluntario, Institución receptora, Líder).
- Coordinador: alta/edición y activar/desactivar de centros y campañas; alta de cuentas.
- Encargado/voluntario: recepciones (anónimas o con datos) y entregas.
- Encargado: merma con motivo, transferencias entre centros y ajustes de stock.
- Inventario automático por centro, filtrable por campaña; corregible por ajuste.
- Dashboards: global (coordinador), por centro (encargado), agregado por campaña (líder).
- Institución receptora confirma las entregas canalizadas.
- Visibilidad jerárquica: el coordinador ve todo; cada centro solo lo suyo.
- Datos de ejemplo propios (campaña, centros, artículos, movimientos).
- Extras: exportación CSV, rol Líder de campaña.

## Checklist de criterios de aceptación
- [x] El coordinador puede registrar un centro y una campaña.
- [x] Un encargado o voluntario registra una recepción (anónima o con datos) y el stock sube.
- [x] Se registra una entrega y el stock baja.
- [x] Se registra una merma con motivo y aparece en el historial.
- [x] Se registra una transferencia y el stock pasa de un centro a otro.
- [x] El stock se corrige a mano mediante un movimiento de ajuste con motivo.
- [x] El coordinador ve el dashboard global con los totales de la campaña.
- [x] El sistema puede ejecutarse o verse desde otra computadora (desplegado como sitio estático en Hostinger / URL pública).

## Stack utilizado
HTML + CSS + JavaScript vanilla (sin frameworks ni build). Lógica de negocio y "API"
simulada en el navegador; persistencia en `localStorage`. Desplegable como sitio estático
(Hostinger, GitHub Pages, Netlify).

## Cuentas de acceso y pasos para probar
Ver `README.md`. Contraseña de todas las cuentas de prueba: `demo123`.
Demo sugerida (30 s): entrar como `norte@demo.com` → Registrar → recepción → ver stock;
luego `coord@demo.com` → Dashboard global.

## Fuentes citadas
JavaScript nativo del navegador (`localStorage`, `crypto.randomUUID`), Google Fonts (Nunito).

## Limitaciones conocidas y pasos futuros
Los datos se guardan en `localStorage` del navegador: no se comparten entre computadoras
ni usuarios (es una simulación para demo). Sin mapa ni notificaciones.
Futuro: backend con base de datos compartida, mapa de centros, metas por campaña,
aprobación de merma por coordinador.

## Declaración de herramientas de IA
Claude (Anthropic) se usó para generar el andamiaje del backend/frontend y los datos de
ejemplo, siguiendo el documento de requerimientos. La revisión y las decisiones de diseño
son del equipo.
