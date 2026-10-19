# Area around Sadr.jpg

Added to the 2D planetarium and Nebulae gallery category (24 photos total).
Original local photograph: `assets/images/astrophoto/Area around Sadr.jpg`,
900 × 1600 pixels, used unchanged. Slideshow, sorting and full-image views use
the same original. No 3D nebula was requested or added.

## Approximate registration

There is no WCS/plate-solve calibration supplied with this JPEG. The image is
therefore manually registered with two visually identified landmarks:

- Sadr, pixel **(404,854)**: RA **20h22m13.7018357s**, Dec **+40°15′24.044963″**,
  [SIMBAD Sadr](https://simbad.u-strasbg.fr/simbad/sim-basic?Ident=SADR).
- WR 136 within NGC 6888, pixel **(805,1242)**: RA **303.027258°**,
  Dec **+38.35494°**, the existing WR 136 reference position in the 3D catalogue.
  [SIMBAD WR 136](https://simbad.cds.unistra.fr/simbad/sim-basic?Ident=WR+136).

Pixel coordinates are approximate visual selections, not a star-centroid fit.
`observationPlaneLayout()` intersects the reference ray with the tangent plane
at Sadr, then solves a two-point similarity transform (translation, scale and
rotation, no reflection). This gives roughly **4.403° × 7.819°**, with the photo
centre near **RA 20.3510h / Dec +40.5233°** and an image roll of about **0.69°**.
The observation marker/position identifies **Sadr**, not the centre of the JPEG.
Sadr and the Crescent consequently land at their respective locations inside
the frame rather than assuming that Sadr is exactly at its centre.

This is an approximate registration, **not a full astrometric plate solve**.
Optical distortion is not calibrated. That limitation is stated in the panel.
The measured image field, rather than a claimed nebular diameter, is used for
the angular-size and Moon-comparison fields. Its larger zoom limit lets the
entire portrait be seen. Existing observation transforms remain unchanged.
The wide Sadr photograph is rendered behind the existing detailed Crescent
photo in overlapping areas; both now have soft edges to reduce rectangular borders.

## Distances and identification

[NASA/JPL: Star Formation in the Heart of the Swan](https://www.jpl.nasa.gov/images/pia14102-star-formation-in-the-heart-of-the-swan)
distinguishes Sadr at approximately **1,800 ly** from IC 1318 at approximately
**4,900 ly**. The star is foreground, not physically inside the glowing cloud.
The gallery distance sort uses 4,900 ly for the nebular subject and explicitly
shows both distances in its facts. The Crescent (NGC 6888) is at the lower right.

## Checks

- Registration anchors must project back to their listed pixel locations.
- Planetarium observations and original gallery cards: 24 each; nebula cards: 15.
- Original photograph is referenced with URL-encoded spaces.
- Check planetarium selection, full-image view, gallery lightbox, sorting and
  slideshow navigation. Changes are local until explicitly published.
