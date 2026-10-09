import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { STARS } from '../data/astrophoto/interactive-stars.js?v=3d-prototype-1';

const stage = document.querySelector('#universe-stage');
const stageWrap = document.querySelector('#universe-stage-wrap');
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
  labels: document.querySelector('#universe-labels'),
  labelMagnitude: document.querySelector('#universe-label-magnitude'),
  labelMagnitudeOutput: document.querySelector('#universe-label-magnitude-output'),
  plane: document.querySelector('#universe-plane'),
  directions: document.querySelector('#universe-directions'),
  reset: document.querySelector('#universe-reset'),
  home: document.querySelector('#universe-home'),
  fullscreen: document.querySelector('#universe-fullscreen'),
  count: document.querySelector('#universe-count'),
  scaleNote: document.querySelector('#universe-scale-note'),
  fly: document.querySelector('#universe-fly')
};

const details = {
  name: document.querySelector('#universe-object-name'),
  description: document.querySelector('#universe-object-description'),
  distance: document.querySelector('#universe-object-distance'),
  constellation: document.querySelector('#universe-object-constellation'),
  spectral: document.querySelector('#universe-object-spectral'),
  temperature: document.querySelector('#universe-object-temperature'),
  luminosity: document.querySelector('#universe-object-luminosity'),
  radius: document.querySelector('#universe-object-radius'),
  hr: document.querySelector('#universe-hr-link')
};

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
let directionGroup;
let selected = catalogue.find(star => /^(sun|sol)/i.test(star.name)) || catalogue[0];
let scaleMode = 'compressed';
let animationFrame;
let isAnimating = false;
let flight = null;
const starObjects = [];
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

function directionFromRaDec(raDegrees, decDegrees) {
  const ra = THREE.MathUtils.degToRad(raDegrees);
  const dec = THREE.MathUtils.degToRad(decDegrees);
  return new THREE.Vector3(
    Math.cos(dec) * Math.cos(ra),
    Math.sin(dec),
    -Math.cos(dec) * Math.sin(ra)
  ).normalize();
}

function createDirectionArrow(name, detail, ra, dec, colour) {
  const direction = directionFromRaDec(ra, dec);
  const length = 72;
  const arrow = new THREE.ArrowHelper(direction, new THREE.Vector3(), length, colour, 4, 2);
  arrow.line.material.transparent = true;
  arrow.line.material.opacity = .58;
  arrow.line.material.depthWrite = false;
  arrow.cone.material.transparent = true;
  arrow.cone.material.opacity = .8;
  arrow.cone.material.depthWrite = false;
  directionGroup.add(arrow);

  const labelElement = document.createElement('span');
  labelElement.className = 'universe-direction-label';
  labelElement.innerHTML = `<strong>${name}</strong><small>${detail}</small>`;
  const label = new CSS2DObject(labelElement);
  label.position.copy(direction.clone().multiplyScalar(length + 4));
  directionGroup.add(label);
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

function createStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 96;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(48, 48, 0, 48, 48, 48);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(.12, 'rgba(255,255,255,.98)');
  gradient.addColorStop(.36, 'rgba(255,255,255,.62)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 96, 96);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function markerSize(star) {
  if (/^(sun|sol)/i.test(star.name)) return scaleMode === 'linear' ? 1.7 : 5.2;
  const magnitude = Number.isFinite(Number(star.magnitude)) ? Number(star.magnitude) : 5;
  const size = THREE.MathUtils.clamp(3.5 + (3 - magnitude) * .35, 2.4, 5.4);
  return scaleMode === 'linear' ? size * .38 : size;
}

function buildScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02050b, .0017);
  camera = new THREE.PerspectiveCamera(50, 1, .1, 2000);
  camera.position.set(70, 48, 105);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x010207, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.append(renderer.domElement);

  labelRenderer = new CSS2DRenderer();
  labelRenderer.domElement.className = 'universe-label-layer';
  stage.append(labelRenderer.domElement);

  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.dampingFactor = .075;
  orbit.minDistance = 2;
  orbit.maxDistance = 700;
  orbit.target.set(0, 0, 0);

  const axesMaterial = new THREE.LineBasicMaterial({ color: 0x35557d, transparent: true, opacity: .32 });
  const axisGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -125, 0), new THREE.Vector3(0, 125, 0)]);
  scene.add(new THREE.Line(axisGeometry, axesMaterial));

  planeGrid = new THREE.GridHelper(240, 12, 0x31567f, 0x1b2a40);
  planeGrid.material.transparent = true;
  planeGrid.material.opacity = .24;
  scene.add(planeGrid);

  directionGroup = new THREE.Group();
  directionGroup.name = 'Milky Way directions';
  scene.add(directionGroup);
  createDirectionArrow('Galactic Centre', 'toward the Milky Way’s core', 266.4051, -28.9362, 0xffb45f);
  createDirectionArrow('North Galactic Pole', 'perpendicular to the galactic plane', 192.8595, 27.1283, 0x76c8ff);

  const texture = createStarTexture();
  catalogue.forEach(star => {
    star.physicalPosition = physicalPosition(star);
    const material = new THREE.SpriteMaterial({
      map: texture,
      color: starColour(star),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
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
  scene.add(new THREE.Points(background, new THREE.PointsMaterial({ color: 0x6f82a8, size: 1.05, transparent: true, opacity: .5, sizeAttenuation: false })));
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
    item.sprite.visible = matchesDistance && matchesSpectral;
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
}

function updatePositions() {
  starObjects.forEach(item => {
    item.sprite.position.copy(displayPosition(item.star));
    item.sprite.scale.setScalar(markerSize(item.star));
    item.sprite.material.opacity = scaleMode === 'linear' ? .78 : 1;
  });
  if (selected) updateSelectionLine();
  updateVisibleStars();
  controlsUi.scaleNote.innerHTML = scaleMode === 'linear'
    ? `<strong>Linear distance · ${integer.format(Math.round(maximumDistance()))} ly volume</strong><span>Distances remain proportional inside the selected volume. Reduce the range to separate the solar neighbourhood.</span>`
    : '<strong>Compressed distance</strong><span>Direction and distance order are preserved; separation is logarithmically compressed.</span>';
}

let selectionLine;
function updateSelectionLine() {
  if (selectionLine) {
    scene.remove(selectionLine);
    selectionLine.geometry.dispose();
    selectionLine.material.dispose();
    selectionLine = null;
  }
  const target = starObjects.find(item => item.star === selected);
  if (!target || target.sprite.position.lengthSq() === 0) return;
  const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), target.sprite.position.clone()]);
  const material = new THREE.LineDashedMaterial({ color: 0x74b7ff, transparent: true, opacity: .65, dashSize: 2, gapSize: 1 });
  selectionLine = new THREE.Line(geometry, material);
  selectionLine.computeLineDistances();
  scene.add(selectionLine);
}

function formatValue(value, unit, digits = 2) {
  return Number.isFinite(Number(value)) ? `${new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(Number(value))} ${unit}` : 'Unknown';
}

function selectStar(star, fly = false) {
  if (!star) return;
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
  details.hr.href = `hr-diagram.html?star=${encodeURIComponent(isSun ? 'Sol' : star.name)}`;
  controlsUi.search.value = isSun ? 'Sun' : star.name;
  if (rangeChanged && scaleMode === 'linear') updatePositions();
  else {
    updateSelectionLine();
    updateVisibleStars();
  }
  if (fly) flyToStar(star);
}

function flyToStar(star) {
  const item = starObjects.find(candidate => candidate.star === star);
  if (!item) return;
  const destinationTarget = item.sprite.position.clone();
  const direction = camera.position.clone().sub(orbit.target).normalize();
  const offset = /^(sun|sol)/i.test(star.name) ? 105 : 22;
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

function findStar() {
  const query = controlsUi.search.value.trim().toLowerCase();
  if (!query) return;
  const exact = catalogue.find(star => star.name.toLowerCase() === query || (query === 'sun' && star.name === 'Sun (Sol)'));
  const partial = catalogue.find(star => star.name.toLowerCase().includes(query));
  selectStar(exact || partial, true);
}

function pointerSelection(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const candidates = starObjects.filter(item => item.sprite.visible).map(item => item.sprite);
  const hit = raycaster.intersectObjects(candidates, false)[0];
  if (hit?.object?.userData?.star) selectStar(hit.object.userData.star);
}

function resize() {
  if (!renderer || !camera) return;
  const width = Math.max(1, stage.clientWidth);
  const height = Math.max(1, stage.clientHeight);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  labelRenderer.setSize(width, height);
}

function animate(time) {
  isAnimating = true;
  animationFrame = requestAnimationFrame(animate);
  updateFlight(time);
  orbit.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

function resetView() {
  scaleMode = 'compressed';
  controlsUi.scale.find(input => input.value === 'compressed').checked = true;
  controlsUi.distance.value = controlsUi.distance.max;
  controlsUi.spectral.value = 'all';
  controlsUi.labels.checked = true;
  controlsUi.labelMagnitude.value = '1.5';
  controlsUi.plane.checked = true;
  controlsUi.directions.checked = true;
  planeGrid.visible = true;
  directionGroup.visible = true;
  camera.position.set(70, 48, 105);
  orbit.target.set(0, 0, 0);
  updatePositions();
  selectStar(catalogue.find(star => /^(sun|sol)/i.test(star.name)) || catalogue[0]);
}

function bindEvents() {
  controlsUi.list.replaceChildren(...catalogue.slice().sort((a, b) => a.name.localeCompare(b.name)).map(star => {
    const option = document.createElement('option');
    option.value = star.name === 'Sun (Sol)' ? 'Sun' : star.name;
    return option;
  }));
  controlsUi.find.addEventListener('click', findStar);
  controlsUi.search.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); findStar(); } });
  controlsUi.scale.forEach(input => input.addEventListener('change', () => {
    scaleMode = input.value;
    controlsUi.distance.value = scaleMode === 'linear' ? '2' : controlsUi.distance.max;
    updatePositions();
  }));
  controlsUi.distance.addEventListener('input', () => {
    if (scaleMode === 'linear') updatePositions();
    else updateVisibleStars();
  });
  controlsUi.spectral.addEventListener('change', updateVisibleStars);
  controlsUi.labels.addEventListener('change', updateVisibleStars);
  controlsUi.labelMagnitude.addEventListener('input', updateVisibleStars);
  controlsUi.plane.addEventListener('change', () => { planeGrid.visible = controlsUi.plane.checked; });
  controlsUi.directions.addEventListener('change', () => { directionGroup.visible = controlsUi.directions.checked; });
  controlsUi.reset.addEventListener('click', resetView);
  controlsUi.home.addEventListener('click', () => selectStar(catalogue.find(star => /^(sun|sol)/i.test(star.name)), true));
  controlsUi.fly.addEventListener('click', () => flyToStar(selected));
  controlsUi.fullscreen.addEventListener('click', async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await stageWrap.requestFullscreen();
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

try {
  buildScene();
  bindEvents();
  resize();
  resetView();
  loading.hidden = true;
  animate(performance.now());
} catch (error) {
  console.error('Could not start the 3D Universe prototype.', error);
  loading.hidden = true;
  errorPanel.hidden = false;
}
