// Pure URL helpers shared by the viewer and its tests. RA is in HOURS;
// declination and vertical field of view are in DEGREES. Never serialize an
// observer's Earth location, time, private filters or unrelated URL parameters.
export function readPlanetariumLink(search, objectIds = [], starNames = []) {
  const params = new URLSearchParams(search);
  const state = {};
  if (objectIds.includes(params.get('object'))) state.object = params.get('object');
  const star = starNames.find(name => name.toLowerCase() === params.get('star')?.toLowerCase());
  if (!state.object && star) state.star = star;
  const numeric = key => {
    const value = params.get(key);
    return value !== null && value.trim() !== '' ? Number(value) : NaN;
  };
  const ra = numeric('ra'), dec = numeric('dec'), fov = numeric('fov');
  if (Number.isFinite(ra) && ra >= 0 && ra < 24 && Number.isFinite(dec) && dec >= -90 && dec <= 90 && Number.isFinite(fov) && fov >= 4.8 && fov <= 95) {
    state.view = { ra, dec, fov };
  }
  if (['photos','stars'].includes(params.get('mode'))) state.mode = params.get('mode');
  for (const key of ['grid','photos','constellations','photoMenu','mainMenu']) {
    if (['0','1'].includes(params.get(key))) state[key] = params.get(key) === '1';
  }
  return state;
}

export function buildPlanetariumLink(base, state = {}) {
  const url = new URL(base);
  url.search = '';
  url.hash = '';
  if (state.object) url.searchParams.set('object', state.object);
  else if (state.star) url.searchParams.set('star', state.star);
  if (state.view) {
    // Rounding immediately below 24h must wrap to 0h, not create an invalid URL.
    const roundedRa = ((Number(state.view.ra.toFixed(6)) % 24) + 24) % 24;
    url.searchParams.set('ra', roundedRa.toFixed(6));
    url.searchParams.set('dec', state.view.dec.toFixed(6));
    url.searchParams.set('fov', state.view.fov.toFixed(4));
  }
  if (['photos','stars'].includes(state.mode)) url.searchParams.set('mode', state.mode);
  for (const key of ['grid','photos','constellations','photoMenu','mainMenu']) {
    if (typeof state[key] === 'boolean') url.searchParams.set(key, state[key] ? '1' : '0');
  }
  return url.href;
}
