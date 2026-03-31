# Plan de implementación — Windows Settings Shortcuts

Extensión MV3 que ofrece **accesos organizados** a páginas de **Configuración de Windows** (`ms-settings:`), utilidades del sistema acotadas (p. ej. MMC donde no hay alternativa estable) y, opcionalmente, **segunda capa** de ayuda oficial. **Idioma principal de tienda y cadenas por defecto: inglés**; **español en la UX** mediante selector persistente.

> Nombre acordado: **Windows Settings Shortcuts** (no “Shortcus” en manifiesto ni repositorio).

---

## 1. Objetivo y alcance

| In scope (MVP) | Out of scope |
|----------------|--------------|
| Abrir URIs `ms-settings:` y destinos documentados (lista cerrada y probada) | Ejecutar comandos arbitrarios, scripts, “reparar” o optimizar |
| Agrupación por **familias** (red, sistema, cuentas, etc.) | Inventario de terceros (antivirus comerciales, etc.) salvo enlaces genéricos a Seguridad de Windows |
| Popup (u optional side panel) con búsqueda/filtrado básico | Lectura de datos del usuario, historial, ficheros |
| i18n: EN por defecto + **ES** vía selector + `storage.local` | Promesas médicas del PC en textos |

**Decisión producto:** Los accesos a `chrome://`, `edge://`, `firefox` u Opera pueden quedar **fuera del MVP** si se prioriza *single purpose “Windows settings only”* en la primera publicación; si se incluyen, declararlo explícitamente en descripción y privacidad.

---

## 2. Arquitectura de referencia (MV3)

```
windows-settings-shortcuts/
├── manifest.json
├── _locales/
│   ├── en/
│   │   └── messages.json      # Cadenas tienda/UI base (o solo UI; ver §6)
│   └── es/
│       └── messages.json
├── src/
│   ├── background/
│   │   └── service-worker.js  # Abrir pestañas / opcional analytics vacío
│   ├── data/
│   │   └── shortcuts.js       # Lista: { id, groupKey, target, type, i18nKey... }
│   ├── lib/
│   │   ├── i18n-runtime.js    # Resolver idioma UI (selector vs default)
│   │   └── open-target.js     # mapping type → tabs.create / windows.open
│   └── popup/
│       ├── popup.html
│       ├── popup.css
│       └── popup.js
├── docs/
│   ├── PRIVACY.md             # Texto para GitHub Pages / embutido
│   └── STORE-EN.md            # Borrador ficha EN (+ ES opcional)
├── icons/
│   └── *.png                  # 16–128
└── README.md
```

Ajustar rutas si preferís `popup/` en raíz como en otros proyectos; lo importante es **separar datos, apertura de destinos e i18n**.

---

## 3. Fases

### Fase 0 — Repositorio y convenciones
- Inicializar git, `README.md`, licencia (p. ej. MIT), enlazar `origin` a `github.com/mapicallo/windows-settings-shortcuts`.
- Definir **tabla de destinos** en `docs/TARGETS.md`: URI, Windows 10/11 probado, notas revisor.

### Fase 1 — MVP técnico
- `manifest.json` MV3: `action` → popup; permisos mínimos (**típicamente** ninguno obligatorio si solo `tabs` para abrir `ms-settings:` en pestaña; validar: a veces basta con `chrome.tabs.create` para URLs especiales — probar en Edge y Chrome).
- Cargar `shortcuts.js` (o JSON generado) con **~25–40 ítems** en **8–10 familias** alineadas al listado acordado (sistema, actualizaciones, red, dispositivos, personalización, cuentas, aplicaciones, almacenamiento, tiempo, seguridad, avanzado).
- Popup: lista por familia (acordeón o secciones), clic → abrir destino.
- **Selector idioma UX:** EN / ES; persistencia `chrome.storage.local` clave `uiLang`.
- Cadenas UI: duplicar vía `messages.json` (en/es) **o** objeto único en JS con claves `title_en` / `title_es` — preferible **`_locales`** + runtime override para no duplicar lógica con Chrome i18n y el selector (ver §6).

### Fase 2 — Pulido tienda y cumplimiento
- `docs/PRIVACY.md`: qué hace la extensión, que **no** recopila datos; uso de `storage` solo para preferencia de idioma.
- Iconos 16, 32, 48, 128; capturas EN.
- Texto corto + descripción larga EN en `docs/STORE-EN.md`.
- Opcional: GitHub Pages para política de privacidad URL estable.

### Fase 3 — Mejoras post-MVP
- Búsqueda en popup por texto (filtrado local).
- Deep links de ayuda `support.microsoft.com` por ítem (segunda fila o icono “?”), URLs verificadas por locale.
- Temas claro/oscuro acorde al sistema (opcional).

---

## 4. Manifest (borrador de permisos)

Valorar tras pruebas reales:

```json
{
  "manifest_version": 3,
  "name": "Windows Settings Shortcuts",
  "version": "0.1.0",
  "description": "__MSG_extDescription__",
  "default_locale": "en",
  "action": { "default_popup": "src/popup/popup.html" },
  "icons": { "16": "icons/icon16.png", "48": "icons/icon48.png", "128": "icons/icon128.png" },
  "background": { "service_worker": "src/background/service-worker.js" },
  "permissions": ["storage", "tabs"]
}
```

- **`storage`:** idioma seleccionado.
- **`tabs`:** si hace falta para abrir `ms-settings:` de forma fiable en el navegador objetivo; si en pruebas `windows.open` desde popup basta, reducir permisos.

**No solicitar** `host_permissions` amplios para dominios de soporte hasta que se abran esas URLs.

---

## 5. Modelo de datos (cada atajo)

Campos recomendados:

| Campo | Descripción |
|-------|-------------|
| `id` | Estable, kebab-case |
| `group` | Clave de familia (traduces en i18n) |
| `target` | URI final (`ms-settings:...`, `https://...`, etc.) |
| `openMode` | `sameTab` / `newTab` (preferible **newTab** para no perder el popup context) |
| `tier` | `core` / `advanced` (p. ej. certificados, variables de entorno) |
| `minNote` | Comentario interno o `docs/TARGETS.md` (no UI) |

Validación previa al merge: abrir cada `target` manualmente en **Win10** y **Win11** (y Edge como mínimo).

---

## 6. Internacionalización (EN + selector ES)

**Enfoque recomendado:**
- `default_locale: "en"` en manifiesto; `_locales/en/messages.json` con `extDescription` y etiquetas de familias.
- Para **UI dinámica** (nombres de cada atajo): mantener un mapa `labels` en `shortcuts.js` o JSON: `{ "id": { "en": "...", "es": "..." } }` para no multiplicar cientos de claves en `messages.json`, **o** generar `messages.json` por build — lo simple es **objeto en datos** + `messages` solo para chrome (descripción y pocos strings comunes).
- **Orden de resolución de idioma:** `storage.uiLang` → si vacío, `navigator.language` comienza por `es` → ES, else EN.

---

## 7. Flujo de apertura

- `popup.js` → clic → `chrome.tabs.create({ url: target })` (o `browser.tabs` en script compatible).
- Para destinos `file:` o `.msc`: **no** abrir desde extensión salvo política clara; para `certmgr.msc` suele ser **más seguro** documentar “abrir Ejecutar” o usar solo si encontráis esquema compatible — en MVP, preferir **solo `ms-settings:`** y posponer `.msc` hasta validar en Edge WebView.

---

## 8. Calidad y pruebas

- Checklist manual: cada ítem del MVP en Win10 + Win11.
- Comprobar popup con **lista larga** (scroll, teclado).
- Probar selector ES: reiniciar navegador y verificar persistencia.
- Revisión de textos: sin “boost”, “clean registry”, “virus removed”.

---

## 9. Publicación

- **Chrome Web Store:** cuenta de desarrollador, política de privacidad URL, capturas.
- **Edge Add-ons:** mismo paquete o variante; probar empaquetado `.zip`.
- Versión en `manifest`semver; tag en Git al publicar.

---

## 10. Orden de trabajo sugerido (checklist corta)

1. [x] `manifest.json` + iconos + popup que abre `ms-settings:`.
2. [x] `shortcuts.js` + familias + render en popup.
3. [x] Selector EN/ES + `storage`.
4. [x] Lista inicial + `docs/TARGETS.md` (seguir validando URIs en Win10/11).
5. [x] `PRIVACY.md`, `docs/privacy-policy.html`, README, `docs/STORE-EN.md`.
6. [x] Fase 3 parcial: **búsqueda** en popup; **ayuda** opcional (`?` → Microsoft Support por idioma).
7. [ ] Habilitar GitHub Pages y comprobar URL pública de privacidad.
8. [ ] Pruebas Win10/11, empaquetado zip, capturas EN, publicación en tiendas.

---

## 11. Referencia remota

- Repositorio: `https://github.com/mapicallo/windows-settings-shortcuts`
- Alineación opcional con el patrón del proyecto *Account & Subscription Shortcuts* (estructura `shortcuts-data`, background, panel) solo donde aporte; **no** copiar permisos ni ámbitos que no apliquen.

---

*Última actualización: plan inicial de implementación para arranque del repositorio.*
