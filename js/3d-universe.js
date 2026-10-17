import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { STARS } from '../data/astrophoto/interactive-stars.js?v=3d-prototype-1';
import { createSagittariusAVisualizer } from './sagittarius-a-webgpu.js?v=adaptive-quality-1';
import { createMilkyWay } from './milky-way.js?v=12';

if (sessionStorage.getItem('space-safari-universe-return')) {
  document.body.classList.add('is-arriving-universe');
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove('is-arriving-universe')));
}

const stage = document.querySelector('#universe-stage');
const stageWrap = document.querySelector('#universe-stage-wrap');
const workspace = document.querySelector('.universe-workspace');
const loading = document.querySelector('#universe-loading');
const errorPanel = document.querySelector('#universe-error');

const controlsUi = {
  search: document.querySelector('#universe-search'),
  list: document.querySelector('#universe-star-list'),
  find: document.querySelector('#universe-find'),
  scale: [...document.querySelectorAll('input[name="distance-scale"]')],
  distance: document.querySelector('#universe-distance'),
  distanceOutput: document.querySelector('#universe-distance-output'),
  spectral: document.querySelector('#universe-spectral'),
  quality: document.querySelector('#universe-quality'),
  qualityOutput: document.querySelector('#universe-quality-output'),
  labels: document.querySelector('#universe-labels'),
  labelMagnitude: document.querySelector('#universe-label-magnitude'),
  labelMagnitudeOutput: document.querySelector('#universe-label-magnitude-output'),
  plane: document.querySelector('#universe-plane'),
  earthGuide: document.querySelector('#universe-earth-guide'),
  directions: document.querySelector('#universe-directions'),
  milkyWay: document.querySelector('#universe-milky-way'),
  milkyWayLabels: document.querySelector('#universe-milky-way-labels'),
  viewMilkyWay: document.querySelector('#universe-view-milky-way'),
  viewMilkyWayEdge: document.querySelector('#universe-view-milky-way-edge'),
  viewMilkyWayOblique: document.querySelector('#universe-view-milky-way-oblique'),
  viewMilkyWaySun: document.querySelector('#universe-view-milky-way-sun'),
  galaxyStyle: document.querySelector('#universe-galaxy-style'),
  galaxyReferences: document.querySelector('#universe-galaxy-references'),
  galaxyOutlines: document.querySelector('#universe-galaxy-outlines'),
  galaxyUncertainty: document.querySelector('#universe-galaxy-uncertainty'),
  milkyWayStatus: document.querySelector('#universe-milky-way-status'),
  nebulae: document.querySelector('#universe-nebulae'),
  nebulaStatus: document.querySelector('#universe-model-status'),
  nebulaList: document.querySelector('#universe-nebula-list'),
  reset: document.querySelector('#universe-reset'),
  home: document.querySelector('#universe-home'),
  fullscreen: document.querySelector('#universe-fullscreen'),
  toggleControls: document.querySelector('#universe-toggle-controls'),
  toggleDetails: document.querySelector('#universe-toggle-details'),
  count: document.querySelector('#universe-count'),
  scaleNote: document.querySelector('#universe-scale-note'),
  fly: document.querySelector('#universe-fly')
};
controlsUi.flyHint = document.querySelector('#universe-fly-hint');

const details = {
  name: document.querySelector('#universe-object-name'),
  description: document.querySelector('#universe-object-description'),
  distance: document.querySelector('#universe-object-distance'),
  constellation: document.querySelector('#universe-object-constellation'),
  spectral: document.querySelector('#universe-object-spectral'),
  temperature: document.querySelector('#universe-object-temperature'),
  luminosity: document.querySelector('#universe-object-luminosity'),
  radius: document.querySelector('#universe-object-radius'),
  galacticStructure: document.querySelector('#universe-object-galactic-structure'),
  hr: document.querySelector('#universe-hr-link'),
  source: document.querySelector('#universe-source-link'),
  labels: {
    distance: document.querySelector('#universe-label-distance'),
    constellation: document.querySelector('#universe-label-constellation'),
    spectral: document.querySelector('#universe-label-spectral'),
    temperature: document.querySelector('#universe-label-temperature'),
    luminosity: document.querySelector('#universe-label-luminosity'),
    radius: document.querySelector('#universe-label-radius')
  }
};

const NEBULAE = [
  {
    name: 'Orion Nebula (M42)', shortName: 'Orion Nebula (M42)', ra: 83.8221, dec: -5.3911, distance: 1344,
    constellation: 'Orion', type: 'Diffuse emission and reflection nebula', format: 'volume', colour: 0x73b9ff,
    description: 'A diffuse, freely rotatable volume inspired by the Orion Nebula’s glowing cavity and dusty clouds. This is a science-informed visual interpretation—not a measured three-dimensional density map.',
    sourceUrl: 'https://svs.gsfc.nasa.gov/30957/', representation: 'Science-informed procedural volume', volumeShape: 'cloud', displayScale: [11.5, 8.3, 9.5], physicalSizeLy: 2.5
  },
  {
    name: 'Ring Nebula (M57)', shortName: 'Ring Nebula (M57)', ra: 283.39613, dec: 33.02918, distance: 2300,
    constellation: 'Lyra', type: 'Planetary nebula', format: 'volume', colour: 0x61e0d0,
    description: 'A diffuse volumetric interpretation of M57’s ionised central ring, fainter outer gas, and hollow bipolar structure. Its position and distance follow NASA data; the enlarged gas distribution is a science-informed visualisation, not a measured three-dimensional density map.',
    sourceUrl: 'https://science.nasa.gov/asset/hubble/compass-and-scale-image-for-ring-nebula-hst-only/', representation: 'Science-informed procedural volume', volumeShape: 'ring', displayScale: [7.8, 7.8, 6.2], physicalSizeLy: 1
  },
  {
    name: 'Owl Nebula (M97 · NGC 3587)', shortName: 'Owl Nebula (M97)', ra: 168.698801, dec: 55.019023, distance: 2030,
    constellation: 'Ursa Major', type: 'Planetary nebula', format: 'volume', colour: 0x72d8cb,
    description: 'A science-informed volumetric interpretation of M97’s roughly spherical, multi-shell structure. Two lower-density bipolar cavities create the famous “owl eyes”, while a faint outer halo surrounds the brighter inner shell. Its position follows SIMBAD; the approximately two-light-year span is derived from its angular diameter and adopted distance. The internal depth remains interpretive rather than a measured three-dimensional density map.',
    sourceUrl: 'https://simbad.u-strasbg.fr/simbad/sim-basic?Ident=M97&submit=SIMBAD+search', sourceLabel: 'Open SIMBAD reference →', modelSource: 'SIMBAD position and angular size', representation: 'Procedural multi-shell volume with bipolar cavities', volumeShape: 'owl', displayScale: [6.8, 6.5, 6.2], physicalSizeLy: 2
  },
  {
    name: 'Helix Nebula (NGC 7293 · Caldwell 63)', shortName: 'Helix Nebula (NGC 7293)', ra: 337.450792, dec: -20.823886, distance: 650,
    constellation: 'Aquarius', type: 'Planetary nebula', format: 'volume', colour: 0x65d7d2,
    description: 'A volumetric interpretation of the nearby Helix Nebula as a thick, knotty barrel or tunnel of ionised gas—not a flat ring. Its axis is aimed close to the Sun, with the inner structure tilted about 23° from our line of sight, so the first view resembles the familiar “cosmic eye”; orbiting around it reveals the tunnel depth. A blue-green inner wall surrounds the hot white dwarf, redder filamentary gas traces the outer rim, and a faint extended envelope reaches beyond the bright main structure.',
    sourceUrl: 'https://science.nasa.gov/asset/hubble/helix-nebula-model/', sourceLabel: 'Open NASA 3D reference →', modelSource: 'NASA/Hubble observation-based 3D reference', representation: 'Sun-facing knotty barrel tilted 23°, with filaments and outer envelope', volumeShape: 'helix', displayScale: [8.2, 8.2, 7.2], physicalSizeLy: 2.5, viewTiltDeg: 23, viewPositionAngleDeg: 303
  },
  {
    name: 'The Pleiades (M45)', shortName: 'The Pleiades (M45)', ra: 56.75, dec: 24.1167, distance: 445,
    constellation: 'Taurus', type: 'Open star cluster and reflection nebulosity', format: 'volume', colour: 0x83b9ff,
    description: 'The Seven Sisters embedded in wisps of blue reflection nebulosity. The bright stars are arranged to evoke the familiar cluster, while the dust is a science-informed procedural interpretation rather than a measured three-dimensional density map.',
    sourceUrl: 'https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-45/', representation: 'Procedural reflection nebulosity and cluster stars', volumeShape: 'cluster', displayScale: [10.5, 8.5, 7.5], physicalSizeLy: 13
  },
  {
    name: 'Dumbbell Nebula (M27)', shortName: 'Dumbbell Nebula (M27)', ra: 299.90108, dec: 22.721, distance: 1240,
    constellation: 'Vulpecula', type: 'Planetary nebula', format: 'volume', colour: 0x63e2e0,
    description: 'A translucent interpretation of M27’s bright double-lobed body, central cavity, clumpy gas, and fainter outer envelope. Its sky position and distance follow NASA data; the enlarged volume is a science-informed visualisation, not a measured three-dimensional density map.',
    sourceUrl: 'https://science.nasa.gov/asset/hubble/the-dumbbell-nebula-m27/', representation: 'Science-informed procedural bipolar volume', volumeShape: 'dumbbell', displayScale: [4.8, 3.8, 4.2], physicalSizeLy: 4.5
  },
  {
    name: 'Rho Ophiuchi Cloud Complex', shortName: 'Rho Ophiuchi', ra: 246.62733, dec: -24.38449, distance: 440,
    constellation: 'Ophiuchus', type: 'Dark, reflection, and star-forming molecular clouds', format: 'volume', colour: 0xe5b06c,
    description: 'A layered interpretation of the nearby Rho Ophiuchi star-forming complex, combining blue reflection nebulosity, warm illuminated dust, dark molecular lanes, and embedded young stars. Position and approximate distance follow NASA and ESA data; the volume is an artistic, science-informed reconstruction.',
    sourceUrl: 'https://science.nasa.gov/asset/webb/rho-ophiuchi-nircam-image/', representation: 'Procedural multi-cloud star-forming region', volumeShape: 'rho', displayScale: [8.8, 6.6, 7.0], physicalSizeLy: 30
  },
  {
    name: 'North America Nebula (NGC 7000)', shortName: 'North America Nebula (NGC 7000)', ra: 314.695833, dec: 44.33, distance: 1800,
    constellation: 'Cygnus', type: 'H II emission nebula and star-forming region', format: 'volume', colour: 0xe96d66,
    description: 'A broad, relatively shallow interpretation of NGC 7000’s glowing hydrogen clouds, eroded ionisation fronts, and opaque molecular dust. The dark Gulf of Mexico region is represented as a foreground lane cutting into the brighter gas. Position, approximate distance, and 50-light-year span follow SIMBAD and NASA data; the depth structure is science-informed rather than a measured three-dimensional density map.',
    sourceUrl: 'https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-caldwell-catalog/caldwell-20/', representation: 'Procedural flattened H II-region volume', volumeShape: 'northamerica', displayScale: [10.5, 12.0, 4.8], physicalSizeLy: 50
  },
  {
    name: 'Crab Nebula (M1)', shortName: 'Crab Nebula (M1)', ra: 83.63308, dec: 22.0145, distance: 6500,
    constellation: 'Taurus', type: 'Supernova remnant and pulsar wind nebula', format: 'volume', colour: 0xff855f,
    description: 'A filament-rich interpretation of the expanding remnant of the supernova observed in 1054, with warm outer ejecta, a blue energetic interior, and its central pulsar. Position, distance, and physical span follow NASA data; the internal volume is a science-informed visualisation.',
    sourceUrl: 'https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-1/', representation: 'Procedural filamentary supernova-remnant volume', volumeShape: 'crab', displayScale: [7.0, 5.3, 5.0], physicalSizeLy: 10
  },
  {
    name: 'Vela Supernova Remnant (SNR G263.9−3.3)', shortName: 'Vela Supernova Remnant', ra: 128.5, dec: -45.833333, distance: 815,
    constellation: 'Vela', type: 'Core-collapse supernova remnant', format: 'volume', colour: 0x63cde2,
    description: 'A thin, fragmented shock shell from a massive star that exploded roughly 11,000 years ago. The model combines an irregular, nearly spherical X-ray shell with brighter optical filaments, faint hot interior gas, and a few ejecta-like protrusions. Its centre follows SIMBAD; the adopted distance of 250 pc and diameter of about 35 pc follow absorption measurements and later physical modelling. Fine depth and filament placement are science-informed rather than a measured density reconstruction.',
    sourceUrl: 'https://academic.oup.com/mnras/article/430/4/2864/1104514', sourceLabel: 'Open scientific reference →', modelSource: 'SIMBAD position · 250 pc distance model', representation: 'Procedural fragmented shock shell, filaments, and central pulsar', volumeShape: 'vela', displayScale: [12.5, 12.0, 11.5], physicalSizeLy: 114
  },
  {
    name: 'The Crescent Nebula (NGC 6888 · Caldwell 27)', shortName: 'Crescent Nebula (NGC 6888)', ra: 303.027258, dec: 38.35494, distance: 5000,
    constellation: 'Cygnus', type: 'Wolf–Rayet wind-blown bubble', format: 'volume', colour: 0x63d3dc,
    description: 'A three-dimensional interpretation of the turbulent bubble blown by the powerful wind of WR 136 into material shed during an earlier red-supergiant phase. An asymmetric blue-green skin encloses hotter diffuse gas, while compressed red filaments and dense knots form the familiar broken crescent. Position follows WR 136 in SIMBAD; the adopted distance and roughly 25-light-year span follow NASA references. Fine depth and filament placement are science-informed rather than directly measured.',
    sourceUrl: 'https://science.nasa.gov/image-article/apod-2021-june-17-ngc-6888-the-crescent-nebula/', sourceLabel: 'Open NASA reference →', modelSource: 'NASA size · SIMBAD WR 136 position', representation: 'Procedural asymmetric wind bubble, thin skin, filaments, and WR 136', volumeShape: 'crescent', displayScale: [9.8, 7.4, 7.8], physicalSizeLy: 25
  },
  {
    name: "The Elephant's Trunk Nebula (IC 1396 · IC 1396A)", shortName: "Elephant's Trunk (IC 1396)", ra: 324.745, dec: 57.513889, distance: 2450,
    constellation: 'Cepheus', type: 'H II region with a dark star-forming globule', format: 'volume', colour: 0xd98772,
    description: "A broad ionised cloud surrounds the long, dense IC 1396A globule. The model cuts a crooked, dark trunk through the glowing H II region and outlines its irradiated rim, with knots and embedded young stars near the compressed head. NASA measurements place the complex about 2,450 light-years away, more than 100 light-years across, while the trunk itself is roughly 20–30 light-years long. Its depth is a science-informed interpretation rather than a measured density reconstruction.",
    sourceUrl: 'https://www.jpl.nasa.gov/images/pia14103-blowin-in-the-stellar-wind/', sourceLabel: 'Open NASA/JPL reference →', modelSource: 'NASA/JPL distance and size · SIMBAD IC 1396 position', representation: 'Procedural face-on H II complex with IC 1396A as an offset hooked globule', volumeShape: 'elephant', displayScale: [12.5, 12.0, 4.8], physicalSizeLy: 105
  },
  {
    name: 'Carina Nebula (NGC 3372)', shortName: 'Carina Nebula (NGC 3372)', ra: 161.2854, dec: -59.8678, distance: 7500,
    constellation: 'Carina', type: 'Giant emission nebula and star-forming complex', format: 'volume', colour: 0xd87a67,
    description: 'NGC 3372 is a vast, turbulent stellar nursery more than 300 light-years across. This layered volume evokes its ionised cavities, illuminated cloud walls, embedded clusters, and obscuring molecular dust. The much smaller Homunculus Nebula and Eta Carinae A/B are positioned separately within this volume.',
    sourceUrl: 'https://science.nasa.gov/missions/hubble/dark-clouds-of-the-carina-nebula/', representation: 'Procedural large-scale star-forming complex', volumeShape: 'carina', displayScale: [15.0, 11.5, 10.0], physicalSizeLy: 300
  },
  {
    name: 'Homunculus Nebula and Eta Carinae A/B', shortName: 'Homunculus + Eta Car A/B', ra: 161.265, dec: -59.684167, distance: 7500,
    constellation: 'Carina · inside NGC 3372', type: 'Bipolar ejecta nebula and massive binary system', format: 'volume', colour: 0xffad62,
    description: 'The roughly 0.7-light-year Homunculus lies inside the much larger Carina Nebula and surrounds the highly eccentric 5.5-year binary Eta Carinae. Its shell uses the observation-based ESO/VLT reconstruction by Steffen and collaborators, including asymmetric polar trenches, openings, and equatorial protrusions. Eta Carinae A is about 90 solar masses and its hot companion, Eta Carinae B, about 30 solar masses. Their true orbital separation is far below the scale of this map, so only their navigation markers are deliberately separated and enlarged.',
    sourceUrl: 'https://www.eso.org/public/products/models3d/3dmodel_004/', modelSource: 'ESO VLT/X-Shooter observations', representation: 'Observation-based ESO/VLT 3D shell with enlarged binary markers', volumeShape: 'eta', displayScale: [4.25, 8.0, 3.8], physicalSizeLy: 0.7
  },
  {
    name: 'Sagittarius A* (Sgr A*)', shortName: 'Sagittarius A*', ra: 266.41683, dec: -29.00781, distance: 26700,
    constellation: 'Sagittarius · Galactic Centre', type: 'Supermassive black hole · ≈ 4.15 million M☉', format: 'procedural', colour: 0xffb06b,
    description: 'The supermassive black hole at the centre of the Milky Way. Its event horizon is far too small to show at this map scale, so the close view is intentionally enlarged. On approach, an orbitable WebGPU raymarcher bends light through a Schwarzschild-like field, revealing the far side of the hot disk, turbulent orbital structure, Doppler beaming, stars, and faint background gas.',
    sourceUrl: 'https://www.eso.org/sci/publications/messenger/archive/no.177-sep19/messenger-no177-25-35.pdf', sourceLabel: 'Open ESO scientific reference →', modelSource: 'ESO/GRAVITY and EHT measurements', representation: 'Orbitable 32-step WebGPU relativistic raymarching', volumeShape: 'sagittarius-a', displayScale: [6, 6, 6], physicalSizeLy: 0.000005
  }
];

const volumeMaterials = [];
const blackHoleObjects = [];

const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const catalogue = STARS.filter(star =>
  Number.isFinite(Number(star.ra)) && Number.isFinite(Number(star.dec)) &&
  Number.isFinite(Number(star.distance)) && Number(star.distance) >= 0
);

let renderer;
let labelRenderer;
let scene;
let camera;
let orbit;
let planeGrid;
let universeAxis;
let directionGroup;
let galacticCentreGuide;
let earthGuideGroup;
let selected = catalogue.find(star => /^(sun|sol)/i.test(star.name)) || catalogue[0];
let scaleMode = 'compressed';
let animationFrame;
let isAnimating = false;
let flight = null;
let sagittariusAVisualizer = null;
let milkyWay = null;
let milkyWayLoadPromise = null;
let galaxyOverviewActive = false;
let backgroundStars = null;
let qualityMode = localStorage.getItem('space-safari-quality-mode') || 'auto';
let activeQuality = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 ? 'low' : 'medium';
let qualityFrameTotal = 0;
let qualityFrameCount = 0;
let qualityWindowStarted = performance.now();
let lastQualityFrameTime = performance.now();
let slowQualityWindows = 0;
let fastQualityWindows = 0;
const starObjects = [];
const nebulaObjects = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function spectralLetter(star) {
  return String(star.spectralClass || '').match(/[OBAFGKMD]/i)?.[0]?.toUpperCase() || '?';
}

function starColour(star) {
  const temperature = Number(star.temperature);
  if (temperature >= 30000) return 0x759bff;
  if (temperature >= 10000) return 0xa7c2ff;
  if (temperature >= 7500) return 0xeef4ff;
  if (temperature >= 6000) return 0xfff2c7;
  if (temperature >= 5000) return 0xffdc91;
  if (temperature >= 3800) return 0xffad64;
  return 0xff745e;
}

function physicalPosition(star) {
  if (/^(sun|sol)/i.test(star.name)) return new THREE.Vector3(0, 0, 0);
  const ra = THREE.MathUtils.degToRad(Number(star.ra));
  const dec = THREE.MathUtils.degToRad(Number(star.dec));
  const distance = Number(star.distance);
  return new THREE.Vector3(
    distance * Math.cos(dec) * Math.cos(ra),
    distance * Math.sin(dec),
    -distance * Math.cos(dec) * Math.sin(ra)
  );
}

function physicalPositionForCoordinates(raDegrees, decDegrees, distance) {
  const ra = THREE.MathUtils.degToRad(raDegrees);
  const dec = THREE.MathUtils.degToRad(decDegrees);
  return new THREE.Vector3(
    distance * Math.cos(dec) * Math.cos(ra),
    distance * Math.sin(dec),
    -distance * Math.cos(dec) * Math.sin(ra)
  );
}

function directionFromRaDec(raDegrees, decDegrees) {
  const ra = THREE.MathUtils.degToRad(raDegrees);
  const dec = THREE.MathUtils.degToRad(decDegrees);
  return new THREE.Vector3(
    Math.cos(dec) * Math.cos(ra),
    Math.sin(dec),
    -Math.cos(dec) * Math.sin(ra)
  ).normalize();
}

function createDirectionArrow(name, detail, ra, dec, colour, parent = directionGroup, length = 72) {
  const direction = directionFromRaDec(ra, dec);
  const arrow = new THREE.ArrowHelper(direction, new THREE.Vector3(), length, colour, 4, 2);
  arrow.line.material.transparent = true;
  arrow.line.material.opacity = .58;
  arrow.line.material.depthWrite = false;
  arrow.cone.material.transparent = true;
  arrow.cone.material.opacity = .8;
  arrow.cone.material.depthWrite = false;
  parent.add(arrow);

  const labelElement = document.createElement('span');
  labelElement.className = 'universe-direction-label';
  labelElement.innerHTML = `<strong>${name}</strong><small>${detail}</small>`;
  const label = new CSS2DObject(labelElement);
  label.position.copy(direction.clone().multiplyScalar(length + 4));
  parent.add(label);
  return { arrow, label, direction };
}

function updateGalacticCentreGuide() {
  if (!galacticCentreGuide) return;
  const centre = NEBULAE.find(object => object.volumeShape === 'sagittarius-a');
  const physical = centre?.physicalPosition || physicalPositionForCoordinates(266.41683, -29.00781, 26700);
  const direction = physical.clone().normalize();
  const length = displayDistance(physical.length());
  galacticCentreGuide.arrow.setDirection(direction);
  galacticCentreGuide.arrow.setLength(length, Math.min(4, Math.max(.9, length * .055)), Math.min(2, Math.max(.55, length * .03)));
  galacticCentreGuide.label.position.copy(direction.multiplyScalar(length));
}

function linearGuideDistances(maximum) {
  // In linear mode every ring represents the same physical interval, making
  // proportional distance visually unambiguous across the galactic view.
  return Array.from({ length: 20 }, (_, index) => (index + 1) * 1000)
    .filter(distance => distance < maximum * .98);
}

function clearEarthGuide() {
  if (!earthGuideGroup) return;
  earthGuideGroup.traverse(child => {
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) child.material.forEach(material => material.dispose?.());
    else child.material?.dispose?.();
  });
  earthGuideGroup.clear();
}

function createDistanceRing(distance, colour = 0x4d91c9, labelAngle = 0) {
  const radius = displayDistance(distance);
  const points = [];
  for (let index = 0; index < 128; index++) {
    const angle = index / 128 * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: colour, transparent: true, opacity: .38, depthWrite: false });
  earthGuideGroup.add(new THREE.LineLoop(geometry, material));

  const labelElement = document.createElement('span');
  labelElement.className = 'universe-scale-label';
  labelElement.textContent = `${integer.format(Math.round(distance))} ly`;
  const label = new CSS2DObject(labelElement);
  label.position.set(Math.cos(labelAngle) * radius, .12, Math.sin(labelAngle) * radius);
  earthGuideGroup.add(label);
}

function updateEarthGuide() {
  if (!earthGuideGroup) return;
  clearEarthGuide();
  const maximum = maximumDistance();
  const outerRadius = displayDistance(maximum);
  const disk = new THREE.Mesh(
    new THREE.CircleGeometry(outerRadius, 128),
    new THREE.MeshBasicMaterial({ color: 0x367bb6, transparent: true, opacity: .025, side: THREE.DoubleSide, depthWrite: false })
  );
  disk.rotation.x = -Math.PI / 2;
  earthGuideGroup.add(disk);

  const ringDistances = scaleMode === 'linear'
    ? linearGuideDistances(maximum)
    : [1, 10, 100, 1000, 5000, 10000].filter(distance => distance < maximum * .98);
  ringDistances.forEach((distance, index) => {
    const labelAngle = scaleMode === 'linear' ? (index % 4) * Math.PI / 2 : 0;
    createDistanceRing(distance, index === ringDistances.length - 1 ? 0x70baff : 0x3f739f, labelAngle);
  });

  const equatorLabelElement = document.createElement('span');
  equatorLabelElement.className = 'universe-scale-label equator-label';
  equatorLabelElement.textContent = 'Earth’s equator extended into space';
  const equatorLabel = new CSS2DObject(equatorLabelElement);
  equatorLabel.position.set(-outerRadius * .72, .15, outerRadius * .68);
  earthGuideGroup.add(equatorLabel);

  createDirectionArrow(
    'Polaris · north from Earth',
    'toward the north celestial pole',
    37.95456067,
    89.26410897,
    0xa8d7ff,
    earthGuideGroup,
    Math.max(34, outerRadius * .86)
  );
  earthGuideGroup.visible = controlsUi.earthGuide.checked;
}

function displayDistance(distance) {
  if (distance <= 0.001) return 0;
  if (scaleMode === 'linear') {
    // Keep the chosen linear volume readable while preserving proportional distances.
    return distance * (80 / maximumDistance());
  }
  return 30 * Math.log10(1 + distance);
}

function displayPosition(star) {
  const physical = star.physicalPosition;
  if (physical.lengthSq() === 0) return new THREE.Vector3();
  return physical.clone().normalize().multiplyScalar(displayDistance(Number(star.distance)));
}

function displayPositionForObject(object) {
  if (object.physicalPosition.lengthSq() === 0) return new THREE.Vector3();
  return object.physicalPosition.clone().normalize().multiplyScalar(displayDistance(Number(object.distance)));
}

function createStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(.14, 'rgba(255,255,255,1)');
  gradient.addColorStop(.28, 'rgba(255,255,255,.93)');
  gradient.addColorStop(.38, 'rgba(255,255,255,.34)');
  gradient.addColorStop(.47, 'rgba(255,255,255,.06)');
  gradient.addColorStop(.54, 'rgba(255,255,255,0)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function markerSize(star) {
  if (/^(sun|sol)/i.test(star.name)) return scaleMode === 'linear' ? .2 : 5.2;
  const magnitude = Number.isFinite(Number(star.magnitude)) ? Number(star.magnitude) : 5;
  const size = THREE.MathUtils.clamp(3.5 + (3 - magnitude) * .35, 2.4, 5.4);
  return scaleMode === 'linear' ? size * .055 : size;
}

function buildScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02050b, .0017);
  scene.add(new THREE.HemisphereLight(0xbcd8ff, 0x24131d, 2.2));
  const modelLight = new THREE.DirectionalLight(0xffffff, 2.8);
  modelLight.position.set(80, 110, 60);
  scene.add(modelLight);
  camera = new THREE.PerspectiveCamera(50, 1, .001, 7000);
  camera.position.set(70, 48, 105);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x010207, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.append(renderer.domElement);

  sagittariusAVisualizer = createSagittariusAVisualizer(stage);

  labelRenderer = new CSS2DRenderer();
  labelRenderer.domElement.className = 'universe-label-layer';
  stage.append(labelRenderer.domElement);

  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.dampingFactor = .075;
  orbit.minDistance = .004;
  orbit.maxDistance = 3000;
  orbit.target.set(0, 0, 0);

  const axesMaterial = new THREE.LineBasicMaterial({ color: 0x35557d, transparent: true, opacity: .32 });
  const axisGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -125, 0), new THREE.Vector3(0, 125, 0)]);
  universeAxis = new THREE.Line(axisGeometry, axesMaterial);
  scene.add(universeAxis);

  planeGrid = new THREE.GridHelper(240, 12, 0x31567f, 0x1b2a40);
  planeGrid.material.transparent = true;
  planeGrid.material.opacity = .24;
  scene.add(planeGrid);

  directionGroup = new THREE.Group();
  directionGroup.name = 'Milky Way directions';
  scene.add(directionGroup);
  galacticCentreGuide = createDirectionArrow('Galactic Centre', 'Sagittarius A* · Milky Way centre', 266.41683, -29.00781, 0xffb45f);
  createDirectionArrow('North Galactic Pole', 'perpendicular to the galactic plane', 192.8595, 27.1283, 0x76c8ff);

  earthGuideGroup = new THREE.Group();
  earthGuideGroup.name = 'Earth orientation and distance scale';
  scene.add(earthGuideGroup);
  updateEarthGuide();

  const texture = createStarTexture();
  catalogue.forEach(star => {
    star.physicalPosition = physicalPosition(star);
    const material = new THREE.SpriteMaterial({
      map: texture,
      color: starColour(star),
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.setScalar(markerSize(star));
    sprite.position.copy(displayPosition(star));
    sprite.userData.star = star;
    scene.add(sprite);

    const labelElement = document.createElement('span');
    labelElement.className = 'universe-star-label';
    labelElement.textContent = star.name === 'Sun (Sol)' ? 'Sun' : star.name;
    const label = new CSS2DObject(labelElement);
    label.position.set(0, 0, 0);
    sprite.add(label);

    starObjects.push({ star, sprite, label, labelElement });
  });

  const background = new THREE.BufferGeometry();
  const backgroundPositions = [];
  for (let index = 0; index < 1400; index++) {
    const direction = new THREE.Vector3().randomDirection().multiplyScalar(620 + Math.random() * 260);
    backgroundPositions.push(direction.x, direction.y, direction.z);
  }
  background.setAttribute('position', new THREE.Float32BufferAttribute(backgroundPositions, 3));
  backgroundStars = new THREE.Points(background, new THREE.PointsMaterial({ color: 0x6f82a8, size: 1.05, transparent: true, opacity: .5, sizeAttenuation: false }));
  scene.add(backgroundStars);
}

function normaliseModel(model, targetSize = 9) {
  const bounds = new THREE.Box3().setFromObject(model);
  const centre = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const largest = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetSize / largest;
  model.scale.multiplyScalar(scale);
  model.position.copy(centre).multiplyScalar(-scale);
  model.traverse(child => {
    if (!child.isMesh) return;
    child.castShadow = false;
    child.receiveShadow = false;
    const hadMaterialArray = Array.isArray(child.material);
    const materials = hadMaterialArray ? child.material : [child.material];
    child.material = materials.map(material => {
      const brighter = material.clone();
      if (brighter.color && brighter.emissive) {
        brighter.emissive.copy(brighter.color).multiplyScalar(.28);
        brighter.emissiveIntensity = 1.25;
      }
      return brighter;
    });
    if (!hadMaterialArray) child.material = child.material[0];
  });
  return model;
}

function createDiffuseNebulaVolume(nebula) {
  const uniforms = {
    uTime: { value: 0 },
    uCameraLocal: { value: new THREE.Vector3() },
    uMaxSteps: { value: activeQuality === 'high' ? 58 : activeQuality === 'low' ? 26 : 42 },
    uShape: { value: nebula.volumeShape === 'ring' ? 1 : nebula.volumeShape === 'cluster' ? 2 : nebula.volumeShape === 'dumbbell' ? 3 : nebula.volumeShape === 'rho' ? 4 : nebula.volumeShape === 'crab' ? 5 : nebula.volumeShape === 'carina' ? 7 : nebula.volumeShape === 'northamerica' ? 8 : nebula.volumeShape === 'owl' ? 9 : nebula.volumeShape === 'helix' ? 10 : nebula.volumeShape === 'vela' ? 11 : nebula.volumeShape === 'crescent' ? 12 : nebula.volumeShape === 'elephant' ? 13 : 0 }
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    blending: THREE.NormalBlending,
    vertexShader: `
      varying vec3 vLocalPosition;
      void main() {
        vLocalPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec3 vLocalPosition;
      uniform vec3 uCameraLocal;
      uniform float uTime;
      uniform int uShape;
      uniform int uMaxSteps;

      float hash(vec3 p) {
        p = fract(p * .1031);
        p += dot(p, p.yzx + 33.33);
        return fract((p.x + p.y) * p.z);
      }
      float noise(vec3 p) {
        vec3 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                       mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                   mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                       mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
      }
      float fbm(vec3 p) {
        float value = 0.0, amplitude = .55;
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(p);
          p = p * 2.03 + vec3(7.1, 3.4, 5.8);
          amplitude *= .5;
        }
        return value;
      }
      float densityAt(vec3 p) {
        if (uShape == 1) {
          float majorRadius = .52;
          float torusDistance = length(vec2(length(p.xy) - majorRadius, p.z * 1.35));
          float brokenRing = fbm(p * 8.5 + vec3(1.7, 4.2, 2.3));
          float ring = smoothstep(.25, .035, torusDistance) * smoothstep(.24, .62, brokenRing);
          float innerGas = smoothstep(.72, .08, length(p * vec3(.9, .9, 1.5))) * .17;
          float halo = smoothstep(1.0, .48, length(p)) * smoothstep(.48, .78, fbm(p * 4.2)) * .18;
          return ring + innerGas + halo;
        }
        if (uShape == 2) {
          vec3 stretched = p * vec3(.72, 1.25, 1.05);
          float broadCloud = smoothstep(1.0, .2, length(stretched));
          float wisps = smoothstep(.47, .76, fbm(p * 5.1 + vec3(p.y * 1.8, 1.2, p.x * 1.4)));
          float lanes = .55 + .45 * sin((p.x + p.y * .38) * 15.0 + fbm(p * 6.0) * 5.0);
          return broadCloud * wisps * lanes * .72;
        }
        if (uShape == 3) {
          float upper = length((p - vec3(0.0,.2,0.0)) * vec3(1.14,1.0,1.1));
          float lower = length((p + vec3(0.0,.2,0.0)) * vec3(1.14,1.0,1.1));
          float lobes = max(smoothstep(.76,.2,upper), smoothstep(.76,.2,lower));
          float hollow = smoothstep(.12,.4,length(p * vec3(1.15,.72,1.15)));
          float knots = smoothstep(.33,.73,fbm(p * 7.4 + vec3(4.1,1.3,6.2)));
          float envelope = smoothstep(1.0,.46,length(p * vec3(.92,.72,1.05))) * .2;
          return lobes * hollow * (.42 + knots * .8) + envelope;
        }
        if (uShape == 4) {
          float blueCloud = smoothstep(.72,.13,length((p - vec3(-.3,.12,.03)) * vec3(.92,1.35,1.05)));
          float amberCloud = smoothstep(.78,.16,length((p - vec3(.34,-.08,.06)) * vec3(.78,1.2,1.0)));
          float streamer = smoothstep(.3,.045,abs(p.y + p.x * .34 + .06)) * smoothstep(.95,.1,length(p.xz));
          float textureNoise = smoothstep(.34,.74,fbm(p * 6.2 + vec3(5.2,1.1,3.7)));
          float darkLane = smoothstep(.13,.34,abs(p.y - p.x * .18 + .04));
          float envelope = smoothstep(1.0,.28,length(p * vec3(.72,1.18,1.0)));
          return (blueCloud * .68 + amberCloud * .72 + streamer * .36) * textureNoise * darkLane * envelope;
        }
        if (uShape == 5) {
          vec3 q = p * vec3(.78,1.02,1.08);
          float envelope = smoothstep(1.0,.13,length(q));
          float shell = smoothstep(.96,.55,length(q)) * smoothstep(.16,.62,length(q));
          float coarse = fbm(p * 4.8 + vec3(2.7,5.1,1.4));
          float fine = fbm(p * 13.0 - vec3(4.0,1.5,3.0));
          float filaments = smoothstep(.48,.76,coarse * .68 + fine * .48);
          float core = smoothstep(.52,.05,length(p * vec3(.9,1.2,1.2))) * .32;
          return envelope * shell * filaments + core;
        }
        if (uShape == 7) {
          vec3 broad = p * vec3(.72,1.0,1.16);
          float envelope = smoothstep(1.0,.14,length(broad));
          float cavityA = smoothstep(.42,.12,length((p - vec3(-.24,.08,.08)) * vec3(.8,1.1,1.0)));
          float cavityB = smoothstep(.35,.1,length((p - vec3(.3,-.18,-.04)) * vec3(1.0,.8,1.2)));
          float billows = smoothstep(.28,.72,fbm(p * 4.6 + vec3(2.2,5.4,1.1)));
          float fineClouds = smoothstep(.38,.74,fbm(p * 10.5 - vec3(4.0,1.7,3.3)));
          float dustLane = smoothstep(.07,.24,abs(p.y + p.x * .22 - .03));
          return envelope * (billows * .7 + fineClouds * .4) * dustLane * (1.0 - cavityA * .35 - cavityB * .25);
        }
        if (uShape == 8) {
          vec3 q = p * vec3(.78,.68,1.72);
          float mainCloud = smoothstep(1.0,.16,length(q));
          float northernCloud = smoothstep(.7,.12,length((p - vec3(-.08,.34,.0)) * vec3(.82,1.02,1.75)));
          float easternCloud = smoothstep(.58,.1,length((p - vec3(.34,.04,.02)) * vec3(1.0,.88,1.8)));
          float southernCloud = smoothstep(.48,.08,length((p - vec3(.18,-.48,-.02)) * vec3(1.25,.72,1.9)));
          float continentalBody = max(mainCloud * .72, max(northernCloud, max(easternCloud, southernCloud * .72)));
          float gulf = smoothstep(.42,.09,length((p - vec3(-.08,-.28,.12)) * vec3(.82,1.1,1.6)));
          float atlanticEdge = smoothstep(.16,.035,abs(p.x + .47 + p.y * .18)) * smoothstep(.82,.12,length(p.yz));
          float textureNoise = smoothstep(.3,.74,fbm(p * 6.4 + vec3(2.6,5.0,1.7)));
          float fine = smoothstep(.4,.72,fbm(p * 12.0 - vec3(4.1,1.2,3.6)));
          float depthFade = smoothstep(.64,.05,abs(p.z));
          return max(0.0, continentalBody - gulf * .78) * (textureNoise * .8 + fine * .32) * depthFade + atlanticEdge * .08;
        }
        if (uShape == 9) {
          vec3 q = p * vec3(.94,1.0,1.08);
          float radius = length(q);
          float innerShell = smoothstep(.82,.48,radius) * smoothstep(.24,.5,radius);
          float outerShell = smoothstep(1.0,.77,radius) * smoothstep(.58,.8,radius) * .42;
          float halo = smoothstep(1.03,.72,radius) * .12;
          float eyeA = smoothstep(.3,.13,length((p - vec3(-.27,.08,.0)) * vec3(1.0,1.0,.48)));
          float eyeB = smoothstep(.3,.13,length((p - vec3(.27,.08,.0)) * vec3(1.0,1.0,.48)));
          float eyes = max(eyeA, eyeB);
          float mottling = .48 + .68 * smoothstep(.25,.78,fbm(p * 7.2 + vec3(3.2,1.7,5.1)));
          float rimKnots = smoothstep(.4,.75,fbm(p * 12.0 - vec3(1.4,4.8,2.2)));
          return max(0.0, (innerShell * mottling + outerShell * (.55 + rimKnots * .45) + halo) * (1.0 - eyes * .88));
        }
        if (uShape == 10) {
          float radial = length(p.xy);
          float barrelWall = smoothstep(.27,.08,abs(radial - .55)) * smoothstep(.8,.22,abs(p.z));
          float flaredEnds = smoothstep(.3,.07,abs(radial - (.58 + abs(p.z) * .22))) * smoothstep(.92,.3,abs(p.z)) * .52;
          float outerEnvelope = smoothstep(1.02,.68,length(p * vec3(.92,.92,.72))) * smoothstep(.58,.82,radial) * .22;
          float angle = atan(p.y,p.x);
          float spokes = .45 + .55 * smoothstep(.18,.78,noise(vec3(angle * 3.2,radial * 13.0,p.z * 5.0)));
          float knots = .48 + .72 * smoothstep(.4,.76,fbm(p * 12.5 + vec3(2.0,5.1,1.4)));
          float hollowCore = smoothstep(.18,.34,radial);
          return (barrelWall * spokes * knots + flaredEnds * knots + outerEnvelope) * hollowCore;
        }
        if (uShape == 11) {
          vec3 q = p * vec3(.96,1.0,1.04);
          float radius = length(q);
          float distortedRadius = radius + (fbm(p * 3.2 + vec3(1.7,4.1,2.3)) - .5) * .1;
          float shock = smoothstep(.115,.025,abs(distortedRadius - .78));
          float broadXrayShell = smoothstep(.22,.055,abs(distortedRadius - .72)) * .2;
          float largeBreaks = smoothstep(.37,.67,fbm(p * 4.8 + vec3(5.2,1.4,3.8)));
          float fineThreads = smoothstep(.5,.76,fbm(p * 15.0 - vec3(2.1,5.0,1.7)));
          float sweptFilaments = .45 + .55 * abs(sin(atan(p.y,p.x) * 9.0 + p.z * 10.0 + fbm(p * 7.0) * 4.0));
          float hotInterior = smoothstep(.69,.12,radius) * smoothstep(.46,.75,fbm(p * 5.4)) * .075;
          float shrapnelA = smoothstep(.18,.035,length((p - vec3(-.74,.48,.03)) * vec3(.7,1.5,1.15))) * .48;
          float shrapnelD = smoothstep(.2,.04,length((p - vec3(.58,-.64,-.04)) * vec3(1.4,.72,1.12))) * .42;
          return shock * largeBreaks * (fineThreads * .85 + sweptFilaments * .38) + broadXrayShell * largeBreaks + hotInterior + shrapnelA + shrapnelD;
        }
        if (uShape == 12) {
          vec3 q = (p - vec3(.06,-.02,.0)) * vec3(.8,1.05,.94);
          float radius = length(q);
          float warpedRadius = radius + (fbm(p * 4.0 + vec3(2.4,5.1,1.3)) - .5) * .105;
          float thinSkin = smoothstep(.105,.025,abs(warpedRadius - .76));
          float compressedShell = smoothstep(.19,.045,abs(warpedRadius - .66));
          float angle = atan(q.y,q.x);
          float crescentArc = .18 + .82 * smoothstep(-.52,.72,sin(angle + .72));
          float rupturedEdge = smoothstep(.34,.7,fbm(p * 6.2 - vec3(4.0,1.6,3.1)));
          float filamentNet = smoothstep(.45,.77,fbm(p * 15.5 + vec3(1.3,4.7,2.2)));
          float folds = .42 + .58 * abs(sin(angle * 7.0 + p.z * 13.0 + fbm(p * 8.0) * 4.5));
          float hotBubble = smoothstep(.61,.12,radius) * smoothstep(.37,.72,fbm(p * 5.0)) * .09;
          float blowout = smoothstep(.3,.06,length((p - vec3(.72,.18,.02)) * vec3(.62,1.35,1.0))) * .32;
          return thinSkin * (.3 + rupturedEdge * .7) + compressedShell * crescentArc * (filamentNet * .9 + folds * .42) + hotBubble + blowout;
        }
        if (uShape == 13) {
          vec3 q = p * vec3(.82,.84,1.72);
          float hiiEnvelope = smoothstep(1.0,.12,length(q));
          float billows = smoothstep(.27,.7,fbm(p * 5.1 + vec3(2.7,4.3,1.2)));
          float fineClouds = smoothstep(.39,.75,fbm(p * 11.5 - vec3(4.1,1.8,3.0)));

          // IC 1396A sits well off-centre: a broad curled head on the right
          // tapers down and left into the long sinuous trunk seen from Earth.
          float trunkA = length((p - vec3(.58,-.08,.04)) * vec3(2.0,2.4,2.8));
          float trunkB = length((p - vec3(.48,-.23,.03)) * vec3(2.7,2.15,3.0));
          float trunkC = length((p - vec3(.38,-.38,.01)) * vec3(3.2,2.2,3.3));
          float trunkD = length((p - vec3(.27,-.52,-.01)) * vec3(3.8,2.45,3.6));
          float trunkE = length((p - vec3(.13,-.63,-.03)) * vec3(4.8,3.0,4.0));
          float trunkDistance = min(min(trunkA,trunkB),min(min(trunkC,trunkD),trunkE));
          float darkGlobule = smoothstep(.3,.12,trunkDistance);
          float brightRim = smoothstep(.38,.24,trunkDistance) * smoothstep(.1,.23,trunkDistance);
          float compressedHead = smoothstep(.3,.07,length((p - vec3(.6,-.06,.04)) * vec3(1.25,1.45,1.3)));
          float centralCavity = smoothstep(.28,.08,length((p - vec3(-.18,-.08,.02)) * vec3(.8,1.15,1.8)));
          float upperLane = smoothstep(.12,.025,abs(p.y - .48 - p.x * .24)) * smoothstep(.82,.18,length(p.xz));
          float depthFade = smoothstep(.7,.06,abs(p.z));
          float glowingGas = hiiEnvelope * (.2 + billows * .58 + fineClouds * .2) * (1.0 - darkGlobule * .97) * (1.0 - centralCavity * .46) * (1.0 - upperLane * .32);
          return (glowingGas + brightRim * (.16 + fineClouds * .12) + compressedHead * .045) * depthFade;
        }
        vec3 q = vec3(p.x * .78, p.y * 1.12, p.z * .9);
        float envelope = smoothstep(1.0, .18, length(q));
        float cavity = smoothstep(.12, .55, length((p - vec3(-.18,.08,.04)) * vec3(1.0,1.35,1.0)));
        float folds = fbm(p * 3.15 + vec3(0.0, 0.0, uTime * .006));
        float filament = fbm(p * 7.0 - vec3(2.0, 1.0, 3.0));
        return envelope * cavity * smoothstep(.37, .82, folds * .78 + filament * .34);
      }
      void main() {
        vec3 rayDirection = normalize(vLocalPosition - uCameraLocal);
        vec3 samplePoint = vLocalPosition;
        vec4 accumulated = vec4(0.0);
        const float stepSize = .037;
        for (int i = 0; i < 58; i++) {
          if (i >= uMaxSteps) break;
          if (length(samplePoint) > 1.03 && i > 2) break;
          float density = densityAt(samplePoint);
          float warm = smoothstep(-.45, .65, samplePoint.y + noise(samplePoint * 2.2));
          vec3 colour = uShape == 1
            ? mix(vec3(.08,.72,.78), vec3(1.0,.24,.18), smoothstep(.42,.82,length(samplePoint.xy)))
            : uShape == 2
              ? mix(vec3(.08,.22,.72), vec3(.56,.82,1.0), warm)
              : uShape == 3
                ? mix(vec3(.12,.78,.84), vec3(.95,.2,.18), smoothstep(.38,.9,length(samplePoint)))
                : uShape == 4
                  ? mix(vec3(.18,.38,.92), vec3(1.0,.48,.12), smoothstep(-.3,.45,samplePoint.x + noise(samplePoint * 3.0) * .24))
                  : uShape == 5
                    ? mix(vec3(.15,.45,.95), vec3(1.0,.3,.12), smoothstep(.18,.82,length(samplePoint)))
                    : uShape == 7
                      ? mix(vec3(.12,.42,.72), vec3(.95,.25,.16), smoothstep(-.45,.55,samplePoint.x + noise(samplePoint * 2.4) * .35))
                      : uShape == 8
                        ? mix(vec3(.18,.58,.75), vec3(1.0,.2,.18), smoothstep(-.55,.48,samplePoint.x + noise(samplePoint * 3.0) * .3))
                        : uShape == 9
                          ? mix(vec3(.12,.68,.7), vec3(.62,.9,.72), smoothstep(.28,.9,length(samplePoint)))
                          : uShape == 10
                            ? mix(vec3(.08,.67,.78), vec3(1.0,.24,.16), smoothstep(.43,.88,length(samplePoint.xy)))
                            : uShape == 11
                              ? mix(vec3(.1,.55,.9), vec3(1.0,.2,.12), smoothstep(-.55,.62,samplePoint.y + noise(samplePoint * 4.0) * .35))
                              : uShape == 12
                                ? mix(vec3(.08,.7,.82), vec3(1.0,.22,.16), smoothstep(-.42,.58,samplePoint.y + noise(samplePoint * 4.2) * .32))
                                : uShape == 13
                                  ? mix(vec3(.42,.07,.09), vec3(1.0,.38,.34), smoothstep(-.52,.6,samplePoint.x + noise(samplePoint * 3.7) * .34))
                                : mix(vec3(.12,.28,.82), vec3(1.0,.28,.18), warm);
          colour = mix(colour, vec3(.76,.91,1.0), pow(density, 2.2) * .55);
          float alpha = density * (uShape == 4 ? .16 : uShape == 11 ? .075 : .095) * (1.0 - accumulated.a);
          accumulated.rgb += colour * alpha;
          accumulated.a += alpha;
          samplePoint += rayDirection * stepSize;
        }
        accumulated.rgb += vec3(.16,.3,.75) * pow(max(0.0, 1.0 - length(vLocalPosition)), 3.0) * .12;
        if (accumulated.a < .012) discard;
        gl_FragColor = vec4(accumulated.rgb, min(accumulated.a, .82));
      }
    `
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 72, 48), material);
  mesh.scale.fromArray(nebula.displayScale || [9, 9, 9]);
  mesh.rotation.set(
    nebula.volumeShape === 'ring' ? -.48 : ['helix','elephant'].includes(nebula.volumeShape) ? 0 : -.24,
    nebula.volumeShape === 'ring' ? .22 : ['helix','elephant'].includes(nebula.volumeShape) ? 0 : .38,
    nebula.volumeShape === 'ring' ? 1.05 : ['helix','elephant'].includes(nebula.volumeShape) ? 0 : -.18
  );
  mesh.userData.volumeUniforms = uniforms;
  volumeMaterials.push({ mesh, uniforms });
  if (nebula.volumeShape === 'dumbbell') {
    const group = new THREE.Group();
    group.add(mesh);
    const centralStar = new THREE.Sprite(new THREE.SpriteMaterial({
      map: createStarTexture(), color: 0xd9efff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    centralStar.scale.setScalar(.75);
    group.add(centralStar);
    return group;
  }
  if (nebula.volumeShape === 'owl') {
    const group = new THREE.Group();
    group.add(mesh);
    const centralStar = new THREE.Sprite(new THREE.SpriteMaterial({
      map: createStarTexture(), color: 0xbdeaff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    centralStar.scale.setScalar(.5);
    centralStar.position.set(0, -.04, .12);
    group.add(centralStar);
    return group;
  }
  if (nebula.volumeShape === 'helix') {
    const group = new THREE.Group();
    group.add(mesh);
    const whiteDwarf = new THREE.Sprite(new THREE.SpriteMaterial({
      map: createStarTexture(), color: 0xc9e9ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    whiteDwarf.scale.setScalar(.55);
    group.add(whiteDwarf);
    return group;
  }
  if (nebula.volumeShape === 'rho') {
    const group = new THREE.Group();
    group.add(mesh);
    const starTexture = createStarTexture();
    const youngStars = [[-1.8,.7,.15,.66],[-.85,1.05,-.2,.5],[.1,.35,.35,.74],[1.15,-.35,-.15,.48],[2.0,.25,.22,.58],[-.2,-1.0,.1,.42]];
    youngStars.forEach(([x,y,z,size]) => {
      const star = new THREE.Sprite(new THREE.SpriteMaterial({
        map: starTexture, color: 0xffe8bd, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
      }));
      star.position.set(x,y,z);
      star.scale.setScalar(size);
      group.add(star);
    });
    return group;
  }
  if (nebula.volumeShape === 'northamerica') {
    const group = new THREE.Group();
    group.add(mesh);
    const starTexture = createStarTexture();
    const youngStars = [[-1.9,1.35,.18,.42],[-.7,2.1,-.12,.34],[.65,.95,.1,.48],[1.45,-.25,-.08,.38],[-.2,-1.6,.14,.31]];
    youngStars.forEach(([x,y,z,size]) => {
      const star = new THREE.Sprite(new THREE.SpriteMaterial({
        map: starTexture, color: 0xc8dcff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
      }));
      star.position.set(x,y,z);
      star.scale.setScalar(size);
      group.add(star);
    });
    return group;
  }
  if (nebula.volumeShape === 'crab') {
    const group = new THREE.Group();
    group.add(mesh);
    const pulsar = new THREE.Sprite(new THREE.SpriteMaterial({
      map: createStarTexture(), color: 0xbfd7ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    pulsar.scale.setScalar(.62);
    group.add(pulsar);
    return group;
  }
  if (nebula.volumeShape === 'vela') {
    const group = new THREE.Group();
    group.add(mesh);
    const pulsar = new THREE.Sprite(new THREE.SpriteMaterial({
      map: createStarTexture(), color: 0xaed4ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    pulsar.position.set(.18, -.32, .08);
    pulsar.scale.setScalar(.48);
    group.add(pulsar);
    return group;
  }
  if (nebula.volumeShape === 'crescent') {
    const group = new THREE.Group();
    group.add(mesh);
    const wr136 = new THREE.Sprite(new THREE.SpriteMaterial({
      map: createStarTexture(), color: 0xa9cfff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    wr136.position.set(.45, -.08, .12);
    wr136.scale.setScalar(.65);
    group.add(wr136);
    return group;
  }
  if (nebula.volumeShape === 'elephant') {
    const group = new THREE.Group();
    group.add(mesh);
    // The real globule is a feathered dust silhouette, not a hard opaque tube.
    // Overlapping soft sprites give it smoky, irregular edges from every view.
    const dustCanvas = document.createElement('canvas');
    dustCanvas.width = dustCanvas.height = 128;
    const dustContext = dustCanvas.getContext('2d');
    const dustGradient = dustContext.createRadialGradient(64, 64, 5, 64, 64, 62);
    dustGradient.addColorStop(0, 'rgba(0,0,0,.82)');
    dustGradient.addColorStop(.42, 'rgba(2,3,5,.55)');
    dustGradient.addColorStop(.76, 'rgba(4,6,9,.2)');
    dustGradient.addColorStop(1, 'rgba(4,6,9,0)');
    dustContext.fillStyle = dustGradient;
    dustContext.fillRect(0, 0, 128, 128);
    const dustTexture = new THREE.CanvasTexture(dustCanvas);
    const dustBlobs = [
      [7.25,-.65,.22,4.4,3.5,.22,.46],[6.35,-1.75,.18,3.2,2.55,.34,.41],
      [5.25,-3.0,.12,2.7,2.2,.42,.37],[4.2,-4.25,.04,2.35,1.9,.52,.33],
      [3.0,-5.35,-.04,2.05,1.65,.62,.29],[1.65,-6.25,-.12,1.7,1.35,.72,.25]
    ];
    dustBlobs.forEach(([x,y,z,width,height,rotation,opacity]) => {
      const dust = new THREE.Sprite(new THREE.SpriteMaterial({
        map: dustTexture, color: 0x15171b, transparent: true, opacity,
        depthWrite: false, depthTest: true, blending: THREE.NormalBlending, rotation
      }));
      dust.position.set(x,y,z);
      dust.scale.set(width,height,1);
      group.add(dust);
    });
    const starTexture = createStarTexture();
    const youngStars = [[7.0,-.2,.3,.48],[6.2,-1.5,-.18,.34],[4.9,-3.0,.12,.28],[3.4,-4.8,-.1,.24]];
    youngStars.forEach(([x,y,z,size]) => {
      const star = new THREE.Sprite(new THREE.SpriteMaterial({
        map: starTexture, color: 0xffd5a3, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
      }));
      star.position.set(x,y,z);
      star.scale.setScalar(size);
      group.add(star);
    });
    return group;
  }
  if (nebula.volumeShape !== 'cluster') return mesh;

  const group = new THREE.Group();
  group.add(mesh);
  const starTexture = createStarTexture();
  const sisters = [
    [-3.1, 1.1, .2, 1.25], [-1.5, 2.4, -.4, 1.05], [.15, 1.35, .3, 1.2],
    [1.65, 2.15, -.15, 1.0], [2.7, .45, .35, 1.15], [.7, -.65, -.5, .95], [-1.55, -.9, .45, .9]
  ];
  sisters.forEach(([x, y, z, size]) => {
    const star = new THREE.Sprite(new THREE.SpriteMaterial({
      map: starTexture, color: 0xc5dcff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    star.position.set(x, y, z);
    star.scale.setScalar(size);
    group.add(star);
  });
  return group;
}

async function createHomunculusModel(nebula) {
  const shell = await new OBJLoader().loadAsync('assets/models/eta-carinae-homunculus-eso.obj');
  const bounds = new THREE.Box3().setFromObject(shell);
  const centre = bounds.getCenter(new THREE.Vector3());
  const longestDimension = Math.max(...bounds.getSize(new THREE.Vector3()).toArray());
  shell.position.sub(centre);
  shell.scale.setScalar(16 / longestDimension);

  shell.traverse(child => {
    if (!child.isMesh) return;
    child.geometry.computeVertexNormals();
    child.material = new THREE.MeshPhysicalMaterial({
      color: 0xf0a05d,
      emissive: 0x6d2415,
      emissiveIntensity: .48,
      transparent: true,
      opacity: .42,
      roughness: .72,
      metalness: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
  });

  const group = new THREE.Group();
  group.add(shell);
  const innerShell = shell.clone(true);
  innerShell.scale.multiplyScalar(.965);
  innerShell.traverse(child => {
    if (!child.isMesh) return;
    child.material = new THREE.MeshBasicMaterial({
      color: 0x83aaff,
      transparent: true,
      opacity: .12,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  });
  group.add(innerShell);

  const starTexture = createStarTexture();
  const components = [
    { name: 'Eta Carinae A', x: -.16, size: .72, colour: 0xffe0a8 },
    { name: 'Eta Carinae B', x: .18, size: .5, colour: 0xb9d8ff }
  ];
  components.forEach(component => {
    const star = new THREE.Sprite(new THREE.SpriteMaterial({
      map: starTexture, color: component.colour, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    star.position.set(component.x, 0, .08);
    star.scale.setScalar(component.size);
    group.add(star);

    const labelElement = document.createElement('span');
    labelElement.className = 'universe-component-label';
    labelElement.textContent = component.name;
    const label = new CSS2DObject(labelElement);
    label.position.set(component.x, component.name.endsWith('A') ? .28 : -.28, .08);
    group.add(label);
  });

  // Orient the reconstructed polar axis (the OBJ's local +Z axis) on the sky.
  // Position angle is measured east of north; the south-east lobe points toward Earth.
  const ra = THREE.MathUtils.degToRad(nebula.ra);
  const dec = THREE.MathUtils.degToRad(nebula.dec);
  const lineOfSight = directionFromRaDec(nebula.ra, nebula.dec);
  const north = new THREE.Vector3(
    -Math.sin(dec) * Math.cos(ra),
    Math.cos(dec),
    Math.sin(dec) * Math.sin(ra)
  ).normalize();
  const east = new THREE.Vector3(-Math.sin(ra), 0, -Math.cos(ra)).normalize();
  const positionAngle = THREE.MathUtils.degToRad(132);
  const skyAxis = north.multiplyScalar(Math.cos(positionAngle)).add(east.multiplyScalar(Math.sin(positionAngle))).normalize();
  const tiltFromSky = THREE.MathUtils.degToRad(49);
  const polarAxis = skyAxis.multiplyScalar(Math.cos(tiltFromSky))
    .add(lineOfSight.multiplyScalar(-Math.sin(tiltFromSky)))
    .normalize();
  group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), polarAxis);
  return group;
}

function createSagittariusAModel() {
  const root = new THREE.Group();
  const marker = new THREE.Sprite(new THREE.SpriteMaterial({
    map: createStarTexture(), color: 0xffad68, transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending
  }));
  marker.scale.setScalar(5.2);
  root.add(marker);
  root.userData.blackHoleLod = { marker, active: false };
  return root;
}

async function loadNebulaModel(nebula) {
  const model = nebula.volumeShape === 'eta'
    ? await createHomunculusModel(nebula)
    : nebula.volumeShape === 'sagittarius-a'
      ? createSagittariusAModel()
      : createDiffuseNebulaVolume(nebula);

  if (nebula.volumeShape === 'helix') {
    // The barrel's local +Z axis points almost back toward the Sun. The small
    // observed tilt preserves the familiar Earth-facing oval while still
    // revealing that this is a deep tunnel when the user orbits around it.
    const ra = THREE.MathUtils.degToRad(nebula.ra);
    const dec = THREE.MathUtils.degToRad(nebula.dec);
    const towardSun = directionFromRaDec(nebula.ra, nebula.dec).negate();
    const north = new THREE.Vector3(
      -Math.sin(dec) * Math.cos(ra),
      Math.cos(dec),
      Math.sin(dec) * Math.sin(ra)
    ).normalize();
    const east = new THREE.Vector3(-Math.sin(ra), 0, -Math.cos(ra)).normalize();
    const positionAngle = THREE.MathUtils.degToRad(nebula.viewPositionAngleDeg);
    const skyTiltDirection = north.multiplyScalar(Math.cos(positionAngle))
      .add(east.multiplyScalar(Math.sin(positionAngle)))
      .normalize();
    const tilt = THREE.MathUtils.degToRad(nebula.viewTiltDeg);
    const helixAxis = towardSun.multiplyScalar(Math.cos(tilt))
      .add(skyTiltDirection.multiplyScalar(Math.sin(tilt)))
      .normalize();
    model.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), helixAxis);
  }
  if (nebula.volumeShape === 'elephant') {
    // Present the observed broad face toward Earth; orbiting still reveals the
    // shallower depth of the H II complex and the embedded globule.
    const towardSun = directionFromRaDec(nebula.ra, nebula.dec).negate();
    model.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), towardSun);
  }

  const pivot = new THREE.Group();
  pivot.add(model);
  pivot.position.copy(displayPositionForObject(nebula));
  pivot.userData.nebula = nebula;
  pivot.traverse(child => { child.userData.nebula = nebula; });

  const labelElement = document.createElement('span');
  labelElement.className = 'universe-nebula-label';
  labelElement.textContent = nebula.shortName;
  labelElement.role = 'button';
  labelElement.tabIndex = 0;
  labelElement.title = `Select ${nebula.name}`;
  labelElement.addEventListener('click', event => {
    event.stopPropagation();
    selectNebula(nebula);
  });
  labelElement.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectNebula(nebula);
    }
  });
  const label = new CSS2DObject(labelElement);
  label.position.set(0, 6, 0);
  pivot.add(label);

  nebula.physicalPosition = physicalPositionForCoordinates(nebula.ra, nebula.dec, nebula.distance);
  scene.add(pivot);
  const hitTarget = new THREE.Mesh(
    new THREE.SphereGeometry(1, 12, 8),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
  );
  hitTarget.position.copy(pivot.position);
  hitTarget.userData.nebula = nebula;
  scene.add(hitTarget);
  const item = { nebula, model: pivot, hitTarget, label, labelElement };
  nebulaObjects.push(item);
  if (nebula.volumeShape === 'sagittarius-a') {
    item.blackHoleLod = model.userData.blackHoleLod;
    blackHoleObjects.push(item);
  }
  const button = controlsUi.nebulaList.querySelector(`[data-nebula="${nebula.shortName}"]`);
  if (button) button.disabled = false;
  updateVisibleNebulae();
  return item;
}

let nebulaLoadPromise;
async function loadNebulae() {
  if (nebulaLoadPromise) return nebulaLoadPromise;
  controlsUi.nebulaStatus.textContent = `Building ${NEBULAE.length} deep-sky objects…`;
  controlsUi.nebulae.disabled = true;
  nebulaLoadPromise = Promise.allSettled(NEBULAE.map(async nebula => {
    nebula.physicalPosition = physicalPositionForCoordinates(nebula.ra, nebula.dec, nebula.distance);
    return loadNebulaModel(nebula);
  })).then(results => {
    const loaded = results.filter(result => result.status === 'fulfilled').length;
    controlsUi.nebulae.disabled = false;
    controlsUi.nebulaStatus.textContent = loaded === NEBULAE.length
      ? `${NEBULAE.length} deep-sky objects loaded`
      : `${loaded} of ${NEBULAE.length} deep-sky objects loaded`;
    controlsUi.nebulaList.hidden = loaded === 0;
    updatePositions();
    return results;
  });
  return nebulaLoadPromise;
}

function updateVisibleNebulae() {
  const maximum = maximumDistance();
  nebulaObjects.forEach(item => {
    const visible = controlsUi.nebulae.checked && item.nebula.distance <= maximum;
    item.model.visible = visible;
    item.hitTarget.visible = visible;
    item.label.visible = visible;
  });
}

function maximumDistance() {
  return 10 ** Number(controlsUi.distance.value);
}

function updateVisibleStars() {
  const maximum = maximumDistance();
  const spectral = controlsUi.spectral.value;
  const labelMagnitude = Number(controlsUi.labelMagnitude.value);
  let visible = 0;
  let visibleLabels = 0;
  starObjects.forEach(item => {
    const matchesDistance = Number(item.star.distance) <= maximum || /^(sun|sol)/i.test(item.star.name);
    const matchesSpectral = spectral === 'all' || spectralLetter(item.star) === spectral;
    item.sprite.visible = !galaxyOverviewActive && matchesDistance && matchesSpectral;
    item.label.visible = item.sprite.visible && controlsUi.labels.checked &&
      (Number(item.star.magnitude) <= labelMagnitude || item.star === selected || /^(sun|sol)/i.test(item.star.name));
    item.labelElement.classList.toggle('is-selected', item.star === selected);
    if (item.sprite.visible) visible++;
    if (item.label.visible) visibleLabels++;
  });
  controlsUi.distanceOutput.textContent = `${integer.format(Math.round(maximum))} ly`;
  controlsUi.labelMagnitude.disabled = !controlsUi.labels.checked;
  controlsUi.labelMagnitudeOutput.textContent = `${labelMagnitude > 0 ? '+' : ''}${labelMagnitude.toFixed(1)} · ${visibleLabels} names`;
  controlsUi.count.textContent = `${visible} of ${catalogue.length} stars shown`;
  updateVisibleNebulae();
}

function updatePositions() {
  starObjects.forEach(item => {
    item.sprite.position.copy(displayPosition(item.star));
    item.sprite.scale.setScalar(markerSize(item.star));
    item.sprite.material.opacity = scaleMode === 'linear' ? .92 : 1;
  });
  nebulaObjects.forEach(item => {
    item.model.position.copy(displayPositionForObject(item.nebula));
    item.hitTarget.position.copy(item.model.position);
    item.hitTarget.scale.setScalar(scaleMode === 'linear' ? 2.2 : 5);
    if (item.nebula.volumeShape === 'sagittarius-a') {
      item.model.scale.setScalar(scaleMode === 'linear' ? .65 : 1);
    } else if (scaleMode === 'linear') {
      const physicalDisplayDiameter = Number(item.nebula.physicalSizeLy) * (80 / maximumDistance());
      const navigationDiameter = Math.max(...item.nebula.displayScale) * 2;
      item.model.scale.setScalar(Math.max(.0005, physicalDisplayDiameter / navigationDiameter));
    } else {
      // The embedded Homunculus keeps its measured scale relative to the 300 ly Carina volume.
      item.model.scale.setScalar(item.nebula.volumeShape === 'eta' ? .004375 : 1);
    }
  });
  if (selected) updateSelectionLine();
  updateEarthGuide();
  updateGalacticCentreGuide();
  milkyWay?.setScaleMode(scaleMode, maximumDistance());
  updateVisibleStars();
  controlsUi.scaleNote.innerHTML = scaleMode === 'linear'
    ? `<strong>Linear distance · ${integer.format(Math.round(maximumDistance()))} ly volume</strong><span>Distances and deep-sky spans are proportional. Invisible hit areas and labels keep physically tiny objects selectable.</span>`
    : '<strong>Logarithmic distance</strong><span>Direction and distance order are preserved. Isolated deep-sky objects are enlarged; nested structures retain their relative scale.</span>';
}

let selectionLine;
function updateSelectionLine() {
  if (selectionLine) {
    scene.remove(selectionLine);
    selectionLine.geometry.dispose();
    selectionLine.material.dispose();
    selectionLine = null;
  }
  const starTarget = starObjects.find(item => item.star === selected);
  const nebulaTarget = nebulaObjects.find(item => item.nebula === selected);
  const targetPosition = starTarget?.sprite.position || nebulaTarget?.model.position;
  if (!targetPosition || targetPosition.lengthSq() === 0) return;
  const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), targetPosition.clone()]);
  const material = new THREE.LineDashedMaterial({ color: 0x74b7ff, transparent: true, opacity: .65, dashSize: 2, gapSize: 1 });
  selectionLine = new THREE.Line(geometry, material);
  selectionLine.computeLineDistances();
  scene.add(selectionLine);
}

function formatValue(value, unit, digits = 2) {
  return Number.isFinite(Number(value)) ? `${new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(Number(value))} ${unit}` : 'Unknown';
}

function setDetailLabels(labels) {
  Object.entries(labels).forEach(([key, value]) => { details.labels[key].textContent = value; });
}

function galacticStructureText(object) {
  const structure = object?.galacticStructure;
  if (!structure) return milkyWay ? 'Outside the classified model' : 'Loading Milky Way model…';
  const qualifier = /uncertain|not arm-classified|unverified|literature-supported/.test(structure.confidence)
    ? structure.confidence
    : `${structure.confidence} confidence`;
  return `${structure.label} · ${qualifier}`;
}

function updateGalacticClassifications() {
  if (!milkyWay) return;
  [...catalogue, ...NEBULAE].forEach(object => {
    if (object.physicalPosition) object.galacticStructure = milkyWay.classifyPosition(object.physicalPosition, object);
  });
  if (selected) details.galacticStructure.textContent = galacticStructureText(selected);
}

function selectStar(star, fly = false) {
  if (!star) return;
  galaxyOverviewActive = false;
  const isSun = /^(sun|sol)/i.test(star.name);
  const starDistance = Number(star.distance);
  let rangeChanged = false;
  if (Number.isFinite(starDistance) && starDistance > maximumDistance()) {
    controlsUi.distance.value = Math.min(
      Number(controlsUi.distance.max),
      Math.ceil(Math.log10(Math.max(1, starDistance)) * 100) / 100
    );
    rangeChanged = true;
  }
  if (controlsUi.spectral.value !== 'all' && controlsUi.spectral.value !== spectralLetter(star)) {
    controlsUi.spectral.value = 'all';
  }
  selected = star;
  setDetailLabels({
    distance: 'Distance', constellation: 'Constellation', spectral: 'Spectral class',
    temperature: 'Temperature', luminosity: 'Luminosity', radius: 'Radius'
  });
  details.name.textContent = isSun ? 'The Sun' : star.name;
  details.description.textContent = isSun
    ? 'Our star and the origin of this three-dimensional view.'
    : star.description || 'A star in the Space Safari stellar catalogue.';
  details.distance.textContent = isSun ? '0 ly' : formatValue(star.distance, 'ly');
  details.constellation.textContent = star.constellation || 'Not applicable';
  details.spectral.textContent = star.spectralClass || 'Unknown';
  details.temperature.textContent = formatValue(star.temperature, 'K', 0);
  details.luminosity.textContent = formatValue(star.luminosity, 'L☉');
  details.radius.textContent = formatValue(star.radius, 'R☉');
  details.galacticStructure.textContent = isSun
    ? 'Orion Spur · high confidence near the Sun'
    : galacticStructureText(star);
  details.hr.href = `hr-diagram.html?star=${encodeURIComponent(isSun ? 'Sol' : star.name)}`;
  details.hr.hidden = false;
  details.source.hidden = true;
  controlsUi.fly.textContent = 'Fly to selected star';
  controlsUi.flyHint.hidden = true;
  controlsUi.search.value = isSun ? 'Sun' : star.name;
  if (rangeChanged && scaleMode === 'linear') updatePositions();
  else {
    updateSelectionLine();
    updateVisibleStars();
  }
  if (fly) flyToStar(star);
}

function selectNebula(nebula, fly = false) {
  const item = nebulaObjects.find(candidate => candidate.nebula === nebula);
  if (!item) return;
  galaxyOverviewActive = false;
  controlsUi.nebulae.checked = true;
  if (nebula.distance > maximumDistance()) {
    controlsUi.distance.value = Math.min(
      Number(controlsUi.distance.max),
      Math.ceil(Math.log10(nebula.distance) * 100) / 100
    );
  }
  selected = nebula;
  const isBlackHole = nebula.volumeShape === 'sagittarius-a';
  setDetailLabels(isBlackHole ? {
    distance: 'Distance', constellation: 'Location', spectral: 'Object type',
    temperature: 'Scientific basis', luminosity: 'Rendering', radius: 'Event-horizon scale'
  } : {
    distance: 'Distance', constellation: 'Constellation', spectral: 'Object type',
    temperature: '3D source', luminosity: 'Representation', radius: 'Approx. physical span'
  });
  details.name.textContent = nebula.name;
  details.description.textContent = nebula.description;
  details.distance.textContent = formatValue(nebula.distance, 'ly', 0);
  details.constellation.textContent = nebula.constellation;
  details.spectral.textContent = nebula.type;
  details.temperature.textContent = nebula.modelSource || (nebula.format === 'volume' ? 'NASA visualization reference' : 'NASA 3D Resources');
  details.luminosity.textContent = nebula.representation || 'Scientific reconstruction';
  details.radius.textContent = isBlackHole ? '< 1 AU (enlarged here)' : `≈ ${number.format(nebula.physicalSizeLy)} ly`;
  details.galacticStructure.textContent = galacticStructureText(nebula);
  details.hr.hidden = true;
  details.source.href = nebula.sourceUrl;
  details.source.textContent = nebula.sourceLabel || (nebula.volumeShape === 'eta' ? 'Open ESO 3D model source →' : 'Open NASA reference →');
  details.source.hidden = false;
  controlsUi.fly.textContent = nebula.volumeShape === 'eta'
    ? 'Zoom in on Homunculus and Eta A/B'
    : isBlackHole ? 'Enter Sagittarius A* simulation' : 'Fly to selected object';
  controlsUi.flyHint.hidden = !isBlackHole;
  updatePositions();
  if (fly) flyToStar(nebula);
}

function flyToStar(star) {
  const starItem = starObjects.find(candidate => candidate.star === star);
  const nebulaItem = nebulaObjects.find(candidate => candidate.nebula === star);
  const targetObject = starItem?.sprite || nebulaItem?.model;
  if (!targetObject) return;
  const destinationTarget = targetObject.position.clone();
  const currentViewDirection = camera.position.clone().sub(orbit.target).normalize();
  const direction = ['helix', 'elephant'].includes(nebulaItem?.nebula.volumeShape)
    ? destinationTarget.clone().negate().normalize()
    : currentViewDirection;
  const etaDiameter = nebulaItem?.nebula.volumeShape === 'eta'
    ? Math.max(...nebulaItem.nebula.displayScale) * 2 * nebulaItem.model.scale.x
    : 0;
  const offset = /^(sun|sol)/i.test(star.name)
    ? 105
    : nebulaItem
      ? (nebulaItem.nebula.volumeShape === 'eta' ? Math.max(.012, etaDiameter * 1.7) : nebulaItem.nebula.volumeShape === 'sagittarius-a' ? 18 : scaleMode === 'linear' ? 5 : nebulaItem.nebula.volumeShape === 'elephant' ? 27 : 28)
      : 22;
  flight = {
    started: performance.now(),
    duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 900,
    fromTarget: orbit.target.clone(),
    toTarget: destinationTarget,
    fromCamera: camera.position.clone(),
    toCamera: destinationTarget.clone().add(direction.multiplyScalar(offset))
  };
}

function updateFlight(time) {
  if (!flight) return;
  const progress = Math.min(1, (time - flight.started) / flight.duration);
  const eased = 1 - (1 - progress) ** 3;
  orbit.target.lerpVectors(flight.fromTarget, flight.toTarget, eased);
  camera.position.lerpVectors(flight.fromCamera, flight.toCamera, eased);
  if (progress >= 1) flight = null;
}

function saveUniverseReturnState() {
  const state = {
    camera: camera.position.toArray(),
    cameraUp: camera.up.toArray(),
    target: orbit.target.toArray(),
    scaleMode,
    distance: controlsUi.distance.value,
    spectral: controlsUi.spectral.value,
    labels: controlsUi.labels.checked,
    labelMagnitude: controlsUi.labelMagnitude.value,
    plane: controlsUi.plane.checked,
    earthGuide: controlsUi.earthGuide.checked,
    directions: controlsUi.directions.checked,
    milkyWay: controlsUi.milkyWay.checked,
    milkyWayLabels: controlsUi.milkyWayLabels.checked,
    nebulae: controlsUi.nebulae.checked,
    selected: selected?.name || null
  };
  sessionStorage.setItem('space-safari-universe-return', JSON.stringify(state));
}

function restoreUniverseReturnState() {
  const raw = sessionStorage.getItem('space-safari-universe-return');
  if (!raw) return;
  sessionStorage.removeItem('space-safari-universe-return');
  try {
    const state = JSON.parse(raw);
    scaleMode = state.scaleMode === 'linear' ? 'linear' : 'compressed';
    controlsUi.scale.forEach(input => { input.checked = input.value === scaleMode; });
    controlsUi.distance.value = state.distance || '3.90';
    controlsUi.spectral.value = state.spectral || 'all';
    controlsUi.labels.checked = state.labels !== false;
    controlsUi.labelMagnitude.value = state.labelMagnitude || '1.5';
    controlsUi.plane.checked = state.plane !== false;
    controlsUi.earthGuide.checked = state.earthGuide !== false;
    controlsUi.directions.checked = state.directions !== false;
    controlsUi.milkyWay.checked = state.milkyWay !== false;
    controlsUi.milkyWayLabels.checked = state.milkyWayLabels === true;
    controlsUi.milkyWayLabels.disabled = !controlsUi.milkyWay.checked;
    controlsUi.nebulae.checked = state.nebulae !== false;
    camera.position.fromArray(state.camera);
    if (state.cameraUp) camera.up.fromArray(state.cameraUp);
    orbit.target.fromArray(state.target);
    updatePositions();
    if (controlsUi.milkyWay.checked) {
      loadMilkyWay().then(() => milkyWay?.setLabelsVisible(controlsUi.milkyWayLabels.checked));
    } else {
      milkyWay?.setVisible(false);
    }
    const restored = [...catalogue, ...NEBULAE].find(object => object.name === state.selected);
    if (restored?.volumeShape) selectNebula(restored);
    else if (restored) selectStar(restored);
  } catch (error) {
    console.warn('Could not restore the universe view.', error);
  }
}

function findStar() {
  const query = controlsUi.search.value.trim().toLowerCase();
  if (!query) return;
  const deepSkyObject = NEBULAE.find(object =>
    object.name.toLowerCase() === query || object.shortName.toLowerCase() === query ||
    object.name.toLowerCase().includes(query) || object.shortName.toLowerCase().includes(query)
  );
  if (deepSkyObject) {
    if (deepSkyObject.volumeShape === 'sagittarius-a') saveUniverseReturnState();
    selectNebula(deepSkyObject, true);
    return;
  }
  const exact = catalogue.find(star => star.name.toLowerCase() === query || (query === 'sun' && star.name === 'Sun (Sol)'));
  const partial = catalogue.find(star => star.name.toLowerCase().includes(query));
  selectStar(exact || partial, true);
}

function pointerSelection(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const starCandidates = starObjects.filter(item => item.sprite.visible).map(item => item.sprite);
  const nebulaCandidates = nebulaObjects.filter(item => item.model.visible).flatMap(item => [item.hitTarget, item.model]);
  const hit = raycaster.intersectObjects([...starCandidates, ...nebulaCandidates], true)[0];
  if (hit?.object?.userData?.star) selectStar(hit.object.userData.star);
  else if (hit?.object?.userData?.nebula) selectNebula(hit.object.userData.nebula);
}

function resize() {
  if (!renderer || !camera) return;
  const width = Math.max(1, stage.clientWidth);
  const height = Math.max(1, stage.clientHeight);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  labelRenderer.setSize(width, height);
  sagittariusAVisualizer?.resize();
}

const QUALITY_PROFILES = {
  low: { pixelRatio: .8, volumeSteps: 26, backgroundStars: 650 },
  medium: { pixelRatio: 1.2, volumeSteps: 42, backgroundStars: 1000 },
  high: { pixelRatio: 1.75, volumeSteps: 58, backgroundStars: 1400 }
};

function applyQuality(level) {
  if (!QUALITY_PROFILES[level]) return;
  activeQuality = level;
  const profile = QUALITY_PROFILES[level];
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, profile.pixelRatio));
  volumeMaterials.forEach(({ uniforms }) => { uniforms.uMaxSteps.value = profile.volumeSteps; });
  backgroundStars?.geometry.setDrawRange(0, profile.backgroundStars);
  milkyWay?.setQuality(level);
  controlsUi.qualityOutput.textContent = `${qualityMode === 'auto' ? 'Auto · ' : ''}${level[0].toUpperCase()}${level.slice(1)}`;
  resize();
}

function updateAdaptiveQuality(time) {
  const frameTime = Math.min(100, time - lastQualityFrameTime);
  lastQualityFrameTime = time;
  if (qualityMode !== 'auto') return;
  qualityFrameTotal += frameTime;
  qualityFrameCount++;
  if (time - qualityWindowStarted < 2200) return;
  const averageFrameMs = qualityFrameTotal / Math.max(1, qualityFrameCount);
  if (averageFrameMs > 24) {
    slowQualityWindows++;
    fastQualityWindows = 0;
  } else if (averageFrameMs < 18) {
    fastQualityWindows++;
    slowQualityWindows = 0;
  } else {
    slowQualityWindows = fastQualityWindows = 0;
  }
  if (slowQualityWindows >= 2 && activeQuality !== 'low') {
    applyQuality(activeQuality === 'high' ? 'medium' : 'low');
    slowQualityWindows = 0;
  } else if (fastQualityWindows >= 4 && activeQuality !== 'high') {
    applyQuality(activeQuality === 'low' ? 'medium' : 'high');
    fastQualityWindows = 0;
  }
  qualityFrameTotal = 0;
  qualityFrameCount = 0;
  qualityWindowStarted = time;
}

function updateBlackHoleLod(time) {
  let nearAnyBlackHole = false;
  blackHoleObjects.forEach(item => {
    const lod = item.blackHoleLod;
    const active = item.model.visible && camera.position.distanceTo(item.model.position) < 46;
    if (active !== lod.active) {
      lod.active = active;
      lod.marker.visible = !active;
      if (active) sagittariusAVisualizer?.show();
    }
    nearAnyBlackHole ||= active;
  });
  stage.classList.toggle('is-black-hole-near', nearAnyBlackHole);
  if (!nearAnyBlackHole) sagittariusAVisualizer?.hide();
  else sagittariusAVisualizer?.update(time);
}

function animate(time) {
  isAnimating = true;
  animationFrame = requestAnimationFrame(animate);
  updateFlight(time);
  orbit.update();
  updateAdaptiveQuality(time);
  updateBlackHoleLod(time);
  if (milkyWay?.group.visible) milkyWay.update(camera, time);
  volumeMaterials.forEach(({ mesh, uniforms }) => {
    uniforms.uTime.value = time * .001;
    uniforms.uCameraLocal.value.copy(mesh.worldToLocal(camera.position.clone()));
  });
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

function resetView() {
  flight = null;
  galaxyOverviewActive = false;
  scaleMode = 'compressed';
  controlsUi.scale.find(input => input.value === 'compressed').checked = true;
  controlsUi.distance.value = '3.90';
  controlsUi.spectral.value = 'all';
  controlsUi.labels.checked = true;
  controlsUi.labelMagnitude.value = '1.5';
  controlsUi.plane.checked = true;
  controlsUi.earthGuide.checked = true;
  controlsUi.directions.checked = true;
  controlsUi.nebulae.checked = true;
  planeGrid.visible = true;
  universeAxis.visible = true;
  earthGuideGroup.visible = true;
  directionGroup.visible = true;
  camera.up.set(0, 1, 0);
  camera.position.set(70, 48, 105);
  orbit.target.set(0, 0, 0);
  updatePositions();
  selectStar(catalogue.find(star => /^(sun|sol)/i.test(star.name)) || catalogue[0]);
}

async function prepareMilkyWayOverview() {
  galaxyOverviewActive = true;
  controlsUi.milkyWay.checked = true;
  controlsUi.milkyWayLabels.disabled = false;
  localStorage.setItem('space-safari-show-milky-way', 'true');
  // A clean face-on galaxy view: no navigation arrows, coordinate grids or
  // enlarged deep-sky markers that could be mistaken for structures or jets
  // emerging from Sagittarius A*. Every layer can still be switched back on.
  controlsUi.directions.checked = false;
  controlsUi.earthGuide.checked = false;
  controlsUi.plane.checked = false;
  controlsUi.labels.checked = false;
  controlsUi.nebulae.checked = false;
  directionGroup.visible = false;
  earthGuideGroup.visible = false;
  planeGrid.visible = false;
  universeAxis.visible = false;
  scaleMode = 'linear';
  controlsUi.scale.forEach(input => { input.checked = input.value === scaleMode; });
  controlsUi.distance.value = '5.00';
  await loadMilkyWay();
  milkyWay?.setVisible(true);
  updatePositions();

  const physical = milkyWay?.getPhysicalPosition(0, 0, 0);
  return physical ? physical.clone().normalize().multiplyScalar(displayDistance(physical.length())) : new THREE.Vector3();
}

async function viewWholeMilkyWay() {
  const centre = await prepareMilkyWayOverview();
  if (!milkyWay) return;
  const north = physicalPositionForCoordinates(192.8595, 27.1283, 1).normalize();
  const sunward = centre.clone().negate().normalize();
  camera.up.copy(sunward).negate();
  flight = {
    started: performance.now(),
    duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 950,
    fromTarget: orbit.target.clone(),
    toTarget: centre,
    fromCamera: camera.position.clone(),
    toCamera: centre.clone().add(north.multiplyScalar(190))
  };
}

async function viewMilkyWayEdgeOn() {
  const centre = await prepareMilkyWayOverview();
  if (!milkyWay) return;
  const sunward = centre.clone().negate().normalize();
  const north = physicalPositionForCoordinates(192.8595, 27.1283, 1).normalize();
  camera.up.copy(north);
  flight = {
    started: performance.now(),
    duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 950,
    fromTarget: orbit.target.clone(),
    toTarget: centre,
    fromCamera: camera.position.clone(),
    toCamera: centre.clone().add(sunward.multiplyScalar(190)).add(north.clone().multiplyScalar(.6))
  };
}

async function viewMilkyWayOblique() {
  const centre = await prepareMilkyWayOverview();
  if (!milkyWay) return;
  const north = milkyWay.getPhysicalPosition(0, 0, 1).sub(milkyWay.getPhysicalPosition(0, 0, 0)).normalize();
  const sunward = centre.clone().negate().normalize();
  camera.up.copy(north);
  flight = {
    started: performance.now(), duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 950,
    fromTarget: orbit.target.clone(), toTarget: centre,
    fromCamera: camera.position.clone(),
    toCamera: centre.clone().addScaledVector(north, 115).addScaledVector(sunward, 150)
  };
}

async function viewMilkyWayFromSun() {
  const centre = await prepareMilkyWayOverview();
  if (!milkyWay) return;
  const north = milkyWay.getPhysicalPosition(0, 0, 1).sub(milkyWay.getPhysicalPosition(0, 0, 0)).normalize();
  camera.up.copy(north);
  flight = {
    started: performance.now(), duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 950,
    fromTarget: orbit.target.clone(), toTarget: centre,
    fromCamera: camera.position.clone(), toCamera: new THREE.Vector3()
  };
}

function bindEvents() {
  if (!['auto', 'high', 'medium', 'low'].includes(qualityMode)) qualityMode = 'auto';
  controlsUi.quality.value = qualityMode;
  const searchableObjects = [
    ...catalogue.map(star => star.name === 'Sun (Sol)' ? 'Sun' : star.name),
    ...NEBULAE.map(object => object.shortName)
  ].sort((a, b) => a.localeCompare(b));
  controlsUi.list.replaceChildren(...searchableObjects.map(name => {
    const option = document.createElement('option');
    option.value = name;
    return option;
  }));
  controlsUi.nebulaList.replaceChildren(...NEBULAE.map(nebula => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = nebula.shortName;
    button.dataset.nebula = nebula.shortName;
    button.disabled = true;
    button.addEventListener('click', () => selectNebula(nebula));
    return button;
  }));
  controlsUi.find.addEventListener('click', findStar);
  stage.addEventListener('sagittarius-a-exit', resetView);
  controlsUi.search.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); findStar(); } });
  controlsUi.scale.forEach(input => input.addEventListener('change', () => {
    scaleMode = input.value;
    updatePositions();
  }));
  controlsUi.distance.addEventListener('input', () => {
    if (scaleMode === 'linear') updatePositions();
    else {
      updateEarthGuide();
      updateVisibleStars();
      milkyWay?.setScaleMode(scaleMode, maximumDistance());
    }
  });
  controlsUi.spectral.addEventListener('change', updateVisibleStars);
  controlsUi.quality.addEventListener('change', () => {
    qualityMode = controlsUi.quality.value;
    localStorage.setItem('space-safari-quality-mode', qualityMode);
    slowQualityWindows = fastQualityWindows = 0;
    applyQuality(qualityMode === 'auto'
      ? (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 ? 'low' : 'medium')
      : qualityMode);
  });
  controlsUi.labels.addEventListener('change', () => {
    if (controlsUi.labels.checked) galaxyOverviewActive = false;
    updateVisibleStars();
  });
  controlsUi.labelMagnitude.addEventListener('input', updateVisibleStars);
  controlsUi.plane.addEventListener('change', () => { planeGrid.visible = controlsUi.plane.checked; });
  controlsUi.earthGuide.addEventListener('change', () => { earthGuideGroup.visible = controlsUi.earthGuide.checked; });
  controlsUi.directions.addEventListener('change', () => { directionGroup.visible = controlsUi.directions.checked; });
  controlsUi.milkyWay.addEventListener('change', async () => {
    localStorage.setItem('space-safari-show-milky-way', String(controlsUi.milkyWay.checked));
    if (controlsUi.milkyWay.checked) await loadMilkyWay();
    milkyWay?.setVisible(controlsUi.milkyWay.checked);
    controlsUi.milkyWayLabels.disabled = !controlsUi.milkyWay.checked;
  });
  controlsUi.milkyWayLabels.addEventListener('change', () => {
    localStorage.setItem('space-safari-show-milky-way-labels', String(controlsUi.milkyWayLabels.checked));
    milkyWay?.setLabelsVisible(controlsUi.milkyWayLabels.checked);
  });
  controlsUi.viewMilkyWay.addEventListener('click', viewWholeMilkyWay);
  controlsUi.viewMilkyWayEdge.addEventListener('click', viewMilkyWayEdgeOn);
  controlsUi.viewMilkyWayOblique.addEventListener('click', viewMilkyWayOblique);
  controlsUi.viewMilkyWaySun.addEventListener('click', viewMilkyWayFromSun);
  controlsUi.galaxyStyle.addEventListener('change', () => milkyWay?.setVisualMode(controlsUi.galaxyStyle.value));
  [
    [controlsUi.galaxyReferences, 'references'],
    [controlsUi.galaxyOutlines, 'outlines'],
    [controlsUi.galaxyUncertainty, 'uncertainty']
  ].forEach(([input, layer]) => input.addEventListener('change', () => milkyWay?.setLayer(layer, input.checked)));
  controlsUi.nebulae.addEventListener('change', async () => {
    if (controlsUi.nebulae.checked) {
      controlsUi.distance.value = '3.90';
      await loadNebulae();
    }
    updatePositions();
  });
  controlsUi.reset.addEventListener('click', resetView);
  controlsUi.home.addEventListener('click', () => selectStar(catalogue.find(star => /^(sun|sol)/i.test(star.name)), true));
  controlsUi.fly.addEventListener('click', () => {
    if (selected?.volumeShape === 'sagittarius-a') saveUniverseReturnState();
    flyToStar(selected);
  });
  controlsUi.fullscreen.addEventListener('click', async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await workspace.requestFullscreen();
  });
  const setFullscreenPanel = (className, button, panelName, hidden) => {
    workspace.classList.toggle(className, hidden);
    button.setAttribute('aria-pressed', String(!hidden));
    button.textContent = `${hidden ? 'Show' : 'Hide'} ${panelName}`;
  };
  controlsUi.toggleControls.addEventListener('click', () => {
    const show = workspace.classList.contains('is-controls-hidden');
    setFullscreenPanel('is-controls-hidden', controlsUi.toggleControls, 'View controls', !show);
    if (show && matchMedia('(max-width: 680px)').matches) {
      setFullscreenPanel('is-details-hidden', controlsUi.toggleDetails, 'Selected object', true);
    }
  });
  controlsUi.toggleDetails.addEventListener('click', () => {
    const show = workspace.classList.contains('is-details-hidden');
    setFullscreenPanel('is-details-hidden', controlsUi.toggleDetails, 'Selected object', !show);
    if (show && matchMedia('(max-width: 680px)').matches) {
      setFullscreenPanel('is-controls-hidden', controlsUi.toggleControls, 'View controls', true);
    }
  });
  document.addEventListener('fullscreenchange', () => {
    const isFullscreen = document.fullscreenElement === workspace;
    controlsUi.fullscreen.textContent = isFullscreen ? 'Exit full screen' : 'Full screen';
    if (isFullscreen) {
      setFullscreenPanel('is-controls-hidden', controlsUi.toggleControls, 'View controls', false);
      setFullscreenPanel('is-details-hidden', controlsUi.toggleDetails, 'Selected object', matchMedia('(max-width: 680px)').matches);
    }
  });
  renderer.domElement.addEventListener('click', pointerSelection);
  new ResizeObserver(resize).observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
      isAnimating = false;
    } else if (!document.hidden && !isAnimating) {
      animate(performance.now());
    }
  });
}

async function loadMilkyWay() {
  if (milkyWay) return milkyWay;
  if (milkyWayLoadPromise) return milkyWayLoadPromise;
  controlsUi.milkyWayStatus.textContent = 'Building the Milky Way map on your device…';
  milkyWayLoadPromise = createMilkyWay({
    scene,
    modelUrl: new URL('../data/milky-way-model.json?v=2026.4b', import.meta.url),
    displayDistance,
    initialQuality: activeQuality
  }).then(instance => {
    milkyWay = instance;
    milkyWay.setScaleMode(scaleMode, maximumDistance());
    milkyWay.setQuality(activeQuality);
    milkyWay.setVisible(controlsUi.milkyWay.checked);
    milkyWay.setLabelsVisible(controlsUi.milkyWayLabels.checked);
    milkyWay.setVisualMode(controlsUi.galaxyStyle.value);
    milkyWay.setLayer('references', controlsUi.galaxyReferences.checked);
    milkyWay.setLayer('outlines', controlsUi.galaxyOutlines.checked);
    milkyWay.setLayer('uncertainty', controlsUi.galaxyUncertainty.checked);
    controlsUi.milkyWayStatus.innerHTML = `${instance.model.modelVersion} · observation-informed · <a href="${instance.model.sources[0].url}" target="_blank" rel="noopener">scientific sources</a> · <a href="${instance.model.credit.url}" target="_blank" rel="noopener">Dan Greenheck inspiration</a>`;
    updateGalacticClassifications();
    return instance;
  }).catch(error => {
    console.warn('Milky Way layer could not be loaded.', error);
    controlsUi.milkyWay.checked = false;
    controlsUi.milkyWayLabels.disabled = true;
    controlsUi.milkyWayStatus.textContent = 'Milky Way layer unavailable; the planetarium continues normally.';
    milkyWayLoadPromise = null;
    return null;
  });
  return milkyWayLoadPromise;
}

try {
  buildScene();
  bindEvents();
  const storedMilkyWay = localStorage.getItem('space-safari-show-milky-way');
  const storedMilkyWayLabels = localStorage.getItem('space-safari-show-milky-way-labels');
  controlsUi.milkyWay.checked = storedMilkyWay !== 'false';
  controlsUi.milkyWayLabels.checked = storedMilkyWayLabels === 'true';
  controlsUi.milkyWayLabels.disabled = !controlsUi.milkyWay.checked;
  resize();
  applyQuality(qualityMode === 'auto' ? activeQuality : qualityMode);
  resetView();
  if (controlsUi.milkyWay.checked) loadMilkyWay();
  loadNebulae().then(() => {
    updateGalacticClassifications();
    restoreUniverseReturnState();
  });
  loading.hidden = true;
  animate(performance.now());
} catch (error) {
  console.error('Could not start the 3D Universe prototype.', error);
  loading.hidden = true;
  errorPanel.hidden = false;
}
