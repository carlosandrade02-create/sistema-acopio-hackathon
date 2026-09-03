# 📦 Sistema de Registro y Coordinación de Centros de Acopio

Plataforma web para que una universidad coordine varios centros de acopio durante una
contingencia: cada centro registra sus **recepciones, entregas, merma y transferencias**,
y el stock se calcula automáticamente por **centro + campaña**. La coordinación general
tiene visibilidad global.

## Stack

100 % **HTML + CSS + JavaScript** (sin frameworks, sin build, sin servidor).
Toda la lógica corre en el navegador; los datos se guardan en `localStorage`.

## Probar en local

- **VS Code + Live Server:** clic derecho en `index.html` → *Open with Live Server*.
- O abre `index.html` directamente en el navegador.

## Subir a Hostinger (subdominio)

1. hPanel → **Dominios → Subdominios** → crea p. ej. `acopio.tudominio.com`
   (Hostinger crea la carpeta `public_html/acopio/`).
2. Administrador de archivos o FTP → entra a esa carpeta.
3. Sube los archivos **en este orden** (o todos juntos):
   1. `index.html`
   2. `styles.css`
   3. `data.js`
   4. `store.js`
   5. `app.js`
4. Abre `https://acopio.tudominio.com`.

No hay nada que configurar: sin base de datos, sin PHP, sin Node.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Estructura de la página y carga de scripts |
| `styles.css` | **Todo el diseño visual** |
| `data.js` | Datos de ejemplo (semilla): campaña, centros, artículos, movimientos |
| `store.js` | "Backend" simulado: `localStorage`, API interna y regla de stock |
| `app.js` | Interfaz: login, navegación y vistas por rol |

## Cuentas de prueba (contraseña `demo123`)

| Rol | Correo |
|---|---|
| Coordinador general | `coord@demo.com` |
| Encargado de centro (Centro Norte) | `norte@demo.com` |
| Voluntario de centro (Centro Norte) | `vol.norte@demo.com` |
| Encargado (Escuela Benito Juárez) | `escuela@demo.com` |
| Encargado (Parroquia San José) | `parroquia@demo.com` |
| Institución receptora (DIF) | `dif@demo.com` |
| Líder de campaña | `lider@demo.com` |

En la pantalla de login puedes hacer clic en una cuenta de prueba para autocompletarla.
El botón **"Reiniciar demo"** de la barra lateral borra los cambios y restaura los datos de ejemplo.

## Regla de stock

```
stock(centro, campaña) = recepciones + transferencia-entrada + ajuste(+)
                       - entregas - merma - transferencia-salida - ajuste(-)
```

Nunca se permite stock negativo. Toda corrección se hace con un **movimiento de ajuste**
(con motivo y actor), no editando números sueltos. Todo movimiento guarda actor y fecha.

## Roles y permisos

- **Coordinador general:** alta/edición y activar/desactivar de centros y campañas; crea
  cuentas; ve el dashboard global y todos los movimientos; puede registrar ajustes.
- **Encargado de centro:** recepciones, entregas, merma, transferencias y ajustes de su
  centro; ve su inventario y dashboard.
- **Voluntario de centro:** apoya el registro de recepciones y entregas; no registra merma
  ni configura nada.
- **Institución receptora:** ve las entregas que se le canalizan y las confirma como recibidas.
- **Líder de campaña (opcional):** gestiona su campaña y ve el agregado de esa campaña.

El donante **no tiene cuenta**: sus donaciones las registra el voluntario o el encargado,
y pueden ser anónimas o con datos.

## Limitación conocida

Los datos viven en el `localStorage` de cada navegador: **no se comparten** entre
computadoras ni usuarios. Es una simulación para demo y desarrollo de la interfaz.
Para datos compartidos reales se necesitaría un backend (Node, PHP+MySQL o Firebase).

## Herramientas de IA usadas

Código generado con asistencia de Claude (Anthropic) para el andamiaje del frontend, la
lógica de simulación y los datos de ejemplo, siguiendo el documento de requerimientos.
