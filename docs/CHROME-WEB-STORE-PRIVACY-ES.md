# Chrome Web Store — sección Privacidad (borradores en español)

Usa estos textos en la consola de desarrollador. **Importante:** en *¿Utilizas código remoto?* elige **No** — esta extensión no carga JavaScript ni Wasm externo al paquete.

---

## Una sola finalidad — Descripción de la finalidad única

La extensión tiene una sola finalidad: facilitar al usuario el acceso, desde un panel flotante, a páginas de **Configuración de Windows** abriendo en el navegador enlaces documentados (por ejemplo direcciones `ms-settings:`). Opcionalmente puede abrir páginas de ayuda de Microsoft o enlaces que el **propio usuario** haya guardado. Ofrece atajos agrupados, búsqueda y texto de interfaz en inglés o español. **No modifica el sistema** ni cambia ajustes por sí sola: solo abre en una pestaña nueva la dirección que el usuario elige al hacer clic.

---

## Justificación de storage

Se usa el almacenamiento local del navegador (`chrome.storage.local`) para guardar **solo en este dispositivo**: el idioma de la interfaz, los atajos personales que crea el usuario (nombre y dirección) y el tamaño y la posición de la ventana del panel si el usuario la mueve o redimensiona. De forma **temporal en la sesión** puede usarse `chrome.storage.session` para recordar qué ventana es el panel y enlazar correctamente el guardado del tamaño. **No se envía** esta información a servidores del desarrollador.

---

## Justificación de tabs

El permiso permite **crear pestañas** cuando el usuario pulsa un atajo, para abrir la página de Configuración de Windows, una ayuda opcional de Microsoft o un enlace definido por el usuario. Es necesario para que esas direcciones se abran desde la extensión de forma fiable.

---

## Justificación de windows (si el formulario lo solicita)

Permite **abrir o poner en primer plano** la ventana del panel de la extensión y, cuando el usuario **mueve o redimensiona** esa ventana, leer posición y tamaño para **guardarlos localmente** y reutilizarlos en la siguiente apertura. No se accede al contenido de otras ventanas ni a datos personales de sitios web.

---

## Código remoto

Respuesta correcta: **No, no estoy usando código remoto**. Todo el código se incluye en el paquete `.zip` de la extensión; no hay `<script>` externos, ni módulos cargados desde dominios externos, ni `eval()` de código remoto.
