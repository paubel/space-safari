import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../js/3d-universe.js',import.meta.url),'utf8');
const helper=source.match(/function findStar\(\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(helper);
const catalogue=[{name:'Vega'},{name:'Sun (Sol)'},{name:'Eta Carinae A',etaCarinaeComponent:'A'},{name:'Eta Carinae B',etaCarinaeComponent:'B'}];
const M31={name:'Andromeda Galaxy (M31)'};
const NEBULAE=[{name:'Homunculus and Eta Carinae A/B',shortName:'Homunculus',volumeShape:'eta'}, {name:'Sagittarius A*',shortName:'Sagittarius A*',volumeShape:'sagittarius-a'}, {name:'Eagle Nebula',shortName:'M16',aliases:['pillars'],volumeShape:'eagle'}];
const run=Function('query','catalogue','M31','NEBULAE',`
  const controlsUi={search:{value:query}}, calls=[];
  let flight={started:1};
  const selectStar=(target,fly=false)=>calls.push({kind:'star',target,fly});
  const selectNebula=(target,fly=false)=>calls.push({kind:'nebula',target,fly});
  const selectAndromeda=()=>calls.push({kind:'galaxy',target:M31,fly:false});
  const viewAndromeda=()=>{throw Error('Find must not approach');};
  const saveUniverseReturnState=()=>{throw Error('Find must not enter a simulation');};
  const viewPillarsOfCreation=()=>{throw Error('Find must not fly into Pillars');};
  ${helper};findStar();return {calls,flight};
`);
for(const [query,kind,name] of [['Vega','star','Vega'],['veg','star','Vega'],['sun','star','Sun (Sol)'],['Eta Carinae A','star','Eta Carinae A'],['Eta Carinae B','star','Eta Carinae B'],['M31','galaxy',M31.name],['Homunculus','nebula',NEBULAE[0].name],['Sagittarius A*','nebula','Sagittarius A*'],['pillars','nebula','Eagle Nebula']]){
  const result=run(query,catalogue,M31,NEBULAE);
  assert.equal(result.flight,null,'previous flight cancelled');
  assert.equal(result.calls.length,1);
  assert.equal(result.calls[0].kind,kind);
  assert.equal(result.calls[0].target.name,name);
  assert.equal(result.calls[0].fly,false,'selection must never start a flight');
}
console.log('Find checks passed: stars, both Eta components, galaxies, nebulae and aliases select without flying; previous flights stop.');
