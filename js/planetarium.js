import * as THREE from 'three';
import { STARS as interactiveStars } from '../data/astrophoto/interactive-stars.js';

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
    id: 'ngc869-884', title: 'The Double Cluster', catalogue: 'NGC 869 · NGC 884 · Caldwell 14', constellation: 'Perseus',
    ra: 2.333, dec: 57.13, image: 'assets/images/astrophoto/Double%20cluster%20NGC%20869%20and%20NGC%20884.jpg', frame: [3.8, 3.8],
    type: 'Pair of open star clusters',
    distance: 'about 7,500 light-years', size: 'about 1° across (the pair)', moons: 'about 2 Moon diameters',
    summary: 'NGC 869 and NGC 884—also called h and Chi Persei—are neighbouring young open clusters born from the same star-forming region. Together they contain hundreds of hot, luminous stars.'
  },
  {
    id: 'm51', title: 'The Whirlpool Galaxy', catalogue: 'M51 · NGC 5195', constellation: 'Canes Venatici',
    ra: 13.498, dec: 47.195, image: 'assets/images/astrophoto/M51.jpg', frame: [2.25, 4.0],
    type: 'Interacting galaxies',
    distance: 'about 31 million light-years', size: '0.19° × 0.12°', moons: '0.37 × 0.23 Moon diameters',
    summary: 'A face-on spiral and its smaller companion. Their interaction helps make the Whirlpool’s two sweeping arms so distinct.'
  },
  {
    id: 'ngc7331', title: 'NGC 7331 & Stephan’s Quintet', catalogue: 'NGC 7331 · Caldwell 30 · HCG 92', constellation: 'Pegasus',
    ra: 22.618, dec: 34.416, image: 'assets/images/astrophoto/Ngc%207331%20with%20very%20fait%20Stephan%27s%20Quintet.jpg', frame: [3.8, 3.8],
    type: 'Spiral galaxy field · compact galaxy group',
    distance: 'NGC 7331: about 50 million ly · Quintet: about 290 million ly', size: 'NGC 7331: about 0.18° × 0.06°', moons: 'about 0.35 × 0.12 Moon diameters',
    summary: 'NGC 7331 is the bright spiral near the centre. Look carefully near the lower right of the frame: Stephan’s Quintet appears as a very faint, diffuse smudge. Four of its galaxies form a distant interacting group; NGC 7320 is a foreground galaxy.'
  },
  {
    id: 'ngc7000', title: 'North America Nebula', catalogue: 'NGC 7000', constellation: 'Cygnus',
    ra: 20.975, dec: 44.33, image: 'assets/images/astrophoto/north-america-nebula.jpg', frame: [2.25, 4.0],
    type: 'Emission nebula · H II region',
    distance: 'about 2,600 light-years', size: '2.0° × 1.7°', moons: '4.0 × 3.4 Moon diameters',
    summary: 'A vast hydrogen-emission region whose bright clouds and dark dust lanes trace a familiar continental silhouette.'
  },
  {
    id: 'ngc6888', title: 'The Crescent Nebula', catalogue: 'NGC 6888 · Caldwell 27', constellation: 'Cygnus',
    ra: 20.2083, dec: 38.4167, image: 'assets/images/astrophoto/Ngc-6888.jpg', frame: [2.25, 4.0],
    type: 'Wind-blown emission nebula',
    distance: 'about 4,700 light-years', size: 'about 0.30° × 0.20°', moons: 'about 0.6 × 0.4 Moon diameters',
    summary: 'A glowing shell of gas driven outward by fierce winds from WR 136, the massive Wolf-Rayet star near its centre.'
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
    id: 'ngc281', title: 'The Pacman Nebula', catalogue: 'NGC 281 · IC 1590', constellation: 'Cassiopeia',
    ra: 0.8832, dec: 56.622, image: 'assets/images/astrophoto/Ngc-281.jpg', frame: [3.8, 3.8],
    type: 'Emission nebula · star-forming region',
    distance: 'about 6,500 light-years', size: 'about 0.6° across', moons: 'about 1.2 Moon diameters',
    summary: 'A vast star-forming cloud shaped by the hot young stars of cluster IC 1590. Dark dust lanes and dense Bok globules create its Pac-Man-like silhouette.'
  },
  {
    id: 'ic1805', title: 'The Heart Nebula', catalogue: 'IC 1805 · Melotte 15', constellation: 'Cassiopeia',
    ra: 2.545, dec: 61.45, image: 'assets/images/astrophoto/Heart nebula ic 1805.jpg', frame: [2.67, 4.0], renderOrder: 1,
    type: 'Emission nebula · star-forming region',
    distance: 'about 7,500 light-years', size: 'about 2° across', moons: 'about 4 Moon diameters',
    summary: 'A vast complex of glowing hydrogen and dark dust. Radiation and stellar winds from the young stars of Melotte 15 sculpt its clouds and central pillars.'
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
const starPanel = document.querySelector('.star-panel');
const starToolsPanel = document.querySelector('#star-tools-panel');
const starTooltip = document.querySelector('.star-tooltip');
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
  const group = new THREE.Group();
  group.name = 'decorative-background-stars';
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
  group.add(points);

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
  group.add(new THREE.Points(brightGeometry, new THREE.PointsMaterial({ color: 0xeaf4ff, size: .56, transparent: true, opacity: .95, depthWrite: false })));
  scene.add(group);
  return group;
}

function starColour(temperature) {
  if (temperature >= 30000) return 0x8eb8ff;
  if (temperature >= 10000) return 0xadc9ff;
  if (temperature >= 7500) return 0xd7e2ff;
  if (temperature >= 6000) return 0xfff7df;
  if (temperature >= 5200) return 0xffe38c;
  if (temperature >= 3700) return 0xffb05c;
  return 0xff6b48;
}

function makeGlowTexture() {
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 128;
  textureCanvas.height = 128;
  const context = textureCanvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(.12, 'rgba(255,255,255,.98)');
  gradient.addColorStop(.34, 'rgba(255,255,255,.55)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeStarLabel(star) {
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 320;
  labelCanvas.height = 64;
  const context = labelCanvas.getContext('2d');
  context.font = '600 26px system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = 'rgba(235,243,255,.96)';
  context.fillText(star.name, 160, 32);
  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: .92, depthTest: false, depthWrite: false }));
  label.scale.set(5.8, 1.16, 1);
  label.userData.starLabel = true;
  return label;
}

const interactiveStarLayer = new THREE.Group();
interactiveStarLayer.name = 'interactive-stars';
interactiveStarLayer.visible = false;
scene.add(interactiveStarLayer);
const starSprites = [];
const starLabels = [];
const glowTexture = makeGlowTexture();

interactiveStars.forEach(star => {
  const position = celestialVector(star.ra / 15, star.dec, 92);
  const material = new THREE.SpriteMaterial({ map: glowTexture, color: starColour(star.temperature), transparent: true, depthTest: false, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  const size = THREE.MathUtils.clamp(1.8 - star.magnitude * .18, .7, 2.4);
  sprite.position.copy(position);
  sprite.scale.setScalar(size);
  sprite.renderOrder = 12;
  sprite.userData.star = star;
  sprite.userData.baseScale = size;
  interactiveStarLayer.add(sprite);
  starSprites.push(sprite);

  if (star.magnitude < 2.5) {
    const label = makeStarLabel(star);
    const direction = position.clone().normalize();
    let tangent = new THREE.Vector3(0, 1, 0).cross(direction);
    if (tangent.lengthSq() < .01) tangent = new THREE.Vector3(1, 0, 0);
    label.position.copy(position).add(tangent.normalize().multiplyScalar(1.4));
    label.renderOrder = 13;
    label.userData.star = star;
    interactiveStarLayer.add(label);
    starLabels.push(label);
    sprite.userData.label = label;
  }
});

const horizonLayer = new THREE.Group();
horizonLayer.name = 'observer-horizon';
horizonLayer.visible = false;
scene.add(horizonLayer);

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
const backgroundStarLayer = makeStars();
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
  plane.renderOrder = observation.renderOrder || 0;
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

const starLayerButton = document.querySelector('[data-sky-action="stars"]');
const starToolsButton = document.querySelector('[data-sky-action="star-tools"]');
const starExplorerLaunch = document.querySelector('#star-explorer-launch');
const starSearch = document.querySelector('#star-search');
const starCount = document.querySelector('#star-filter-count');
const constellationSelect = document.querySelector('#star-constellation');
const spectralButtons = [...document.querySelectorAll('#star-spectral-chips button')];
const observerMode = document.querySelector('#observer-mode');
const observerDate = document.querySelector('#observer-date');
const observerTime = document.querySelector('#observer-time');
const observerLocation = document.querySelector('#observer-location');
const starDetailFields = Object.fromEntries([...starPanel.querySelectorAll('[data-star-detail]')].map(item => [item.dataset.starDetail, item]));
const starNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const starInteger = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
let activeSpectral = new Set(spectralButtons.map(button => button.dataset.value));
let observerLatitude = 59.334;
let observerLongitude = 18.063;
let observerDateTime = new Date();
let selectedStar = null;

const starRanges = {
  magnitude: { min: document.querySelector('#star-magnitude-min'), max: document.querySelector('#star-magnitude-max'), output: document.querySelector('#star-magnitude-output'), defaults: [-2, 6] },
  distance: { min: document.querySelector('#star-distance-min'), max: document.querySelector('#star-distance-max'), output: document.querySelector('#star-distance-output'), defaults: [0, 3.4771] },
  age: { min: document.querySelector('#star-age-min'), max: document.querySelector('#star-age-max'), output: document.querySelector('#star-age-output'), defaults: [0, 8] },
  mass: { min: document.querySelector('#star-mass-min'), max: document.querySelector('#star-mass-max'), output: document.querySelector('#star-mass-output'), defaults: [.5, 35] },
  luminosity: { min: document.querySelector('#star-luminosity-min'), max: document.querySelector('#star-luminosity-max'), output: document.querySelector('#star-luminosity-output'), defaults: [-1, 6] },
  temperature: { min: document.querySelector('#star-temperature-min'), max: document.querySelector('#star-temperature-max'), output: document.querySelector('#star-temperature-output'), defaults: [3000, 45000] }
};

function starRangeValues(name) {
  const range = starRanges[name];
  const first = Number(range.min.value);
  const second = Number(range.max.value);
  return [Math.min(first, second), Math.max(first, second)];
}

function compactNumber(value) {
  if (value >= 1000000) return `${starNumber.format(value / 1000000)}M`;
  if (value >= 1000) return `${starNumber.format(value / 1000)}k`;
  return starNumber.format(value);
}

function updateStarRange(name) {
  const range = starRanges[name];
  const values = starRangeValues(name);
  const domainMin = Number(range.min.min);
  const domainMax = Number(range.min.max);
  const start = ((values[0] - domainMin) / (domainMax - domainMin)) * 100;
  const end = ((values[1] - domainMin) / (domainMax - domainMin)) * 100;
  range.min.parentElement.style.background = `linear-gradient(to right, #293147 0%, #293147 ${start}%, #4a9eff ${start}%, #4a9eff ${end}%, #293147 ${end}%, #293147 100%) center / 100% 3px no-repeat`;
  if (name === 'magnitude') range.output.textContent = `${values[0].toFixed(1).replace('-', '−')}–${values[1].toFixed(1).replace('-', '−')} mag`;
  if (name === 'distance') range.output.textContent = `${starInteger.format(10 ** values[0])}–${starInteger.format(10 ** values[1])} ly`;
  if (name === 'age') range.output.textContent = `${values[0].toFixed(1)}–${values[1].toFixed(1)} Gy`;
  if (name === 'mass') range.output.textContent = `${values[0].toFixed(1)}–${values[1].toFixed(1)} M☉`;
  if (name === 'luminosity') range.output.textContent = `${compactNumber(10 ** values[0])}–${compactNumber(10 ** values[1])} L☉`;
  if (name === 'temperature') range.output.textContent = `${starInteger.format(values[0])}–${starInteger.format(values[1])} K`;
}

function localSiderealHours(date, longitude) {
  const julianDay = date.getTime() / 86400000 + 2440587.5;
  const centuries = (julianDay - 2451545) / 36525;
  let degrees = 280.46061837 + 360.98564736629 * (julianDay - 2451545) + .000387933 * centuries ** 2 - centuries ** 3 / 38710000 + longitude;
  degrees = ((degrees % 360) + 360) % 360;
  return degrees / 15;
}

function altitudeForStar(star) {
  const hourAngle = THREE.MathUtils.degToRad(localSiderealHours(observerDateTime, observerLongitude) * 15 - star.ra);
  const latitude = THREE.MathUtils.degToRad(observerLatitude);
  const declination = THREE.MathUtils.degToRad(star.dec);
  return THREE.MathUtils.radToDeg(Math.asin(
    Math.sin(declination) * Math.sin(latitude) + Math.cos(declination) * Math.cos(latitude) * Math.cos(hourAngle)
  ));
}

function horizonVector(azimuthDegrees, radius = 93) {
  const latitude = THREE.MathUtils.degToRad(observerLatitude);
  const sidereal = THREE.MathUtils.degToRad(localSiderealHours(observerDateTime, observerLongitude) * 15);
  const azimuth = THREE.MathUtils.degToRad(azimuthDegrees);
  const north = new THREE.Vector3(-Math.sin(latitude) * Math.cos(sidereal), -Math.sin(latitude) * Math.sin(sidereal), Math.cos(latitude));
  const east = new THREE.Vector3(-Math.sin(sidereal), Math.cos(sidereal), 0);
  const conventional = north.multiplyScalar(Math.cos(azimuth)).add(east.multiplyScalar(Math.sin(azimuth))).normalize();
  return new THREE.Vector3(conventional.x, conventional.z, -conventional.y).multiplyScalar(radius);
}

function makeCompassLabel(text) {
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 80;
  labelCanvas.height = 80;
  const context = labelCanvas.getContext('2d');
  context.font = '700 42px system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#8fd2ff';
  context.fillText(text, 40, 40);
  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false }));
  label.scale.set(2.4, 2.4, 1);
  return label;
}

function rebuildHorizon() {
  horizonLayer.clear();
  const points = [];
  for (let azimuth = 0; azimuth <= 360; azimuth += 2) points.push(horizonVector(azimuth));
  horizonLayer.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0x64c7ff, transparent: true, opacity: .8, depthWrite: false })));
  [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(([text, azimuth]) => {
    const label = makeCompassLabel(text);
    label.position.copy(horizonVector(azimuth, 92.7));
    horizonLayer.add(label);
  });
  horizonLayer.visible = interactiveStarLayer.visible && observerMode.checked;
}

function applyStarFilters() {
  const query = starSearch.value.trim().toLowerCase();
  const magnitude = starRangeValues('magnitude');
  const distanceLog = starRangeValues('distance');
  const distance = [10 ** distanceLog[0], 10 ** distanceLog[1]];
  const age = starRangeValues('age');
  const mass = starRangeValues('mass');
  const luminosityLog = starRangeValues('luminosity');
  const luminosity = [10 ** luminosityLog[0], 10 ** luminosityLog[1]];
  const temperature = starRangeValues('temperature');
  const constellation = constellationSelect.value;
  let shown = 0;
  starSprites.forEach(sprite => {
    const star = sprite.userData.star;
    const spectral = (star.spectralClass || '').charAt(0).toUpperCase();
    const matches = (!query || star.name.toLowerCase().includes(query)) &&
      star.magnitude >= magnitude[0] && star.magnitude <= magnitude[1] &&
      star.distance >= distance[0] && star.distance <= distance[1] &&
      star.age >= age[0] && star.age <= age[1] &&
      star.mass >= mass[0] && star.mass <= mass[1] &&
      star.luminosity >= luminosity[0] && star.luminosity <= luminosity[1] &&
      star.temperature >= temperature[0] && star.temperature <= temperature[1] &&
      activeSpectral.has(spectral) &&
      (constellation === 'all' || star.constellation === constellation) &&
      (!observerMode.checked || altitudeForStar(star) >= 0);
    sprite.visible = matches;
    if (sprite.userData.label) sprite.userData.label.visible = matches;
    if (matches) shown++;
  });
  Object.keys(starRanges).forEach(updateStarRange);
  starCount.textContent = `${shown} of ${interactiveStars.length} stars shown${observerMode.checked ? ' above the horizon' : ''}`;
  horizonLayer.visible = interactiveStarLayer.visible && observerMode.checked;
  if (selectedStar) {
    const selectedSprite = starSprites.find(sprite => sprite.userData.star === selectedStar);
    if (!selectedSprite?.visible) closeStarPanel();
  }
}

function setObserverInputs(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  observerDate.value = local.toISOString().slice(0, 10);
  observerTime.value = local.toISOString().slice(11, 16);
  observerDateTime = new Date(`${observerDate.value}T${observerTime.value}`);
}

function applyObserverView() {
  observerDateTime = new Date(`${observerDate.value}T${observerTime.value}`);
  if (Number.isNaN(observerDateTime.getTime())) observerDateTime = new Date();
  rebuildHorizon();
  applyStarFilters();
  if (!observerMode.checked) return;
  const zenith = celestialVector(localSiderealHours(observerDateTime, observerLongitude), observerLatitude, 1).normalize();
  const startDirection = viewDirection.clone();
  targetDirection = zenith;
  animation = { start: performance.now(), duration: 1400, startDirection, startFov: camera.fov, targetFov: 95 };
}

const constellationNames = [...new Set(interactiveStars.map(star => star.constellation))].sort((a, b) => a.localeCompare(b));
constellationSelect.append(...constellationNames.map(name => {
  const option = document.createElement('option');
  option.value = name;
  option.textContent = name;
  return option;
}));
setObserverInputs();
applyStarFilters();

Object.values(starRanges).forEach(range => {
  range.min.addEventListener('input', applyStarFilters);
  range.max.addEventListener('input', applyStarFilters);
});
starSearch.addEventListener('input', applyStarFilters);
starSearch.addEventListener('keydown', event => {
  if (event.key !== 'Enter') return;
  const match = starSprites.find(sprite => sprite.visible && sprite.userData.star.name.toLowerCase().includes(starSearch.value.trim().toLowerCase()));
  if (match) selectInteractiveStar(match.userData.star);
});
constellationSelect.addEventListener('change', applyStarFilters);
spectralButtons.forEach(button => button.addEventListener('click', () => {
  const value = button.dataset.value;
  if (activeSpectral.has(value)) activeSpectral.delete(value);
  else activeSpectral.add(value);
  button.setAttribute('aria-pressed', String(activeSpectral.has(value)));
  applyStarFilters();
}));
document.querySelector('#clear-star-spectral').addEventListener('click', () => {
  activeSpectral.clear();
  spectralButtons.forEach(button => button.setAttribute('aria-pressed', 'false'));
  applyStarFilters();
});
document.querySelector('#select-star-spectral').addEventListener('click', () => {
  activeSpectral = new Set(spectralButtons.map(button => button.dataset.value));
  spectralButtons.forEach(button => button.setAttribute('aria-pressed', 'true'));
  applyStarFilters();
});
observerMode.addEventListener('change', applyObserverView);
document.querySelector('#apply-observer-time').addEventListener('click', applyObserverView);
document.querySelector('#observer-now').addEventListener('click', () => { setObserverInputs(); applyObserverView(); });
document.querySelector('#use-my-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    observerLocation.textContent = 'Location is not available in this browser.';
    return;
  }
  observerLocation.textContent = 'Requesting location…';
  navigator.geolocation.getCurrentPosition(position => {
    observerLatitude = position.coords.latitude;
    observerLongitude = position.coords.longitude;
    observerLocation.textContent = `${observerLatitude.toFixed(3)}°, ${observerLongitude.toFixed(3)}°`;
    observerMode.checked = true;
    applyObserverView();
  }, () => { observerLocation.textContent = 'Location was not shared. Using Stockholm.'; });
});
document.querySelector('#reset-star-filters').addEventListener('click', () => {
  starSearch.value = '';
  Object.values(starRanges).forEach(range => { range.min.value = range.defaults[0]; range.max.value = range.defaults[1]; });
  activeSpectral = new Set(spectralButtons.map(button => button.dataset.value));
  spectralButtons.forEach(button => button.setAttribute('aria-pressed', 'true'));
  constellationSelect.value = 'all';
  observerMode.checked = false;
  horizonLayer.visible = false;
  applyStarFilters();
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

function closeStarTools() {
  starToolsPanel.hidden = true;
  starToolsButton.classList.remove('is-active');
  starToolsButton.setAttribute('aria-expanded', 'false');
}

function closeStarPanel() {
  selectedStar = null;
  starPanel.classList.remove('is-visible');
  setTimeout(() => {
    if (!starPanel.classList.contains('is-visible')) starPanel.hidden = true;
  }, 350);
}

function closePhotoPanel() {
  selected = null;
  document.querySelectorAll('.sky-targets button').forEach(button => button.classList.remove('is-active'));
  panel.classList.remove('is-visible');
  setTimeout(() => {
    if (!panel.classList.contains('is-visible')) panel.hidden = true;
  }, 350);
}

function selectInteractiveStar(star) {
  selectedStar = star;
  closePhotoPanel();
  closeStarTools();
  targetDirection = celestialVector(star.ra / 15, star.dec, 1).normalize();
  const startDirection = viewDirection.clone();
  animation = {
    start: performance.now(),
    duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 1500,
    startDirection,
    startFov: camera.fov,
    targetFov: 18
  };

  const position = formatPosition(targetDirection);
  starPanel.querySelector('.star-panel-name').textContent = star.name;
  starPanel.querySelector('.star-panel-description').textContent = star.description || `${star.name} is a ${star.spectralClass}-class star in ${star.constellation}.`;
  starDetailFields.constellation.textContent = star.constellation;
  starDetailFields.spectral.textContent = star.spectralClass;
  starDetailFields.magnitude.textContent = star.magnitude.toFixed(2).replace('-', '−');
  starDetailFields.distance.textContent = `${starNumber.format(star.distance)} light-years`;
  starDetailFields.temperature.textContent = `${starInteger.format(star.temperature)} K`;
  starDetailFields.luminosity.textContent = `${starNumber.format(star.luminosity)} L☉`;
  starDetailFields.mass.textContent = `${starNumber.format(star.mass)} M☉`;
  starDetailFields.radius.textContent = `${starNumber.format(star.radius)} R☉`;
  starDetailFields.age.textContent = `${starNumber.format(star.age)} billion years`;
  starDetailFields.position.textContent = `RA ${position.ra} · Dec ${position.dec}`;
  starPanel.querySelector('.star-hr-link').href = `hr-diagram.html?star=${encodeURIComponent(star.name)}`;
  starPanel.hidden = false;
  starPanel.classList.remove('is-visible');
  requestAnimationFrame(() => starPanel.classList.add('is-visible'));
}

function selectObservation(observation) {
  closeStarPanel();
  closeStarTools();
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
  closePhotoPanel();
  closeStarPanel();
  closeStarTools();
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
  if (!dragging) {
    if (!interactiveStarLayer.visible) return;
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(starSprites.filter(sprite => sprite.visible), false)[0];
    if (!hit) {
      starTooltip.hidden = true;
      canvas.style.cursor = 'grab';
      return;
    }
    const star = hit.object.userData.star;
    starTooltip.innerHTML = `<strong>${star.name}</strong><span>${star.spectralClass} · ${star.constellation}</span>`;
    starTooltip.style.left = `${event.clientX - rect.left}px`;
    starTooltip.style.top = `${event.clientY - rect.top}px`;
    starTooltip.hidden = false;
    canvas.style.cursor = 'pointer';
    return;
  }
  starTooltip.hidden = true;
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
  if (interactiveStarLayer.visible) {
    const starHit = raycaster.intersectObjects(starSprites.filter(sprite => sprite.visible), false)[0];
    if (starHit?.object.userData.star) {
      selectInteractiveStar(starHit.object.userData.star);
      return;
    }
  }
  const photoHit = raycaster.intersectObjects(selectable, false)[0];
  if (photoHit?.object.userData.observation) selectObservation(photoHit.object.userData.observation);
});

canvas.addEventListener('pointerleave', () => {
  starTooltip.hidden = true;
  if (!dragging) canvas.style.cursor = 'grab';
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
starPanel.querySelector('.star-panel-close').addEventListener('click', closeStarPanel);
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
  constellationFigures.visible = grid.visible && !interactiveStarLayer.visible;
  event.currentTarget.classList.toggle('is-active', grid.visible);
  event.currentTarget.setAttribute('aria-pressed', String(grid.visible));
});
function setInteractiveStars(enabled) {
  interactiveStarLayer.visible = enabled;
  backgroundStarLayer.visible = !enabled;
  constellationFigures.visible = !enabled && grid.visible;
  starLayerButton.classList.toggle('is-active', enabled);
  starLayerButton.setAttribute('aria-pressed', String(enabled));
  starExplorerLaunch.setAttribute('aria-pressed', String(enabled));
  starToolsButton.hidden = !enabled;
  if (enabled) {
    applyStarFilters();
    starToolsPanel.hidden = false;
    starToolsButton.classList.add('is-active');
    starToolsButton.setAttribute('aria-expanded', 'true');
  } else {
    closeStarTools();
    closeStarPanel();
    horizonLayer.visible = false;
    starTooltip.hidden = true;
    canvas.style.cursor = 'grab';
  }
}
starLayerButton.addEventListener('click', () => setInteractiveStars(!interactiveStarLayer.visible));
starExplorerLaunch.addEventListener('click', () => setInteractiveStars(!interactiveStarLayer.visible));
starToolsButton.addEventListener('click', () => {
  const opening = starToolsPanel.hidden;
  starToolsPanel.hidden = !opening;
  starToolsButton.classList.toggle('is-active', opening);
  starToolsButton.setAttribute('aria-expanded', String(opening));
});
document.querySelector('#close-star-tools').addEventListener('click', closeStarTools);

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
  const starScale = THREE.MathUtils.clamp(camera.fov / 50, .4, 1.5);
  starSprites.forEach(sprite => sprite.scale.setScalar(sprite.userData.baseScale * starScale));
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

setTimeout(() => loading.classList.add('is-hidden'), 7000);
