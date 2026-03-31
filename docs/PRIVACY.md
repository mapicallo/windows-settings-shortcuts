# Privacy policy — Windows Settings Shortcuts

**Last updated:** March 2026

## What this extension does

Windows Settings Shortcuts lets you open pages in the Windows **Settings** app by launching documented `ms-settings:` addresses (and similar system settings links) **in a new browser tab**. You choose what to open; the extension does not change system settings by itself.

## Data we collect

**None.** This extension does not transmit personal information to external servers.

## Local storage

The extension may save the following **on your device only** using the browser’s extension storage (`chrome.storage.local` / `browser.storage.local`):

- Your **interface language** preference (English or Spanish).
- **Personal shortcuts** you create: the **name**, **address** (`ms-settings:` or other allowed link types), and an internal id. Nothing is uploaded to us.
- **Panel window size and position** (width, height, and screen coordinates when available), so the floating panel can reopen with a similar layout.

The extension may also use **`chrome.storage.session`** (in-memory for the browsing session) to remember which browser window is the panel, so window bounds updates apply to the correct window only.

## Optional help links

Some shortcuts show a **?** control that opens public **Microsoft Support** pages in a new tab (English or Spanish hub, depending on your extension language setting). Those sites are governed by Microsoft’s own policies.

## Permissions

- **storage** — language, personal shortcuts, and last panel window bounds.
- **tabs** — to open a new tab when you click a shortcut or optional help link.
- **windows** — to open or focus the floating panel window and read its position/size when you move or resize it (for optional persistence).

## Contact

For privacy questions, open an issue on the GitHub repository for this project.
