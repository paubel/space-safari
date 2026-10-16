import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const DEG = Math.PI / 180;
const GALACTIC_TO_EQUATORIAL = [
  [-0.0548755604, 0.4941094279, -0.8676661490],
  [-0.8734370902, -0.4448296300, -0.1980763734],
  [-0.4838350155, 0.7469822445, 0.4559837762]
];
const EQUATORIAL_TO_GALACTIC = [
  [-0.0548755604, -0.8734370902, -0.4838350155],
  [0.4941094279, -0.4448296300, 0.7469822445],
  [-0.8676661490, -0.1980763734, 0.4559837762]
];

function seededRandom(seed = 0x5afaf1) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function gaussian(random) {
  const a = Math.max(1e-7, random());
  const b = random();
  return Math.sqrt(-2 * Math.log(a)) * Math.cos(Math.PI * 2 * b);
}

function galactocentricToScene(x, y, z, sunDistance) {
  // Galactic heliocentric +X points towards the centre; galactocentric +X
  // points from the centre towards the Sun.
  const gx = sunDistance - x;
  const gy = y;
  const gz = z;
  const ex = GALACTIC_TO_EQUATORIAL[0][0] * gx + GALACTIC_TO_EQUATORIAL[0][1] * gy + GALACTIC_TO_EQUATORIAL[0][2] * gz;
  const ey = GALACTIC_TO_EQUATORIAL[1][0] * gx + GALACTIC_TO_EQUATORIAL[1][1] * gy + GALACTIC_TO_EQUATORIAL[1][2] * gz;
  const ez = GALACTIC_TO_EQUATORIAL[2][0] * gx + GALACTIC_TO_EQUATORIAL[2][1] * gy + GALACTIC_TO_EQUATORIAL[2][2] * gz;
  return [ex, ez, -ey];
}

function armPoint(arm, fraction) {
  const safeFraction = THREE.MathUtils.clamp(fraction, 0, 1);
  const radius = arm.startRadiusLy * Math.pow(arm.endRadiusLy / arm.startRadiusLy, safeFraction);
  const angle = (arm.startAngleDegrees + arm.sweepDegrees * safeFraction +
    (arm.bendDegrees || 0) * Math.sin(safeFraction * Math.PI * 2) * Math.sin(safeFraction * Math.PI)) * DEG;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, radius, angle };
}

function prepareStructureCurves(model) {
  model.spurs.forEach(spur => {
    const parent = model.arms.find(arm => arm.id === spur.fromArmId);
    const start = parent ? armPoint(parent, spur.fromFraction) : { x: 0, y: 0 };
    const points = [
      new THREE.Vector3(start.x, start.y, 0),
      ...spur.controlPointsLy.map(([x, y]) => new THREE.Vector3(x, y, 0))
    ];
    spur.curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', .5);
  });
}

function structurePoint(structure, fraction) {
  if (structure.curve) {
    const point = structure.curve.getPointAt(THREE.MathUtils.clamp(fraction, 0, 1));
    return { x: point.x, y: point.y, radius: Math.hypot(point.x, point.y), angle: Math.atan2(point.y, point.x) };
  }
  return armPoint(structure, fraction);
}

function structureTangent(structure, fraction) {
  if (structure.curve) return structure.curve.getTangentAt(THREE.MathUtils.clamp(fraction, 0, 1));
  const before = armPoint(structure, Math.max(0, fraction - .002));
  const after = armPoint(structure, Math.min(1, fraction + .002));
  return new THREE.Vector3(after.x - before.x, after.y - before.y, 0).normalize();
}

function structureWidth(structure, fraction) {
  return THREE.MathUtils.lerp(structure.widthStartLy, structure.widthEndLy, fraction);
}

function galacticWarp(model, radius, angle) {
  const start = model.disk.warpStartLy;
  if (!start || radius <= start) return 0;
  const strength = THREE.MathUtils.clamp((radius - start) / (model.disk.radiusLy - start), 0, 1);
  return Math.sin(angle - model.disk.warpPhaseDegrees * DEG) * model.disk.warpAmplitudeLy * strength * strength;
}

function pushScenePosition(target, x, y, z, sunDistance) {
  target.push(...galactocentricToScene(x, y, z, sunDistance));
}

function chooseWeighted(items, random) {
  const total = items.reduce((sum, item) => sum + item.prominence, 0);
  let value = random() * total;
  for (const item of items) {
    value -= item.prominence;
    if (value <= 0) return item;
  }
  return items[items.length - 1];
}

function sampledFraction(structure, random) {
  // Rejection sampling avoids endpoint piles and periodic pearl-like clumps.
  for (let attempt = 0; attempt < 40; attempt++) {
    const f = random();
    let density = .70 + .20 * Math.sin(f * 49 + structure.startRadiusLy * .001) +
      .10 * Math.sin(f * 113 + structure.prominence * 17);
    density *= Math.min(1, f / .04, (1 - f) / .09);
    for (const [centre, width, depth] of structure.gaps || []) {
      density *= 1 - depth * Math.exp(-.5 * ((f - centre) / width) ** 2);
    }
    if (random() < density) return f;
  }
  return .15 + random() * .7;
}

function exponentialHeight(random, scale) {
  return (random() < .5 ? -1 : 1) * -Math.log(Math.max(1e-7, random())) * scale;
}

function sampleDiskRadius(model, random) {
  // Area element R dR makes an exponential surface density a Gamma(2) law.
  let radius;
  do { radius = -model.disk.scaleLengthLy * Math.log(Math.max(1e-10, random() * random())); }
  while (radius > model.disk.radiusLy);
  return radius;
}

function makeArmData(model, count, random, dust = false) {
  const positions = [];
  const colours = [];
  const sunDistance = model.sunDistanceFromCentreLy;
  const armsAndSpur = [...model.arms, ...model.spurs];

  for (let index = 0; index < count; index++) {
    const structure = chooseWeighted(dust ? model.arms : armsAndSpur, random);
    const fraction = sampledFraction(structure, random);
    const point = structurePoint(structure, fraction);
    const tangent = structureTangent(structure, fraction);
    const width = structureWidth(structure, fraction);
    const taper = Math.min(1, fraction / .035, (1 - fraction) / .055);
    const dustLaneOffset = dust ? -width * .22 : 0;
    const filament = Math.sin(fraction * 83 + point.angle) * width * .10;
    const across = dustLaneOffset + filament + gaussian(random) * width * (dust ? .14 : .42) * Math.max(.18, taper);
    const x = point.x - tangent.y * across;
    const y = point.y + tangent.x * across;
    const z = galacticWarp(model, point.radius, point.angle) +
      gaussian(random) * (dust ? 105 : 170 + point.radius * .007);
    const colourRoll = random();
    const colour = dust
      ? new THREE.Color().setRGB(.105 + random() * .035, .055 + random() * .022, .038 + random() * .015)
      : colourRoll < .10
        ? new THREE.Color().setRGB(.54 + random() * .13, .63 + random() * .14, .90)
        : colourRoll < .125
          ? new THREE.Color().setRGB(.78 + random() * .16, .22 + random() * .12, .18 + random() * .08)
          : new THREE.Color().setRGB(.68 + random() * .15, .65 + random() * .15, .70 + random() * .16);
    pushScenePosition(positions, x, y, z, sunDistance);
    colours.push(colour.r, colour.g, colour.b);
  }
  return { positions, colours };
}

function makeDiskData(model, count, random) {
  const positions = [];
  const colours = [];
  for (let index = 0; index < count; index++) {
    const radius = sampleDiskRadius(model, random);
    const angle = random() * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const thickDisk = random() < model.disk.thickDiskFraction;
    const thickness = thickDisk ? model.sampling.thickScaleHeightLy : model.sampling.thinScaleHeightLy;
    const z = galacticWarp(model, radius, angle) +
      exponentialHeight(random, thickness) * (1 + model.sampling.flareFraction * (radius / model.disk.radiusLy) ** 2);
    const warmth = 1 - THREE.MathUtils.clamp(radius / 24000, 0, 1);
    const colour = new THREE.Color().setRGB(
      .59 + warmth * .19 + random() * .12,
      .57 + warmth * .12 + random() * .11,
      .65 - warmth * .10 + random() * .12
    );
    pushScenePosition(positions, x, y, z, model.sunDistanceFromCentreLy);
    colours.push(colour.r, colour.g, colour.b);
  }
  return { positions, colours };
}

function makeDustData(model, count, random) {
  const data = { positions: [], colours: [] };
  // Interleave both populations: every quality prefix retains diffuse dust.
  for (let index = 0; index < count; index++) {
    if (random() < .64) {
      const arm = makeArmData(model, 1, random, true);
      data.positions.push(...arm.positions);
      data.colours.push(...arm.colours);
      continue;
    }
    const radius = sampleDiskRadius(model, random);
    const angle = random() * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = galacticWarp(model, radius, angle) + gaussian(random) * 85;
    const colour = new THREE.Color().setRGB(.075 + random() * .035, .038 + random() * .018, .026 + random() * .012);
    pushScenePosition(data.positions, x, y, z, model.sunDistanceFromCentreLy);
    data.colours.push(colour.r, colour.g, colour.b);
  }
  return data;
}

function makeCoreData(model, count, random) {
  const positions = [];
  const colours = [];
  const barAngle = model.bar.angleDegrees * DEG;
  for (let index = 0; index < count; index++) {
    let x;
    let y;
    let z;
    let colour;
    if (random() < model.sampling.barFraction) {
      const halfLength = model.bar.lengthLy * .5;
      let along;
      do { along = gaussian(random) * halfLength * .49; } while (Math.abs(along) > halfLength);
      const endTaper = Math.sqrt(Math.max(.06, 1 - Math.pow(along / halfLength, 2)));
      const across = gaussian(random) * model.bar.widthLy * .22 * endTaper;
      x = Math.cos(barAngle) * along - Math.sin(barAngle) * across;
      y = Math.sin(barAngle) * along + Math.cos(barAngle) * across;
      z = gaussian(random) * model.bar.halfThicknessLy * .32 * endTaper;
      colour = new THREE.Color().setRGB(.88 + random() * .10, .70 + random() * .16, .52 + random() * .12);
    } else {
      // Correlated ellipsoidal density, no cylindrical cusp/spike at R=0.
      const along = gaussian(random) * model.bulge.radiusLy * .43;
      const across = gaussian(random) * model.bulge.radiusLy * .27;
      x = Math.cos(barAngle) * along - Math.sin(barAngle) * across;
      y = Math.sin(barAngle) * along + Math.cos(barAngle) * across;
      z = gaussian(random) * model.bulge.halfThicknessLy * .48 *
        (.75 + .30 * Math.exp(-(((Math.abs(along) - 2200) / 1800) ** 2)));
      colour = new THREE.Color().setRGB(.90 + random() * .10, .76 + random() * .16, .62 + random() * .13);
    }
    pushScenePosition(positions, x, y, z, model.sunDistanceFromCentreLy);
    colours.push(colour.r, colour.g, colour.b);
  }
  return { positions, colours };
}

function makeHaloData(model, count, random) {
  const data = { positions: [], colours: [] };
  for (let i = 0; i < count; i++) {
    const radius = 9000 * Math.pow(model.sampling.haloRadiusLy / 9000, random());
    const angle = random() * Math.PI * 2;
    const cosine = random() * 2 - 1;
    const planar = radius * Math.sqrt(1 - cosine * cosine);
    pushScenePosition(data.positions, planar * Math.cos(angle), planar * Math.sin(angle), radius * cosine * .72, model.sunDistanceFromCentreLy);
    data.colours.push(.59, .54, .46);
  }
  return data;
}

function makeMaterial({ dust = false, glow = false, model } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: dust ? THREE.NormalBlending : THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: {
      uLinear: { value: 0 },
      uMaximumDistance: { value: 8000 },
      uOpacity: { value: dust ? .26 : .42 },
      uPointSize: { value: dust ? 3.2 : 2.0 },
      uCameraGalactic: { value: new THREE.Vector3() },
      uSunDistance: { value: model.sunDistanceFromCentreLy },
      uExtinction: { value: model.sampling.extinctionStrength },
      uCinematic: { value: 0 },
      uGlow: { value: glow ? 1 : 0 }
    },
    vertexShader: `
      uniform float uLinear;
      uniform float uMaximumDistance;
      uniform float uPointSize;
      uniform vec3 uCameraGalactic;
      uniform float uSunDistance;
      uniform float uExtinction;
      uniform float uGlow;
      varying vec3 vColour;
      varying float vVisible;
      varying float vTransmission;
      void main() {
        float physicalDistance = length(position);
        float linearDistance = physicalDistance * (80.0 / max(1.0, uMaximumDistance));
        float logarithmicDistance = 30.0 * log(1.0 + physicalDistance) / log(10.0);
        float shownDistance = mix(logarithmicDistance, linearDistance, uLinear);
        vec3 shownPosition = physicalDistance > 0.001 ? normalize(position) * shownDistance : position;
        // The catalogue distance control changes the linear scale, but the
        // Milky Way is a persistent context layer and must remain available
        // when the user zooms out beyond the selected catalogue range.
        vVisible = 1.0;
        vColour = color;
        // A short optical-depth integral through the synthetic dust disk.
        // These are physical light-years in the same frame as the geometry.
        vec3 e = vec3(position.x, -position.z, position.y);
        vec3 g = vec3(uSunDistance - dot(vec3(-.0548755604,-.8734370902,-.4838350155),e),
          dot(vec3(.4941094279,-.4448296300,.7469822445),e),
          dot(vec3(-.8676661490,-.1980763734,.4559837762),e));
        vec3 ray = g - uCameraGalactic;
        float tPlane = clamp(-uCameraGalactic.z / (abs(ray.z) < .001 ? .001 : ray.z), 0.0, 1.0);
        vec3 crossing = uCameraGalactic + ray * tPlane;
        float radius = length(crossing.xy);
        float dustPatch = .55 + .22*sin(crossing.x*.0012 + sin(crossing.y*.0017)) +
          .16*sin(crossing.y*.0031 + crossing.x*.0014);
        float column = exp(-radius/26000.0) * exp(-abs(crossing.z)/240.0) *
          min(7.0, length(ray)/max(240.0,abs(ray.z))) * dustPatch;
        vTransmission = exp(-column * uExtinction * uLinear);
        vec4 mvPosition = modelViewMatrix * vec4(shownPosition, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = vVisible * uPointSize * clamp(155.0 / max(18.0, -mvPosition.z), .65, 2.7);
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      uniform float uCinematic;
      uniform float uGlow;
      varying vec3 vColour;
      varying float vVisible;
      varying float vTransmission;
      void main() {
        vec2 centred = gl_PointCoord - .5;
        float radius = length(centred) * 2.0;
        float profile = mix(smoothstep(1.0, .12, radius), exp(-radius*radius*4.5) * smoothstep(1.0,.65,radius), uGlow);
        float alpha = profile * uOpacity * vVisible * vTransmission;
        if (alpha < .001) discard;
        vec3 colour = mix(vColour, pow(vColour, vec3(.84)), uCinematic);
        gl_FragColor = vec4(colour, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `
  });
}

function createPoints(data, material, name) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(data.colours, 3));
  geometry.computeBoundingSphere();
  const points = new THREE.Points(geometry, material);
  points.name = name;
  points.frustumCulled = false;
  return points;
}

function labelAnchor(structure, model) {
  const point = structurePoint(structure, structure.labelFraction ?? .58);
  return galactocentricToScene(point.x, point.y, 420, model.sunDistanceFromCentreLy);
}

function sceneToGalactocentric(position, sunDistance) {
  const ex = position.x;
  const ey = -position.z;
  const ez = position.y;
  const gx = EQUATORIAL_TO_GALACTIC[0][0] * ex + EQUATORIAL_TO_GALACTIC[0][1] * ey + EQUATORIAL_TO_GALACTIC[0][2] * ez;
  const gy = EQUATORIAL_TO_GALACTIC[1][0] * ex + EQUATORIAL_TO_GALACTIC[1][1] * ey + EQUATORIAL_TO_GALACTIC[1][2] * ez;
  const gz = EQUATORIAL_TO_GALACTIC[2][0] * ex + EQUATORIAL_TO_GALACTIC[2][1] * ey + EQUATORIAL_TO_GALACTIC[2][2] * ez;
  return { x: sunDistance - gx, y: gy, z: gz };
}

function pointToSegmentDistance(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const lengthSquared = abx * abx + aby * aby;
  const t = lengthSquared > 0 ? THREE.MathUtils.clamp(((px - ax) * abx + (py - ay) * aby) / lengthSquared, 0, 1) : 0;
  return Math.hypot(px - (ax + abx * t), py - (ay + aby * t));
}

function distanceToStructure(position, structure, model) {
  let minimum = Infinity;
  let previous = structurePoint(structure, 0);
  for (let index = 1; index <= 180; index++) {
    const current = structurePoint(structure, index / 180);
    minimum = Math.min(minimum, pointToSegmentDistance(position.x, position.y, previous.x, previous.y, current.x, current.y));
    previous = current;
  }
  return minimum;
}

function classifyPosition(position, object, model) {
  const type = String(object?.type || '').toLowerCase();
  const name = String(object?.name || '');
  const galactic = sceneToGalactocentric(position, model.sunDistanceFromCentreLy);
  const centreDistance = Math.hypot(galactic.x, galactic.y, galactic.z);

  if (/sagittarius a/i.test(name)) return { label: 'Galactic Centre', confidence: 'high', modelVersion: model.modelVersion };
  if (/globular/.test(type)) return { label: 'Galactic halo/bulge population', confidence: 'not arm-classified', modelVersion: model.modelVersion };
  if (centreDistance < model.bulge.radiusLy) return { label: 'Galactic bulge', confidence: 'medium', modelVersion: model.modelVersion };

  const structures = [...model.arms, ...model.spurs];
  const candidates = structures.map(structure => ({
    structure,
    distance: distanceToStructure(galactic, structure, model)
  })).sort((a, b) => a.distance - b.distance);
  const nearest = candidates[0];
  const width = Math.max(nearest.structure.widthStartLy, nearest.structure.widthEndLy);
  const inherentlyUncertain = /planetary nebula|white dwarf/.test(type);
  let confidence = nearest.distance <= width ? 'model proximity; membership unverified' : 'low';
  if (inherentlyUncertain) confidence = 'nearest arm only; membership uncertain';
  else if (Math.abs(galactic.z) > 1800) confidence = 'low';
  return {
    label: nearest.structure.name,
    confidence,
    distanceFromCentrelineLy: Math.round(nearest.distance),
    modelVersion: model.modelVersion
  };
}

const QUALITY = {
  low: { arms: 9000, disk: 16000, core: 6000, dust: 0, halo: 350, glow: 2000, opacity: .62, pointSize: 1.65 },
  medium: { arms: 25000, disk: 40000, core: 14000, dust: 3000, halo: 800, glow: 5000, opacity: .36, pointSize: 1.65 },
  high: { arms: 50000, disk: 80000, core: 28000, dust: 6500, halo: 1500, glow: 9000, opacity: .22, pointSize: 1.65 }
};

export async function createMilkyWay({ scene, modelUrl, displayDistance, initialQuality = 'medium' }) {
  const response = await fetch(modelUrl);
  if (!response.ok) throw new Error(`Milky Way model could not be loaded (${response.status}).`);
  const model = await response.json();
  prepareStructureCurves(model);
  const group = new THREE.Group();
  group.name = 'milkyWayGroup';
  group.renderOrder = -5;

  const random = seededRandom(model.sampling.seed);
  const arms = createPoints(makeArmData(model, QUALITY.high.arms, random), makeMaterial({ model }), 'Milky Way spiral arms');
  const disk = createPoints(makeDiskData(model, QUALITY.high.disk, random), makeMaterial({ model }), 'Milky Way stellar disk');
  const core = createPoints(makeCoreData(model, QUALITY.high.core, random), makeMaterial({ model }), 'Milky Way central bar and bulge');
  const dust = createPoints(makeDustData(model, QUALITY.high.dust, random), makeMaterial({ dust: true, model }), 'Milky Way dust lanes');
  const halo = createPoints(makeHaloData(model, QUALITY.high.halo, random), makeMaterial({ model }), 'Sparse stellar halo');
  // Reuse sampled densities as broad soft splats; this is not a second model.
  const glowData = { positions: [], colours: [] };
  const populations = [disk, disk, disk, arms, core];
  for (let i = 0; i < QUALITY.high.glow; i++) {
    const source = populations[i % populations.length].geometry;
    const p = source.getAttribute('position');
    const c = source.getAttribute('color');
    const j = Math.floor(random() * p.count);
    glowData.positions.push(p.getX(j), p.getY(j), p.getZ(j));
    glowData.colours.push(c.getX(j), c.getY(j), c.getZ(j));
  }
  const glow = createPoints(glowData, makeMaterial({ glow: true, model }), 'Soft stellar density');
  group.add(halo, glow, disk, arms, core, dust);
  const particles = [arms, disk, core, dust, halo, glow];

  const outlines = new THREE.Group();
  const uncertainty = new THREE.Group();
  const projectables = [];
  function physicalLine(points, colour, opacity, destination) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: colour, transparent: true, opacity, depthWrite: false }));
    line.userData.physical = geometry.getAttribute('position').array.slice();
    projectables.push(line);
    destination.add(line);
  }
  [...model.arms, ...model.spurs].forEach(structure => {
    const points = [];
    const bounds = [[], []];
    for (let i = 0; i <= 180; i++) {
      const f = i / 180;
      const p = structurePoint(structure, f);
      const t = structureTangent(structure, f);
      points.push(galactocentricToScene(p.x, p.y, 0, model.sunDistanceFromCentreLy));
      bounds.forEach((bound, side) => {
        const width = structureWidth(structure, f) * (side === 0 ? -1 : 1) *
          (structure.confidence.includes('low') ? 1.6 : 1.15);
        bound.push(galactocentricToScene(p.x - t.y * width, p.y + t.x * width, 0, model.sunDistanceFromCentreLy));
      });
    }
    physicalLine(points, 0x8cbad4, .44, outlines);
    bounds.forEach(bound => physicalLine(bound, 0xdcb881, .23, uncertainty));
  });
  outlines.visible = uncertainty.visible = false;
  group.add(outlines, uncertainty);

  const references = [];
  function referenceLabel(text, coordinates, className = '') {
    const element = document.createElement('span');
    element.className = 'universe-milky-way-label ' + className;
    element.textContent = text;
    const label = new CSS2DObject(element);
    label.userData.physicalPosition = new THREE.Vector3(...coordinates);
    group.add(label);
    references.push(label);
    return label;
  }
  referenceLabel('☉ Sun · ≈8.2 kpc', [0, 0, 0], 'universe-galaxy-sun');
  referenceLabel('Galactic Center', galactocentricToScene(0, 0, 0, model.sunDistanceFromCentreLy));
  const scaleStart = galactocentricToScene(-36000, -36000, 0, model.sunDistanceFromCentreLy);
  const scaleEnd = galactocentricToScene(-26000, -36000, 0, model.sunDistanceFromCentreLy);
  const scaleGroup = new THREE.Group();
  physicalLine([scaleStart, scaleEnd], 0xb5c4d5, .7, scaleGroup);
  group.add(scaleGroup);
  const scaleLabel = referenceLabel('10,000 ly · linear scale', scaleStart);

  const labels = [...model.arms, ...model.spurs].map(structure => {
    const element = document.createElement('span');
    element.className = 'universe-milky-way-label';
    element.textContent = structure.name;
    element.title = `${structure.confidence} confidence in this model`;
    const label = new CSS2DObject(element);
    label.userData.physicalPosition = new THREE.Vector3(...labelAnchor(structure, model));
    group.add(label);
    return label;
  });

  scene.add(group);
  let scaleMode = 'compressed';
  let maximumDistance = 8000;
  let labelsVisible = false;
  let referencesVisible = true;
  let visualMode = 'scientific';
  let quality = initialQuality;

  function updateLabels() {
    labels.forEach(label => {
      const physical = label.userData.physicalPosition;
      const distance = physical.length();
      label.position.copy(physical).normalize().multiplyScalar(displayDistance(distance));
      label.visible = group.visible && labelsVisible;
    });
    references.forEach(label => {
      const physical = label.userData.physicalPosition;
      const distance = physical.length();
      label.position.copy(physical).multiplyScalar(distance > 0 ? displayDistance(distance) / distance : 1);
      label.visible = group.visible && referencesVisible && (label !== scaleLabel || scaleMode === 'linear');
    });
    scaleGroup.visible = referencesVisible && scaleMode === 'linear';
    projectables.forEach(line => {
      const data = line.userData.physical;
      const position = line.geometry.getAttribute('position');
      for (let i = 0; i < position.count; i++) {
        const p = new THREE.Vector3(data[i*3], data[i*3+1], data[i*3+2]);
        const distance = p.length();
        p.multiplyScalar(distance > 0 ? displayDistance(distance) / distance : 1);
        position.setXYZ(i, p.x, p.y, p.z);
      }
      position.needsUpdate = true;
      line.frustumCulled = false;
    });
  }

  function updateUniforms() {
    particles.map(p => p.material).forEach(material => {
      material.uniforms.uLinear.value = scaleMode === 'linear' ? 1 : 0;
      material.uniforms.uMaximumDistance.value = maximumDistance;
    });
    updateLabels();
  }

  const api = {
    group,
    model,
    setVisible(visible) {
      group.visible = Boolean(visible);
      updateLabels();
    },
    setLabelsVisible(visible) {
      labelsVisible = Boolean(visible);
      updateLabels();
    },
    setLayer(layer, visible) {
      if (layer === 'outlines') outlines.visible = Boolean(visible);
      if (layer === 'uncertainty') uncertainty.visible = Boolean(visible);
      if (layer === 'references') referencesVisible = Boolean(visible);
      updateLabels();
    },
    setVisualMode(mode) {
      visualMode = mode === 'cinematic' ? mode : 'scientific';
      api.setQuality(quality);
    },
    getPhysicalPosition(x, y, z = 0) {
      return new THREE.Vector3(...galactocentricToScene(x, y, z, model.sunDistanceFromCentreLy));
    },
    setScaleMode(mode, maximum) {
      scaleMode = mode === 'linear' ? 'linear' : 'compressed';
      maximumDistance = Math.max(1, Number(maximum) || maximumDistance);
      updateUniforms();
    },
    setQuality(level) {
      quality = level;
      const profile = QUALITY[level] || QUALITY.medium;
      arms.geometry.setDrawRange(0, profile.arms);
      disk.geometry.setDrawRange(0, profile.disk);
      core.geometry.setDrawRange(0, profile.core);
      dust.geometry.setDrawRange(0, profile.dust);
      halo.geometry.setDrawRange(0, profile.halo);
      glow.geometry.setDrawRange(0, profile.glow);
      const richness = visualMode === 'cinematic' ? 1.35 : 1;
      particles.forEach(p => { p.material.uniforms.uCinematic.value = visualMode === 'cinematic' ? 1 : 0; });
      arms.material.uniforms.uOpacity.value = profile.opacity * richness * .90;
      arms.material.uniforms.uPointSize.value = profile.pointSize;
      disk.material.uniforms.uOpacity.value = profile.opacity * richness * 1.10;
      disk.material.uniforms.uPointSize.value = profile.pointSize * .92;
      core.material.uniforms.uOpacity.value = profile.opacity * richness * .64;
      core.material.uniforms.uPointSize.value = profile.pointSize * .90;
      dust.material.uniforms.uOpacity.value = .12;
      halo.material.uniforms.uOpacity.value = .20;
      halo.material.uniforms.uPointSize.value = 1;
      glow.material.uniforms.uOpacity.value = model.sampling.glowOpacity * (9000 / profile.glow) * (visualMode === 'cinematic' ? 1.65 : 1);
      glow.material.uniforms.uPointSize.value = visualMode === 'cinematic' ? 18 : 14;
      dust.visible = profile.dust > 0;
    },
    update(camera) {
      if (!group.visible) return;
      const physicalCamera = camera.position.clone();
      if (scaleMode === 'linear') physicalCamera.multiplyScalar(maximumDistance / 80);
      const g = sceneToGalactocentric(physicalCamera, model.sunDistanceFromCentreLy);
      particles.forEach(p => p.material.uniforms.uCameraGalactic.value.set(g.x, g.y, g.z));
    },
    classifyPosition(position, object = {}) {
      return classifyPosition(position, object, model);
    },
    dispose() {
      scene.remove(group);
      [...labels, ...references].forEach(label => label.element?.remove());
      [...particles, ...projectables].forEach(points => {
        points.geometry.dispose();
        points.material.dispose();
      });
      group.clear();
    }
  };

  api.setQuality(initialQuality);
  updateUniforms();
  return api;
}
