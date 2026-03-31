# Windows Settings Shortcuts

Minimal MV3 extension that opens **Windows Settings** pages (`ms-settings:`) in a new browser tab. Shortcuts are grouped (System, Network, Apps, …). **English** is the default; the panel includes an **English / Spanish** UI selector (stored locally). The UI runs in a **separate window** you can move, resize, and close—like a small desktop tool.

Repository: [github.com/mapicallo/windows-settings-shortcuts](https://github.com/mapicallo/windows-settings-shortcuts)

## Requirements

- Windows 10 or 11
- Chromium browser (Microsoft Edge or Google Chrome) on Windows, for `ms-settings:` links to resolve from a tab

## Load unpacked (development)

1. Open `edge://extensions` or `chrome://extensions`.
2. Enable **Developer mode**.
3. **Load unpacked** → select this folder (`windows-settings-shortcuts`).
4. Click the extension **icon** on the toolbar: the **panel window** opens (or is focused if already open). There is no dropdown popup.

## Project layout

- `manifest.json` — MV3 manifest, `storage` + `tabs` + `windows`
- `src/data/shortcuts.js` — URI list and EN/ES labels
- `src/panel/` — panel window UI (`panel.html` opened via `chrome.windows.create`)
- `src/ui/app.js` — shared view logic (shortcuts, search, custom links)
- `src/background/service-worker.js` — opens or focuses the panel; optional window bounds persistence
- `_locales/` — store strings (`name` / `description` via `__MSG_*__`)
- `docs/` — privacy draft, targets checklist, store copy

Toolbar icons are **PNG** assets in `icons/` (gear on Windows blue). Regenerate with:

`powershell -ExecutionPolicy Bypass -File scripts/generate-icons.ps1`

For **Chrome Web Store → Graphic resources → 128×128 icon**, use `icons/chrome-web-store-icon-128.png` (opaque background, exact size).

**Store screenshots (1280×800 or 640×400, no alpha):** put PNG sources in `C:\code\pantallazos_settings` (or pass `-SourceDir`), then run `scripts/process-store-screenshots.ps1` — output folder `chrome-web-store-1280x800` beside your sources.

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for the full roadmap.

## Store submission package (Chrome / Edge)

Build a ZIP with **only** what the browser needs (`manifest.json`, `icons/`, `_locales/`, `src/`). The file name includes the version from `manifest.json`:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/package-store.ps1
```

Output: `dist/windows-settings-shortcuts-v<version>.zip` (example: `windows-settings-shortcuts-v0.4.2.zip`).  
Upload that ZIP to the **Chrome Web Store** developer dashboard or **Microsoft Edge** Partner Center. The `dist/` folder is listed in `.gitignore` (build locally before each submission).

## Privacy

The extension does **not** send your data to external servers. It stores **locally** (`chrome.storage.local`): your **UI language**, **personal shortcuts** (name + link), and **last panel window size/position**. Transient **`chrome.storage.session`** may hold the current panel window id for bounds tracking. See [docs/PRIVACY.md](./docs/PRIVACY.md).

**Store / public URL:** enable **GitHub Pages** (source: `/docs`) and use  
`https://mapicallo.github.io/windows-settings-shortcuts/privacy-policy.html` as the privacy policy link ([`docs/privacy-policy.html`](./docs/privacy-policy.html)).

## License

MIT — see [LICENSE](./LICENSE).
