/**
 * Microsoft support landings by locale — verify before store submission (see docs/TARGETS.md).
 * Used when a shortcut sets help: 'windowsHub'.
 */
export const SUPPORT_WINDOWS_HUB = {
  en: 'https://support.microsoft.com/en-us/windows',
  es: 'https://support.microsoft.com/es-es/windows',
};

/**
 * @param {'windowsHub'|undefined|null} key
 * @param {'en'|'es'} lang
 * @returns {string | null}
 */
export function resolveHelpUrl(key, lang) {
  if (!key) return null;
  const locale = lang === 'es' ? 'es' : 'en';
  if (key === 'windowsHub') return SUPPORT_WINDOWS_HUB[locale];
  return null;
}
