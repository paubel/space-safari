# Space Safari 3D Universe — plan

Last updated: 8 October 2026

## Purpose

Create a new, independent 3D page for Space Safari where visitors can explore well-known stars and selected astronomical objects in three dimensions.

The page should complement the existing planetarium without replacing or changing it.

> **Important project decision:** The 3D Universe must remain separate from the Deep-Sky Atlas. Do not add automatic links between the Deep-Sky Atlas and the 3D view unless Paul changes this decision later.

Suggested page name:

- File: `3d-universe.html`
- Menu label: **3D Universe**
- Heading: **Explore Our Stellar Neighborhood in 3D**

## Recommended first version

Begin with a focused and reliable version rather than attempting to model the entire universe.

Include:

- The Sun at the origin.
- The 100 brightest star systems.
- The stars already used by the interactive H–R diagram where reliable coordinates and distances are available.
- Correct three-dimensional positions derived from right ascension, declination, and distance.
- Search with a **Fly to object** function.
- Clickable stars with an information panel.
- Filters for distance, spectral class, and stellar type.
- A choice between linear and compressed distance.
- Optional constellation lines and labels.
- A visible galactic-plane reference grid.
- A **Return to the Sun** button.
- Full-screen mode.
- Mobile and reduced-motion alternatives.

Add nebulae and other deep-space models after this first version works well.

## Recommended viewing modes

A single physical scale cannot show nearby stars, Milky Way nebulae, and external galaxies clearly at the same time. Use separate modes.

### 1. Local Stars

- Suggested range: 0–1,000 light-years.
- Prefer a linear distance scale.
- Show the Sun, bright stars, nearby stars, and optionally constellation lines.
- This is the most scientifically intuitive mode.

### 2. Milky Way Objects

- Show selected stars, nebulae, supernova remnants, and star clusters.
- Use logarithmically compressed distances.
- Clearly label the view as **Compressed distance**.
- Display the galactic plane and the approximate direction of the Galactic Centre.

### 3. Beyond the Milky Way

- Show the Magellanic Clouds, Andromeda, Triangulum, and a small number of galaxy groups.
- Treat this as a pedagogical overview rather than a common physical scale with nearby stars.
- Never imply that visible model sizes are proportional to their real diameters unless a scale explicitly says so.

## Positioning stars in 3D

The existing stellar data already contains much of what is needed:

- Right ascension (`ra`)
- Declination (`dec`)
- Distance in light-years (`distance`)

Convert spherical sky coordinates to Cartesian coordinates:

```text
x = distance × cos(dec) × cos(ra)
y = distance × sin(dec)
z = distance × cos(dec) × sin(ra)
```

Convert right ascension and declination to radians before applying the formula. Keep the astronomical source values unchanged and store calculated `x`, `y`, and `z` separately.

## Distance compression

Provide two explicit choices:

### Linear

```text
displayDistance = physicalDistance
```

Best for the local stellar neighborhood.

### Logarithmic/compressed

One possible mapping:

```text
displayDistance = scale × log10(1 + physicalDistance)
```

The interface must state that compressed mode preserves direction and ordering, but not proportional separation.

## Star rendering

Do not construct every star as a detailed spherical mesh. For the catalogue, use GPU-efficient points or instanced sprites.

Recommended visual encoding:

- Position: real 3D position.
- Colour: effective temperature or spectral class.
- Brightness/glow: apparent or absolute luminosity, with safe visual limits.
- Point size: a readable screen-space marker, not the physical stellar radius.
- Selected star: outline, halo, and line back to the Sun.
- Labels: show only important or selected stars until the user zooms closer.

The information panel can show physical radius separately and link a selected star to the H–R diagram.

## Are usable 3D nebula models available?

Yes, but they fall into three different categories.

### A. Web-ready scientific models

These are the best starting points because GLB works directly with Three.js.

#### Crab Nebula

- Source: [NASA 3D Resources — Crab Nebula](https://science.nasa.gov/3d-resources/crab-nebula/)
- Available as GLB, approximately 2.11 MB.
- Also available as separate STL components.
- Based on X-ray information from the Chandra X-ray Observatory.
- Good candidate for the first nebula model.

#### G292.0+1.8 supernova remnant

- Source: [NASA 3D Resources — G292.0+1.8](https://science.nasa.gov/3d-resources/g292-01-8-supernova-remnant/)
- Available as GLB, approximately 1.14 MB.
- Based on scientific modelling of Chandra observations.
- Small enough for direct web use after testing.

### B. Scientific meshes that need conversion or optimisation

#### Pillars of Creation in the Eagle Nebula

- Source: [NASA 3D Resources — Pillars of Creation](https://science.nasa.gov/3d-resources/pillars-of-creation/)
- Based on work by STScI visualization specialists.
- Available as STL files.
- Full model is approximately 50 MB; the mini version is still approximately 31 MB.
- Individual pillars are also downloadable.
- Convert to GLB, reduce polygon count, and apply a web material before use.
- This model represents the Pillars, not the complete Eagle Nebula.

#### Eta Carinae Homunculus Nebula

- Source: [NASA 3D Resources — Eta Carinae Homunculus Nebula](https://science.nasa.gov/3d-resources/eta-carinae-homunculus-nebula/)
- High-resolution reconstruction based on observations.
- Available as an STL model of approximately 835 KB.
- A very good candidate for conversion to GLB.
- Separate simulation models of Eta Carinae's interacting stellar winds are also available from [NASA 3D Resources](https://science.nasa.gov/3d-resources/eta-carinae-homunculus-nebula-high-mass-loss-rate/).

#### Chandra 3D collection

- Source: [Chandra 3D Files and Resources](https://chandra.harvard.edu/resources/illustrations/3d_files.html)
- Includes models related to the Cygnus Loop, Eagle Nebula, Crab Nebula, Cassiopeia A, Tycho's supernova remnant, SN 1987A, IC 443, and other objects.
- Formats include STL, OBJ, MTL, FBX, and volumetric VTK data, depending on the object.
- Many are intended for 3D printing and require optimisation before web use.

### C. Scientific 3D visualizations without a convenient downloadable web mesh

#### Orion Nebula

- Source: [NASA — Journey through the Orion Nebula](https://science.nasa.gov/asset/hubble/journey-through-the-orion-nebula/)
- NASA/STScI created a scientifically informed 3D visualization from observations.
- The public page primarily provides images and video rather than a ready-to-load GLB model.
- For Space Safari, use either an original procedural volume inspired by the scientific structure or a flat image marker until a reusable model with clear terms is found.

#### Helix Nebula

- Source: [NASA — Helix Nebula Model](https://science.nasa.gov/asset/hubble/helix-nebula-model-2/)
- NASA provides an animation of a 3D reconstruction.
- The page does not provide a convenient GLB mesh.
- Do not extract a model from the video. Use the video as scientific reference only.

## Important scientific limitation

Nebulae are not solid objects with hard surfaces. STL and OBJ files often represent an inferred shell, emission boundary, simulation surface, or printable interpretation.

The site should distinguish between:

- **Observation-derived reconstruction**
- **Simulation-derived model**
- **Scientifically informed artistic reconstruction**
- **Illustrative procedural effect**

Every model panel should identify which category applies. Avoid calling a model an exact three-dimensional map unless its source explicitly supports that description.

## Recommended rendering approach for nebulae

Use two layers when possible:

1. **Structural mesh**
   - A lightweight GLB mesh showing the scientifically inferred shape.
   - Transparent or emissive material.
   - Optional wireframe/science mode.

2. **Atmospheric volume effect**
   - Soft particle sprites, noise, or a shader-based glow surrounding the mesh.
   - Clearly treated as a visual interpretation.
   - Disable or simplify it on low-powered devices.

This gives the user a recognizable nebula without pretending that a printable surface is the whole gas cloud.

## Formats and conversion

### Preferred runtime format

Use **GLB/glTF** for the website because it can contain geometry, materials, textures, and hierarchy in one efficient web format.

### Source formats

- GLB: load directly after optimisation checks.
- OBJ/MTL: import into Blender and export as GLB.
- STL: contains geometry but usually no colour or useful material; import, simplify, create materials, then export as GLB.
- VTK: scientific volumetric or mesh data; requires a specialised conversion pipeline.

### Optimisation targets

- Prefer under 3 MB per frequently used model.
- Allow up to roughly 5–8 MB for optional models loaded only after selection.
- Use mesh decimation where it does not destroy important structure.
- Use Draco or Meshopt compression if compatible with the loading setup.
- Compress textures to WebP, AVIF, or KTX2 where appropriate.
- Load models on demand, never all at initial page load.
- Provide a lightweight fallback image for devices without WebGL 2.

## Hosting models

### Option 1: Keep optimised models in the repository

Advantages:

- Reliable URLs.
- No cross-origin problems.
- Versions remain tied to the website code.

Disadvantages:

- Increases repository and GitHub Pages size.

Use this for small, essential GLB models such as the Crab Nebula and G292.0+1.8.

### Option 2: GitHub Releases or dedicated object storage

Advantages:

- Keeps the main repository smaller.
- Suitable for optional large models.

Disadvantages:

- Requires stable URLs and correct CORS headers.
- Must provide graceful failure handling.

Do not depend on a third-party model-viewer URL unless it explicitly allows hotlinking and supplies stable CORS headers.

## Technology recommendation

Use **Three.js** for the independent 3D Universe page.

Relevant official documentation:

- [Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html)
- [OrbitControls](https://threejs.org/docs/pages/OrbitControls.html)
- [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html)
- [InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html)
- [Aligning HTML labels with 3D objects](https://threejs.org/manual/pages/align-html-elements-to-3d.html)
- [Responsive Three.js scenes](https://threejs.org/manual/pages/responsive.html)

Why Three.js:

- Works on a static GitHub Pages site.
- Good control over a Sun-centred coordinate system.
- Supports GLB/glTF models.
- Supports point clouds, sprites, custom shaders, labels, picking, and camera flights.
- Does not require a backend for the first version.

## Proposed controls

- Search for an object.
- Fly to selected object.
- Return to Sun.
- Reset camera.
- Linear/compressed distance toggle.
- Maximum-distance slider.
- Object-type toggles: stars, nebulae, clusters, galaxies.
- Spectral-class filter.
- Labels on/off.
- Constellation lines on/off.
- Galactic plane on/off.
- Scale explanation on/off.
- Full screen.
- Reduced effects / performance mode.

## Object information panel

For stars:

- Name and aliases
- Distance
- Right ascension and declination
- Spectral class
- Temperature
- Luminosity
- Radius
- Mass
- Age
- Constellation
- Link to the H–R diagram

For nebula models:

- Name and catalogue designation
- Object type
- Constellation
- Distance
- Approximate physical size
- Model interpretation category
- Observational wavelength represented
- Model creator and credit
- Source link
- Short explanation of what is measured and what is reconstructed

## Accessibility and performance

- Keyboard-accessible search, filters, and object list.
- A text list offering the same object selection as the canvas.
- Visible focus indicators.
- Do not rely on colour alone for star classification.
- Respect `prefers-reduced-motion`.
- Pause animation when the tab is hidden.
- Cap device pixel ratio on mobile.
- Offer a low-effects mode without nebular particles or bloom.
- Provide a non-WebGL fallback message and object list.

## Credits and usage rights

NASA's 3D Resources hub states that its assets are free to download and use, but each asset must still be checked for specific third-party credits or restrictions.

Sources:

- [NASA 3D Resources](https://science.nasa.gov/3d-resources/)
- [NASA 3D Resources on GitHub](https://github.com/nasa/NASA-3D-Resources)
- [NASA Images and Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/)

Rules for Space Safari:

- Credit NASA and the named model creators.
- Link to the original asset page.
- Do not imply NASA endorsement.
- Do not use NASA logos as Space Safari branding.
- Check every asset page for third-party material before publishing.
- Store the asset name, source URL, creator, licence/usage note, download date, and any modifications in a small model manifest.

Suggested manifest fields:

```json
{
  "id": "crab-nebula",
  "name": "Crab Nebula",
  "file": "crab-nebula-optimized.glb",
  "source": "https://science.nasa.gov/3d-resources/crab-nebula/",
  "credit": "NASA/Francis J. Summers; NASA/Robert L. Hurt",
  "modelKind": "observation-derived reconstruction",
  "modified": true,
  "modifications": "Converted/optimised for web display",
  "downloaded": "YYYY-MM-DD"
}
```

## Recommended implementation phases

### Phase 1 — stellar prototype

- Create the independent page and Three.js scene.
- Add the Sun and 100–182 stars.
- Verify Cartesian positions.
- Add camera controls, search, labels, filters, and information panel.
- Add linear/compressed distance modes.
- Test desktop and mobile performance.

### Phase 2 — first two nebula models

- Add the Crab Nebula GLB.
- Add the G292.0+1.8 GLB.
- Load models only when selected.
- Add model credits and reconstruction explanations.

### Phase 3 — converted models

- Convert Eta Carinae's Homunculus Nebula from STL to GLB.
- Evaluate one optimised Pillars of Creation model.
- Add transparent/emissive materials and optional particle effects.

### Phase 4 — expanded educational features

- Galactic plane and scale guides.
- Guided tours such as **From the Sun to Betelgeuse**.
- Distance comparisons.
- Optional travel-time comparisons.
- WebXR only if the ordinary desktop/mobile experience is already stable.

## Recommended first model selection

Start with these objects:

1. Crab Nebula — direct GLB, small file, recognizable, strong scientific source.
2. G292.0+1.8 — direct GLB, very small, useful supernova-remnant comparison.
3. Eta Carinae Homunculus Nebula — small STL and a distinctive 3D structure.
4. Pillars of Creation — visually powerful but requires substantial optimisation.

Do not begin with Orion or the complete Carina Nebula. Their structures are too complex for a quick, honest, and lightweight first implementation.

## Definition of a successful first release

The first release is successful when:

- Star positions are correct and testable.
- The scale mode is always clear.
- Navigation works with mouse, touch, and keyboard-accessible controls.
- The page performs acceptably on a mid-range phone.
- Selecting a star produces useful information.
- At least one nebula model loads on demand with complete credits.
- The existing planetarium and Deep-Sky Atlas remain unchanged.

