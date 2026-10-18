import * as THREE from 'three';

// Adapted NASA/STScI mesh: Leah Hustak and Ralf Crawford. See notices and
// EAGLE-NEBULA-MODEL.md. This is geometry, not a camera-facing photograph.
export async function createPillarsOfCreation() {
  const response = await fetch(new URL('../assets/models/pillars-of-creation.bin', import.meta.url));
  if (!response.ok) throw new Error(`Pillars model: HTTP ${response.status}`);
  const buffer = await response.arrayBuffer();
  const header = new DataView(buffer);
  const vertices = header.getUint32(0, true);
  const triangles = header.getUint32(4, true);
  if (buffer.byteLength !== 8 + vertices * 12 + triangles * 12) throw new Error('Invalid Pillars mesh');
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buffer, 8, vertices * 3), 3));
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer, 8 + vertices * 12, triangles * 3), 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    vertexShader: `
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        vView = -viewPosition.xyz;
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vView;
      float hash(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7))) * 43758.5453); }
      float noise(vec3 p) {
        vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
        return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
          mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
      }
      void main() {
        float grain = noise(vPosition*28.0)*.58 + noise(vPosition*67.0)*.28 + noise(vPosition*139.0)*.14;
        // Dither the adapted lower ends into the surrounding dust, without
        // transparent triangle sorting or a second expensive mesh pass.
        float fade = smoothstep(-.5,-.32,vPosition.y + (grain-.5)*.09);
        if (hash(vec3(gl_FragCoord.xy,1.0)) > fade) discard;
        vec3 normal = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
        float rim = pow(1.0-abs(dot(normal,normalize(vView))),2.4);
        float illuminated = smoothstep(.2,.85,grain)*.3 + smoothstep(-.15,.5,vPosition.y)*.24;
        vec3 dust = mix(vec3(.012,.008,.012),vec3(.07,.032,.035),grain);
        vec3 colour = dust + vec3(.62,.32,.33)*rim*(.3+illuminated) + vec3(.045,.025,.028)*illuminated;
        gl_FragColor = vec4(colour,1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `
  });
  const pillars = new THREE.Mesh(geometry, material);
  pillars.name = 'pillars-of-creation';
  // Four-light-year height within the 70-light-year / 24-display-unit cloud.
  pillars.scale.setScalar(24 * 4 / 70);
  pillars.position.set(0, -.65, .7);
  return pillars;
}
