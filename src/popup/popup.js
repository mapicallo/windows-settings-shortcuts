import { GROUP_ORDER, SHORTCUTS, LABELS } from '../data/shortcuts.js';
import { popupUi } from '../data/ui-strings.js';
import { getUiLang, setUiLang } from '../lib/i18n-runtime.js';
import { openTarget } from '../lib/open-target.js';

/** @param {'en'|'es'} lang */
function tLabel(kind, id, lang) {
  const bucket = kind === 'group' ? LABELS.groups : LABELS.items;
  const entry = bucket[id];
  if (!entry) return id;
  return entry[lang] || entry.en;
}

/**
 * @param {'en'|'es'} lang
 */
function render(lang) {
  const groupsRoot = document.getElementById('groupsRoot');
  if (!groupsRoot) return;
  groupsRoot.replaceChildren();

  const byGroup = new Map();
  for (const g of GROUP_ORDER) byGroup.set(g, []);
  for (const s of SHORTCUTS) {
    const list = byGroup.get(s.groupId);
    if (list) list.push(s);
  }

  for (const groupId of GROUP_ORDER) {
    const items = byGroup.get(groupId) || [];
    if (items.length === 0) continue;

    const details = document.createElement('details');
    details.className = 'group';
    details.open = false;

    const summary = document.createElement('summary');
    summary.textContent = tLabel('group', groupId, lang);
    details.appendChild(summary);

    const ul = document.createElement('ul');
    ul.className = 'shortcut-list';

    for (const item of items) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'shortcut-btn';
      btn.dataset.uri = item.uri;

      const span = document.createElement('span');
      span.textContent = tLabel('item', item.id, lang);
      btn.appendChild(span);

      if (item.tier === 'advanced') {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = popupUi(lang).tierAdvanced;
        btn.appendChild(badge);
      }

      btn.addEventListener('click', () => {
        openTarget(item.uri).catch(() => {});
      });
      li.appendChild(btn);
      ul.appendChild(li);
    }

    details.appendChild(ul);
    groupsRoot.appendChild(details);
  }
}

/** @param {'en'|'es'} lang */
function applyStaticUi(lang) {
  const u = popupUi(lang);
  document.getElementById('extTitle').textContent = u.title;
  document.getElementById('langLabel').textContent = u.languageLabel;
  document.getElementById('footerHint').textContent = u.footer;

  const sel = document.getElementById('langSelect');
  const optEn = sel.querySelector('option[value="en"]');
  const optEs = sel.querySelector('option[value="es"]');
  optEn.textContent = u.optionEn;
  optEs.textContent = u.optionEs;
}

async function main() {
  const sel = document.getElementById('langSelect');
  let lang = await getUiLang();
  sel.value = lang;
  applyStaticUi(lang);

  sel.addEventListener('change', async () => {
    const next = sel.value === 'es' ? 'es' : 'en';
    await setUiLang(next);
    lang = next;
    applyStaticUi(lang);
    render(lang);
  });

  render(lang);
}

main().catch(() => {});
