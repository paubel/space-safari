# Hyades (Caldwell 41) and revised Pleiades (M45)

Implemented in `js/open-star-clusters.js` and the existing 3D Universe catalogue.

## What is observational and what is illustrative

Ten bright Pleiades members and eight bright Hyades members use **SIMBAD ICRS
J2000 RA/Dec and V magnitudes**, retrieved 2026-10-18. Values are stored in the
module as a small deterministic snapshot, not fetched during browser startup.
The blue-white Pleiades stars and the warm Hyades giants have tighter unresolved
cores rather than large solid luminous balls. Apparent magnitude controls marker
size, not physical stellar radius or a calibrated photometric flux.

Sky offsets are projected at the adopted common cluster distance onto a local
east/west/north basis. Stars have small, **illustrative depth offsets**, not a
claim of individual Gaia distances. Bright-star parallaxes (especially multiples)
are not naively inverted to invent a precise depth reconstruction. The 360 faint
points per cluster are a seeded illustrative population, **not** 360 individually
verified members or a full catalogue. This distinction is visible in the panels.

SIMBAD TAP query used:

```sql
SELECT i.id,b.ra,b.dec,b.plx_value,f.V
FROM basic AS b JOIN ident AS i ON b.oid=i.oidref
LEFT JOIN allfluxes AS f ON b.oid=f.oidref
WHERE i.id IN ('NAME Alcyone','NAME Atlas','NAME Electra','NAME Maia',
 'NAME Merope','NAME Taygeta','NAME Pleione','NAME Celaeno','* 21 Tau',
 '* 22 Tau','* gam Tau','* del01 Tau','* eps Tau','* tet01 Tau',
 '* tet02 Tau','* del02 Tau','* del03 Tau','* 70 Tau')
```

Endpoint: https://simbad.cds.unistra.fr/simbad/sim-tap/sync
Acknowledgment: SIMBAD database, operated at CDS, Strasbourg, France.
Returned parallax values were inspected but are **not used** for stellar depth.

## Pleiades

- Centre RA 56.75°, Dec +24.1167°, adopted distance **445 ly**; local central
  field diameter **13 ly**, not the whole extended/tidal cluster.
- Source: [NASA Messier 45](https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-45/).
- The old seven arbitrary star placements are removed. Main members include
  Alcyone, Atlas, Electra, Maia, Merope, Taygeta, Pleione, Celaeno and Asterope.
- Blue dust illumination is localized around Merope, Alcyone, Maia and Electra;
  a southward Merope fan and irregular wisps replace the spherical blue cloud.
  The volume remains an artistic density interpretation, not measured tomography.
- [NASA: Ghostly Reflections in the Pleiades](https://science.nasa.gov/asset/hubble/ghostly-reflections-in-the-pleiades/)
  and [NASA: Hubble's Nebulae](https://science.nasa.gov/mission/hubble/science/universe-uncovered/hubble-nebulae/)
  describe illuminated interstellar dust encountered by the cluster, not dust
  left over from its birth. Telescope diffraction spikes are not intrinsic stars
  and are not baked into the model.
- A generic map marker coincident with a resolved member's sky position fades
  near the cluster to avoid covering the new stars. This does not alter the
  underlying global star catalogue or its data. It returns when zooming out.
  Other generic catalogue markers smoothly become small unresolved points in a
  cluster close-up so nearby foreground symbols (especially Aldebaran) do not
  engulf the view. Marker sizes return to normal on leaving the close-up.

## Hyades

- **Caldwell 41 / Melotte 25**, adopted centre RA 66.75°, Dec +16°; distance
  **153 ly**; displayed central field **24 ly**. The approximate core diameter is
  **18 ly**, and the bound region and especially tidal tails extend farther.
- [ESA/Gaia overview](https://www.esa.int/Science_Exploration/Space_Science/Gaia/Is_the_nearest_star_cluster_to_the_Sun_being_destroyed)
  and [ESA core visualization](https://www.esa.int/ESA_Multimedia/Images/2021/03/The_core_of_the_Hyades_star_cluster).
  Core context: [Perryman et al., The Hyades: distance, structure, dynamics, and age](https://arxiv.org/abs/astro-ph/9707253).
- The bright V uses Gamma, Delta¹/²/³, Epsilon and Theta¹/² Tauri plus 70 Tauri.
  It has **no bright reflection or emission nebula**. Aldebaran stays a separate
  foreground object; it is not inserted among cluster members.
- The model omits the hundreds-of-parsecs-long tidal tails and is not a claim of
  complete Gaia membership or accurate cluster dynamics.

## Scale, controls, performance

- Both use the normal deep-sky list, search aliases, selection panel, orbit
  controls and layer switch. Fly distance follows actual model scale, including
  narrow viewports. Startup remains Sun-centred, logarithmic, with nebulas on.
- Linear positions and model spans use the shared ly-to-scene conversion.
  Logarithmic distances remain compressed; cluster spans keep their relative
  physical ratio to the 70 ly Eagle field (and its 4 ly Pillars), rather than
  showing every object at the same arbitrary diameter.
- Low/Medium/High show 120/220/360 illustrative faint points. Hyades adds just
  eight bright sprites and one point draw, no raymarching or animation.
  Pleiades adds ten bright sprites, one point draw and a 26/42/58-step reflection
  volume. Step-length-corrected whole-ray integration preserves approximate
  opacity across quality settings. No runtime catalogue/network asset download.
- Remove the module/import, cluster load/scale/fly/quality/marker-overlap branches
  and the Hyades catalogue entry to remove this addition. Restoring the previous
  Pleiades representation requires its prior catalogue/volume implementation.
