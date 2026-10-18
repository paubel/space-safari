# Horsehead Nebula — Barnard 33

Original procedural visible-light interpretation in `js/horsehead-nebula.js`.
No photograph or external 3D mesh is distributed. Its dark curved muzzle, head,
neck and dust ridge obscure the red IC 434 emission sheet behind them. The
profile is converted into a depth-dependent density volume with turbulent edges;
it is not a camera-facing photograph. The depth is illustrative, not tomography.

## Position, size and uncertainty

- RA 05h40m59s, Dec −02°27′30″ (J2000), from
  [SIMBAD Barnard 33](https://simbad.cds.unistra.fr/simbad/sim-basic?Ident=Barnard+33).
- Adopted distance **1,300 ly**, following
  [NASA's 2024 Webb account](https://science.nasa.gov/missions/webb/webb-captures-top-of-iconic-horsehead-nebula-in-unprecedented-detail/).
- Adopted protruding pillar height **approximately 4 ly**, within an **8 ly**
  local context field. Not an exact measurement, and not the size of all IC 434.
  Published approximate extents depend on the cloud boundary and adopted distance:
  [NASA APOD 2019](https://science.nasa.gov/image-article/apod-2019-december-17-the-horsehead-nebula/)
  describes about 5 ly at the older 1,500 ly distance (about 4.3 ly if rescaled
  to 1,300 ly). The model rounds to 4 ly, rather than claiming false precision.
- The normalized profile rises from y=−0.5 to +0.5. With an 8 ly diameter
  field, this corresponds to 4 ly base-to-tip. Depth is not observationally fixed.
- Linear mode: the 8 ly field is converted with the same ly-to-scene factor
  as other nebulas; the dust pillar remains half the field diameter.
- Logarithmic mode: distances are compressed, but this model is scaled relative
  to the 70 ly Eagle complex. A 4 ly Horsehead is comparable in displayed height
  to the adopted 4 ly Pillars of Creation, not the entire 70 ly Eagle Nebula.
  This does not make logarithmic *positions* metrically proportional.

## Appearance and navigation

The Sun-facing initial camera shows the familiar optical silhouette. Drag to
orbit; scroll/pinch to zoom. Search Horsehead, Barnard 33, B33 or B 33, or select
the object from the existing deep-sky list. The existing nebulas switch hides
both dust and emission. Fly distance follows model scale in both distance modes.
The details panel distinguishes pillar height from local context field.

## Performance and removal

One low-poly sphere bounds a 26/42/58-step volume, using the existing adaptive
quality settings. The entire ray is integrated at each quality, with step-length
corrected extinction and static sub-step jitter. A generated 256 × 256 single-channel
half-float distance texture (128 KiB) avoids 8-bit contour banding and replaces
per-pixel polygon traversal. There are no new network assets,
physics, shadows or postprocessing. More visible volumes still add GPU work.

Remove its catalogue entry, module import/load branch, orientation/scale/fly and
detail overrides, then remove the module. Other nebulas do not depend on it.
