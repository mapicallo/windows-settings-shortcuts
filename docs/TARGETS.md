# Settings URI checklist

Verify each URI on **your** minimum supported Windows builds (10 / 11) and browser (**Edge** / **Chrome**) before store submission. Microsoft may change deep links between releases.

| URI fragment (after `ms-settings:`) | Notes |
|---------------------------------------|--------|
| about | Device / Windows specs |
| activation | Activation |
| powersleep | Power & sleep |
| optionalfeatures | Optional features |
| windowsupdate | Windows Update |
| windowsupdate-history | May differ on older Windows 10 builds |
| network | Network section overview |
| network-wifi | Wi-Fi |
| network-ethernet | Ethernet |
| network-status | Status |
| bluetooth | Bluetooth & devices area |
| printers | Printers & scanners |
| sound | Sound |
| mousetouchpad | Mouse / touchpad |
| typing | Typing |
| personalization | Personalization overview |
| personalization-background | Wallpaper |
| themes | Themes |
| colors | Colors |
| lockscreen | Lock screen |
| emailandaccounts | Accounts |
| otherusers | Other users / family |
| signinoptions | Sign-in options |
| appsfeatures | Installed apps |
| defaultapps | Defaults |
| startupapps | Startup apps |
| storagesense | Storage |
| storagepolicies | Storage policies / settings |
| backup | Backup |
| windowsdefender | Windows Security |
| windowsdefender-firewall | Firewall |
| privacy | Privacy overview |
| camera | Camera permission |
| microphone | Microphone permission |
| dateandtime | Date & time |
| regionlanguage | Language & region |

Full URL pattern: `ms-settings:SECTION` (opened as the tab URL).

## Future candidates (not in current build)

- User certificates: typically `certmgr.msc` (not a single stable `ms-settings:` page) — evaluate separately.
- Environment variables: classic Control Panel / `SystemPropertiesAdvanced` — document, do not execute from the extension.
