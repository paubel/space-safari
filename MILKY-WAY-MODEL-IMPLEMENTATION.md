# Space Safari Milky Way reconstruction

Active model: **2026.4**, October 2026. This document describes the implemented
model, its evidence, display choices, limitations and verification.

## Existing pipeline and implementation plan

The existing `3d-universe.html` uses Three.js/WebGL, OrbitControls, CSS2D labels,
a real star catalogue, procedural deep-sky objects and a separate close-up
Sagittarius A* viewer. The existing render loop controls adaptive quality and
pauses when the page is hidden. No framework or ESA image asset was added.

The implementation extends the isolated `createMilkyWay()` module:

1. Correct the synthetic disk and bulge probability distributions.
2. Add unequal, curved and interrupted arm enhancements, an elongated bar,
   thick disk, sparse halo, soft density glow and approximate dust extinction.
3. Add four camera presets, two appearance modes and optional map layers.
4. Preserve the catalogue, existing navigation, full-screen panels, logarithmic
   scale and close-up black-hole viewer.
5. Document physical assumptions separately from artistic transfer functions.

## Startup and navigation

At the user's explicit request, a normal page load and Reset start **centered
on the Sun in logarithmic scale, with the 3D deep-sky objects enabled**.
An explicit return from the black-hole viewer can restore the saved view.
The Milky Way visibility preference remains separately saved.

The four galaxy camera presets all select linear scale and a 100,000 ly
catalogue range, center the target on the model's Galactic Center and hide
enlarged catalogue markers, coordinate grids and directional arrows:

- View whole Milky Way: face-on; the Sun is below the center.
- View Milky Way edge-on: looks along the Sun–center direction, with Galactic
  north up and a small vertical offset to avoid an exactly singular view.
- Oblique: shows the bar, bulge and thin disk together.
- View from Sun: camera at the physical Sun, looking toward the Galactic Center.

Orbit, pan and zoom remain available after choosing a preset. Reset restores
the stellar neighborhood. All flights respect `prefers-reduced-motion`.
There is no continuous fly-around or added animation.

## Evidence hierarchy and attribution

The primary **visual** reference is ESA/Gaia/DPAC, Stefan Payne-Wardenaar (2025):

- [Gaia Milky Way overview](https://www.cosmos.esa.int/web/gaia/milky-way)
- [Face-on labelled illustration](https://www.esa.int/ESA_Multimedia/Images/2025/01/The_best_Milky_Way_map_by_Gaia_labelled)
- [Edge-on illustration](https://www.esa.int/ESA_Multimedia/Images/2025/01/The_best_Milky_Way_map_by_Gaia_edge-on)

These are artist impressions informed by observations. They are neither direct
photographs from outside the Galaxy nor a released, verified 3D mesh. ESA states
that Gaia supports more than two arms and less conspicuous arms than many older
depictions, with revised bar orientation. Our model uses those qualitative
constraints, not coordinates inferred by tracing image pixels.

Independent structural evidence:

- [Reid et al. 2019, maser parallaxes](https://arxiv.org/abs/1910.03357):
  about 200 high-mass star-forming regions; supports a four-arm interpretation.
  That interpretation is not presented as a uniquely established taxonomy.
- [GRAVITY Collaboration 2019](https://arxiv.org/abs/1904.05721):
  geometric center distance 8178 ±13 statistical ±22 systematic pc.
- [Wegg, Gerhard & Portail 2015](https://arxiv.org/abs/1504.01401):
  long-bar angle 28–33°, half length about 4.6–5.0 kpc depending on fit.
- [Bland-Hawthorn & Gerhard 2016](https://arxiv.org/abs/1602.07702):
  review of bar, bulge, stellar disk and halo structure and populations.
- [Chen et al. 2019](https://arxiv.org/abs/1902.00998):
  Cepheid evidence for the outer-disk warp; the implementation is a restrained
  illustrative warp, not their fitted surface.

The interface links ESA and Reid and explicitly marks procedural stars/clouds
as synthetic. No ESA image/video pixels are copied, embedded or redistributed.
If such assets are added later, retain their displayed licence and exact
attribution (ESA lists CC BY-SA 3.0 IGO or its Standard Licence).

Dan Greenheck's [WebGPU Galaxy](https://github.com/dgreenheck/webgpu-galaxy)
remains credited as visual/technical inspiration. This module does not import
that simulation and does not require WebGPU.

## Scale, coordinates and parameter provenance

The central configuration is `data/milky-way-model.json`.
`parameterNotes` contains source URLs and distinguishes evidence from choices.
Sampling settings are in `sampling`. One kpc = about 3261.56 light-years.

| Parameter | Adopted value | Meaning and evidence |
|---|---:|---|
| Sun–center distance | 26,700 ly ≈8.19 kpc | Rounded 8.2 kpc convention, consistent with GRAVITY 2019; not a new precision measurement |
| Stellar-disk diameter | ≈112,000 ly | Visualization convention in requested 100–120k range; Galaxy has no unique sharp edge |
| Disk exponential scale length | 8,500 ly ≈2.61 kpc | Approximation informed by Bland-Hawthorn & Gerhard |
| Old thin-disk vertical exponential scale | 850 ly ≈261 pc | Representative population, informed by the review |
| Thick-disk vertical exponential scale | 2,700 ly ≈828 pc | Representative older population; synthetic particle fraction 16%, not a measured mass fraction |
| Full bar length | 30,000 ly ≈9.20 kpc | Low end of Wegg et al. long-bar estimates |
| Bar angle | 30° | Within Wegg et al. range; projected appearance varies with camera orientation |
| Bar width / vertical sampling parameter | 6,800 / 2,100 ly | Illustrative ellipsoid parameters, not observational boundaries |
| Bulge radial / vertical sampling parameters | 6,500 / 2,600 ly | Illustrative triaxial density, not a spherical light ball |
| Warp start / maximum height | 28,500 / 850 ly | Restrained artistic amplitude inspired by Cepheid warp evidence |
| Warp phase | 18° | Illustrative choice, not a fitted precession measurement |
| Outer flare | up to 50% increase | Smooth illustrative flare of the sampled old disk |
| Synthetic halo sampling limit | 85,000 ly radius | Display cutoff; real stellar halo extends farther |
| Arm widths, gaps, bends, junctions | Per segment in JSON | Illustrative reconstruction; no fitted astrometric coefficients claimed |
| Dust thickness, opacity, colours, glow | JSON and shader transfer | Artistic extinction approximation, not calibrated photometry |

The model's physical origin is the Galactic Center, disk in XY, Z perpendicular.
The Sun is at (26700, 0, 0) ly; the small real solar height is ignored. Positive
Y follows positive heliocentric Galactic longitude in the adopted transformation.
The frame uses the standard Galactic/equatorial rotation matrix in the module.
Scene positions are heliocentric equatorial vectors mapped to Three.js as
(equatorial X, equatorial Z, −equatorial Y).

Sagittarius A* uses the same adopted distance. Its observed RA/Dec differs
slightly from the ideal Galactic-coordinate origin; the offset is small at this
map scale and is not hidden by moving catalogue objects onto modeled arms.

The log mode applies r' = 30 log10(1+r) around the Sun; linear mode applies
r' = 80r / selectedMaximumDistance. Both preserve directions. Only linear mode
preserves the Galaxy's shape. The scale bar is hidden in log mode. Dust's
physical line-of-sight approximation is disabled in the distorted log view.

## Density sampling and morphology

Seeded LCG randomization makes reloads reproducible. Synthetic particles are
render samples, not individually observed Gaia stars or a dynamical simulation.

- Disk: R follows a Gamma(shape=2) distribution, equivalent to surface density
  exp(−R/h) with the cylindrical area factor R dR. Radii outside the cutoff are
  rejected, never clamped into a bright artificial outer ring.
- Thin/thick disk: symmetric exponential vertical sampling with an outer flare.
- Bar: truncated Gaussian along its major axis, Gaussian transverse density
  tapered at its ends; no clamping of samples into point piles.
- Bulge: correlated triaxial Gaussian rotated with the bar, slightly enhanced
  thickness off-center to suggest a box/peanut population. It avoids the former
  cylindrical sampling cusp that looked like a vertical jet.
- Arms: four nonidentical bounded spiral segments with smooth bend terms,
  variable width, filament offsets, nonperiodic density modulation and gaps.
  Rejection sampling tapers ends without building endpoint piles.
- Orion: shorter curved spline through the adopted Sun location. Its connection
  to Sagittarius is an illustrative hypothesis, not established membership.
- Halo: sparse isotropic directions, flattened Z and log-uniform radii, which
  approximate an r⁻³ density over the displayed interval. It is intentionally faint.

The older major/secondary arm flags are sampling weights only. The model is not
an exact reproduction of Reid's fitted spiral segments or all named Gaia arms.
In particular the far-side junctions and inner 3-kpc structures remain schematic.

## Rendering, dust and appearance modes

Six bounded particle draw calls: arms, disk, bar/bulge, halo, diffuse density
splats and dust. Soft density splats reuse samples from the same geometry.
No particle positions are updated every frame.

Extinction is evaluated in the vertex shader using the nearest point of a
camera-to-particle ray to the dust midplane, an exponential radial/vertical
density and irregular modulation. This produces a dark lane in edge-on and
inside-disk views without a foreground image or a fixed painted ribbon.
It is a cheap optical-depth proxy, not a radiative-transfer solution. Dust
particles add restrained brown fine structure; they do not form an opaque
screen covering unrelated catalogue objects.

Scientific is the default: neutral older starlight, warm ivory center, localized
blue associations and sparse pink/red emission. Cinematic increases diffuse
glow and brightness through uniforms. **No buffers, arm locations, seed,
coordinates or membership results change when switching modes.**

Optional layers: arm names, centerlines, Sun/center/scale labels and illustrative
uncertainty bounds. The bounds expand around less secure segments; they are
not statistical confidence intervals. Nearby real objects remain available
through the existing catalogue/deep-sky toggles.

## Performance and maintenance

| Quality | Arms | Disk | Core | Halo | Glow | Dust | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| Low | 9,000 | 16,000 | 6,000 | 350 | 2,000 | 0 | 33,350 |
| Medium | 25,000 | 40,000 | 14,000 | 800 | 5,000 | 3,000 | 87,800 |
| High | 50,000 | 80,000 | 28,000 | 1,500 | 9,000 | 6,500 | 175,000 |

The maximum particle position/color buffers total about 4.2 MB before driver
overhead; temporary JS arrays are released after initialization. Draw ranges
reuse those buffers. Point opacity roughly compensates for count changes.
The existing Auto controller also reduces renderer resolution. Dust and halo
are reduced first through the profiles. Mobile defaults to reduced quality
on low-core devices; actual Auto behavior depends on measured frame time.

Per frame, the module changes six camera uniforms. Layer/scale changes project
only the small overlay line arrays on CPU. Hidden layers skip updates.
`dispose()` removes labels and releases all particle/line geometries/materials.
An unavailable JSON/module must not block the underlying planetarium.

Core files: `js/milky-way.js`, `data/milky-way-model.json`,
`js/3d-universe.js`, `3d-universe.html`, `css/3d-universe.css`.
Removal is isolated to the module import/initialization, controls and matching
styles. Star catalogue data are not modified by procedural arm assignment.

## Verification and intentional differences

JavaScript syntax, JSON parsing and whitespace checks are run locally.
Browser checks cover the four presets, both appearance modes, layer toggles,
quality levels, scale switching, hidden Milky Way, Reset and the requested
Sun/log/deep-sky startup. Browser shader errors discovered during development
must be resolved before handoff.

The reference images contain much finer unresolved texture and more complex
dust than this browser point-cloud approximation. Our face-on arm junctions,
gaps and outer extent remain illustrative. Edge-on views use the very same
3D particles; there is no alternate flat image. Oblique views expose the bar
and thickness; the Sun preset is an inside-disk educational view without a
direct outside-Galaxy photographic counterpart.

Formal low-end phone/GPU timing and cross-browser benchmarking are separate
from local desktop smoke verification; no unmeasured FPS guarantee is made.
