# Eagle Nebula (M16) and embedded Pillars of Creation

Implemented in `js/3d-universe.js` and `js/eagle-nebula.js`.

## Scientific basis and limits

- Adopted distance: 7,000 light-years; constellation Serpens; complex span
  approximately 70 × 55 light-years. Source:
  [NASA Messier 16](https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-16/).
- Catalogue centre: RA 274.7°, Dec −13.8167° (NGC 6611/M16 region).
  The Pillars are embedded near the centre, not a separate distant object.
  Their fine offset and the cluster markers are illustrative. They are not
  individual astrometric measurements. The Eagle's diffuse shape is procedural.
- Pillars geometry is adapted from the NASA printable **positions** STL:
  [NASA Pillars of Creation 3D Resources](https://science.nasa.gov/3d-resources/pillars-of-creation/).
  Original creators: **Leah Hustak and Ralf Crawford, STScI**.
- The printable model contains a lower lattice. The adaptation keeps triangles
  wholly above source Z=10, omits printing supports/lower ends, and fades the
  resulting ends with screen-door shading. Vertex clustering reduces geometry.
  This is an adapted visualization, not the complete original scientific mesh.
- The retained geometry is normalized to a four-light-year height (NASA gives
  roughly 4–5 light-years for the pillars). It retains the source's relative
  depths and upper-cloud shapes, but cropping changes the full original extent.
- Diffuse emission now follows the user's [ESO wide-field reference eso0926a](https://www.eso.org/public/images/eso0926a/):
  pink/red wings, a pale blue-white central region, an upper dark dust bay and
  irregular obscuring lanes. NGC 6611 markers are grouped towards the upper right.
  The pillar surfaces use dark reddish-brown dust with pale illuminated rims.
  This is an illustrative colour rendering, not calibrated radiative transfer or
  a measured three-dimensional reconstruction of the photograph.
  [NASA's 2024 Hubble/Webb visualization](https://science.nasa.gov/missions/hubble/new-hubble-webb-pillars-of-creation-visualization/)
  and [ESA/Hubble's visible image](https://esahubble.org/images/heic1501a/)
  provide visual/scientific context. Colours vary with filter mapping.
- Eagle-only volume integration uses analytic ray/sphere entry and exit, including
  views from inside the cloud. Low/Medium/High cover the same whole ray with
  optical-depth opacity scaled by step length; lower quality no longer samples
  only the faint front of the cloud. Straight-alpha output avoids double dimming.

## Navigation and performance

- Select **Eagle Nebula (M16)** in the deep-sky list or search M16 / M 16 /
  Messier 16 / NGC 6611. “Fly to selected object” shows the whole cloud.
- **View Pillars of Creation** centres the existing orbit camera on the actual
  embedded mesh. Drag to orbit; scroll/pinch to zoom. No separate viewer or
  fullscreen requirement. Searching “Pillars of Creation” goes to this close-up.
- Both scales share one hierarchy: linear scale uses proportional physical
  spans; logarithmic scale enlarges the complex but retains the 4:70 size ratio.
- Local indexed asset: `assets/models/pillars-of-creation.bin`, 850,340 bytes,
  23,484 vertices, 47,377 triangles. No runtime STL parsing or remote model fetch.
  A single opaque, depth-writing draw with procedural shading avoids transparent
  triangle sorting. The surrounding volume follows the existing adaptive
  26/42/58-step quality settings and the existing nebulosity on/off switch.
- This adds work; frame-rate impact depends on hardware and view. No universal
  FPS guarantee. No extra animation, physics, shadows, postprocessing or raytracer.

## Rebuilding the asset

Download NASA's **Pillars of Creation (positions).stl** from the source page, then:

```sh
python3 tools/prepare-pillars-model.py /path/to/positions.stl assets/models/pillars-of-creation.bin
```

Requires NumPy. The build script specifies the binary layout and all transforms.
Original source URL:
https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/printable/pillars-of-creation/Pillars%20of%20Creation%20(positions).stl

## Removal

Remove the Eagle catalogue entry, its import/load branch, close-up function,
button/bindings/search special case, the module and asset. Other nebulas do not
depend on it. Keep attribution while distributing the adapted model.
