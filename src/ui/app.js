import { GROUP_ORDER, SHORTCUTS, LABELS } from '../data/shortcuts.js';
import { resolveHelpUrl } from '../data/help-links.js';
import { popupUi } from '../data/ui-strings.js';
import { getUiLang, setUiLang } from '../lib/i18n-runtime.js';
import { openTarget } from '../lib/open-target.js';
import {
  loadCustomShortcuts,
  saveCustomShortcuts,
  validateUserUri,
  newCustomId,
} from '../lib/custom-shortcuts.js';

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
 * @param {{ title: string, uri: string }} c
 * @param {string} query
 */
function customMatches(c, query) {
  if (!query) return true;
  const hay = `${c.title} ${c.uri}`.toLowerCase();
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
 * @param {Awaited<ReturnType<typeof loadCustomShortcuts>>} customList
 * @param {{ editingId: string | null }} ui
 * @param {() => Promise<void>} redraw
 */
function render(lang, filterRaw, customList, ui, redraw) {
  const { editingId } = ui;
  const groupsRoot = document.getElementById('groupsRoot');
  const noResultsEl = document.getElementById('noResults');
  if (!groupsRoot || !noResultsEl) return;

  const query = norm(filterRaw);
  const u = popupUi(lang);
  const hasFilter = query.length > 0;

  groupsRoot.replaceChildren();

  const byGroup = new Map();
  for (const g of GROUP_ORDER) byGroup.set(g, []);
  for (const s of SHORTCUTS) {
    if (!itemMatches(s, query, lang)) continue;
    const list = byGroup.get(s.groupId);
    if (list) list.push(s);
  }

  let builtinAny = false;

  for (const groupId of GROUP_ORDER) {
    const items = byGroup.get(groupId) || [];
    if (items.length === 0) continue;

    builtinAny = true;
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

  const filteredCustom = customList.filter((c) => customMatches(c, query));
  const showCustomSection = !hasFilter || filteredCustom.length > 0;

  if (showCustomSection) {
    const details = document.createElement('details');
    details.className = 'group group-custom';
    details.open = true;

    const summary = document.createElement('summary');
    summary.textContent = u.customSectionTitle;
    details.appendChild(summary);

    const body = document.createElement('div');
    body.className = 'custom-body';

    if (filteredCustom.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'custom-empty';
      empty.textContent = u.customEmpty;
      body.appendChild(empty);
    } else {
      const ul = document.createElement('ul');
      ul.className = 'shortcut-list';

      for (const c of filteredCustom) {
        const li = document.createElement('li');
        if (editingId === c.id) {
          const form = document.createElement('div');
          form.className = 'custom-edit-form';

          const tLab = document.createElement('label');
          tLab.className = 'form-label';
          tLab.textContent = u.customTitleLabel;
          const tIn = document.createElement('input');
          tIn.type = 'text';
          tIn.className = 'form-input';
          tIn.value = c.title;
          tIn.autocomplete = 'off';
          tLab.appendChild(tIn);

          const uLab = document.createElement('label');
          uLab.className = 'form-label';
          uLab.textContent = u.customUriLabel;
          const uIn = document.createElement('input');
          uIn.type = 'text';
          uIn.className = 'form-input';
          uIn.value = c.uri;
          uIn.autocomplete = 'off';
          uLab.appendChild(uIn);

          const err = document.createElement('p');
          err.className = 'form-error hidden';
          err.setAttribute('role', 'alert');

          const actions = document.createElement('div');
          actions.className = 'form-actions';

          const saveBtn = document.createElement('button');
          saveBtn.type = 'button';
          saveBtn.className = 'btn-secondary';
          saveBtn.textContent = u.customSave;
          saveBtn.addEventListener('click', async () => {
            err.classList.add('hidden');
            const title = tIn.value.trim();
            const uri = uIn.value.trim();
            if (!title) {
              err.textContent = u.customErrorTitle;
              err.classList.remove('hidden');
              return;
            }
            const v = validateUserUri(uri);
            if (!v.ok) {
              err.textContent = u.customErrorUri;
              err.classList.remove('hidden');
              return;
            }
            const next = customList.map((x) =>
              x.id === c.id ? { ...x, title, uri } : x,
            );
            await saveCustomShortcuts(next);
            ui.editingId = null;
            await redraw();
          });

          const cancelBtn = document.createElement('button');
          cancelBtn.type = 'button';
          cancelBtn.className = 'btn-ghost';
          cancelBtn.textContent = u.customCancel;
          cancelBtn.addEventListener('click', async () => {
            ui.editingId = null;
            await redraw();
          });

          actions.appendChild(saveBtn);
          actions.appendChild(cancelBtn);
          form.appendChild(tLab);
          form.appendChild(uLab);
          form.appendChild(err);
          form.appendChild(actions);
          li.appendChild(form);
        } else {
          const row = document.createElement('div');
          row.className = 'shortcut-row shortcut-row-custom';

          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'shortcut-btn';
          const span = document.createElement('span');
          span.textContent = c.title;
          btn.appendChild(span);
          btn.addEventListener('click', () => {
            openTarget(c.uri).catch(() => {});
          });
          row.appendChild(btn);

          const actions = document.createElement('div');
          actions.className = 'row-actions';

          const editBtn = document.createElement('button');
          editBtn.type = 'button';
          editBtn.className = 'icon-text-btn';
          editBtn.textContent = u.customEdit;
          editBtn.addEventListener('click', async () => {
            ui.editingId = c.id;
            await redraw();
          });

          const delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.className = 'icon-text-btn danger';
          delBtn.textContent = u.customDelete;
          delBtn.addEventListener('click', async () => {
            if (!confirm(u.customDeleteConfirm)) return;
            ui.editingId = null;
            const next = customList.filter((x) => x.id !== c.id);
            await saveCustomShortcuts(next);
            await redraw();
          });

          actions.appendChild(editBtn);
          actions.appendChild(delBtn);
          row.appendChild(actions);
          li.appendChild(row);
        }
        ul.appendChild(li);
      }
      body.appendChild(ul);
    }

    const addWrap = document.createElement('div');
    addWrap.className = 'custom-add';

    const tLab = document.createElement('label');
    tLab.className = 'form-label';
    tLab.textContent = u.customTitleLabel;
    const tIn = document.createElement('input');
    tIn.type = 'text';
    tIn.className = 'form-input';
    tIn.placeholder = u.customTitlePlaceholder;
    tIn.autocomplete = 'off';
    tLab.appendChild(tIn);

    const uLab = document.createElement('label');
    uLab.className = 'form-label';
    uLab.textContent = u.customUriLabel;
    const uIn = document.createElement('input');
    uIn.type = 'text';
    uIn.className = 'form-input';
    uIn.placeholder = u.customUriPlaceholder;
    uIn.autocomplete = 'off';
    uLab.appendChild(uIn);

    const hint = document.createElement('p');
    hint.className = 'form-hint';
    hint.textContent = u.customUriHint;

    const addErr = document.createElement('p');
    addErr.className = 'form-error hidden';
    addErr.setAttribute('role', 'alert');

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn-primary';
    addBtn.textContent = u.customAdd;
    addBtn.addEventListener('click', async () => {
      addErr.classList.add('hidden');
      const title = tIn.value.trim();
      const uri = uIn.value.trim();
      if (!title) {
        addErr.textContent = u.customErrorTitle;
        addErr.classList.remove('hidden');
        return;
      }
      const v = validateUserUri(uri);
      if (!v.ok) {
        addErr.textContent = u.customErrorUri;
        addErr.classList.remove('hidden');
        return;
      }
      const next = [
        ...customList,
        { id: newCustomId(), title, uri },
      ];
      await saveCustomShortcuts(next);
      tIn.value = '';
      uIn.value = '';
      await redraw();
    });

    addWrap.appendChild(tLab);
    addWrap.appendChild(uLab);
    addWrap.appendChild(hint);
    addWrap.appendChild(addErr);
    addWrap.appendChild(addBtn);
    body.appendChild(addWrap);
    details.appendChild(body);
    groupsRoot.appendChild(details);
  }

  const customAny = filteredCustom.length > 0;
  const noMatches = hasFilter && !builtinAny && !customAny;
  noResultsEl.textContent = u.noResults;
  noResultsEl.classList.toggle('hidden', !noMatches);

  const hasVisibleContent = builtinAny || showCustomSection;
  groupsRoot.classList.toggle('hidden', !hasVisibleContent);
}

/** @param {'en'|'es'} lang */
function applyStaticUi(lang) {
  const u = popupUi(lang);
  document.getElementById('extTitle').textContent = u.title;
  document.getElementById('langLabel').textContent = u.languageLabel;
  document.getElementById('footerHint').textContent = u.footer;
  const footerWin = document.getElementById('footerWindowHint');
  if (footerWin) footerWin.textContent = u.windowHint;
  const btnClose = document.getElementById('btnClose');
  if (btnClose) {
    btnClose.textContent = u.closeWindow;
    btnClose.setAttribute('aria-label', u.closeWindow);
  }

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

export async function initApp() {
  const sel = document.getElementById('langSelect');
  const filterInput = document.getElementById('filterInput');
  let lang = await getUiLang();
  const ui = { editingId: /** @type {string | null} */ (null) };

  sel.value = lang;
  applyStaticUi(lang);

  document.getElementById('btnClose')?.addEventListener('click', () => window.close());

  /** @type {() => Promise<void>} */
  let redraw = async () => {};

  redraw = async () => {
    const custom = await loadCustomShortcuts();
    render(lang, filterInput?.value ?? '', custom, ui, redraw);
  };

  sel.addEventListener('change', async () => {
    const next = sel.value === 'es' ? 'es' : 'en';
    await setUiLang(next);
    lang = next;
    ui.editingId = null;
    applyStaticUi(lang);
    await redraw();
  });

  filterInput?.addEventListener('input', async () => {
    ui.editingId = null;
    await redraw();
  });

  await redraw();
}
