import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPlanetariumLink, readPlanetariumLink } from '../js/planetarium-links.js';

const objects=['sadr-region','m31','ic5146'];
const stars=['Vega','Sun','Rigil Kent Toliman'];
test('object and named-star links are validated against local catalogues',()=>{
  assert.deepEqual(readPlanetariumLink('?object=sadr-region',objects,stars),{object:'sadr-region'});
  assert.deepEqual(readPlanetariumLink('?star=vega',objects,stars),{star:'Vega'});
  assert.deepEqual(readPlanetariumLink('?object=missing&star=missing',objects,stars),{});
  assert.deepEqual(readPlanetariumLink('?object=m31&star=Vega',objects,stars),{object:'m31'});
});
test('camera and display state round-trip without unrelated or private parameters',()=>{
  const state={object:'sadr-region',view:{ra:20.370473,dec:40.256679,fov:10.9466},mode:'stars',grid:false,photos:true,constellations:false,photoMenu:true,mainMenu:false};
  const url=buildPlanetariumLink('https://example.com/planetarium.html?latitude=59&token=private#old',state);
  assert(!url.includes('latitude'));assert(!url.includes('private'));assert(!url.includes('#old'));
  assert.deepEqual(readPlanetariumLink(new URL(url).search,objects,stars),state);
});
test('zero RA, negative declinations, poles and minimum/maximum zoom are accepted',()=>{
  for(const view of [{ra:0,dec:-90,fov:4.8},{ra:23.999999,dec:90,fov:95}]){
    const url=buildPlanetariumLink('https://example.com/planetarium.html',{view});
    assert.deepEqual(readPlanetariumLink(new URL(url).search).view,view);
  }
});
test('rounding at the 24h boundary wraps back to zero',()=>{
  const url=buildPlanetariumLink('https://example.com/planetarium.html',{view:{ra:23.99999999,dec:0,fov:10}});
  assert.equal(readPlanetariumLink(new URL(url).search).view.ra,0);
});
test('incomplete, non-finite, empty and out-of-range camera values safely fall back',()=>{
  for(const query of ['ra=&dec=0&fov=10','ra=NaN&dec=0&fov=10','ra=1&dec=Infinity&fov=10','ra=24&dec=0&fov=10','ra=-1&dec=0&fov=10','ra=1&dec=-91&fov=10','ra=1&dec=0&fov=96','ra=1&dec=0&fov=0','ra=1&dec=0']){
    assert.deepEqual(readPlanetariumLink('?object=m31&'+query,objects,stars),{object:'m31'});
  }
});
test('unrecognized modes/booleans and injection text are not restored',()=>{
  assert.deepEqual(readPlanetariumLink('?object=%3Cscript%3E&mode=other&grid=yes&photos=2',objects,stars),{});
});
test('encoded names and clean direct-object links work',()=>{
  const url=buildPlanetariumLink('https://example.com/planetarium.html?ra=1&dec=2&fov=3',{star:'Rigil Kent Toliman'});
  assert.deepEqual(readPlanetariumLink(new URL(url).search,objects,stars),{star:'Rigil Kent Toliman'});
  assert.equal(buildPlanetariumLink(url,{object:'sadr-region'}),'https://example.com/planetarium.html?object=sadr-region');
});
