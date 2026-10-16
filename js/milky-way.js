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
  const theta = fraction * arm.turns * Math.PI * 2;
  const radius = arm.startRadiusLy * Math.exp(theta * Math.tan(arm.pitchDegrees * DEG));
  const angle = arm.phaseDegrees * DEG + theta;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, radius, angle };
}

function pushScenePosition(target, x, y, z, sunDistance) {
  target.push(...galactocentricToScene(x, y, z, sunDistance));
}

function makeParticleData(model, count, kind, random) {
  const positions = [];
  const colours = [];
  const sunDistance = model.sunDistanceFromCentreLy;
  const armsAndSpur = [...model.arms, ...model.spurs];

  for (let index = 0; index < count; index++) {
    let x;
    let y;
    let z;
    let colour;

    if (kind === 'dust') {
      const arm = model.arms[index % model.arms.length];
      const point = armPoint(arm, random());
      const across = gaussian(random) * arm.widthLy * .62;
      x = point.x + Math.cos(point.angle + Math.PI / 2) * across;
      y = point.y + Math.sin(point.angle + Math.PI / 2) * across;
      z = gaussian(random) * 170;
      colour = new THREE.Color().setRGB(.20 + random() * .05, .12 + random() * .035, .09 + random() * .02);
    } else {
      const choice = random();
      if (choice < .64) {
        const structure = armsAndSpur[index % armsAndSpur.length];
        if ('turns' in structure) {
          const point = armPoint(structure, random());
          const across = gaussian(random) * structure.widthLy * .42;
          x = point.x + Math.cos(point.angle + Math.PI / 2) * across;
          y = point.y + Math.sin(point.angle + Math.PI / 2) * across;
          z = gaussian(random) * (170 + point.radius * .006);
        } else {
          const along = (random() - .5) * structure.lengthLy;
          const across = gaussian(random) * structure.widthLy * .28;
          const angle = structure.angleDegrees * DEG;
          x = sunDistance + structure.centreXFromSunLy + Math.cos(angle) * along - Math.sin(angle) * across;
          y = structure.centreYFromSunLy + Math.sin(angle) * along + Math.cos(angle) * across;
          z = gaussian(random) * 180;
        }
        const hot = random() < .18;
        colour = hot
          ? new THREE.Color().setRGB(.34 + random() * .15, .58 + random() * .18, .95)
          : new THREE.Color().setRGB(.78 + random() * .20, .48 + random() * .20, .25 + random() * .18);
      } else if (choice < .86) {
        const radius = Math.min(model.disk.radiusLy, -Math.log(Math.max(1e-7, 1 - random())) * model.disk.scaleLengthLy);
        const angle = random() * Math.PI * 2;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
        z = gaussian(random) * model.disk.halfThicknessLy * (.35 + .65 * radius / model.disk.radiusLy);
        colour = new THREE.Color().setRGB(.66 + random() * .22, .55 + random() * .18, .42 + random() * .15);
      } else if (choice < .95) {
        const radius = Math.pow(random(), 1.8) * model.bulge.radiusLy;
        const angle = random() * Math.PI * 2;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
        z = gaussian(random) * model.bulge.halfThicknessLy * (1 - radius / model.bulge.radiusLy * .5);
        colour = new THREE.Color().setRGB(.98, .62 + random() * .18, .30 + random() * .10);
      } else {
        const along = (random() - .5) * model.bar.lengthLy;
        const across = gaussian(random) * model.bar.widthLy * .23;
        const angle = model.bar.angleDegrees * DEG;
        x = Math.cos(angle) * along - Math.sin(angle) * across;
        y = Math.sin(angle) * along + Math.cos(angle) * across;
        z = gaussian(random) * 650;
        colour = new THREE.Color().setRGB(.98, .58 + random() * .16, .26);
      }
    }

    pushScenePosition(positions, x, y, z, sunDistance);
    colours.push(colour.r, colour.g, colour.b);
  }
  return { positions, colours };
}

function makeMaterial({ dust = false } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: dust ? THREE.NormalBlending : THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: {
      uLinear: { value: 0 },
      uMaximumDistance: { value: 8000 },
      uOpacity: { value: dust ? .16 : .50 },
      uPointSize: { value: dust ? 3.4 : 2.15 }
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
  if ('turns' in structure) {
    const point = armPoint(structure, .58);
    return galactocentricToScene(point.x, point.y, 420, model.sunDistanceFromCentreLy);
  }
  const angle = structure.angleDegrees * DEG;
  const along = structure.lengthLy * .30;
  return galactocentricToScene(
    model.sunDistanceFromCentreLy + structure.centreXFromSunLy + Math.cos(angle) * along,
    structure.centreYFromSunLy + Math.sin(angle) * along,
    350,
    model.sunDistanceFromCentreLy
  );
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
  if ('turns' in structure) {
    let previous = armPoint(structure, 0);
    for (let index = 1; index <= 160; index++) {
      const current = armPoint(structure, index / 160);
      minimum = Math.min(minimum, pointToSegmentDistance(position.x, position.y, previous.x, previous.y, current.x, current.y));
      previous = current;
    }
  } else {
    const angle = structure.angleDegrees * DEG;
    const centreX = model.sunDistanceFromCentreLy + structure.centreXFromSunLy;
    const centreY = structure.centreYFromSunLy;
    const halfX = Math.cos(angle) * structure.lengthLy * .5;
    const halfY = Math.sin(angle) * structure.lengthLy * .5;
    minimum = pointToSegmentDistance(position.x, position.y, centreX - halfX, centreY - halfY, centreX + halfX, centreY + halfY);
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
  const width = nearest.structure.widthLy;
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
  low: { stars: 15000, dust: 0, opacity: .42, pointSize: 1.9 },
  medium: { stars: 40000, dust: 3500, opacity: .48, pointSize: 2.1 },
  high: { stars: 100000, dust: 8000, opacity: .54, pointSize: 2.3 }
};

export async function createMilkyWay({ scene, modelUrl, displayDistance, initialQuality = 'medium' }) {
  const response = await fetch(modelUrl);
  if (!response.ok) throw new Error(`Milky Way model could not be loaded (${response.status}).`);
  const model = await response.json();
  const group = new THREE.Group();
  group.name = 'milkyWayGroup';
  group.renderOrder = -5;

  const random = seededRandom();
  const stars = createPoints(makeParticleData(model, QUALITY.high.stars, 'stars', random), makeMaterial(), 'Milky Way stars');
  const dust = createPoints(makeParticleData(model, QUALITY.high.dust, 'dust', random), makeMaterial({ dust: true }), 'Milky Way dust');
  group.add(stars, dust);

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
    [stars.material, dust.material].forEach(material => {
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
      stars.geometry.setDrawRange(0, profile.stars);
      dust.geometry.setDrawRange(0, profile.dust);
      stars.material.uniforms.uOpacity.value = profile.opacity;
      stars.material.uniforms.uPointSize.value = profile.pointSize;
      dust.visible = profile.dust > 0;
    },
    update() {},
    classifyPosition(position, object = {}) {
      return classifyPosition(position, object, model);
    },
    dispose() {
      scene.remove(group);
      labels.forEach(label => label.element?.remove());
      [stars, dust].forEach(points => {
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
