# Prothymía — Sistema de Registro y Coordinación de Centros de Acopio

Plataforma web para que una universidad coordine varios centros de acopio durante una
contingencia: cada centro registra sus **recepciones, entregas, merma y transferencias**,
y el stock se calcula automáticamente por **centro + campaña**. La coordinación general
tiene visibilidad global.

## Stack

100 % **HTML + CSS + JavaScript** (sin frameworks, sin build, sin servidor).
Toda la lógica corre en el navegador; los datos se guardan en `localStorage`.

La app tiene tres pantallas antes del panel:
1. **Landing** (`#/`) — explica el proyecto. Botón **Dashboard** arriba y abajo.
2. **Dashboard** (`#/dashboard`) — explica qué es la herramienta, qué hace y la regla de
   stock. Botón **Entrar / Comenzar**.
3. **Login** (`#/entrar`) — si ya iniciaste sesión, entra directo al panel (`#/app`).

La tipografía (Montserrat) y las fotos de la landing se cargan desde CDN. Si no hay
internet, el sitio funciona igual: usa una tipografía de respaldo y las fotos se ocultan
sin romper el diseño.

## Probar en local

- **VS Code + Live Server:** clic derecho en `index.html` → *Open with Live Server*.
- O abre `index.html` directamente en el navegador.

## Tutorial: subir todo a Hostinger

**Qué se sube:** solo archivos estáticos. No hay base de datos, PHP ni Node que configurar.

### 1. Crear el subdominio
1. Entra a **hPanel** (panel de Hostinger).
2. **Sitios web → Panel de control** del dominio → **Dominios → Subdominios**.
3. Escribe el nombre (p. ej. `acopio`) y crea. Hostinger genera la carpeta
   `public_html/acopio/`.

### 2. Preparar los archivos
En tu computadora, junta en una carpeta:
- `index.html`, `styles.css`, `data.js`, `store.js`, `app.js`, `circular-gallery.js`
- la carpeta `assets/` completa

*Para ahorrar espacio (opcional):* no subas `assets/acopia.jpg` ni
`assets/Gemini_Generated_Image_*.jpg` — son solo la fuente del logo.

### 3. Subir
**Opción A — Administrador de archivos (más fácil):**
1. hPanel → **Archivos → Administrador de archivos**.
2. Entra a `public_html/acopio/`.
3. Botón **Subir** (icono de flecha arriba) → arrastra todos los archivos y la carpeta
   `assets/`. Si tu navegador no sube carpetas, comprime todo en un `.zip`, súbelo y usa
   **Extraer** dentro del administrador.
4. Verifica que `index.html` quede directamente dentro de `acopio/` (no dentro de otra
   subcarpeta).

**Opción B — FTP:** con FileZilla, host `ftp.tudominio.com`, usuario/clave de hPanel →
**Archivos → Cuentas FTP**. Copia todo a `/public_html/acopio/`.

### 4. Probar
Abre `https://acopio.tudominio.com`. Si sale el candado y carga la landing, listo.
(La primera visita puede tardar unos minutos mientras Hostinger emite el certificado SSL.)

### 5. Actualizar en el futuro
Vuelve a subir solo los archivos que cambiaste, sobrescribiendo. Pide a quien pruebe que
recargue con **Ctrl + F5** para saltarse la caché.

> **Deshacer la demo local:** el botón *Reiniciar demo* (barra lateral) borra los datos de
> ese navegador y restaura los de ejemplo.

## Inicio de sesión con Google y captcha (opcional, para que sean reales)

La demo ya funciona sin esto: Google abre un selector simulado y el captcha es una
casilla + operación. Para activar los servicios reales:

**Google Sign-In**
1. [console.cloud.google.com](https://console.cloud.google.com) → crea un proyecto.
2. **APIs y servicios → Pantalla de consentimiento OAuth** → tipo *Externo*, completa lo mínimo.
3. **Credenciales → Crear credenciales → ID de cliente de OAuth → Aplicación web**.
   En *Orígenes autorizados de JavaScript* agrega `https://acopio.tudominio.com`
   (y `http://localhost:5500` si usas Live Server).
4. Copia el **ID de cliente** y pégalo en `app.js`:
   `const GOOGLE_CLIENT_ID = 'xxxx.apps.googleusercontent.com';`

**reCAPTCHA v2 ("No soy un robot")**
1. [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin) → **+** → reCAPTCHA v2,
   *"No soy un robot"*. En *Dominios* agrega `acopio.tudominio.com` (y `localhost`).
2. Copia la **Clave del sitio** y pégala en `app.js`:
   `const RECAPTCHA_SITE_KEY = '...';`

El `<script>` de ambos servicios ya está incluido en `index.html`.

> **Datos de contacto del footer:** correo `prothymia@gmail.com`, tel. `+52 833 530 9449`
> (WhatsApp al mismo número). Instagram y LinkedIn son de ejemplo. Todo se edita en
> `app.js` → constante `CONTACT`.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Estructura de la página y carga de scripts |
| `styles.css` | **Todo el diseño visual** |
| `data.js` | Datos de ejemplo (semilla): campaña, centros, artículos, movimientos |
| `store.js` | "Backend" simulado: `localStorage`, API interna y regla de stock |
| `app.js` | Interfaz: landing, página de la herramienta, login y panel por rol |
| `circular-gallery.js` | Galería circular WebGL de la landing (port de React Bits; carga `ogl` desde CDN, con respaldo si no hay internet) |
| `assets/` | Logo (`prothymia-logo*.png`) y fotos de la landing |

## Cuentas de prueba (contraseña `demo123`)

| Rol | Correo |
|---|---|
| Coordinador general | `coord@demo.com` |
| Encargado de centro (Centro Norte) | `norte@demo.com` |
| Voluntario de centro (Centro Norte) | `vol.norte@demo.com` |
| Encargado (Escuela Benito Juárez) | `escuela@demo.com` |
| Encargado (Parroquia San José) | `parroquia@demo.com` |
| Institución receptora (DIF) | `dif@demo.com` |
| Voluntario (Escuela Benito Juárez) | `vol.escuela@demo.com` |
| Líder de campaña | `lider@demo.com` |

También puedes:
- **Crear una cuenta** desde la pestaña *Crear cuenta* de la pantalla de acceso (nombre,
  correo, contraseña, rol + verificación). Queda guardada en ese navegador y puedes volver
  a entrar con ella.
- Entrar con **"Continuar con Google"** (en la demo abre un selector de cuentas simulado;
  ver arriba para activarlo de verdad).

## En el panel

- **Organización**: organigrama **interactivo** (haz clic en una persona para ver su ficha —
  correo, a quién reporta, a quién tiene a su cargo— y contraer/expandir ramas), más la
  tabla de roles y permisos y tu lugar en la jerarquía.
- **Pendientes** (arriba del dashboard de cada rol): acciones sugeridas + pendientes personales.
- **Mensajes**: chat entre usuarios de la plataforma.
- Deep link a una sección: `?sec=organizacion` (o `mensajes`, `movimientos`, …).

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
