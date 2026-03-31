/**
 * Popup UI copy keyed by user-selected language (independent of browser locale).
 */
export const POPUP_UI = {
  en: {
    title: 'Windows Settings Shortcuts',
    languageLabel: 'Language',
    optionEn: 'English',
    optionEs: 'Spanish',
    footer:
      'Each item opens a Windows Settings page in a new browser tab. You control what happens next.',
    tierAdvanced: 'Advanced',
  },
  es: {
    title: 'Windows Settings Shortcuts',
    languageLabel: 'Idioma',
    optionEn: 'Inglés',
    optionEs: 'Español',
    footer:
      'Cada elemento abre una página de Configuración de Windows en una nueva pestaña. Tú decides qué hacer después.',
    tierAdvanced: 'Avanzado',
  },
};

/** @param {'en'|'es'} lang */
export function popupUi(lang) {
  return POPUP_UI[lang] || POPUP_UI.en;
}
