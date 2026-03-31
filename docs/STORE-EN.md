# Store listing draft (English)

**Name:** Windows Settings Shortcuts

**Chrome Web Store icon (128×128):** Upload `icons/chrome-web-store-icon-128.png` (or `icons/icon128.png` — same image). PNG, opaque square, **exactly 128×128 px**. Regenerate with `scripts/generate-icons.ps1`.

**Localized screenshots:** Up to **5** images, at least **1**. Size **1280×800** or **640×400**; **JPEG** or **24-bit PNG**, **no alpha**. Source RAW shots can live outside the repo (e.g. `C:\code\pantallazos_settings`). Generate compliant files with:

`powershell -ExecutionPolicy Bypass -File scripts/process-store-screenshots.ps1`

(Default: reads that folder, writes `chrome-web-store-1280x800\*.png` next to the sources. Use `-Width 640` for 640×400.)

**Promotional tiles (optional but recommended):**  
- **Small:** 440×280 px, JPEG or 24-bit PNG, no alpha.  
- **Marquee:** 1400×560 px, same rules.

Generate from your best UI shot (default: `pantallazos_settings\4_ux-extension.png`):

`powershell -ExecutionPolicy Bypass -File scripts/process-store-promo-tiles.ps1`

Output folder: `pantallazos_settings\chrome-web-store-promo\` → `promo-small-440x280.png`, `promo-marquee-1400x560.png`. Override source with `-SourceFile "C:\path\to.png"`.

**Short description:** Quick access to Windows Settings pages. Opens system settings only; you stay in control.

**Long description (draft):**

Organize frequent Windows Settings destinations in one place. The extension opens a **floating panel window** you can move, resize, and close. Tap a category, choose a shortcut, and Windows Settings opens in a new tab so you can continue on your PC.

- Grouped shortcuts: System, Updates, Network, Devices, Personalization, Accounts, Apps, Storage, Backup, Security, Privacy, Time & language  
- **My shortcuts:** add, edit, or remove your own trusted links (stored only on this device)  
- English UI by default; optional Spanish in the panel  
- **Toolbar icon** opens or focuses the panel (no tiny dropdown popup)  
- Remembers panel **size and position** between sessions (local only)  
- No system changes in the background — only opens settings links you choose  
- No cloud sync or analytics — language, personal shortcuts, and window bounds stay on-device

Designed for Windows 10 and 11 with Microsoft Edge or Google Chrome.

**Privacy policy URL (GitHub Pages):**

`https://mapicallo.github.io/windows-settings-shortcuts/privacy-policy.html`

Use **branch `master`** + **`/(root)`** in Pages settings: the HTML file must be **`privacy-policy.html` at the repo root**. A duplicate for reference lives in `docs/privacy-policy.html` — update both if content changes (or switch Pages to `/docs` only and keep a single file there).

**Justification for `tabs` + `storage` + `windows`:** Open tabs for settings/help links; store UI language, personal shortcuts, and optional panel bounds; create/focus the floating panel window.
