import { DEEP_SKY_OBJECTS } from '../data/deep-sky-objects.js?v=272';

const PAGE_SIZE = 32;
const OBJECT_OVERRIDES = {
  'M 34': { name: 'Messier 34', description: 'A young open cluster in Perseus, approximately 1,500 light-years from Earth.' },
  'M 47': { name: 'Messier 47' },
  'M 71': { name: 'Messier 71' },
  'M 79': { name: 'Messier 79', description: 'A globular cluster in Lepus, approximately 12,900 light-years from Earth.' },
  'M 82': { name: 'Cigar Galaxy', group: 'Galaxies', subtype: 'Irregular galaxy', description: 'A nearby starburst galaxy in Ursa Major, approximately 12 million light-years from Earth.' }
};
const OBJECTS = DEEP_SKY_OBJECTS.map(object => ({
  ...object,
  catalogue: /^westerhout$/i.test(object.catalogue) ? 'Westerhout' : object.catalogue,
  ...OBJECT_OVERRIDES[object.id]
}));
const controls = {
  form: document.querySelector('#atlas-controls'),
  search: document.querySelector('#atlas-search'),
  group: document.querySelector('#atlas-group'),
  subtype: document.querySelector('#atlas-subtype'),
  constellation: document.querySelector('#atlas-constellation'),
  catalogue: document.querySelector('#atlas-catalogue-filter'),
  distance: document.querySelector('#atlas-distance'),
  sort: document.querySelector('#atlas-sort'),
  count: document.querySelector('#atlas-result-count'),
  active: document.querySelector('#atlas-active-filters'),
  grid: document.querySelector('#atlas-grid'),
  more: document.querySelector('#atlas-load-more')
};

const dialog = document.querySelector('#atlas-dialog');
let visibleLimit = PAGE_SIZE;

function unique(field, records = OBJECTS) {
  return [...new Set(records.map(record => record[field]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function populate(select, values) {
  const current = select.value;
  const first = select.options[0];
  select.replaceChildren(first, ...values.map(value => new Option(value, value)));
  if ([...select.options].some(option => option.value === current)) select.value = current;
}

function formatDistance(distance) {
  if (!Number.isFinite(distance)) return 'Distance uncertain';
  if (distance >= 1e9) return `${(distance / 1e9).toLocaleString('en-US', { maximumFractionDigits: 2 })} billion ly`;
  if (distance >= 1e6) return `${(distance / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 })} million ly`;
  if (distance >= 1e3) return `${(distance / 1e3).toLocaleString('en-US', { maximumFractionDigits: 1 })} thousand ly`;
  return `${distance.toLocaleString('en-US')} ly`;
}

function inDistanceBucket(object, bucket) {
  if (bucket === 'all') return true;
  const d = object.distance;
  if (bucket === 'local') return d < 1e4;
  if (bucket === 'milky-way') return d >= 1e4 && d < 1e5;
  if (bucket === 'nearby') return d >= 1e5 && d < 1e7;
  if (bucket === 'far') return d >= 1e7 && d < 5e8;
  return d >= 5e8;
}

function filteredObjects() {
  const query = controls.search.value.trim().toLowerCase();
  const records = OBJECTS.filter(object => {
    const haystack = `${object.id} ${object.name} ${object.group} ${object.subtype} ${object.constellation} ${object.catalogue} ${object.description}`.toLowerCase();
    return (!query || haystack.includes(query)) &&
      (controls.group.value === 'all' || object.group === controls.group.value) &&
      (controls.subtype.value === 'all' || object.subtype === controls.subtype.value) &&
      (controls.constellation.value === 'all' || object.constellation === controls.constellation.value) &&
      (controls.catalogue.value === 'all' || object.catalogue === controls.catalogue.value) &&
      inDistanceBucket(object, controls.distance.value);
  });

  const sorters = {
    recommended: (a, b) => a.featuredRank - b.featuredRank,
    name: (a, b) => a.name.localeCompare(b.name),
    nearest: (a, b) => a.distance - b.distance,
    farthest: (a, b) => b.distance - a.distance,
    constellation: (a, b) => a.constellation.localeCompare(b.constellation) || a.name.localeCompare(b.name),
    type: (a, b) => a.subtype.localeCompare(b.subtype) || a.name.localeCompare(b.name)
  };
  return records.sort(sorters[controls.sort.value]);
}

function cardMarkup(object) {
  const title = object.name === object.id ? object.id : object.name;
  const designation = object.name === object.id ? object.catalogue : object.id;
  return `<article class="atlas-card" tabindex="0" role="button" aria-label="Open details for ${escapeHtml(title)}" data-object-id="${escapeHtml(object.id)}">
    <div class="atlas-card-image"><img src="${escapeHtml(stableImageUrl(object.image))}" alt="${escapeHtml(title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span>${escapeHtml(object.wavelength)}</span></div>
    <div class="atlas-card-body">
      <p class="atlas-card-kicker"><span>${escapeHtml(object.subtype)}</span><span>${escapeHtml(object.constellation)}</span></p>
      <h3 title="${escapeHtml(title)}">${escapeHtml(title)}</h3>
      <p class="atlas-card-designation">${escapeHtml(designation)}</p>
      <p class="atlas-card-description">${escapeHtml(object.description)}</p>
      <p class="atlas-card-meta"><span>${escapeHtml(formatDistance(object.distance))}</span><span>${escapeHtml(object.catalogue)}</span></p>
    </div>
  </article>`;
}

function stableImageUrl(url) {
  if (!/upload\.wikimedia\.org/i.test(url)) return url;
  const path = decodeURIComponent(new URL(url).pathname);
  const thumbMatch = path.match(/\/thumb\/[a-f0-9]\/[^/]+\/([^/]+)\/[0-9]+px-/i);
  const originalMatch = path.match(/\/[a-f0-9]\/[^/]+\/([^/]+)$/i);
  const filename = thumbMatch?.[1] || originalMatch?.[1];
  return filename ? `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename)}?width=800` : url;
}

function imageSourcePage(object) {
  if (!/upload\.wikimedia\.org/i.test(object.image)) return object.imageSource;
  const path = decodeURIComponent(new URL(object.image).pathname);
  const thumbMatch = path.match(/\/thumb\/[a-f0-9]\/[^/]+\/([^/]+)\/[0-9]+px-/i);
  const originalMatch = path.match(/\/[a-f0-9]\/[^/]+\/([^/]+)$/i);
  const filename = thumbMatch?.[1] || originalMatch?.[1];
  return filename ? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename)}` : object.imageSource;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function renderActiveFilters() {
  const definitions = [
    ['search', controls.search.value.trim()], ['group', controls.group.value], ['subtype', controls.subtype.value],
    ['constellation', controls.constellation.value], ['catalogue', controls.catalogue.value], ['distance', controls.distance.value]
  ].filter(([, value]) => value && value !== 'all');
  controls.active.innerHTML = definitions.map(([key, value]) => `<button type="button" data-clear="${key}" aria-label="Remove ${escapeHtml(value)} filter">${escapeHtml(value)} ×</button>`).join('');
}

function render() {
  const records = filteredObjects();
  const shown = records.slice(0, visibleLimit);
  controls.count.textContent = `${records.length} of ${OBJECTS.length} objects`;
  controls.grid.innerHTML = shown.length ? shown.map(cardMarkup).join('') : '<p class="atlas-empty">No objects match these filters. Try clearing one or more choices.</p>';
  controls.more.hidden = shown.length >= records.length;
  controls.more.textContent = `Show more objects (${records.length - shown.length} remaining)`;
  renderActiveFilters();

  controls.grid.querySelectorAll('img').forEach(image => image.addEventListener('error', () => {
    image.removeAttribute('src');
    image.alt = 'External image unavailable';
    image.classList.add('atlas-image-fallback');
  }, { once: true }));
}

function refreshSubtypeOptions() {
  const records = controls.group.value === 'all' ? OBJECTS : OBJECTS.filter(object => object.group === controls.group.value);
  populate(controls.subtype, unique('subtype', records));
}

function openObject(object) {
  document.querySelector('#atlas-dialog-image').src = stableImageUrl(object.imageLarge || object.image);
  document.querySelector('#atlas-dialog-image').alt = object.name;
  document.querySelector('#atlas-dialog-wavelength').textContent = object.wavelength;
  document.querySelector('#atlas-dialog-type').textContent = `${object.group} · ${object.subtype}`;
  document.querySelector('#atlas-dialog-title').textContent = object.name;
  document.querySelector('#atlas-dialog-designation').textContent = object.id;
  document.querySelector('#atlas-dialog-description').textContent = object.description;
  const facts = [['Constellation', object.constellation], ['Distance', formatDistance(object.distance)], ['Catalogue', object.catalogue], ['Image', object.wavelength]];
  document.querySelector('#atlas-dialog-data').innerHTML = facts.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
  document.querySelector('#atlas-dialog-credit').textContent = `Image credit/source: ${object.imageCredit}`;
  document.querySelector('#atlas-dialog-source').href = imageSourcePage(object);
  document.querySelector('#atlas-dialog-facts').href = object.factSource;
  dialog.showModal();
}

populate(controls.group, unique('group'));
populate(controls.constellation, unique('constellation'));
populate(controls.catalogue, unique('catalogue'));
refreshSubtypeOptions();

controls.form.addEventListener('input', event => {
  if (event.target === controls.group) refreshSubtypeOptions();
  visibleLimit = PAGE_SIZE;
  render();
});
controls.form.addEventListener('reset', () => setTimeout(() => { refreshSubtypeOptions(); visibleLimit = PAGE_SIZE; render(); }));
controls.more.addEventListener('click', () => { visibleLimit += PAGE_SIZE; render(); });
controls.active.addEventListener('click', event => {
  const key = event.target.closest('[data-clear]')?.dataset.clear;
  if (!key || !controls[key]) return;
  controls[key].value = key === 'search' ? '' : 'all';
  if (key === 'group') refreshSubtypeOptions();
  visibleLimit = PAGE_SIZE;
  render();
});
controls.grid.addEventListener('click', event => {
  const card = event.target.closest('.atlas-card');
  if (card) openObject(OBJECTS.find(object => object.id === card.dataset.objectId));
});
controls.grid.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.classList.contains('atlas-card')) { event.preventDefault(); event.target.click(); }
});
document.querySelector('.atlas-dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelector('#atlas-explainer-toggle').addEventListener('click', event => {
  const button = event.currentTarget;
  const content = document.querySelector('#atlas-explainer-content');
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  button.lastElementChild.textContent = expanded ? '＋' : '−';
  content.hidden = expanded;
});

render();
