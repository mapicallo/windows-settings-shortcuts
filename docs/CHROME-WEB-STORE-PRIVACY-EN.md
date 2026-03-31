# Chrome Web Store — Privacy section (English copy)

Paste these into the developer dashboard **Privacy** fields. **Important:** for *Remote code?* choose **No** — this extension ships all code inside the package; it does not load remote JavaScript or Wasm.

---

## Single purpose — Description of the single purpose

The extension has one purpose: to help users open **Windows Settings** pages from a floating panel by opening documented links in the browser (for example `ms-settings:` URIs). It may also open optional Microsoft Help pages or links that the **user** has saved. It provides grouped shortcuts, search, and an English or Spanish UI. It **does not modify the system** or change settings by itself — it only opens the address the user selects, in a new tab, when the user clicks.

---

## Storage permission justification

**`chrome.storage.local`** is used to keep **only on this device**: the UI language, any personal shortcuts the user creates (name and URL), and the panel window’s size and position when the user moves or resizes it. **`chrome.storage.session`** may be used briefly in the session to remember which browser window is the panel so bounds updates apply to the correct window. This data is **not** sent to the developer’s servers.

---

## Tabs permission justification

This permission is needed to **open new browser tabs** when the user clicks a shortcut — for Windows Settings URIs, optional Microsoft Support pages, or user-defined links. Without it, those destinations could not be opened reliably from the extension.

---

## Windows permission justification (if the form asks for it)

This permission is used to **open or focus** the extension’s panel window and, when the user **moves or resizes** that window, to read its size and position so it can be **stored locally** and restored on the next open. The extension does not read the contents of other windows or personal data from websites.

---

## Remote code

Select **No, I am not using remote code.** All scripts are included in the extension ZIP; there are no external `<script>` tags, no modules loaded from third-party URLs at runtime, and no `eval()` of remote code.
