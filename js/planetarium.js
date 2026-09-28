import * as THREE from 'three';

const observations = [
  {
    id: 'm31', title: 'The Andromeda Galaxy', catalogue: 'M31 · M32 · M110', constellation: 'Andromeda',
    ra: 0.712, dec: 41.269, image: 'assets/images/astrophoto/M33-M110-M32.jpg', frame: [2.25, 4.0],
    type: 'Galaxy group',
    distance: '2.5 million light-years', size: '3.2° × 1.0°', moons: '6.4 × 2.0 Moon diameters',
    summary: 'Our nearest large galactic neighbour, accompanied by M32 and M110. Its faint outer disc spans far more sky than the bright core suggests.'
  },
  {
    id: 'm81', title: "Bode’s Galaxy & friends", catalogue: 'M81 · M82 · NGC 3077', constellation: 'Ursa Major',
    ra: 9.926, dec: 69.10, image: 'assets/images/astrophoto/Bode and friends.jpg', frame: [2.25, 3.0],
    type: 'Interacting galaxy group',
    distance: '11.8 million light-years', size: '0.45° × 0.24° (M81)', moons: '0.9 × 0.5 Moon diameters',
    summary: 'A nearby group led by the grand-design spiral M81 and the starburst galaxy M82, distorted by their gravitational encounter.'
  },
  {
    id: 'm27', title: 'The Dumbbell Nebula', catalogue: 'M27', constellation: 'Vulpecula',
    ra: 19.993, dec: 22.721, image: 'assets/images/astrophoto/m27-dumbbell-nebula.jpg', frame: [2.25, 2.25],
    type: 'Planetary nebula',
    distance: 'about 1,360 light-years', size: '0.13° × 0.10°', moons: '0.27 × 0.19 Moon diameters',
    summary: 'A planetary nebula: expanding gas cast off by a dying Sun-like star, now lit by its hot exposed core.'
  },
  {
    id: 'm13', title: 'The Great Cluster', catalogue: 'M13', constellation: 'Hercules',
    ra: 16.695, dec: 36.461, image: 'assets/images/astrophoto/M13.jpg', frame: [2.25, 4.0],
    type: 'Globular star cluster',
    distance: 'about 22,200 light-years', size: '0.33° across', moons: '0.67 Moon diameters',
    summary: 'Several hundred thousand ancient stars gathered into one of the northern sky’s finest globular clusters.'
  },
  {
    id: 'm45', title: 'The Pleiades', catalogue: 'M45 · Seven Sisters', constellation: 'Taurus',
    ra: 3.79, dec: 24.12, image: 'assets/images/astrophoto/Pleiaderna.jpg', frame: [3.8, 3.8],
    type: 'Open star cluster · reflection nebula',
    distance: 'about 445 light-years', size: 'about 1.3° across', moons: 'about 2.6 Moon diameters',
    summary: 'A nearby young open cluster whose brightest blue stars are visible to the unaided eye. Their light is scattered by surrounding dust, producing the delicate blue reflection nebulosity.'
  },
  {
    id: 'm51', title: 'The Whirlpool Galaxy', catalogue: 'M51 · NGC 5195', constellation: 'Canes Venatici',
    ra: 13.498, dec: 47.195, image: 'assets/images/astrophoto/M51.jpg', frame: [2.25, 4.0],
    type: 'Interacting galaxies',
    distance: 'about 31 million light-years', size: '0.19° × 0.12°', moons: '0.37 × 0.23 Moon diameters',
    summary: 'A face-on spiral and its smaller companion. Their interaction helps make the Whirlpool’s two sweeping arms so distinct.'
  },
  {
    id: 'ngc7000', title: 'North America Nebula', catalogue: 'NGC 7000', constellation: 'Cygnus',
    ra: 20.975, dec: 44.33, image: 'assets/images/astrophoto/north-america-nebula.jpg', frame: [2.25, 4.0],
    type: 'Emission nebula · H II region',
    distance: 'about 2,600 light-years', size: '2.0° × 1.7°', moons: '4.0 × 3.4 Moon diameters',
    summary: 'A vast hydrogen-emission region whose bright clouds and dark dust lanes trace a familiar continental silhouette.'
  },
  {
    id: 'ic1396', title: 'Elephant’s Trunk Nebula', catalogue: 'IC 1396A', constellation: 'Cepheus',
    ra: 21.650, dec: 57.50, image: 'assets/images/astrophoto/elephants-trunk-nebula.jpg', frame: [2.25, 4.0],
    type: 'Dark nebula · star-forming region',
    distance: 'about 2,400 light-years', size: 'about 0.33° long', moons: 'about 0.7 Moon diameters',
    summary: 'A dense pillar of gas and dust inside the much larger IC 1396 star-forming region, sculpted by nearby massive stars.'
  },
  {
    id: 'ngc6992', title: 'Eastern Veil Nebula', catalogue: 'NGC 6992 · Caldwell 33', constellation: 'Cygnus',
    ra: 20.940, dec: 31.72, image: 'assets/images/astrophoto/NGC 6992.jpg', frame: [2.25, 2.25],
    type: 'Supernova remnant',
    distance: 'about 2,000 light-years', size: 'about 1.3° × 0.2°', moons: '2.7 × 0.4 Moon diameters',
    summary: 'The bright eastern arc of the Veil Nebula, a filamentary shell of gas expanding from a supernova that exploded thousands of years ago.'
  },
  {
    id: 'ngc7822', title: 'Question Mark Nebula', catalogue: 'NGC 7822 · Sh2-171 · V398 Cephei', constellation: 'Cepheus',
    ra: 0.061, dec: 67.15, image: 'assets/images/astrophoto/V398 Cephei - NGC 7822.jpg', frame: [2.67, 4.0],
    type: 'Emission nebula · star-forming complex',
    distance: 'about 3,000 light-years', size: 'about 3° across', moons: 'about 6 Moon diameters',
    summary: 'A vast cloud of ionised hydrogen and dark dust shaped like a question mark. The field includes the young NGC 7822 complex and the region around variable star V398 Cephei.'
  },
  {
    id: 'ngc6960', title: 'Western Veil Nebula', catalogue: 'NGC 6960 · Caldwell 34', constellation: 'Cygnus',
    ra: 20.760, dec: 30.70, image: 'assets/images/astrophoto/ngc 6960.jpg', frame: [2.25, 2.25],
    type: 'Supernova remnant',
    distance: 'about 2,000 light-years', size: 'about 1.2° × 0.1°', moons: '2.3 × 0.2 Moon diameters',
    summary: 'The western arc of the Veil Nebula, also called the Witch’s Broom. Its glowing filaments are a shock front moving through interstellar gas.'
  },
  {
    id: 'ngc7635', title: 'Bubble Nebula & friends', catalogue: 'NGC 7635 · M52 · Sh2-157', constellation: 'Cassiopeia',
    ra: 23.300, dec: 61.10, image: 'assets/images/astrophoto/ngc 7635.jpg', frame: [3.8, 3.8],
    type: 'Wind-blown emission nebula',
    distance: 'about 7,100 light-years', size: 'about 0.05° across (bubble)', moons: 'about 0.1 Moon diameters',
    summary: 'A bubble of gas inflated by the fierce wind from a massive hot star. This wide field also shows open cluster M52 and the larger Lobster Claw region, Sh2-157.'
  },
  {
    id: 'ic1848', title: 'The Soul Nebula', catalogue: 'IC 1848 · W5 · Sh2-199', constellation: 'Cassiopeia',
    ra: 2.9, dec: 60.4, image: 'assets/images/astrophoto/IC 1848 – Soul Nebula.jpg', frame: [3.8, 3.8],
    type: 'Emission nebula · star-forming complex',
    distance: 'about 6,500 light-years', size: 'about 2.5° × 1.25°', moons: 'about 5 × 2.5 Moon diameters',
    summary: 'A vast complex of glowing gas, dark dust and young stars. Winds and ultraviolet radiation from the embedded clusters have carved large cavities through the cloud.'
  },
  {
    id: 'ngc7380', title: 'The Wizard Nebula', catalogue: 'NGC 7380 · Sh2-142', constellation: 'Cepheus',
    ra: 22.788, dec: 58.125, image: 'assets/images/astrophoto/Ngc 7380 wizard.jpg', frame: [3.8, 3.8],
    type: 'Emission nebula · young open cluster',
    distance: 'about 7,000 light-years', size: 'about 0.5° across', moons: 'about 1 Moon diameter',
    summary: 'A young open cluster embedded in a star-forming cloud. Bright ionisation fronts and dark dust lanes create the outline that inspired the nebula’s nickname.'
  },
  {
    id: 'eclipse', title: 'Sun & Moon', catalogue: 'Partial solar eclipse', constellation: 'The ecliptic',
    ra: 0.600, dec: 4.0, image: 'assets/images/astrophoto/sun-moon.jpg', frame: [2.25, 4.0],
    type: 'Solar-system event',
    distance: 'Moon: about 384,400 km', size: 'about 0.5° across', moons: '1 Moon diameter',
    summary: 'The Moon passes between Earth and the Sun. Unlike the deep-sky objects, this marker is illustrative: both bodies move across the celestial sphere.'
  }
];

const viewer = document.querySelector('.sky-viewer');
const canvas = document.querySelector('#sky-canvas');
const loading = document.querySelector('.sky-loading');
const targetList = document.querySelector('.sky-targets');
const panel = document.querySelector('.object-panel');
const coordinates = document.querySelector('.sky-coordinates');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x03060b);
scene.fog = new THREE.FogExp2(0x03060b, 0.0017);

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 240);
camera.position.set(0, 0, 0);
camera.up.set(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

function celestialVector(raHours, decDegrees, radius = 90) {
  const ra = THREE.MathUtils.degToRad(raHours * 15);
  const dec = THREE.MathUtils.degToRad(decDegrees);
  return new THREE.Vector3(
    Math.cos(dec) * Math.cos(ra) * radius,
    Math.sin(dec) * radius,
    -Math.cos(dec) * Math.sin(ra) * radius
  );
}

function makeGrid() {
  const material = new THREE.LineBasicMaterial({ color: 0x42617b, transparent: true, opacity: 0.17, depthWrite: false });
  const group = new THREE.Group();
  group.name = 'coordinate-grid';
  for (let dec = -60; dec <= 60; dec += 30) {
    const points = [];
    for (let ra = 0; ra <= 24; ra += 0.1) points.push(celestialVector(ra, dec, 97));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  }
  for (let ra = 0; ra < 24; ra += 2) {
    const points = [];
    for (let dec = -90; dec <= 90; dec += 2) points.push(celestialVector(ra, dec, 97));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  }
  scene.add(group);
  return group;
}

function random(seed) {
  let t = seed;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ t >>> 15, 1 | t);
    r ^= r + Math.imul(r ^ r >>> 7, 61 | r);
    return ((r ^ r >>> 14) >>> 0) / 4294967296;
  };
}

function makeStars() {
  const rand = random(302026);
  const positions = [];
  const colors = [];
  const color = new THREE.Color();
  for (let i = 0; i < 3400; i++) {
    const y = rand() * 2 - 1;
    const angle = rand() * Math.PI * 2;
    const radius = 99 + rand() * 3;
    const flat = Math.sqrt(1 - y * y);
    positions.push(Math.cos(angle) * flat * radius, y * radius, Math.sin(angle) * flat * radius);
    const temperature = rand();
    color.setRGB(0.68 + temperature * .32, 0.72 + temperature * .22, 0.78 + (1 - temperature) * .22);
    colors.push(color.r, color.g, color.b);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({ size: .18, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: .82, depthWrite: false }));
  scene.add(points);

  const brightStars = [
    [6.753,-16.716,0.75],[6.399,-52.696,0.72],[14.261,19.182,0.65],[18.615,38.784,0.68],
    [5.919,7.407,0.64],[5.242,-8.202,0.58],[7.655,5.225,0.57],[19.846,8.868,0.56],
    [12.444,-63.099,0.60],[4.598,16.509,0.55],[13.420,-11.161,0.54],[16.490,-26.432,0.58],
    [7.576,31.889,0.48],[22.961,-29.622,0.49],[20.690,45.280,0.47],[10.139,11.967,0.43],
    [2.530,89.264,0.52],[13.792,49.313,0.46],[5.278,45.998,0.42],[17.560,-37.104,0.47]
  ];
  const brightPositions = [];
  brightStars.forEach(([ra, dec]) => brightPositions.push(...celestialVector(ra, dec, 98).toArray()));
  const brightGeometry = new THREE.BufferGeometry();
  brightGeometry.setAttribute('position', new THREE.Float32BufferAttribute(brightPositions, 3));
  scene.add(new THREE.Points(brightGeometry, new THREE.PointsMaterial({ color: 0xeaf4ff, size: .56, transparent: true, opacity: .95, depthWrite: false })));
}

// A figure is included if at least one of its line stars rises above the
// mathematical horizon during the year at the configured observing latitude.
const OBSERVING_LATITUDE = 55.6;
const MIN_VISIBLE_DECLINATION = OBSERVING_LATITUDE - 90;

function sourceCoordinate([longitude, declination]) {
  return [((longitude % 360) + 360) % 360 / 15, declination];
}

function greatCirclePoints(start, end, radius = 96) {
  const a = celestialVector(start[0], start[1], 1).normalize();
  const b = celestialVector(end[0], end[1], 1).normalize();
  const angle = a.angleTo(b);
  const points = [];
  const steps = Math.max(2, Math.ceil(THREE.MathUtils.radToDeg(angle) / 3));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    if (angle < 0.0001) points.push(a.clone().multiplyScalar(radius));
    else points.push(a.clone().multiplyScalar(Math.sin((1 - t) * angle)).add(b.clone().multiplyScalar(Math.sin(t * angle))).divideScalar(Math.sin(angle)).normalize().multiplyScalar(radius));
  }
  return points;
}

function constellationLabel(text, rank = 2) {
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 512;
  labelCanvas.height = 96;
  const context = labelCanvas.getContext('2d');
  context.font = '700 38px system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.letterSpacing = '4px';
  context.fillStyle = 'rgba(190, 222, 241, 1)';
  context.fillText(text, 256, 48);
  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: .9, depthWrite: false, depthTest: false }));
  const width = rank === 1 ? 19 : rank === 2 ? 17 : 15;
  sprite.userData.baseScale = new THREE.Vector3(width, width / 4.1, 1);
  sprite.scale.copy(sprite.userData.baseScale);
  sprite.userData.rank = rank;
  return sprite;
}

function makeConstellationLayer() {
  const group = new THREE.Group();
  group.name = 'western-constellation-figures';
  group.userData.labels = [];
  scene.add(group);
  populateConstellations(group);
  return group;
}

async function populateConstellations(group) {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x84b4d1, transparent: true, opacity: .62, depthWrite: false });
  const starPositions = [];
  try {
    const [lineResponse, nameResponse] = await Promise.all([
      fetch('data/astrophoto/constellations.lines.json'),
      fetch('data/astrophoto/constellations.json')
    ]);
    if (!lineResponse.ok || !nameResponse.ok) throw new Error('Constellation catalogue unavailable');
    const [lineCatalogue, nameCatalogue] = await Promise.all([lineResponse.json(), nameResponse.json()]);
    const namesById = new Map();
    nameCatalogue.features.forEach(feature => {
      if (!namesById.has(feature.id)) namesById.set(feature.id, []);
      namesById.get(feature.id).push(feature);
    });

    const visibleFigures = lineCatalogue.features.filter(feature =>
      feature.geometry.coordinates.some(path => path.some(([, dec]) => dec > MIN_VISIBLE_DECLINATION))
    );

    visibleFigures.forEach(figure => {
      const uniqueStars = new Set();
      figure.geometry.coordinates.forEach(path => {
        for (let index = 0; index < path.length - 1; index++) {
          const start = sourceCoordinate(path[index]);
          const end = sourceCoordinate(path[index + 1]);
          group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(greatCirclePoints(start, end)), lineMaterial));
        }
        path.forEach(coordinate => {
          const key = coordinate.join(',');
          if (uniqueStars.has(key)) return;
          uniqueStars.add(key);
          starPositions.push(...celestialVector(...sourceCoordinate(coordinate), 95.7).toArray());
        });
      });

      const metadata = namesById.get(figure.id) || [];
      const visibleLabels = metadata.filter(item => item.geometry.coordinates[1] > MIN_VISIBLE_DECLINATION);
      const labelSources = visibleLabels.length ? visibleLabels : metadata.slice(0, 1);
      labelSources.forEach(item => {
        let coordinate = item.geometry.coordinates;
        if (coordinate[1] <= MIN_VISIBLE_DECLINATION) {
          coordinate = figure.geometry.coordinates.flat().reduce((highest, candidate) => candidate[1] > highest[1] ? candidate : highest);
        }
        const rank = Number(figure.properties.rank || item.properties.rank || 2);
        const label = constellationLabel(item.properties.name.toUpperCase(), rank);
        label.position.copy(celestialVector(...sourceCoordinate(coordinate), 94.8));
        label.renderOrder = 8;
        group.add(label);
        group.userData.labels.push(label);
      });
    });

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    group.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xe5f5ff, size: .72, transparent: true, opacity: 1, depthWrite: false })));
    group.userData.figureCount = visibleFigures.length;
  } catch (error) {
    console.warn('Could not load constellation figures.', error);
  }
}

const grid = makeGrid();
makeStars();
const constellationFigures = makeConstellationLayer();
const selectable = [];
const textureLoader = new THREE.TextureLoader();
let loadedTextures = 0;

observations.forEach((observation, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.target = observation.id;
  button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><span><strong>${observation.title}</strong><small>${observation.catalogue} · ${observation.constellation}</small></span><i aria-hidden="true">→</i>`;
  button.addEventListener('click', () => selectObservation(observation));
  targetList.append(button);

  const center = celestialVector(observation.ra, observation.dec, 90);
  const width = 2 * 90 * Math.tan(THREE.MathUtils.degToRad(observation.frame[0]) / 2);
  const height = 2 * 90 * Math.tan(THREE.MathUtils.degToRad(observation.frame[1]) / 2);
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: .9, side: THREE.DoubleSide, depthWrite: false });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.copy(center);
  plane.lookAt(0, 0, 0);
  plane.userData.observation = observation;
  scene.add(plane);
  selectable.push(plane);

  textureLoader.load(observation.image, texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    material.map = texture;
    material.needsUpdate = true;
    loadedTextures++;
    if (loadedTextures === observations.length) loading.classList.add('is-hidden');
  }, undefined, () => {
    loadedTextures++;
    if (loadedTextures === observations.length) loading.classList.add('is-hidden');
  });

});

let viewDirection = celestialVector(0.712, 41.269, 1).normalize();
let targetDirection = viewDirection.clone();
let animation = null;
let selected = null;
let dragging = false;
let dragged = false;
let previousX = 0;
let previousY = 0;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const fullImageLink = panel.querySelector('.object-full-image');
const photoLightbox = document.querySelector('.planetarium-lightbox');
const photoLightboxImage = photoLightbox.querySelector('img');
const photoLightboxTitle = photoLightbox.querySelector('figcaption strong');
const photoLightboxMeta = photoLightbox.querySelector('figcaption span');

function pointCamera(direction = viewDirection) {
  camera.lookAt(direction);
}
pointCamera();

function formatPosition(direction) {
  const raRadians = Math.atan2(-direction.z, direction.x);
  const raHours = ((THREE.MathUtils.radToDeg(raRadians) / 15) + 24) % 24;
  const dec = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(direction.y, -1, 1)));
  const hours = Math.floor(raHours);
  const minutes = Math.floor((raHours - hours) * 60);
  const degrees = Math.floor(Math.abs(dec));
  const arcminutes = Math.floor((Math.abs(dec) - degrees) * 60);
  return {
    ra: `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`,
    dec: `${dec >= 0 ? '+' : '−'}${String(degrees).padStart(2, '0')}° ${String(arcminutes).padStart(2, '0')}′`
  };
}

function selectObservation(observation) {
  selected = observation;
  document.querySelectorAll('.sky-targets button').forEach(button => button.classList.toggle('is-active', button.dataset.target === observation.id));
  targetDirection = celestialVector(observation.ra, observation.dec, 1).normalize();
  const startDirection = viewDirection.clone();
  const startFov = camera.fov;
  const targetFov = THREE.MathUtils.clamp(Math.max(...observation.frame) * 1.4, 4.8, 7.2);
  animation = { start: performance.now(), duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 2400, startDirection, startFov, targetFov };
  panel.hidden = false;
  panel.classList.remove('is-visible');
  requestAnimationFrame(() => panel.classList.add('is-visible'));
  panel.querySelector('.object-catalogue').textContent = `${observation.catalogue} · ${observation.constellation}`;
  panel.querySelector('.object-title').textContent = observation.title;
  panel.querySelector('.object-summary').textContent = observation.summary;
  panel.querySelector('.object-type').textContent = observation.type;
  panel.querySelector('.object-distance').textContent = observation.distance;
  panel.querySelector('.object-size').textContent = observation.size;
  panel.querySelector('.object-moons').textContent = observation.moons;
  panel.querySelector('.object-position').textContent = `RA ${formatPosition(targetDirection).ra} · Dec ${formatPosition(targetDirection).dec}`;
  fullImageLink.href = observation.image;
}

function overview() {
  selected = null;
  document.querySelectorAll('.sky-targets button').forEach(button => button.classList.remove('is-active'));
  panel.classList.remove('is-visible');
  setTimeout(() => { if (!panel.classList.contains('is-visible')) panel.hidden = true; }, 350);
  const startDirection = viewDirection.clone();
  targetDirection = celestialVector(0.712, 41.269, 1).normalize();
  animation = { start: performance.now(), duration: 1500, startDirection, startFov: camera.fov, targetFov: 75 };
}

function adjustZoom(delta) {
  animation = null;
  camera.fov = THREE.MathUtils.clamp(camera.fov + delta, 5, 95);
  camera.updateProjectionMatrix();
}

canvas.addEventListener('pointerdown', event => {
  dragging = true; dragged = false; previousX = event.clientX; previousY = event.clientY;
  canvas.setPointerCapture(event.pointerId);
  animation = null;
});

canvas.addEventListener('pointermove', event => {
  if (!dragging) return;
  const dx = event.clientX - previousX;
  const dy = event.clientY - previousY;
  if (Math.abs(dx) + Math.abs(dy) > 2) dragged = true;
  previousX = event.clientX; previousY = event.clientY;
  const sensitivity = THREE.MathUtils.degToRad(camera.fov) / Math.max(240, canvas.clientHeight);
  const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
  euler.y -= dx * sensitivity;
  euler.x -= dy * sensitivity;
  euler.x = THREE.MathUtils.clamp(euler.x, -Math.PI / 2 + .015, Math.PI / 2 - .015);
  camera.quaternion.setFromEuler(euler);
  camera.getWorldDirection(viewDirection).normalize();
});

canvas.addEventListener('pointerup', event => {
  dragging = false;
  if (dragged) return;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(selectable, false)[0];
  if (hit?.object.userData.observation) selectObservation(hit.object.userData.observation);
});

canvas.addEventListener('wheel', event => {
  event.preventDefault();
  adjustZoom(event.deltaY * .025);
}, { passive: false });

let pinchDistance = null;
canvas.addEventListener('touchmove', event => {
  if (event.touches.length !== 2) { pinchDistance = null; return; }
  const distance = Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY);
  if (pinchDistance !== null) adjustZoom((pinchDistance - distance) * .05);
  pinchDistance = distance;
}, { passive: true });

panel.querySelector('.object-panel-close').addEventListener('click', overview);
fullImageLink.addEventListener('click', event => {
  event.preventDefault();
  if (!selected) return;
  photoLightboxImage.src = selected.image;
  photoLightboxImage.alt = `${selected.title}, photographed in ${selected.constellation}`;
  photoLightboxTitle.textContent = selected.title;
  photoLightboxMeta.textContent = selected.catalogue;
  photoLightbox.showModal();
});
photoLightbox.querySelector('.planetarium-lightbox-back').addEventListener('click', () => photoLightbox.close());
document.querySelector('[data-sky-action="home"]').addEventListener('click', overview);
document.querySelector('[data-sky-action="zoom-in"]').addEventListener('click', () => adjustZoom(-8));
document.querySelector('[data-sky-action="zoom-out"]').addEventListener('click', () => adjustZoom(8));
document.querySelector('[data-sky-action="labels"]').addEventListener('click', event => {
  grid.visible = !grid.visible;
  constellationFigures.visible = grid.visible;
  event.currentTarget.classList.toggle('is-active', grid.visible);
  event.currentTarget.setAttribute('aria-pressed', String(grid.visible));
});

function resize() {
  const width = viewer.clientWidth;
  const height = viewer.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

function animate(time) {
  if (animation) {
    const elapsed = Math.min(1, (time - animation.start) / animation.duration);
    const eased = elapsed < .5 ? 4 * elapsed ** 3 : 1 - ((-2 * elapsed + 2) ** 3) / 2;
    viewDirection.copy(animation.startDirection).lerp(targetDirection, eased).normalize();
    camera.fov = THREE.MathUtils.lerp(animation.startFov, animation.targetFov, eased);
    camera.updateProjectionMatrix();
    pointCamera();
    if (elapsed === 1) animation = null;
  }
  const position = formatPosition(viewDirection);
  coordinates.children[0].textContent = `RA ${position.ra}`;
  coordinates.children[1].textContent = `DEC ${position.dec}`;
  coordinates.children[2].textContent = `FOV ${Math.round(camera.fov)}°`;
  const labelScale = Math.max(.2, camera.fov / 75);
  constellationFigures.userData.labels.forEach(label => label.scale.copy(label.userData.baseScale).multiplyScalar(labelScale));
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

setTimeout(() => loading.classList.add('is-hidden'), 7000);
