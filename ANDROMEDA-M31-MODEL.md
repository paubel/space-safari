# Andromeda (M31): revised 3D draft

Implemented in `3d-universe.html`, 2026-10-20. Publication uses the project's
existing GitHub-to-Netlify workflow.

Revision 2 replaces the initially shape-preserving log proxy with a genuine
Sun-centred pointwise logarithmic mapping. The regular luminous pinwheel has
also been replaced with a diffuse stellar disk, old bulge and irregular dust.

## Controls

- **Show Andromeda (M31)** is independent of the Milky Way and nebula switches.
  Its preference is remembered locally. Turning it off removes its rendering
  and per-frame updates, without affecting other objects.
- **Approach Andromeda (M31)** frames its centre. Standard drag/orbit, wheel/pinch
  zoom and right-drag pan work normally; fullscreen is not required.
- Its on-map label selects the information panel; the panel also has an approach
  button. Search recognises M31, M 31, NGC 224, Andromeda and Andromedagalaxen.
- Linear approach expands the range to about 3.16 million ly when needed. The
  slider now reaches 3.98 million ly. The default Sun-centred log view is unchanged.

## Scientific basis and limits

Centre: RA 10.6847083°, Dec +41.26875° (J2000). Distance: approximately
2.5 million ly. Disk inclination: approximately 77°, major-axis position angle:
38° east of north. The disk basis is calculated in the same equatorial scene
coordinates as the rest of the viewer, not placed by eye.

Sources checked for this implementation:

- [NASA: Messier 31](https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-31/)
- [NASA: Andromeda distance](https://www.nasa.gov/image-article/nasas-chandra-shares-a-new-view-of-our-galactic-neighbor/)
- [SIMBAD: centre coordinates](https://simbad.cds.unistra.fr/simbad/sim-id?Ident=M31)
- [Rotation curve and mass distribution of M31 (2024): adopted orientation](https://academic.oup.com/mnras/article/528/2/2653/7512223)
- [NASA: extended diameter estimate](https://www.nasa.gov/image-article/ultraviolet/)
- [NASA/Hubble: older bulge, stellar disk and dust lanes (2025)](https://science.nasa.gov/missions/hubble/nasas-hubble-traces-hidden-history-of-andromeda-galaxy/)
- [ESA/ISO: dust and star-forming ring at 10 kpc](https://general-tools.cosmos.esa.int/iso/outreach/esa_pr/andromed.php)
- [HELGA: 10 and 15 kpc ring morphology](https://doi.org/10.1051/0004-6361/201118619)

The illustrative outer disk is 220,000 ly across. Galaxy sizes depend on the
population and brightness threshold, so this is not a sharply measured edge.
The warm 3D bulge, predominantly old grey/cream stellar disk, patchy dusty rings
at roughly 10 and 15 kpc, scattered blue stars and faint arm fragments are
**synthetic illustrations**, not a measured 3D
density reconstruction or individual stellar catalogue. The detailed arm paths,
near-side choice, vertical thickness and individual particles are not claimed
as observationally established. No real galaxy rotation or collision simulation
is attempted. No external image or new asset download is required.

## Scale handling

- Linear: centre and all local dimensions use `80 / maximumDistance` scene units
  per light-year. Relative physical size and distance are proportional.
- Logarithmic: for **every vertex and particle**, first construct its physical
  heliocentric position `P = centre + major*x + minor*y + normal*z`, in ly.
  Then map it to `P / |P| * 30 log10(1 + |P|)`. No independent galaxy-size
  multiplier, local isotropic proxy or camera-relative scale is applied.
  The galaxy centre is subtracted only to keep geometry buffers local and
  numerically stable; adding the group's translation restores the mapped point.
- The disk is tessellated 80×80 so it bends with the nonlinear mapping; the
  bulge surface and all individual particles follow the same formula. Triangle
  interiors approximate the continuous transform by mesh interpolation.
- Around 2.5 million ly, log scaling compresses radial depth about 15 times
  more than transverse extent. The galaxy can therefore look flattened or
  warped when orbiting it; that is a consequence of this coordinate map, not
  an attempted physical model of its shape. Linear mode is the physical view.
- Changing scales while M31 is selected and visible reframes the galaxy.
- Logarithmic reference rings retain every 1,000 ly step through 20,000 ly and
  continue at 50,000, 100,000, 200,000, 500,000, 1,000,000, 2,000,000 and
  2,500,000 ly. The last is labelled as Andromeda's distance; it does not imply
  that M31 lies in the equatorial plane. The guide disk covers the outermost
  ring even when the stellar distance filter is set to a smaller range.
  Linear-mode rings remain unchanged. The distance slider already reaches
  approximately 3.98 million ly; manual camera zoom-out remains available.

## Performance and removal

`js/andromeda.js` owns its geometry and materials. It uses one analytic,
double-sided disk surface, a low-poly translucent bulge and one genuinely 3D
point cloud (three draw calls when close). No ray marching,
post-processing, new renderer, new animation loop or per-star CPU animation.
The continuous disk remains at all qualities. The point budget is 3,000 / 8,000 /
18,000 at Low / Medium / High and respects the existing Auto selector. Individual
stars render only within 5 disk radii at Low or 9 at other levels. The geometry
is built once from a deterministic seed; point position and colour buffers total
432,000 bytes, plus modest mesh buffers and retained physical-coordinate copies.
Mapping runs on scale changes, not each frame; identical mappings are cached.
Actual frame rate still depends on device, resolution and the
other visible layers; no universal FPS guarantee is made.

To remove: remove the Andromeda HTML controls, import and integration calls in
`js/3d-universe.js`, and its small CSS button rule; then delete the module. Restore
the slider maximum to `5.00` if intergalactic range is no longer wanted. No
Milky Way data, star catalogue or nebula geometry has been modified. The module
also exposes `dispose()` to release all its geometry and materials.

## Verification

```sh
node --check js/3d-universe.js
node --check js/andromeda.js
node tools/test-andromeda.mjs /path/to/three.module.js
```

The Node check uses real Three.js mathematics and geometry, with only the DOM
label stubbed. Checks cover reproducible finite 3D positions, inclination,
orthogonal basis, **every mesh vertex and particle** against an independent
implementation of the global linear and logarithmic formulas, unchanged sky
directions, radial log compression, quality budgets, near/far detail, visibility
and disposal. Browser checks covered
approach, orbiting to reveal a face-on view, wheel zoom, off/on, linear approach
and quality switching. Fullscreen permission was denied in the test browser;
the normal embedded view worked. No new WebGL/shader error was observed.

Revision 2 was visually checked at Low in log and linear modes, including an
orbit to expose the disk face-on. The Node test checks all mapped disk, bulge and
point vertices, not just the centre or bounding radius. Log distortion is retained
deliberately. Fine dust and arm morphology remain illustrative, not a fit to
observational pixels.
