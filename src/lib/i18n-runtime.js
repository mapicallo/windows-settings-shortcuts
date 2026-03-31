/** Preference key for popup UI language (separate from browser _locales for store default). */
export const UI_LANG_KEY = 'uiLang';

const FALLBACK = 'en';

/**
 * @returns {Promise<'en'|'es'>}
 */
export async function getUiLang() {
  try {
    const { [UI_LANG_KEY]: stored } = await chrome.storage.local.get(UI_LANG_KEY);
    if (stored === 'en' || stored === 'es') return stored;
  } catch {
    /* ignore */
  }
  const nav =
    typeof navigator !== 'undefined' && navigator.language
      ? navigator.language.toLowerCase()
      : FALLBACK;
  return nav.startsWith('es') ? 'es' : FALLBACK;
}

/**
 * @param {'en'|'es'} lang
 */
export function setUiLang(lang) {
  return chrome.storage.local.set({ [UI_LANG_KEY]: lang });
}
