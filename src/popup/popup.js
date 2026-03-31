import { GROUP_ORDER, SHORTCUTS, LABELS } from '../data/shortcuts.js';
import { resolveHelpUrl } from '../data/help-links.js';
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
 * @param {string} q
 * @returns {string}
 */
function norm(q) {
  return q.trim().toLowerCase();
}

/**
 * @param {typeof SHORTCUTS[number]} item
 * @param {string} query
 * @param {'en'|'es'} lang
 */
function itemMatches(item, query, lang) {
  if (!query) return true;
  const bucket = LABELS.items[item.id];
  const gBucket = LABELS.groups[item.groupId];
  const hay = [
    tLabel('item', item.id, lang),
    bucket?.en ?? '',
    bucket?.es ?? '',
    tLabel('group', item.groupId, lang),
    gBucket?.en ?? '',
    gBucket?.es ?? '',
    item.uri.replace(/^ms-settings:/i, ''),
    item.uri,
  ]
    .join(' ')
    .toLowerCase();
  const parts = query.split(/\s+/).filter(Boolean);
  return parts.every(
    (p) =>
      hay.includes(p) ||
      hay
        .split(/[\s/:_.-]+/)
        .some((w) => w.startsWith(p) || w.includes(p)),
  );
}

/**
 * @param {'en'|'es'} lang
 * @param {string} filterRaw
 */
function render(lang, filterRaw) {
  const groupsRoot = document.getElementById('groupsRoot');
  const noResultsEl = document.getElementById('noResults');
  if (!groupsRoot || !noResultsEl) return;

  const query = norm(filterRaw);
  const u = popupUi(lang);

  groupsRoot.replaceChildren();

  const byGroup = new Map();
  for (const g of GROUP_ORDER) byGroup.set(g, []);
  for (const s of SHORTCUTS) {
    if (!itemMatches(s, query, lang)) continue;
    const list = byGroup.get(s.groupId);
    if (list) list.push(s);
  }

  let any = false;
  const hasFilter = query.length > 0;

  for (const groupId of GROUP_ORDER) {
    const items = byGroup.get(groupId) || [];
    if (items.length === 0) continue;

    any = true;
    const details = document.createElement('details');
    details.className = 'group';
    details.open = hasFilter;

    const summary = document.createElement('summary');
    summary.textContent = tLabel('group', groupId, lang);
    details.appendChild(summary);

    const ul = document.createElement('ul');
    ul.className = 'shortcut-list';

    for (const item of items) {
      const li = document.createElement('li');
      const row = document.createElement('div');
      row.className = 'shortcut-row';

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
        badge.textContent = u.tierAdvanced;
        btn.appendChild(badge);
      }

      btn.addEventListener('click', () => {
        openTarget(item.uri).catch(() => {});
      });
      row.appendChild(btn);

      const helpUrl = resolveHelpUrl(item.help, lang);
      if (helpUrl) {
        const helpBtn = document.createElement('button');
        helpBtn.type = 'button';
        helpBtn.className = 'help-btn';
        helpBtn.textContent = '?';
        helpBtn.title = u.helpTooltip;
        helpBtn.setAttribute('aria-label', u.helpTooltip);
        helpBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openTarget(helpUrl).catch(() => {});
        });
        row.appendChild(helpBtn);
      }

      li.appendChild(row);
      ul.appendChild(li);
    }

    details.appendChild(ul);
    groupsRoot.appendChild(details);
  }

  noResultsEl.textContent = u.noResults;
  noResultsEl.classList.toggle('hidden', any);
  groupsRoot.classList.toggle('hidden', !any);
}

/** @param {'en'|'es'} lang */
function applyStaticUi(lang) {
  const u = popupUi(lang);
  document.getElementById('extTitle').textContent = u.title;
  document.getElementById('langLabel').textContent = u.languageLabel;
  document.getElementById('footerHint').textContent = u.footer;

  const filterInput = document.getElementById('filterInput');
  if (filterInput) {
    filterInput.placeholder = u.searchPlaceholder;
    filterInput.setAttribute('aria-label', u.searchAriaLabel);
  }

  const sel = document.getElementById('langSelect');
  const optEn = sel.querySelector('option[value="en"]');
  const optEs = sel.querySelector('option[value="es"]');
  optEn.textContent = u.optionEn;
  optEs.textContent = u.optionEs;
}

async function main() {
  const sel = document.getElementById('langSelect');
  const filterInput = document.getElementById('filterInput');
  let lang = await getUiLang();
  sel.value = lang;
  applyStaticUi(lang);

  const redraw = () => render(lang, filterInput?.value ?? '');

  sel.addEventListener('change', async () => {
    const next = sel.value === 'es' ? 'es' : 'en';
    await setUiLang(next);
    lang = next;
    applyStaticUi(lang);
    redraw();
  });

  filterInput?.addEventListener('input', () => redraw());

  redraw();
}

main().catch(() => {});
