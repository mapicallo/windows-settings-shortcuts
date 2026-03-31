/** @typedef {{ width?: number; height?: number; left?: number; top?: number }} PanelBounds */

const PANEL_HTML = 'src/panel/panel.html';
const BOUNDS_KEY = 'panelWindowBoundsV1';
const SESSION_WIN_KEY = 'panelWindowId';

function panelUrl() {
  return chrome.runtime.getURL(PANEL_HTML);
}

async function openOrFocusPanel() {
  const url = panelUrl();
  const windows = await chrome.windows.getAll({ populate: true });

  for (const win of windows) {
    if (!win.tabs) continue;
    for (const tab of win.tabs) {
      if (tab.url === url && win.id != null) {
        await chrome.windows.update(win.id, { focused: true });
        if (tab.id !== undefined) await chrome.tabs.update(tab.id, { active: true });
        await chrome.storage.session.set({ [SESSION_WIN_KEY]: win.id });
        return;
      }
    }
  }

  /** @type {{ [k: string]: PanelBounds | undefined }} */
  const stored = await chrome.storage.local.get(BOUNDS_KEY);
  const b = stored[BOUNDS_KEY];

  /** @type {chrome.windows.CreateData} */
  const createOpts = {
    url,
    type: 'popup',
    focused: true,
    width:
      Number.isFinite(b?.width) && b.width
        ? Math.max(320, Math.min(/** @type {number} */ (b.width), 2000))
        : 400,
    height:
      Number.isFinite(b?.height) && b.height
        ? Math.max(360, Math.min(/** @type {number} */ (b.height), 1600))
        : 640,
  };
  if (Number.isFinite(b?.left)) createOpts.left = b?.left;
  if (Number.isFinite(b?.top)) createOpts.top = b?.top;

  const created = await chrome.windows.create(createOpts);
  if (created.id != null) {
    await chrome.storage.session.set({ [SESSION_WIN_KEY]: created.id });
  }
}

chrome.action.onClicked.addListener(() => {
  openOrFocusPanel().catch(() => {});
});

/** @type {ReturnType<typeof setTimeout> | undefined} */
let boundsTimer;
chrome.windows.onBoundsChanged.addListener((win) => {
  clearTimeout(boundsTimer);
  boundsTimer = setTimeout(async () => {
    const sid = await chrome.storage.session.get(SESSION_WIN_KEY);
    const panelId = sid[SESSION_WIN_KEY];
    if (win.id !== panelId || !win.width || !win.height) return;
    /** @type {PanelBounds} */
    const next = {
      width: win.width,
      height: win.height,
    };
    if (typeof win.left === 'number') next.left = win.left;
    if (typeof win.top === 'number') next.top = win.top;
    await chrome.storage.local.set({ [BOUNDS_KEY]: next });
  }, 450);
});

chrome.windows.onRemoved.addListener(async (windowId) => {
  const sid = await chrome.storage.session.get(SESSION_WIN_KEY);
  if (sid[SESSION_WIN_KEY] === windowId) {
    await chrome.storage.session.remove(SESSION_WIN_KEY);
  }
});

chrome.runtime.onInstalled.addListener(() => {});
