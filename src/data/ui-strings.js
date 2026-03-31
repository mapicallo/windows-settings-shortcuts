/**
 * Popup UI copy keyed by user-selected language (independent of browser locale).
 */
export const POPUP_UI = {
  en: {
    title: 'Windows Settings Shortcuts',
    languageLabel: 'Language',
    optionEn: 'English',
    optionEs: 'Spanish',
    searchPlaceholder: 'Search shortcuts…',
    searchAriaLabel: 'Filter shortcuts',
    noResults: 'No shortcuts match your search.',
    helpTooltip: 'Related Microsoft Support topic (new tab)',
    customSectionTitle: 'My shortcuts',
    customEmpty: 'No personal shortcuts yet. Add a name and a trusted link below.',
    customTitleLabel: 'Name',
    customTitlePlaceholder: 'e.g. Sound settings',
    customUriLabel: 'Address',
    customUriPlaceholder: 'e.g. ms-settings:sound',
    customUriHint:
      'Allowed: ms-settings:, https:, edge://, chrome://. Blocked: javascript:, data:, file:.',
    customAdd: 'Add',
    customEdit: 'Edit',
    customSave: 'Save',
    customCancel: 'Cancel',
    customDelete: 'Delete',
    customDeleteConfirm: 'Remove this shortcut?',
    customErrorTitle: 'Enter a name.',
    customErrorUri: 'Enter a valid address (see hint below).',
    footer:
      'Each item opens a Windows Settings page in a new browser tab. You control what happens next.',
    closeWindow: 'Close',
    windowHint:
      'Drag the window by its title bar to move it, or drag an edge to resize. Size and position are saved for next time.',
    tierAdvanced: 'Advanced',
  },
  es: {
    title: 'Windows Settings Shortcuts',
    languageLabel: 'Idioma',
    optionEn: 'Inglés',
    optionEs: 'Español',
    searchPlaceholder: 'Buscar atajos…',
    searchAriaLabel: 'Filtrar atajos',
    noResults: 'Ningún atajo coincide con la búsqueda.',
    helpTooltip: 'Ayuda relacionada en Microsoft Support (nueva pestaña)',
    customSectionTitle: 'Mis atajos',
    customEmpty: 'Aún no hay atajos personales. Añade un nombre y un enlace de confianza abajo.',
    customTitleLabel: 'Nombre',
    customTitlePlaceholder: 'p. ej., Configuración de sonido',
    customUriLabel: 'Dirección',
    customUriPlaceholder: 'p. ej., ms-settings:sound',
    customUriHint:
      'Permitido: ms-settings:, https:, edge://, chrome://. No permitido: javascript:, data:, file:.',
    customAdd: 'Añadir',
    customEdit: 'Editar',
    customSave: 'Guardar',
    customCancel: 'Cancelar',
    customDelete: 'Eliminar',
    customDeleteConfirm: '¿Quitar este atajo?',
    customErrorTitle: 'Escribe un nombre.',
    customErrorUri: 'Escribe una dirección válida (ver indicación abajo).',
    footer:
      'Cada elemento abre una página de Configuración de Windows en una nueva pestaña. Tú decides qué hacer después.',
    closeWindow: 'Cerrar',
    windowHint:
      'Arrastra la ventana por la barra de título para moverla o los bordes para redimensionarla. Se guardan tamaño y posición.',
    tierAdvanced: 'Avanzado',
  },
};

/** @param {'en'|'es'} lang */
export function popupUi(lang) {
  return POPUP_UI[lang] || POPUP_UI.en;
}
