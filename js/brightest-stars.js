import { STARS } from '../data/astrophoto/interactive-stars.js?v=brightest-audit-1';

const catalogueNames = [
  'Sun (Sol)', 'Sirius', 'Canopus', 'Arcturus', 'Rigil Kent', 'Vega', 'Capella', 'Rigel', 'Procyon', 'Achernar',
  'Betelgeuse', 'Hadar (Beta Centauri)', 'Altair', 'Acrux', 'Aldebaran', 'Spica', 'Antares', 'Pollux', 'Fomalhaut', 'Deneb',
  'Mimosa', 'Regulus', 'Adhara', 'Shaula', 'Castor', 'Gacrux', 'Bellatrix', 'Elnath', 'Alnilam', 'Alnitak',
  'Mintaka', 'Saiph', 'Alkaid', 'Mizar', 'Alioth', 'Dubhe', 'Merak', 'Phecda', 'Polaris', 'Denebola',
  'Mirfak', 'Kaus Australis', 'Avior', 'Miaplacidus', 'Menkent', 'Alpheratz', 'Algol', 'Schedar', 'Caph', 'Nunki',
  'Mirach (Beta Andromedae)', 'Rasalhague', 'Algieba', 'Kochab', 'Tiaki (Beta Gruis)', 'Muhlifain', 'Aspidiske', 'Suhail', 'Alphecca', 'Almach',
  'Sadr', 'Eltanin', 'Alnair', 'Wezen', 'Sargas', 'Menkalinan', 'Atria', 'Alhena', 'Peacock', 'Alsephina',
  'Mirzam', 'Naos', 'Alphard', 'Hamal', 'Diphda', 'Dschubba', 'Larawag', 'Ankaa', 'Enif', 'Scheat',
  'Sabik', 'Aludra', 'Alderamin', 'Gamma Cassiopeiae', 'Markab', 'Gienah (Epsilon Cygni)', 'Acrab', 'Markeb', 'Menkar', 'Zeta Centauri',
  'Zosma', 'Arneb', 'Izar', 'Iota Aurigae (Hassaleh)', 'Kappa Scorpii (Girtab)', 'Delta Centauri (Ma Wei)', 'Alpha Lupi', 'Beta Arietis (Sheratan)'
];

const catalogue = catalogueNames.map(name => STARS.find(star => star.name === name)).filter(Boolean);
const nightStars = catalogue.filter(star => !star.dynamicPosition).sort((a, b) => a.magnitude - b.magnitude);
const nightRank = new Map(nightStars.map((star, index) => [star.name, index + 1]));
catalogue.forEach(star => { star.catalogueRank = star.dynamicPosition ? 0 : nightRank.get(star.name); });

const elements = {
  search: document.querySelector('#bright-search'),
  spectral: document.querySelector('#bright-spectral'),
  constellation: document.querySelector('#bright-constellation'),
  category: document.querySelector('#bright-category'),
  reset: document.querySelector('#bright-reset'),
  count: document.querySelector('#bright-star-count'),
  total: document.querySelector('#catalogue-total'),
  temperatureSpan: document.querySelector('#temperature-span'),
  rows: document.querySelector('#bright-star-rows'),
  cards: document.querySelector('#bright-card-list'),
  dialog: document.querySelector('#bright-star-dialog')
};

let sortKey = 'rank';
let sortDirection = 1;

function spectralLetter(star) { return (star.spectralClass || '').match(/[OBAFGKM]/i)?.[0]?.toUpperCase() || '?'; }

function stellarCategory(star) {
  const spectral = (star.spectralClass || '').toUpperCase().replace(/\s/g, '');
  if (/IA|IB/.test(spectral)) return 'supergiant';
  if (/II/.test(spectral) && !/III/.test(spectral)) return 'supergiant';
  if (/III/.test(spectral)) return 'giant';
  if (/IV/.test(spectral)) return 'subgiant';
  return 'main sequence';
}

function starColour(temperature) {
  if (temperature >= 30000) return '#84a9ff';
  if (temperature >= 10000) return '#a8c4ff';
  if (temperature >= 7500) return '#eef4ff';
  if (temperature >= 6000) return '#fff4d0';
  if (temperature >= 5000) return '#ffe09c';
  if (temperature >= 3800) return '#ffb36b';
  return '#ff8268';
}

function formatNumber(value, maximumFractionDigits = 1) {
  if (value == null || !Number.isFinite(Number(value))) return '—';
  const number = Number(value);
  if (number > 0 && number < .001) return number.toExponential(2);
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(number);
}

function displayName(name) {
  if (name === 'Rigil Kent') return 'Alpha Centauri A (Rigil Kent)';
  return name;
}

function sourceIdentifier(star) {
  const aliases = {
    'Rigil Kent': 'Alpha Centauri', 'Hadar (Beta Centauri)': 'Beta Centauri', Acrux: 'Alpha Crucis', Mimosa: 'Beta Crucis',
    Adhara: 'Epsilon Canis Majoris', Shaula: 'Lambda Scorpii', Nunki: 'Sigma Sagittarii', 'Mirach (Beta Andromedae)': 'Beta Andromedae',
    'Tiaki (Beta Gruis)': 'Beta Gruis', Muhlifain: 'Gamma Centauri', 'Gienah (Epsilon Cygni)': 'Epsilon Cygni',
    'Iota Aurigae (Hassaleh)': 'Iota Aurigae', 'Kappa Scorpii (Girtab)': 'Kappa Scorpii',
    'Delta Centauri (Ma Wei)': 'Delta Centauri', 'Beta Arietis (Sheratan)': 'Beta Arietis'
  };
  return aliases[star.name] || star.name.replace(/\s*\(.*?\)\s*/g, '');
}

function currentStars() {
  const query = elements.search.value.trim().toLowerCase();
  const spectral = elements.spectral.value;
  const constellation = elements.constellation.value;
  const category = elements.category.value;
  return catalogue.filter(star => {
    const haystack = `${star.name} ${displayName(star.name)} ${star.constellation} ${star.description} ${star.spectralClass}`.toLowerCase();
    return (!query || haystack.includes(query)) &&
      (spectral === 'all' || spectralLetter(star) === spectral) &&
      (constellation === 'all' || star.constellation === constellation) &&
      (category === 'all' || stellarCategory(star) === category);
  }).sort((a, b) => {
    const left = sortKey === 'rank' ? a.catalogueRank : a[sortKey];
    const right = sortKey === 'rank' ? b.catalogueRank : b[sortKey];
    if (typeof left === 'number' && typeof right === 'number') return (left - right) * sortDirection;
    return String(left || '').localeCompare(String(right || '')) * sortDirection;
  });
}

function starDot(star) {
  const size = Math.max(10, Math.min(22, 11 + Math.log10(Math.max(1, star.radius || 1)) * 3));
  return `<span class="star-dot" style="--star-colour:${starColour(star.temperature)};--dot-size:${size}px" aria-hidden="true"></span>`;
}

function render() {
  const stars = currentStars();
  elements.count.textContent = `${stars.length} of ${catalogue.length} systems shown`;
  elements.rows.innerHTML = stars.map(star => `
    <tr tabindex="0" data-star="${star.name}" aria-label="Open details for ${displayName(star.name)}">
      <td class="rank">${star.catalogueRank || 'Sun'}</td>
      <td><span class="bright-star-name">${starDot(star)}<span>${displayName(star.name)}</span></span></td>
      <td class="muted">${star.constellation}</td>
      <td>${formatNumber(star.magnitude, 2)}</td>
      <td>${formatNumber(star.distance, 2)} ly</td>
      <td>${star.spectralClass}</td>
      <td>${formatNumber(star.temperature, 0)} K</td>
      <td>${formatNumber(star.luminosity, 1)} L☉</td>
    </tr>`).join('');
  elements.cards.innerHTML = stars.map(star => `
    <button class="bright-star-card" type="button" data-star="${star.name}">
      ${starDot(star)}<span><strong>${displayName(star.name)}</strong><small>${star.constellation} · ${star.spectralClass} · ${formatNumber(star.distance, 2)} ly</small></span><span>${formatNumber(star.magnitude, 2)}</span>
    </button>`).join('');
  document.querySelectorAll('.bright-star-table th button').forEach(button => {
    button.querySelector('span').textContent = button.dataset.sort === sortKey ? (sortDirection === 1 ? '▲' : '▼') : '';
  });
}

function openStar(starName) {
  const star = catalogue.find(item => item.name === starName);
  if (!star) return;
  document.querySelector('#bright-dialog-name').textContent = displayName(star.name);
  document.querySelector('#bright-dialog-rank').textContent = star.catalogueRank ? `Night-sky brightness rank ${star.catalogueRank}` : 'Our own star';
  document.querySelector('#bright-dialog-summary').textContent = star.description || 'A bright star in the Space Safari catalogue.';
  document.querySelector('#bright-dialog-orb').style.setProperty('--star-colour', starColour(star.temperature));
  const values = [
    ['Constellation', star.constellation], ['Apparent magnitude', formatNumber(star.magnitude, 2)], ['Distance', `${formatNumber(star.distance, 3)} light-years`],
    ['Spectral class', star.spectralClass], ['Temperature', `${formatNumber(star.temperature, 0)} K`], ['Luminosity', `${formatNumber(star.luminosity, 1)} L☉`],
    ['Mass', `${formatNumber(star.mass, 2)} M☉`], ['Radius', `${formatNumber(star.radius, 2)} R☉`], ['Age', `${formatNumber(star.age, 3)} billion years`],
    ['Right ascension', `${formatNumber(star.ra / 15, 3)} h`], ['Declination', `${star.dec >= 0 ? '+' : '−'}${formatNumber(Math.abs(star.dec), 3)}°`], ['Category', stellarCategory(star)]
  ];
  document.querySelector('#bright-dialog-data').innerHTML = values.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
  const hrName = star.name === 'Sun (Sol)' ? 'Sol' : star.name;
  document.querySelector('#bright-dialog-hr').href = `hr-diagram.html?star=${encodeURIComponent(hrName)}`;
  document.querySelector('#bright-dialog-source').href = `https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${encodeURIComponent(sourceIdentifier(star))}`;
  elements.dialog.showModal();
}

const constellations = [...new Set(catalogue.map(star => star.constellation))].sort((a, b) => a.localeCompare(b));
elements.constellation.append(...constellations.map(name => {
  const option = document.createElement('option'); option.value = name; option.textContent = name; return option;
}));
elements.total.textContent = catalogue.length;
const temperatures = catalogue.map(star => star.temperature).filter(Number.isFinite);
elements.temperatureSpan.textContent = `${formatNumber(Math.min(...temperatures), 0)}–${formatNumber(Math.max(...temperatures), 0)} K`;

[elements.search, elements.spectral, elements.constellation, elements.category].forEach(control => control.addEventListener('input', render));
elements.reset.addEventListener('click', () => { elements.search.value = ''; elements.spectral.value = 'all'; elements.constellation.value = 'all'; elements.category.value = 'all'; sortKey = 'rank'; sortDirection = 1; render(); });
document.querySelectorAll('.bright-star-table th button').forEach(button => button.addEventListener('click', () => {
  if (sortKey === button.dataset.sort) sortDirection *= -1; else { sortKey = button.dataset.sort; sortDirection = 1; }
  render();
}));
document.querySelector('.bright-star-table').addEventListener('click', event => { const row = event.target.closest('[data-star]'); if (row) openStar(row.dataset.star); });
document.querySelector('.bright-star-table').addEventListener('keydown', event => { const row = event.target.closest('[data-star]'); if (row && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openStar(row.dataset.star); } });
elements.cards.addEventListener('click', event => { const card = event.target.closest('[data-star]'); if (card) openStar(card.dataset.star); });
document.querySelector('.bright-dialog-close').addEventListener('click', () => elements.dialog.close());
elements.dialog.addEventListener('click', event => { if (event.target === elements.dialog) elements.dialog.close(); });

render();
