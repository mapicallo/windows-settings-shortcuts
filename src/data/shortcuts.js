/**
 * Group order in the popup. Each shortcut references groupId.
 * URIs: verify on Windows 10/11 + target browser before release (see docs/TARGETS.md).
 */
export const GROUP_ORDER = [
  'system',
  'updates',
  'network',
  'devices',
  'personalization',
  'accounts',
  'apps',
  'storage',
  'backup',
  'security',
  'privacy',
  'time',
];

/** @type {{ id: string, groupId: string, uri: string, tier?: 'advanced' }[]} */
export const SHORTCUTS = [
  { id: 'about', groupId: 'system', uri: 'ms-settings:about' },
  { id: 'activation', groupId: 'system', uri: 'ms-settings:activation' },
  { id: 'powersleep', groupId: 'system', uri: 'ms-settings:powersleep' },
  { id: 'optionalfeatures', groupId: 'system', uri: 'ms-settings:optionalfeatures' },

  { id: 'windowsupdate', groupId: 'updates', uri: 'ms-settings:windowsupdate' },
  { id: 'windowsupdatehistory', groupId: 'updates', uri: 'ms-settings:windowsupdate-history' },

  { id: 'network', groupId: 'network', uri: 'ms-settings:network' },
  { id: 'network_wifi', groupId: 'network', uri: 'ms-settings:network-wifi' },
  { id: 'network_ethernet', groupId: 'network', uri: 'ms-settings:network-ethernet' },
  { id: 'network_status', groupId: 'network', uri: 'ms-settings:network-status' },
  { id: 'bluetooth', groupId: 'network', uri: 'ms-settings:bluetooth' },

  { id: 'printers', groupId: 'devices', uri: 'ms-settings:printers' },
  { id: 'sound', groupId: 'devices', uri: 'ms-settings:sound' },
  { id: 'mousetouchpad', groupId: 'devices', uri: 'ms-settings:mousetouchpad' },
  { id: 'typing', groupId: 'devices', uri: 'ms-settings:typing' },

  { id: 'personalization', groupId: 'personalization', uri: 'ms-settings:personalization' },
  { id: 'background', groupId: 'personalization', uri: 'ms-settings:personalization-background' },
  { id: 'themes', groupId: 'personalization', uri: 'ms-settings:themes' },
  { id: 'colors', groupId: 'personalization', uri: 'ms-settings:colors' },
  { id: 'lockscreen', groupId: 'personalization', uri: 'ms-settings:lockscreen' },

  { id: 'emailandaccounts', groupId: 'accounts', uri: 'ms-settings:emailandaccounts' },
  { id: 'otherusers', groupId: 'accounts', uri: 'ms-settings:otherusers' },
  { id: 'signinoptions', groupId: 'accounts', uri: 'ms-settings:signinoptions' },

  { id: 'appsfeatures', groupId: 'apps', uri: 'ms-settings:appsfeatures' },
  { id: 'defaultapps', groupId: 'apps', uri: 'ms-settings:defaultapps' },
  { id: 'startupapps', groupId: 'apps', uri: 'ms-settings:startupapps' },

  { id: 'storagesense', groupId: 'storage', uri: 'ms-settings:storagesense' },
  { id: 'storagepolicies', groupId: 'storage', uri: 'ms-settings:storagepolicies' },

  { id: 'backup', groupId: 'backup', uri: 'ms-settings:backup' },

  { id: 'windowsdefender', groupId: 'security', uri: 'ms-settings:windowsdefender' },
  { id: 'firewall', groupId: 'security', uri: 'ms-settings:windowsdefender-firewall' },

  { id: 'privacy', groupId: 'privacy', uri: 'ms-settings:privacy' },
  { id: 'camera', groupId: 'privacy', uri: 'ms-settings:camera' },
  { id: 'microphone', groupId: 'privacy', uri: 'ms-settings:microphone' },

  { id: 'dateandtime', groupId: 'time', uri: 'ms-settings:dateandtime' },
  { id: 'regionlanguage', groupId: 'time', uri: 'ms-settings:regionlanguage' },
];

/** Labels for groups and items: popup UI (selector EN/ES). */
export const LABELS = {
  groups: {
    system: { en: 'System', es: 'Sistema' },
    updates: { en: 'Windows Update', es: 'Windows Update' },
    network: { en: 'Network & Bluetooth', es: 'Red y Bluetooth' },
    devices: { en: 'Devices', es: 'Dispositivos' },
    personalization: { en: 'Personalization', es: 'Personalización' },
    accounts: { en: 'Accounts', es: 'Cuentas' },
    apps: { en: 'Apps', es: 'Aplicaciones' },
    storage: { en: 'Storage', es: 'Almacenamiento' },
    backup: { en: 'Backup', es: 'Copia de seguridad' },
    security: { en: 'Security', es: 'Seguridad' },
    privacy: { en: 'Privacy', es: 'Privacidad' },
    time: { en: 'Time & language', es: 'Hora e idioma' },
  },
  items: {
    about: { en: 'About (device & Windows specs)', es: 'Acerca de (dispositivo y Windows)' },
    activation: { en: 'Activation', es: 'Activación' },
    powersleep: { en: 'Power & sleep', es: 'Energía y suspensión' },
    optionalfeatures: {
      en: 'Optional features',
      es: 'Características opcionales',
    },
    windowsupdate: { en: 'Windows Update', es: 'Windows Update' },
    windowsupdatehistory: {
      en: 'Update history',
      es: 'Historial de actualizaciones',
    },
    network: { en: 'Network (overview)', es: 'Red (resumen)' },
    network_wifi: { en: 'Wi-Fi', es: 'Wi-Fi' },
    network_ethernet: { en: 'Ethernet', es: 'Ethernet' },
    network_status: { en: 'Network status', es: 'Estado de la red' },
    bluetooth: { en: 'Bluetooth', es: 'Bluetooth' },
    printers: { en: 'Printers & scanners', es: 'Impresoras y escáneres' },
    sound: { en: 'Sound', es: 'Sonido' },
    mousetouchpad: { en: 'Mouse & touchpad', es: 'Ratón y panel táctil' },
    typing: { en: 'Typing', es: 'Escribir' },
    personalization: {
      en: 'Personalization (overview)',
      es: 'Personalización (resumen)',
    },
    background: { en: 'Background / wallpaper', es: 'Fondo de escritorio' },
    themes: { en: 'Themes', es: 'Temas' },
    colors: { en: 'Colors', es: 'Colores' },
    lockscreen: { en: 'Lock screen', es: 'Pantalla de bloqueo' },
    emailandaccounts: { en: 'Email & accounts', es: 'Correo y cuentas' },
    otherusers: { en: 'Other users / Family', es: 'Otros usuarios / Familia' },
    signinoptions: { en: 'Sign-in options', es: 'Opciones de inicio de sesión' },
    appsfeatures: {
      en: 'Installed apps',
      es: 'Aplicaciones instaladas',
    },
    defaultapps: { en: 'Default apps', es: 'Aplicaciones predeterminadas' },
    startupapps: { en: 'Startup apps', es: 'Aplicaciones de inicio' },
    storagesense: { en: 'Storage', es: 'Almacenamiento' },
    storagepolicies: {
      en: 'Storage settings / policies',
      es: 'Configuración de almacenamiento',
    },
    backup: { en: 'Backup', es: 'Copia de seguridad' },
    windowsdefender: {
      en: 'Windows Security',
      es: 'Seguridad de Windows',
    },
    firewall: {
      en: 'Firewall & network protection',
      es: 'Firewall y protección de red',
    },
    privacy: { en: 'Privacy (overview)', es: 'Privacidad (resumen)' },
    camera: { en: 'Camera privacy', es: 'Privacidad de cámara' },
    microphone: { en: 'Microphone privacy', es: 'Privacidad del micrófono' },
    dateandtime: { en: 'Date & time', es: 'Fecha y hora' },
    regionlanguage: { en: 'Language & region', es: 'Idioma y región' },
  },
};
