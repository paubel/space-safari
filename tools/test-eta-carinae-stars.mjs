import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
async function moduleAt(path) {
  const source=await readFile(new URL(path,import.meta.url),'utf8');
  return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
}
const {STARS}=await moduleAt('../data/astrophoto/interactive-stars.js');
const {ETA_CARINAE_STARS}=await moduleAt('../data/astrophoto/eta-carinae-stars.js');
const catalogue=[...STARS,...ETA_CARINAE_STARS.filter(c=>!STARS.some(s=>s.name===c.name))];
const hr=JSON.parse(await readFile(new URL('../data/hr-diagram/stars.json',import.meta.url),'utf8'));
for(const suffix of ['A','B']) {
  const name=`Eta Carinae ${suffix}`, found=catalogue.filter(s=>s.name===name);
  assert.equal(found.length,1);
  assert.equal(found[0].distance,7500);
  assert.equal(found[0].etaCarinaeComponent,suffix);
  assert.ok([found[0].ra,found[0].dec,found[0].distance].every(Number.isFinite));
  assert.ok(hr.some(s=>s.name===name),'H–R destination still exists');
}
assert.equal(ETA_CARINAE_STARS[0].ra,ETA_CARINAE_STARS[1].ra);
assert.equal(ETA_CARINAE_STARS[0].dec,ETA_CARINAE_STARS[1].dec);
assert.equal(catalogue.length,119);
assert.equal(STARS.length,117,'original catalogue unchanged');
const app=await readFile(new URL('../js/3d-universe.js',import.meta.url),'utf8');
assert.ok(app.indexOf('if (component) { selectStar(component); return; }')<app.indexOf('const deepSkyObject = NEBULAE.find'),'exact component search takes precedence over the containing nebula');
console.log('Eta Carinae checks passed: independent A/B entries, shared measured system position, original catalogue preserved, 119 stars, H–R links and search priority.');
