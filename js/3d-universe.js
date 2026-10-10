import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
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
  nebulae: document.querySelector('#universe-nebulae'),
  nebulaStatus: document.querySelector('#universe-model-status'),
  nebulaList: document.querySelector('#universe-nebula-list'),
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
  }
];

const volumeMaterials = [];

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

function displayPositionForObject(object) {
  if (object.physicalPosition.lengthSq() === 0) return new THREE.Vector3();
  return object.physicalPosition.clone().normalize().multiplyScalar(displayDistance(Number(object.distance)));
}

function createStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 96;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(48, 48, 0, 48, 48, 48);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(.1, 'rgba(255,255,255,.98)');
  gradient.addColorStop(.24, 'rgba(255,255,255,.72)');
  gradient.addColorStop(.42, 'rgba(255,255,255,.2)');
  gradient.addColorStop(.64, 'rgba(255,255,255,0)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 96, 96);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function markerSize(star) {
  if (/^(sun|sol)/i.test(star.name)) return scaleMode === 'linear' ? .72 : 5.2;
  const magnitude = Number.isFinite(Number(star.magnitude)) ? Number(star.magnitude) : 5;
  const size = THREE.MathUtils.clamp(3.5 + (3 - magnitude) * .35, 2.4, 5.4);
  return scaleMode === 'linear' ? size * .18 : size;
}

function buildScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02050b, .0017);
  scene.add(new THREE.HemisphereLight(0xbcd8ff, 0x24131d, 2.2));
  const modelLight = new THREE.DirectionalLight(0xffffff, 2.8);
  modelLight.position.set(80, 110, 60);
  scene.add(modelLight);
  camera = new THREE.PerspectiveCamera(50, 1, .001, 2000);
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
  orbit.minDistance = .004;
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
  scene.add(new THREE.Points(background, new THREE.PointsMaterial({ color: 0x6f82a8, size: 1.05, transparent: true, opacity: .5, sizeAttenuation: false })));
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
    uShape: { value: nebula.volumeShape === 'ring' ? 1 : nebula.volumeShape === 'cluster' ? 2 : nebula.volumeShape === 'dumbbell' ? 3 : nebula.volumeShape === 'rho' ? 4 : nebula.volumeShape === 'crab' ? 5 : nebula.volumeShape === 'carina' ? 7 : nebula.volumeShape === 'northamerica' ? 8 : 0 }
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
                        : mix(vec3(.12,.28,.82), vec3(1.0,.28,.18), warm);
          colour = mix(colour, vec3(.76,.91,1.0), pow(density, 2.2) * .55);
          float alpha = density * (uShape == 4 ? .16 : .095) * (1.0 - accumulated.a);
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
    nebula.volumeShape === 'ring' ? -.48 : -.24,
    nebula.volumeShape === 'ring' ? .22 : .38,
    nebula.volumeShape === 'ring' ? 1.05 : -.18
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

async function loadNebulaModel(nebula) {
  const model = nebula.volumeShape === 'eta'
    ? await createHomunculusModel(nebula)
    : createDiffuseNebulaVolume(nebula);

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
  const button = controlsUi.nebulaList.querySelector(`[data-nebula="${nebula.shortName}"]`);
  if (button) button.disabled = false;
  updateVisibleNebulae();
  return item;
}

let nebulaLoadPromise;
async function loadNebulae() {
  if (nebulaLoadPromise) return nebulaLoadPromise;
  controlsUi.nebulaStatus.textContent = 'Building nine diffuse objects…';
  controlsUi.nebulae.disabled = true;
  nebulaLoadPromise = Promise.allSettled(NEBULAE.map(async nebula => {
    nebula.physicalPosition = physicalPositionForCoordinates(nebula.ra, nebula.dec, nebula.distance);
    return loadNebulaModel(nebula);
  })).then(results => {
    const loaded = results.filter(result => result.status === 'fulfilled').length;
    controlsUi.nebulae.disabled = false;
    controlsUi.nebulaStatus.textContent = loaded === NEBULAE.length
      ? 'Nine diffuse objects loaded'
      : `${loaded} of ${NEBULAE.length} nebula models loaded`;
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
  updateVisibleNebulae();
}

function updatePositions() {
  starObjects.forEach(item => {
    item.sprite.position.copy(displayPosition(item.star));
    item.sprite.scale.setScalar(markerSize(item.star));
    item.sprite.material.opacity = scaleMode === 'linear' ? .9 : 1;
  });
  nebulaObjects.forEach(item => {
    item.model.position.copy(displayPositionForObject(item.nebula));
    item.hitTarget.position.copy(item.model.position);
    item.hitTarget.scale.setScalar(scaleMode === 'linear' ? 2.2 : 5);
    if (scaleMode === 'linear') {
      const physicalDisplayDiameter = Number(item.nebula.physicalSizeLy) * (80 / maximumDistance());
      const navigationDiameter = Math.max(...item.nebula.displayScale) * 2;
      item.model.scale.setScalar(Math.max(.0005, physicalDisplayDiameter / navigationDiameter));
    } else {
      // The embedded Homunculus keeps its measured scale relative to the 300 ly Carina volume.
      item.model.scale.setScalar(item.nebula.volumeShape === 'eta' ? .004375 : 1);
    }
  });
  if (selected) updateSelectionLine();
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
  details.hr.href = `hr-diagram.html?star=${encodeURIComponent(isSun ? 'Sol' : star.name)}`;
  details.hr.hidden = false;
  details.source.hidden = true;
  controlsUi.fly.textContent = 'Fly to selected star';
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
  if (nebula.distance > maximumDistance()) controlsUi.distance.value = Math.log10(nebula.distance).toFixed(2);
  selected = nebula;
  setDetailLabels({
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
  details.radius.textContent = `≈ ${number.format(nebula.physicalSizeLy)} ly`;
  details.hr.hidden = true;
  details.source.href = nebula.sourceUrl;
  details.source.textContent = nebula.volumeShape === 'eta' ? 'Open ESO 3D model source →' : 'Open NASA model source →';
  details.source.hidden = false;
  controlsUi.fly.textContent = nebula.volumeShape === 'eta'
    ? 'Zoom in on Homunculus and Eta A/B'
    : 'Fly to selected object';
  updatePositions();
  if (fly) flyToStar(nebula);
}

function flyToStar(star) {
  const starItem = starObjects.find(candidate => candidate.star === star);
  const nebulaItem = nebulaObjects.find(candidate => candidate.nebula === star);
  const targetObject = starItem?.sprite || nebulaItem?.model;
  if (!targetObject) return;
  const destinationTarget = targetObject.position.clone();
  const direction = camera.position.clone().sub(orbit.target).normalize();
  const etaDiameter = nebulaItem?.nebula.volumeShape === 'eta'
    ? Math.max(...nebulaItem.nebula.displayScale) * 2 * nebulaItem.model.scale.x
    : 0;
  const offset = /^(sun|sol)/i.test(star.name)
    ? 105
    : nebulaItem
      ? (nebulaItem.nebula.volumeShape === 'eta' ? Math.max(.012, etaDiameter * 1.7) : scaleMode === 'linear' ? 5 : 28)
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
}

function animate(time) {
  isAnimating = true;
  animationFrame = requestAnimationFrame(animate);
  updateFlight(time);
  orbit.update();
  volumeMaterials.forEach(({ mesh, uniforms }) => {
    uniforms.uTime.value = time * .001;
    uniforms.uCameraLocal.value.copy(mesh.worldToLocal(camera.position.clone()));
  });
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

function resetView() {
  scaleMode = 'compressed';
  controlsUi.scale.find(input => input.value === 'compressed').checked = true;
  controlsUi.distance.value = '3.90';
  controlsUi.spectral.value = 'all';
  controlsUi.labels.checked = true;
  controlsUi.labelMagnitude.value = '1.5';
  controlsUi.plane.checked = true;
  controlsUi.directions.checked = true;
  controlsUi.nebulae.checked = true;
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
  controlsUi.search.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); findStar(); } });
  controlsUi.scale.forEach(input => input.addEventListener('change', () => {
    scaleMode = input.value;
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
  controlsUi.nebulae.addEventListener('change', async () => {
    if (controlsUi.nebulae.checked) {
      controlsUi.distance.value = '3.90';
      await loadNebulae();
    }
    updatePositions();
  });
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
  loadNebulae();
  loading.hidden = true;
  animate(performance.now());
} catch (error) {
  console.error('Could not start the 3D Universe prototype.', error);
  loading.hidden = true;
  errorPanel.hidden = false;
}
