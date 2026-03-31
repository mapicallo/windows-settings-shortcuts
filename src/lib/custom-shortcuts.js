/** @typedef {{ id: string, title: string, uri: string }} CustomShortcut */

export const CUSTOM_SHORTCUTS_KEY = 'customShortcutsV1';

export async function loadCustomShortcuts() {
  const { [CUSTOM_SHORTCUTS_KEY]: raw } = await chrome.storage.local.get(CUSTOM_SHORTCUTS_KEY);
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (x) => x && typeof x.id === 'string' && typeof x.title === 'string' && typeof x.uri === 'string',
  );
}

/** @param {CustomShortcut[]} list */
export async function saveCustomShortcuts(list) {
  await chrome.storage.local.set({ [CUSTOM_SHORTCUTS_KEY]: list });
}

/**
 * @param {string} uri
 * @returns {{ ok: true } | { ok: false, reason: 'empty' | 'forbidden' | 'scheme' }}
 */
export function validateUserUri(uri) {
  const s = String(uri).trim();
  if (!s) return { ok: false, reason: 'empty' };
  const low = s.toLowerCase();
  if (low.startsWith('javascript:') || low.startsWith('data:') || low.startsWith('vbscript:'))
    return { ok: false, reason: 'forbidden' };
  if (low.startsWith('file:')) return { ok: false, reason: 'forbidden' };
  if (low.startsWith('ms-settings:')) return { ok: true };
  if (low.startsWith('http://') || low.startsWith('https://')) return { ok: true };
  if (low.startsWith('edge://') || low.startsWith('chrome://')) return { ok: true };
  return { ok: false, reason: 'scheme' };
}

export function newCustomId() {
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
