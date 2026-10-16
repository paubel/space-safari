/**
 * Opens the dedicated WebGPU simulation as a top-level page. OrbitControls
 * cannot reliably retain pointer capture when this GPU canvas is embedded in
 * an iframe above the map canvas, while the same controls work correctly at
 * top level.
 */
export function createSagittariusAVisualizer() {
  const simulationUrl = new URL('../sagittarius-a-view.html?v=direct-orbit-2', import.meta.url).href;
  let opening = false;

  function show() {
    if (opening) return;
    opening = true;
    document.body.classList.add('is-leaving-universe');
    const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 320;
    window.setTimeout(() => window.location.assign(simulationUrl), delay);
  }

  function hide() {}
  function resize() {}
  function update() {}

  return { show, hide, resize, update };
}
