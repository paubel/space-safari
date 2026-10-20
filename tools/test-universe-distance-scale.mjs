import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../js/3d-universe.js',import.meta.url),'utf8');
// Execute the actual small helper without starting the browser application.
const helper=source.match(/function guideDistances\(\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(helper,'distance guide helper exists');
const rings=Function('scaleMode','M31',`${helper};return guideDistances();`);
const log=rings('compressed',{distance:2500000});
const linear=rings('linear',{distance:2500000});
const thousands=Array.from({length:20},(_,i)=>(i+1)*1000);
assert.deepEqual(linear,thousands,'linear guide is unchanged');
assert.deepEqual(log,[1,10,100,...thousands,50000,100000,200000,500000,1000000,2000000,2500000]);
assert.equal(new Set(log).size,log.length,'no duplicate rings');
const display=d=>30*Math.log10(1+d);
assert.ok(log.every((d,i)=>i===0 || display(d)>display(log[i-1])),'radii increase under the actual logarithmic formula');
assert.equal(display(log.at(-1)),display(2500000),'outer ring reaches M31 centre distance');
assert.match(source,/displayDistance\(Math\.max\(maximum, \.\.\.ringDistances\)\)/,'guide disk includes all rings independently of the star filter');
console.log('Distance-scale checks passed: 30 logarithmic rings through Andromeda; 20 unchanged linear rings; monotonic log radii and full guide extent.');
