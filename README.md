# Windows Settings Shortcuts

Minimal MV3 extension that opens **Windows Settings** pages (`ms-settings:`) in a new browser tab. Shortcuts are grouped (System, Network, Apps, …). **English** is the default; the popup includes an **English / Spanish** UI selector (stored locally).

Repository: [github.com/mapicallo/windows-settings-shortcuts](https://github.com/mapicallo/windows-settings-shortcuts)

## Requirements

- Windows 10 or 11
- Chromium browser (Microsoft Edge or Google Chrome) on Windows, for `ms-settings:` links to resolve from a tab

## Load unpacked (development)

1. Open `edge://extensions` or `chrome://extensions`.
2. Enable **Developer mode**.
3. **Load unpacked** → select this folder (`windows-settings-shortcuts`).

## Project layout

- `manifest.json` — MV3 manifest, `storage` + `tabs`
- `src/data/shortcuts.js` — URI list and EN/ES labels
- `src/popup/` — popup UI
- `src/background/service-worker.js` — placeholder
- `_locales/` — store strings (`name` / `description` via `__MSG_*__`)
- `docs/` — privacy draft, targets checklist, store copy

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for the full roadmap.

## Privacy

The extension does **not** collect personal data. It only stores your **UI language** choice (`chrome.storage.local`). See [docs/PRIVACY.md](./docs/PRIVACY.md).

**Store / public URL:** enable **GitHub Pages** (source: `/docs`) and use  
`https://mapicallo.github.io/windows-settings-shortcuts/privacy-policy.html` as the privacy policy link ([`docs/privacy-policy.html`](./docs/privacy-policy.html)).

## License

MIT — see [LICENSE](./LICENSE).
