# Space Safari Advent Calendar — draft notes

## Local preview

Open `advent-calendar.html` through a local web server to review the real calendar state. Doors unlock from December 1 through December 24, 2026, using each visitor’s local calendar date and midnight. Locked future doors cannot be opened; missed doors remain closed; opened doors persist in local storage across later dates and page reloads. Accelerated-test openings used a separate storage key and do not carry into the real calendar.

## Publication status

This page is deliberately not linked from the website navigation and has not been published. Google Analytics has also been omitted from the draft page until publication is approved.

## Asset audit

All 24 doors now use different, object-specific external images; no image file is repeated. Each story identifies its image type and links to the source/licence page. The non-photographic cases are explicitly labelled: the 51 Pegasi b artist’s impression, the Orion Arm and Local Bubble scientific maps, and the radio image of M87*.

The early galaxy is specifically identified as JADES-GS-z13-0. Sun and Moon use separate source images. CSS circles are no longer used as astronomical-object placeholders; an abstract fallback appears only if an external image fails to load.

The page background is the generated project asset `assets/images/advent-cosmic-background.webp` (1600 px wide, about 59 kB). It was created as a dark, text-free panorama with galaxies, nebulae, a subtle black hole, and varied planets, leaving quieter central regions for the calendar UI. Built-in image generation was used; prompt constraints excluded text, logos, people, spacecraft, doors, and watermarks.

## Editorial review still required

- Check every 100–150-word discovery against the final book manuscript.
- Confirm the exact chapter titles used in the published edition.
- Add the author’s final personal Orion/Christmas wording for Day 24.
- Confirm whether the 2026 calendar should remain in permanent archive mode after December.
- Decide whether the ISS and Voyager satisfy the desired definition of a door “object.”
