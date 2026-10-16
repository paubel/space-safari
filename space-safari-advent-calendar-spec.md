# Space Safari — Advent Calendar: 24 Days of Cosmic Discovery

## Project brief for VS Code + Codex

Build an English-language, visually rich, interactive astronomy Advent calendar for **https://spacesafari-thebook.com/**. This is a functional specification and content plan for implementation, not a claim that the site's existing files/assets have been inspected.

**Central idea:** A dark, star-filled sky contains **24 traditional-looking numbered Advent-calendar doors**. Each date from December 1 to 24 unlocks one new door. When a visitor clicks an unlocked door, it **swings open like a real physical Advent-calendar flap** (rather than merely fading away), revealing a beautiful **astronomical object underneath**. Once opened, the flap disappears from the layout and **the astronomical object remains visible in the same place instead of the door**. Visitors can click the object again at any time to reopen the day's story. Thus the calendar gradually transforms from 24 doors into a sky full of 24 astronomical objects.

## Non-negotiable interaction requirements

1. The **entire calendar has a star-field background**. Prefer a deep navy / black cosmic sky with subtly twinkling stars, a restrained glow, and optional very faint nebula texture. Keep text readable and animation performant.
2. Exactly **24 positions**, corresponding to December 1–24. Each position begins as a distinct **numbered, closed door**.
3. A door can be opened **on its date or later**, never earlier. Earlier dates remain available; no doors expire.
4. On first opening, animate a **physical hinged opening** with CSS `perspective`, `transform-origin`, `rotateY` (or equivalent), a visible flap edge, realistic shadows, and a gentle reveal of the object underneath. Do **not** substitute a simple dissolve or a card flip without a hinge.
5. Each day has **one primary astronomical object**. It occupies the spot **beneath** that day’s door, is revealed when the flap opens, and **stays on the calendar permanently after opening**. Do not replace an opened door with just a check mark, number, empty cell or text label. Avoid several primary objects in one cell.
6. Once a door has opened, clicking the **revealed astronomical object** opens that day's content panel again (modal, drawer or accessible dialog). The object remains visible in the calendar while the panel is open and after it closes.
7. Persist opened-door state in `localStorage` for visitors returning to the site, keyed by year, e.g. `spaceSafariAdventOpened:2026`. On reload, already-opened doors display the objects immediately **without replaying the initial opening animation**. If browser storage is cleared, unlocked doors may need reopening; content must never depend on storage for access.
8. **Future doors stay closed and disabled.** Indicate their availability date accessibly; do not reveal content early via clicking, keyboard navigation, DOM-based hidden spoilers, or unnecessary preloading of future story text.
9. Use a **responsive 6 × 4 grid on desktop** (24 cells); scale to **4 × 6** or **3 × 8** on narrow displays. Preserve attractive, roughly square doors and legible numbers. A slight irregular star-map feeling is welcome but never sacrifice usability.
10. Clicking a currently available door first plays the **door-opening animation**, and then offers its short astronomical story. The object must remain underneath throughout the reveal. Decide whether the content dialog appears automatically after the animation (recommended) and ensure that closing it does not reset the door.
11. Give both the closed doors and revealed objects clear focus states and meaningful screen-reader labels. Support keyboard use (Enter/Space, Escape to close dialog), focus management, and `prefers-reduced-motion`.
12. The calendar and its copy are **in English**, aimed at an international audience, including the United States.

## Purpose and content principles

- Title: **Space Safari Advent Calendar**.
- Subtitle: **24 Days of Cosmic Discovery**.
- One unique chapter from the Space Safari book is featured on each day **December 1–22**: use **all chapters 1–22 exactly once, in a deliberately non-sequential order**.
- December 13 must celebrate **Swedish Lucia**, connecting light in darkness to **Chapter 1 — The Sun and the Edge of Home**, particularly *Light and Color*.
- December 23 and 24 are **special bonus days, not extra chapters**.
- Each day must include a meaningful, specific connection to a concept, observation, or passage in the assigned chapter, not just generic astronomy trivia.
- Use **one hero astronomical object** for each door and, when available, an image already used by Space Safari (from the website, book, or the author's own astrophotography). **Audit existing image assets and their licensing before selecting files**; do not fabricate file paths or assume that a book figure is automatically licensed for reuse online. When no suitable image exists, specify a clearly labeled placeholder and an authorized fallback image source.
- A day's content should typically include: a compelling **question/headline**, **one hero image/object**, a **100–150-word discovery** (written from the relevant chapter after checking the source), a **chapter connection**, and optionally **one small interactive extra** (a quiz, existing 3D scene, or links to a relevant site feature). Do not make every day need a complicated new feature.
- The experience should provide genuine educational value without becoming 24 advertisements. A quiet link to the book or chapter is appropriate.
- Past doors stay available throughout December and, ideally, after Christmas in a clearly defined archive mode.

## Suggested calendar content and door objects

This is a creative plan; titles and prompts below are **not quotations from the book**. The book chapter titles are from the attached manuscript. The final daily prose should be checked against the book and adapted to the chosen real image. Hero objects are **one per cell**, even if the educational topic touches on other objects.

| Date | Book chapter / occasion | Door object (the one object that remains visible) | Discovery question / chapter connection |
|---|---|---|---|
| Dec 1 | Ch. 12 — Our Nearest Stars | **Proxima Centauri** | *How far away is our nearest stellar neighbor?* Explain a light-year and the Alpha Centauri system. |
| Dec 2 | Ch. 5 — The Asteroid Belt | **Ceres** | *Why didn't the asteroid belt become a planet?* Explore Ceres as a remnant of solar-system formation. |
| Dec 3 | Ch. 19 — Beyond the Milky Way: The Cosmic Web | **Andromeda Galaxy (M31)** | *Where does our galaxy fit among its neighbors?* Introduce the Local Group and larger-scale structure. |
| Dec 4 | Ch. 3 — The Moon | **The Moon** | *How did Earth get its Moon?* Giant-impact hypothesis, lunar tides and long-term influence. |
| Dec 5 | Ch. 10 — Beyond the Solar System: Worlds Around Other Stars | **51 Pegasi b** | *What can a giant planet orbiting another star teach us?* Introduce hot Jupiters and exoplanet discovery. |
| Dec 6 | Ch. 15 — The Interstellar Medium and Molecular Clouds | **Taurus Molecular Cloud** | *Where do stars begin?* Molecular clouds, gravitational collapse and star formation. |
| Dec 7 | Ch. 7 — The Outer Planets and the Migrating Worlds | **Saturn** | *Did the giant planets always orbit where they are now?* Rings, ice giants and planetary migration. |
| Dec 8 | Ch. 21 — A Universe at Two Speeds | **NGC 4258 (Messier 106)** | *Why do astronomers disagree about how fast the universe expands?* Explain the Hubble tension using distance-calibration context. Verify any numerical claims against current sources. |
| Dec 9 | Ch. 6 — Meteoroids, Meteors, and Meteorites | **A Perseid meteor** | *What makes a shooting star shine?* Explain meteoroids, meteors, meteorites and atmospheric heating. |
| Dec 10 | Ch. 16 — The Local Arm and Beyond | **The Orion Arm** | *Where exactly are we in the Milky Way?* Show our local spiral-arm segment and how astronomers map it. |
| Dec 11 | Ch. 2 — Human Satellites and Exploration | **International Space Station (ISS)** | *How do humans live and work in orbit?* Connect orbiting laboratories and human spaceflight. |
| Dec 12 | Ch. 8 — Comets, Kuiper Belt, and the Oort Cloud | **Pluto** | *What exists beyond Neptune?* Explore dwarf planets and the Kuiper Belt; briefly distinguish the Oort Cloud. |
| **Dec 13** | **Ch. 1 — The Sun and the Edge of Home / Lucia** | **The Sun** | **Lucia — Bringing Light into the Darkness.** Explain Sweden's Lucia tradition and the physics of sunlight, color and stellar light; a cultural connection, not a claim that Lucia is an astronomical phenomenon. |
| Dec 14 | Ch. 17 — The Stellar Life Cycle in Orion | **Orion Nebula (M42)** | *How does Orion tell the story of stars from birth to death?* Start with stellar birth in M42 and connect to the chapter's stellar life cycle. |
| Dec 15 | Ch. 4 — The Inner Planets | **Venus** | *How did Earth's near-twin become so hostile?* Compare terrestrial worlds, atmospheres and the greenhouse effect. |
| Dec 16 | Ch. 11 — The Local Interstellar Cloud and the Local Bubble | **The Local Bubble** | *Are we living inside a bubble left by ancient supernovae?* Explain the hot, low-density cavity surrounding our Sun. Use a scientific map/visualization if available; this is a large-scale structure, not a directly photographed object. |
| Dec 17 | Ch. 20 — Cosmic Origins: A Journey Through Time and Space | **A deep-field early galaxy** | *How can a telescope look back in time?* The age of light, early galaxies and our cosmic origins. Select one specific, documented galaxy when the image is chosen. |
| Dec 18 | Ch. 14 — Local Stellar Associations and Moving Groups | **The Pleiades (M45)** | *Why do some stars travel through the galaxy together?* Stellar associations, clusters and common origins. |
| Dec 19 | Ch. 9 — Leaving the Solar System | **Voyager 1** | *What does it mean to enter interstellar space?* Heliosphere, heliopause and the Voyager mission. |
| Dec 20 | Ch. 13 — The Solar Neighborhood | **Barnard's Star** | *Why are most nearby stars so faint?* Red dwarfs and the hidden stellar majority. |
| Dec 21 | Ch. 18 — The Future of the Solar System's Journey | **Milky Way Galaxy** | *Where is our Solar System heading?* Galactic orbit, stellar encounters and the very distant future. |
| Dec 22 | Ch. 22 — The Fate of Light and Time | **A black hole** | *What might the universe look like unimaginably far into the future?* Stellar fading, the black-hole era and cosmic end states. Use a scientifically responsible black-hole image or simulation. |
| **Dec 23** | **Bonus: Our Cosmic Home — A Journey Back to Earth** | **Earth** | A visual *homecoming*: after 22 different subjects, zoom from the cosmic web / galaxies / stellar neighborhood back to our planet. Connect to the book's epilogue and central idea that **we are inside the universe, not outside observers**. If technically feasible, link to the existing 3D universe. |
| **Dec 24** | **Bonus: A Christmas Gift from the Universe** | **Orion constellation** | A personal ending: share why Orion mattered in the author's childhood and in the book's preface. Offer an Orion-based interactive experience, astronomy image and/or a small 22-chapter quiz, plus a brief Christmas greeting. |

### Editorial checks before publishing

- Chapters are assigned **once each** for Dec 1–22; Dec 23–24 do not count as additional chapters.
- Some hero images may depict an **astronomical structure, a spacecraft, or one specific meteor** rather than a single star/planet. In each case, they are still **one coherent hero illustration per door**. If the requirement becomes strictly *natural astronomical objects only*, replace the ISS and Voyager with one appropriate celestial object while keeping their chapter connection.
- The **Sun and the Orion constellation** are intentional highlights for Dec 13 and 24 respectively.
- For technical accuracy, avoid presenting hypothetical future objects or conceptual simulations as photographs; add image type/credit where applicable.
- Avoid unsupported definitive claims about the habitability of red-dwarf systems or unresolved cosmological hypotheses.
- Verify that reused photos, especially those in the uploaded book and on external sources, may be redistributed on this website; show appropriate attribution.

## Visual design

### Default calendar state

- Full-width / immersive cosmic section, with a dark gradient backdrop, subtle scattered stars and faint ambient light.
- Header: `Space Safari Advent Calendar` and subtitle `24 Days of Cosmic Discovery`.
- The 24 door tiles should look like a **physical printed Advent calendar set against a starry universe**: numbered front panels, delicate outlines or foil-like accents, hinge on the **left edge**, subtle paper texture/shadows and a hint of astronomical imagery.
- Locked future doors remain visibly closed; current/past dates can be opened.
- Display a short legend: `Open one new cosmic discovery each day, December 1–24.`

### First opening animation (important)

1. User activates an unlocked **closed** door.
2. Front flap pivots around its **left-hand hinge** with a convincing three-dimensional swing: `perspective` on wrapper and `transform-origin: left center` on flap. Set `backface-visibility: hidden`, cast a moving shadow; 600–1000 ms is a reasonable starting duration.
3. Underneath, **the day's astronomical object is already positioned in the identical grid cell** and becomes fully visible as the flap swings away. It may have a subtle reveal glow, but the physical door should be the dominant effect.
4. When animation ends, mark it `opened`, **remove/hide the flap without leaving it as an overlay**, and retain the **same object image in that cell**. The image remains on future visits.
5. Open the educational detail dialog for the selected day (after animation, not before).
6. The opened tile acts as a clickable object thumbnail from then on. **Do not rerun the flap animation** on subsequent clicks.

### Opened door state

- An opened cell displays **one clearly identifiable astronomical object** floating against the star field, possibly in a restrained circular/transparent image treatment. The door number can remain as a tiny unobtrusive caption or accessible label, but **the object is the main visible element**.
- Hover/focus provides a subtle halo and indicates clickability.
- Clicking the object opens the *same* discovery story in a dialog; closing the dialog **does not** restore the flap.
- An optional tooltip shows `Day 14 — Orion Nebula` on hover, but not as a substitute for visible / keyboard-operable content.

### Detail dialog

- Day and topic title; large properly credited image; roughly 100–150 words of engaging explanatory copy; clear reference to chapter title and section; optional related interactive link / one-question quiz.
- One obvious close button; Escape closes; focus is returned to the cell that opened the dialog.
- **No hard paywall or email form required to read the discovery.**
- Optionally `Explore the book` link to https://spacesafari-thebook.com/ and the existing companion features: `/planetarium.html`, `/gallery.html`, `/quiz`, and the site's 3D universe page **after verifying routes**.

## Unlocking dates and year behavior

**Decision to implement:** Use **December in the Europe/Stockholm timezone**, so the published daily unlocks follow the author's Swedish Advent calendar even for international visitors. State this visibly: `New doors open at midnight Swedish time (CET).` December in Stockholm is CET. If a different worldwide schedule is desired, change this centrally in configuration before shipping.

- December 1, 00:00 CET: Day 1 unlocks.
- December 13, 00:00 CET: Lucia door unlocks.
- December 24, 00:00 CET: all 24 doors are unlocked.
- A visitor arriving for the first time on December 10 sees 1–10 **available but visually unopened**, and 11–24 locked. They may open any available doors in any order.
- After December 24, keep all doors available for replay in an **archive mode** (preferably until the next season, or permanently via an archive route). Clarify whether the live season runs from Dec 1 of the configured year; before Dec 1 keep all doors closed. Never reopen all doors by accident when changing the year.
- Keep the date logic separate from UI and make it independently unit-testable. Use a reliable timezone-aware date utility or `Intl.DateTimeFormat(..., { timeZone: 'Europe/Stockholm' })`; do not calculate Swedish dates by assuming the visitor's local timezone or adding a hardcoded UTC offset throughout the year.
- Refresh availability while the page stays open across midnight (e.g. low-frequency check or scheduled next-midnight update) and on tab focus/visibility restoration.
- Client-side date checks are fine for a festive experience but **not security**: if preventing spoilers is essential, use server-side date gating instead of delivering future copy in the initial bundle.

## Data structure suggestion

Keep the data independent of rendering so content/images may be revised without editing interaction logic. Example schema (illustrative pseudo-JSON, **not** actual asset paths):

    {
        "day": 13,
        "chapterNumber": 1,
        "chapterTitle": "The Sun and the Edge of Home",
        "section": "Light and Color",
        "title": "Lucia: Bringing Light into the Darkness",
        "objectName": "The Sun",
        "objectImage": "REPLACE_WITH_VERIFIED_IMAGE_ASSET",
        "imageAlt": "The Sun showing its glowing surface",
        "imageCredit": "REPLACE_WITH_VERIFIED_LICENSE_AND_CREDIT",
        "teaserQuestion": "Where does the light around us come from?",
        "body": "WRITE_100_TO_150_WORDS_BASED_ON_THE_BOOK",
        "interactiveUrl": null,
        "specialOccasion": "Swedish Lucia"
    }

Use **24 entries** with unique `day` and `objectName` values as far as reasonably possible; `chapterNumber` is 1–22 on days 1–22 and `null` on days 23–24. Maintain a separate asset manifest showing verified local file path, original source, attribution, license and usage status.

## Implementation guidance for Codex

1. Inspect the existing website project first: framework (plain HTML/CSS/JS, React, etc.), build workflow, routing, existing fonts/theme, image files, and any animation libraries. **Extend the existing project rather than imposing a new framework.**
2. Find existing site/book/author image assets before choosing external replacements. Do not invent existing paths or promise that particular images are already present.
3. Create a reusable calendar component, a separate date-unlock helper, a structured 24-day content dataset, a hinged-door component/state, a persistent-state utility, and one accessible detail dialog. Follow the current repository conventions.
4. Provide beautiful **starfield imagery/graphics without making individual astronomical objects disappear into the backdrop**. Prefer CSS / lightweight canvas for stars only if necessary; ensure no excessive CPU or flashing.
5. Implement actual **hinged-flap interaction** before polishing secondary details. Distinguish `locked`, `unlocked but closed`, `opening`, and `opened` UI states.
6. Persist opened days per year and restore them on page load; **opened objects remain** and are clickable to reread content.
7. Support desktop/touch/mobile, good loading behavior, reduced motion, accessible dialog interactions and descriptive alt text.
8. Add tests for: 22 distinct chapters on days 1–22; unique dates 1–24; Dec 13 Lucia; Dec 23 and 24 specials; future doors blocked; past days available; once opened object retained; click reopened object; persistence after reload; midnight rollover; missing asset fallback; reduced motion.
9. Check that every detail story truly matches its book chapter. Put only approved/licensed images into production.
10. Deliver clean, readable, maintainable code, with **all code identifiers, code comments and interface copy in English**.

## Acceptance criteria / test cases

- [ ] On November 30 (Stockholm date), 24 numbered flaps appear on a star-field background; none can be opened early.
- [ ] On December 1, Day 1 opens with a physical **left-hinged door animation**, revealing **Proxima Centauri**, and its story can be read.
- [ ] After opening Day 1, **Proxima Centauri remains visible in the grid** instead of the door even after the user closes the story.
- [ ] Clicking Proxima Centauri again reopens the story immediately and does **not** bring the door back.
- [ ] Refreshing/revisiting the website still shows Proxima Centauri rather than its closed flap if it was previously opened.
- [ ] On December 10, days 1–10 may be opened in **any order**, and days 11–24 remain locked.
- [ ] Day 13 explains Swedish Lucia and the Sun/light/color connection to Chapter 1.
- [ ] Days 1–22 collectively cover **all 22 chapters exactly once**, not in chapter order.
- [ ] Day 23 is the cosmic homecoming to Earth; Day 24 uses Orion, the author's childhood inspiration, for a special Christmas finale.
- [ ] Each of the 24 doors reveals **one distinct main hero object/visual**, not an empty cell, and all revealed objects remain individually clickable.
- [ ] Touch, keyboard, Escape/focus behavior, responsive layouts and reduced-motion mode work.
- [ ] Each image has a verified asset/source/license (or clearly declared placeholder awaiting review), appropriate alt text and attribution.

## What Codex should do first

**First inspect the existing codebase and asset directory, then propose exact files to create/edit.** Implement the calendar interaction and data structure using the plan above. Flag missing approved images and any uncertain book-to-image mapping instead of silently inventing assets. Confirm the date policy and deploy route before shipping; otherwise proceed with Stockholm midnight as the default.
