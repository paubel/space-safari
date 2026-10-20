// Pass the project's Three.js module path (no browser or GPU needed):
// node tools/test-andromeda.mjs /path/to/three.module.js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const threeUrl = process.argv[2] ? pathToFileURL(process.argv[2]).href : import.meta.resolve('three');
const THREE = await import(threeUrl);
globalThis.document = {createElement:()=>({addEventListener(){},remove(){}})};
let source = await readFile(new URL('../js/andromeda.js', import.meta.url),'utf8');
source=source.replace("from 'three';",`from '${threeUrl}';`)
  .replace("import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';",
    'class CSS2DObject extends THREE.Object3D { constructor(element){super();this.element=element;} }');
const {createAndromeda,M31}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const scene=new THREE.Scene();
const start=performance.now();
const a=createAndromeda({scene,onSelect(){}});
const b=createAndromeda({scene,onSelect(){}});
const body=a.group.children[0], points=body.children.find(child=>child.isPoints);
const positions=points.geometry.getAttribute('position').array;
assert.ok(positions.every(Number.isFinite));
assert.deepEqual(positions,b.group.children[0].children.find(child=>child.isPoints).geometry.getAttribute('position').array);
assert.equal(positions.length,18000*3);
assert.ok(positions.some((v,i)=>i%3===2 && Math.abs(v)>.02),'genuinely three-dimensional bulge');
assert.ok(Math.abs(Math.abs(a.direction.dot(a.normal))-Math.cos(77*Math.PI/180))<1e-6);
assert.ok(Math.abs(a.direction.dot(a.major))<1e-12);
const physical=body.children.map(child=>child.geometry.getAttribute('position').array.slice());
function checkEveryVertex(mode,maximum){
  a.setScaleMode(mode,maximum);
  body.children.forEach((child,index)=>{
    const actual=child.geometry.getAttribute('position').array;
    const input=physical[index];
    for(let i=0;i<input.length;i+=3){
      const world=a.direction.clone().multiplyScalar(M31.distance)
        .addScaledVector(a.major,input[i]*M31.radiusLy)
        .addScaledVector(a.minor,input[i+1]*M31.radiusLy)
        .addScaledVector(a.normal,input[i+2]*M31.radiusLy);
      const d=world.length(), mapped=mode==='linear'?d*80/maximum:30*Math.log10(1+d);
      world.multiplyScalar(mapped/d);
      const output=new THREE.Vector3(actual[i],actual[i+1],actual[i+2]).add(a.group.position);
      assert.ok(output.distanceTo(world)<Math.max(1e-5,world.length()*1e-7),'each vertex follows the global distance formula');
      assert.ok(output.clone().normalize().distanceTo(world.clone().normalize())<1e-6,'sky direction preserved');
    }
  });
  assert.equal(body.scale.x,1);assert.equal(body.scale.y,1);assert.equal(body.scale.z,1);
}
for(const max of [7943,100000,10**6.5,10**6.6]){
  checkEveryVertex('linear',max);
  assert.ok(Math.abs(a.group.position.length()-M31.distance*80/max)<1e-8);
}
checkEveryVertex('compressed',7943);
assert.ok(Math.abs(a.group.position.length()-30*Math.log10(1+M31.distance))<1e-10);
assert.ok(a.group.position.length()>30*Math.log10(1+100000),'outside the Milky Way');
// A +/-10,000 ly line-of-sight change must not use the much larger
// tangential/angular-size scale from the initial shape-preserving draft.
const radialSpan=30*Math.log10(1+M31.distance+10000)-30*Math.log10(1+M31.distance-10000);
const oldSpan=20000*a.group.position.length()/M31.distance;
assert.ok(radialSpan<oldSpan*.08,'log depth is about fifteen times more compressed than tangential size');
const before=points.geometry.getAttribute('position').array.slice();
a.setScaleMode('compressed',100000);
assert.deepEqual(before,points.geometry.getAttribute('position').array,'distance filter does not remap log positions');
const camera=new THREE.PerspectiveCamera();
for(const [level,count] of [['low',3000],['medium',8000],['high',18000]]){
  a.setQuality(level); assert.equal(points.geometry.drawRange.count,count);
  camera.position.copy(a.group.position);a.update(camera,720);assert.ok(points.visible);
  camera.position.set(0,0,0);a.update(camera,720);assert.equal(points.visible,false);
}
a.setVisible(false);assert.equal(a.group.visible,false);
a.setVisible(true);assert.equal(a.group.visible,true);
let disposed=0;
body.children.forEach(child=>child.geometry.addEventListener('dispose',()=>disposed++));
a.dispose();b.dispose();assert.equal(scene.children.length,0);assert.equal(disposed,3);
console.log(`Andromeda checks passed: coordinates, shape, deterministic 3D geometry, both scales, 3 quality levels, distance LOD, visibility and disposal (${Math.round(performance.now()-start)} ms).`);
