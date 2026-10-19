# Planetarium direct links

Implemented in `js/planetarium-links.js` (pure URL helpers) and
`js/planetarium.js` (camera/UI restoration). No server-side routing is required.

## Object and star destinations

Examples after publication:

- `planetarium.html?object=sadr-region`
- `planetarium.html?object=m45`
- `planetarium.html?object=ic5146`
- `planetarium.html?star=Vega`

Object IDs come from `observations` in the viewer; star names are validated
against the local interactive-star catalogue (case-insensitive). Unknown names
are ignored safely. Object destinations take precedence if both are provided.
Selecting a photograph or star updates the address using `replaceState`, without
adding dozens of browser-history entries. Panels also expose a clean direct
link. The Overview action clears the destination. Existing plain URLs still
open the original Andromeda-centred overview.

## Copy view link

The **Copy view link** button in the lower-right toolbar creates a URL containing:

- `ra`: right ascension in **hours**, 0 ≤ RA < 24 (six decimal places).
- `dec`: declination in **degrees**, −90 through +90 (six decimal places).
- `fov`: vertical field of view in **degrees**, 4.8 through 95.
- Optional selected `object` or `star` to restore its information panel.
- `mode=photos|stars`, `grid=0|1`, and the star-mode display switches
  `photos`, `constellations`, `photoMenu`, `mainMenu` (0/1).

Explicit coordinates and zoom override a destination's default camera framing.
Copying during a fly-to animation finishes that animation first, avoiding a
transient midway view. View links apply immediately on load, not via a long
fly-in animation. URL restoration is also connected to `popstate`.

Clipboard access uses the browser Clipboard API. The generated URL is also
shown in a labelled read-only field. If clipboard access is denied or unavailable,
the field is selected for manual copying; the feature still works without it.

## Privacy and limitations

No Earth latitude/longitude, geolocation, observer date/time, permissions, private
search filters or unrelated query parameters are serialized. Only the whitelisted
sky-view parameters are copied. Fullscreen state is not restored automatically.
The URL preserves camera direction, zoom and display layers—not every filter or
temporary panel state. Different screen aspect ratios naturally frame a
different horizontal width at the same vertical field of view.

RA=0 and negative declination are valid. The serializer wraps rounding at the
24h meridian back to 0h. Empty, non-finite, incomplete or out-of-range coordinate
triples are ignored as a unit; a valid object destination can still be opened.
URL text is never interpreted as HTML or JavaScript.

## Verification

```sh
node --test tools/test-planetarium-links.mjs
node --check js/planetarium.js
```

Test object/star links, a dragged/zoomed view round trip, display switches,
clipboard fallback, narrow screens and malformed URLs in the browser. This
feature is local until explicitly published.
