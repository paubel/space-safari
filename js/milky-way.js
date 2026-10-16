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
  const angle = (arm.startAngleDegrees + arm.sweepDegrees * safeFraction) * DEG;
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
  if (random() > structure.clumpiness) return random();
  const clumpCount = structure.role === 'major' ? 22 : 15;
  const centre = (Math.floor(random() * clumpCount) + .5) / clumpCount;
  const spread = structure.role === 'local-branch' ? .055 : structure.role === 'major' ? .026 : .038;
  return THREE.MathUtils.clamp(centre + gaussian(random) * spread, 0, 1);
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
    const across = dustLaneOffset + gaussian(random) * width * (dust ? .18 : .31) * Math.max(.18, taper);
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
          : new THREE.Color().setRGB(.54 + random() * .18, .49 + random() * .16, .61 + random() * .19);
    pushScenePosition(positions, x, y, z, sunDistance);
    colours.push(colour.r, colour.g, colour.b);
  }
  return { positions, colours };
}

function makeDiskData(model, count, random) {
  const positions = [];
  const colours = [];
  for (let index = 0; index < count; index++) {
    const radius = Math.min(model.disk.radiusLy, -Math.log(Math.max(1e-7, 1 - random())) * model.disk.scaleLengthLy);
    const angle = random() * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const thickDisk = random() < model.disk.thickDiskFraction;
    const thickness = thickDisk ? model.disk.thickDiskHalfThicknessLy : model.disk.halfThicknessLy;
    const z = galacticWarp(model, radius, angle) +
      gaussian(random) * thickness * (.34 + .66 * radius / model.disk.radiusLy);
    const warmth = 1 - THREE.MathUtils.clamp(radius / 24000, 0, 1);
    const colour = new THREE.Color().setRGB(
      .40 + warmth * .20 + random() * .12,
      .38 + warmth * .15 + random() * .11,
      .48 + warmth * .08 + random() * .14
    );
    pushScenePosition(positions, x, y, z, model.sunDistanceFromCentreLy);
    colours.push(colour.r, colour.g, colour.b);
  }
  return { positions, colours };
}

function makeDustData(model, count, random) {
  const armCount = Math.round(count * .64);
  const data = makeArmData(model, armCount, random, true);
  for (let index = armCount; index < count; index++) {
    const radius = Math.sqrt(random()) * model.disk.radiusLy;
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
    if (random() < .38) {
      const halfLength = model.bar.lengthLy * .5;
      const along = THREE.MathUtils.clamp(gaussian(random) * halfLength * .45, -halfLength, halfLength);
      const endTaper = Math.sqrt(Math.max(.06, 1 - Math.pow(along / halfLength, 2)));
      const across = gaussian(random) * model.bar.widthLy * .22 * endTaper;
      x = Math.cos(barAngle) * along - Math.sin(barAngle) * across;
      y = Math.sin(barAngle) * along + Math.cos(barAngle) * across;
      z = gaussian(random) * model.bar.halfThicknessLy * .32 * endTaper;
      colour = new THREE.Color().setRGB(.88 + random() * .10, .70 + random() * .16, .52 + random() * .12);
    } else {
      const radius = Math.pow(random(), 1.45) * model.bulge.radiusLy;
      const angle = random() * Math.PI * 2;
      const squash = .88 + .08 * Math.abs(Math.cos(angle - barAngle));
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius * squash;
      z = gaussian(random) * model.bulge.halfThicknessLy * (1 - radius / model.bulge.radiusLy * .55);
      colour = new THREE.Color().setRGB(.90 + random() * .10, .76 + random() * .16, .62 + random() * .13);
    }
    pushScenePosition(positions, x, y, z, model.sunDistanceFromCentreLy);
    colours.push(colour.r, colour.g, colour.b);
  }
  return { positions, colours };
}

function makeMaterial({ dust = false } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: !dust,
    blending: dust ? THREE.NormalBlending : THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: {
      uLinear: { value: 0 },
      uMaximumDistance: { value: 8000 },
      uOpacity: { value: dust ? .26 : .42 },
      uPointSize: { value: dust ? 3.2 : 2.0 }
    },
    vertexShader: `
      uniform float uLinear;
      uniform float uMaximumDistance;
      uniform float uPointSize;
      varying vec3 vColour;
      varying float vVisible;
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
        vec4 mvPosition = modelViewMatrix * vec4(shownPosition, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = vVisible * uPointSize * clamp(155.0 / max(18.0, -mvPosition.z), .82, 2.7);
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      varying vec3 vColour;
      varying float vVisible;
      void main() {
        vec2 centred = gl_PointCoord - .5;
        float radius = length(centred) * 2.0;
        float alpha = smoothstep(1.0, .12, radius) * uOpacity * vVisible;
        if (alpha < .004) discard;
        gl_FragColor = vec4(vColour, alpha);
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
  let confidence = nearest.distance <= width * .45 ? 'high' : nearest.distance <= width ? 'medium' : 'low';
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
  low: { arms: 9000, disk: 12000, core: 5000, dust: 0, dustOpacity: 0, opacity: .31, pointSize: 1.75 },
  medium: { arms: 25000, disk: 30000, core: 11000, dust: 5000, dustOpacity: .27, opacity: .36, pointSize: 1.9 },
  high: { arms: 56000, disk: 60000, core: 24000, dust: 11000, dustOpacity: .32, opacity: .41, pointSize: 2.08 }
};

export async function createMilkyWay({ scene, modelUrl, displayDistance, initialQuality = 'medium' }) {
  const response = await fetch(modelUrl);
  if (!response.ok) throw new Error(`Milky Way model could not be loaded (${response.status}).`);
  const model = await response.json();
  prepareStructureCurves(model);
  const group = new THREE.Group();
  group.name = 'milkyWayGroup';
  group.renderOrder = -5;

  const random = seededRandom();
  const arms = createPoints(makeArmData(model, QUALITY.high.arms, random), makeMaterial(), 'Milky Way spiral arms');
  const disk = createPoints(makeDiskData(model, QUALITY.high.disk, random), makeMaterial(), 'Milky Way stellar disk');
  const core = createPoints(makeCoreData(model, QUALITY.high.core, random), makeMaterial(), 'Milky Way central bar and bulge');
  const dust = createPoints(makeDustData(model, QUALITY.high.dust, random), makeMaterial({ dust: true }), 'Milky Way dust lanes');
  group.add(disk, arms, core, dust);

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

  function updateLabels() {
    labels.forEach(label => {
      const physical = label.userData.physicalPosition;
      const distance = physical.length();
      label.position.copy(physical).normalize().multiplyScalar(displayDistance(distance));
      label.visible = group.visible && labelsVisible;
    });
  }

  function updateUniforms() {
    [arms.material, disk.material, core.material, dust.material].forEach(material => {
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
    setScaleMode(mode, maximum) {
      scaleMode = mode === 'linear' ? 'linear' : 'compressed';
      maximumDistance = Math.max(1, Number(maximum) || maximumDistance);
      updateUniforms();
    },
    setQuality(level) {
      const profile = QUALITY[level] || QUALITY.medium;
      arms.geometry.setDrawRange(0, profile.arms);
      disk.geometry.setDrawRange(0, profile.disk);
      core.geometry.setDrawRange(0, profile.core);
      dust.geometry.setDrawRange(0, profile.dust);
      arms.material.uniforms.uOpacity.value = profile.opacity;
      arms.material.uniforms.uPointSize.value = profile.pointSize;
      disk.material.uniforms.uOpacity.value = profile.opacity * .68;
      disk.material.uniforms.uPointSize.value = profile.pointSize * .92;
      core.material.uniforms.uOpacity.value = profile.opacity * .54;
      core.material.uniforms.uPointSize.value = profile.pointSize * .90;
      dust.material.uniforms.uOpacity.value = profile.dustOpacity;
      dust.visible = profile.dust > 0;
    },
    update() {},
    classifyPosition(position, object = {}) {
      return classifyPosition(position, object, model);
    },
    dispose() {
      scene.remove(group);
      labels.forEach(label => label.element?.remove());
      [arms, disk, core, dust].forEach(points => {
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
