/**
 * Open a settings URI in a new tab (user can interact with the system UI from there).
 * @param {string} url
 */
export function openTarget(url) {
  return chrome.tabs.create({ url, active: true });
}
