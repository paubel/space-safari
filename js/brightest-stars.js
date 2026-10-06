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
  'Zosma', 'Zeta Ophiuchi', 'Arneb', 'Gienah Corvi', 'Izar', 'Kappa Scorpii (Girtab)', 'Alpha Lupi',
  'Gamma Velorum', 'Epsilon Centauri', 'Eta Centauri'
];

const catalogue = catalogueNames.map(name => STARS.find(star => star.name === name)).filter(Boolean);

// Multiplicity and component spectra from the audited source catalogue. The
// visual radii are deliberately compressed; component count is not inferred
// from a system's display name or from a '+' in its spectrum.
const systemComponents = {
  Sirius: ['A1V', 'DA2'], 'Rigil Kent': ['G2V', 'K1V', 'M5V'], Capella: ['G8III', 'G0III', 'M0V', 'M2V'],
  Rigel: ['B8Ia', 'B9V', 'B9V', 'B9V'], Procyon: ['F5IV-V', 'DQZ'], Achernar: ['B6V', 'A2V'],
  'Hadar (Beta Centauri)': ['B1III', 'B1III', 'B1V'], Acrux: ['B0.5IV', 'B7V', 'B1V', 'B4V', 'G5V', 'M0V'],
  Aldebaran: ['K5III', 'M2.5V'], Spica: ['B1III-IV', 'B2V'], Antares: ['M1.5Iab', 'B2.5V'],
  Fomalhaut: ['A3V', 'K4V', 'M4V'], Adhara: ['B2II', 'A5V'], Shaula: ['B2IV', 'B3V', 'B5V'],
  Castor: ['A1V', 'M1V', 'Am', 'M1V', 'M1V', 'M1V'], Alnitak: ['O9.5Iab', 'B1IV', 'B0III'],
  Mintaka: ['O9.5II', 'B1V', 'B0IV', 'B5V', 'B5V'], Mizar: ['A2V', 'A2V', 'A7V', 'A7V'],
  Dubhe: ['K0III', 'A5V', 'F8V', 'F8V'], Polaris: ['F7Ib', 'F6V', 'F3V'], Algol: ['B8V', 'K0IV', 'F1V'],
  Algieba: ['K0III', 'G7III'], Menkalinan: ['A1IV', 'A1IV'], Peacock: ['B3V', '?'],
  Alsephina: ['A2IV', 'A4V', 'F8V'], Dschubba: ['B0.3IV', '~B'], Ankaa: ['K0.5III', '?'],
  Sabik: ['A2V', 'A2V'], 'Gienah (Epsilon Cygni)': ['K0III', '?'],
  Acrab: ['B0.5IV', 'B1.5V', 'B2V', 'HgMn', '?', '?'], Markeb: ['B2IV', '~B'],
  'Zeta Centauri': ['B2.5IV', '?'], Izar: ['K0II-III', 'A2V'], Alphecca: ['A0V', 'G5V'],
  'Kappa Scorpii (Girtab)': ['B1.5III', 'B2III'], 'Beta Arietis (Sheratan)': ['A3V', 'G2V'],
  'Gamma Velorum': ['WC8', 'O7.5III', 'B2III', 'F'], 'Gienah Corvi': ['B8III', 'K-MV']
};
// Preserve the component sizes from the original Brightest Stars page. These
// are display sizes for comparing members within a system, not a universal
// physical scale across different systems.
const systemComponentSizes = {
  Sirius: [38, 12], 'Rigil Kent': [36, 30, 12], Capella: [36, 32, 12, 12], Rigel: [44, 18, 16, 16],
  Procyon: [34, 12], Achernar: [40, 18], 'Hadar (Beta Centauri)': [18, 16, 14], Aldebaran: [36, 12],
  Spica: [36, 28], Antares: [48, 22], Fomalhaut: [36, 14, 12], Adhara: [40, 12], Shaula: [20, 14, 12],
  Castor: [36, 12, 30, 12, 12, 12], Alnitak: [40, 22, 18], Mintaka: [40, 30, 22, 16, 14],
  Mizar: [30, 30, 26, 12], Dubhe: [36, 18, 12, 12], Polaris: [44, 16, 18], Algol: [30, 20, 22],
  Algieba: [30, 22], Menkalinan: [30, 28], Alsephina: [30, 26, 14], Dschubba: [30, 14],
  Ankaa: [30, 15], Acrab: [30, 25, 20, 15, 12, 12], Markeb: [30, 12], Izar: [30, 15],
  Alphecca: [30, 16], 'Kappa Scorpii (Girtab)': [30, 27], 'Gamma Velorum': [38, 32, 18, 12],
  'Gienah Corvi': [30, 12]
};
const combinedMagnitudes = { 'Rigil Kent': -0.27, Acrux: 0.76, Castor: 1.58, 'Gamma Velorum': 1.83 };
catalogue.forEach(star => {
  star.components = systemComponents[star.name] || [star.spectralClass];
  star.componentSizes = systemComponentSizes[star.name] || null;
  star.componentCount = star.components.length;
  star.apparentMagnitude = combinedMagnitudes[star.name] ?? star.magnitude;
  const bothSkies = new Set(['Sun (Sol)', 'Sirius', 'Rigel', 'Betelgeuse', 'Spica', 'Adhara', 'Bellatrix', 'Alnilam', 'Alnitak', 'Mintaka', 'Saiph', 'Alphard', 'Diphda', 'Menkar']);
  star.visibility = bothSkies.has(star.name) ? 'Both' : star.dec >= 0 ? 'Northern' : 'Southern';
  star.starType = stellarCategory(star).replace(/\b\w/g, letter => letter.toUpperCase());
});
const nightStars = catalogue.filter(star => !star.dynamicPosition).sort((a, b) => a.apparentMagnitude - b.apparentMagnitude);
const nightRank = new Map(nightStars.map((star, index) => [star.name, index + 1]));
catalogue.forEach(star => { star.catalogueRank = star.dynamicPosition ? 0 : nightRank.get(star.name); });

const elements = {
  search: document.querySelector('#bright-search'),
  spectral: document.querySelector('#bright-spectral'),
  constellation: document.querySelector('#bright-constellation'),
  category: document.querySelector('#bright-category'),
  north: document.querySelector('#bright-north'),
  south: document.querySelector('#bright-south'),
  reset: document.querySelector('#bright-reset'),
  count: document.querySelector('#bright-star-count'),
  rows: document.querySelector('#bright-star-rows'),
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

function spectralColour(spectral) {
  return { O: '#84a9ff', B: '#a8c4ff', A: '#eef4ff', F: '#fff4d0', G: '#ffe09c', K: '#ffb36b', M: '#ff8268', D: '#f5f7ff' }[(spectral || '').match(/[OBAFGKMD]/i)?.[0]?.toUpperCase()] || '#d9e2ef';
}

function spectralDisplaySize(spectral) {
  return { O: 18, B: 16, A: 14, F: 13, G: 12, K: 11, M: 10 }[(spectral || '').match(/[OBAFGKM]/i)?.[0]?.toUpperCase()] || 10;
}

function luminositySizeMultiplier(spectral, starType) {
  const spec = String(spectral || '').toUpperCase();
  const type = String(starType || '').toUpperCase();
  if (/SUPERGIANT/.test(type) || /IAB|IA|IB/.test(spec)) return 2;
  if (/BRIGHT GIANT/.test(type) || /(^|[^I])II([^I]|$)/.test(spec)) return 1.8;
  if (/GIANT/.test(type) || /III/.test(spec)) return 1.4;
  if (/SUBGIANT/.test(type) || /IV/.test(spec)) return 1.15;
  if (/WHITE\s*-?DWARF/.test(type) || /D[A-Z]/.test(spec)) return .6;
  if (/MAIN/.test(type) || /V/.test(spec)) return 1;
  if (/[OB]/.test(spec)) return 1.2;
  return 1;
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
      (category === 'all' || stellarCategory(star) === category) &&
      ((elements.north.checked && (star.visibility === 'Northern' || star.visibility === 'Both')) ||
       (elements.south.checked && (star.visibility === 'Southern' || star.visibility === 'Both')));
  }).sort((a, b) => {
    const left = sortKey === 'rank' ? a.catalogueRank : sortKey === 'magnitude' ? a.apparentMagnitude : a[sortKey];
    const right = sortKey === 'rank' ? b.catalogueRank : sortKey === 'magnitude' ? b.apparentMagnitude : b[sortKey];
    if (typeof left === 'number' && typeof right === 'number') return (left - right) * sortDirection;
    return String(left || '').localeCompare(String(right || '')) * sortDirection;
  });
}

function starDot(star) {
  const size = radiusDisplaySize(star.radius);
  return `<span class="star-dot" style="--star-colour:${starColour(star.temperature)};--dot-size:${size}px" aria-hidden="true"></span>`;
}

function radiusDisplaySize(radius) {
  const safeRadius = Math.max(0.1, Number(radius) || 1);
  return Math.min(50, Math.max(7, 10 + 13 * Math.log10(safeRadius)));
}

function systemVisual(star) {
  const primarySize = radiusDisplaySize(star.radius);
  const primaryReference = star.componentSizes?.[0] ||
    spectralDisplaySize(star.components[0]) * luminositySizeMultiplier(star.components[0], star.starType);
  const dots = star.components.map((spectral, index) => {
    const baseSize = star.componentSizes?.[index] || spectralDisplaySize(spectral);
    const componentReference = baseSize * (star.componentSizes ? 1 : luminositySizeMultiplier(spectral, index === 0 ? star.starType : ''));
    const relativeSize = Math.min(.92, Math.max(.22, componentReference / primaryReference));
    const size = Math.round(index === 0 ? primarySize : Math.max(7, primarySize * relativeSize));
    const colour = spectralColour(spectral);
    return `<span class="star-dot" style="--star-colour:${colour};--dot-size:${size}px" title="Component ${index + 1}: ${spectral}" aria-label="Component ${index + 1}, spectral class ${spectral}"></span>`;
  }).join('');
  return `<span class="star-system-visual">${dots}</span><span class="star-system-caption">${star.componentCount} ${star.componentCount === 1 ? 'star' : 'stars'} · primary radius ${formatNumber(star.radius, 2)} R☉</span>`;
}

function render() {
  const stars = currentStars();
  elements.count.textContent = `${stars.length} of ${catalogue.length} systems shown`;
  elements.rows.innerHTML = stars.map(star => `
    <tr tabindex="0" data-star="${star.name}" aria-label="Open details for ${displayName(star.name)}">
      <td class="rank">${star.catalogueRank || 'Sun'}</td>
      <td><span class="bright-star-name"><span>${displayName(star.name)}</span>${systemVisual(star)}</span></td>
      <td>${star.componentCount}</td>
      <td class="muted">${star.constellation}</td>
      <td>${formatNumber(star.apparentMagnitude, 2)}</td>
      <td>${formatNumber(star.distance, 2)} ly</td>
      <td>${star.spectralClass}</td>
      <td class="col-medium">${formatNumber(star.temperature, 0)} K</td>
      <td class="col-medium">${formatNumber(star.luminosity, 1)} L☉</td>
      <td class="col-wide">${formatNumber(star.radius, 2)} R☉</td>
      <td class="col-wide">${formatNumber(star.mass, 2)} M☉</td>
      <td class="col-wide">${formatNumber(star.age, 3)} Gyr</td>
      <td class="col-wide">${star.starType}</td>
      <td class="col-wide notes-column">${star.description || '—'}</td>
    </tr>`).join('');
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
    ['Constellation', star.constellation], ['Visibility', star.visibility], ['Stars in system', star.componentCount], ['Apparent magnitude', formatNumber(star.apparentMagnitude, 2)], ['Distance', `${formatNumber(star.distance, 3)} light-years`],
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

[elements.search, elements.spectral, elements.constellation, elements.category, elements.north, elements.south].forEach(control => control.addEventListener('input', render));
elements.reset.addEventListener('click', () => { elements.search.value = ''; elements.spectral.value = 'all'; elements.constellation.value = 'all'; elements.category.value = 'all'; elements.north.checked = true; elements.south.checked = true; sortKey = 'rank'; sortDirection = 1; render(); });
document.querySelectorAll('.bright-star-table th button').forEach(button => button.addEventListener('click', () => {
  if (sortKey === button.dataset.sort) sortDirection *= -1; else { sortKey = button.dataset.sort; sortDirection = 1; }
  render();
}));
document.querySelector('.bright-star-table').addEventListener('click', event => { const row = event.target.closest('[data-star]'); if (row) openStar(row.dataset.star); });
document.querySelector('.bright-star-table').addEventListener('keydown', event => { const row = event.target.closest('[data-star]'); if (row && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openStar(row.dataset.star); } });
document.querySelector('.bright-dialog-close').addEventListener('click', () => elements.dialog.close());
elements.dialog.addEventListener('click', event => { if (event.target === elements.dialog) elements.dialog.close(); });

render();
