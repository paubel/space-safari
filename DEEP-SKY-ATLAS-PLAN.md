# Deep-Sky Atlas – project plan

## Purpose

Create a new, independent page for Space Safari that improves and modernizes the earlier Astronomy Safari catalogue:

- Reference: <https://astronomysafari.netlify.app/>
- New page: `deep-sky-atlas.html`
- Menu label: **Deep-Sky Atlas**
- Language of the finished page: English

The first release will contain approximately 180 carefully selected and verified objects. The architecture and data format must support expansion to the original catalogue's 463 objects, and beyond, without rebuilding the interface.

## Firm decisions

- The Deep-Sky Atlas must **not** be connected to the planetarium.
- Do not add planetarium links or “show in planetarium” controls.
- Do not include or link to the old H–R diagram.
- All object images must remain external; do not store catalogue images in the repository.
- External images must be clear, relevant, credited, and accompanied by a link to the original image page.
- The catalogue must be responsive and must not require horizontal page scrolling.
- The explanatory introduction must be short so the catalogue is visible quickly.
- The data and interface must be designed for incremental expansion from about 180 to at least 463 objects.

## Initial catalogue

Target approximately 180 distinct physical objects, chosen for scientific interest, image quality, reliable data, and balanced coverage of the sky.

Suggested foundation:

- Relevant Messier objects
- Strong Caldwell selections
- Important NGC and IC objects
- Selected Sharpless, Barnard, Abell, and other specialist catalogue objects
- A balance between the northern and southern celestial hemispheres
- A useful range of distances and physical processes

Avoid duplicate entries for the same physical object unless a substructure genuinely needs its own entry. Stars and Solar System objects are outside this catalogue because Space Safari already treats those separately.

## Catalogue hierarchy

Use four clear top-level groups:

1. Nebulae
2. Star clusters
3. Galaxies
4. Galaxy groups and clusters

Possible subtypes include:

- Emission nebula
- Reflection nebula
- Dark nebula
- Planetary nebula
- Supernova remnant
- Star-forming region
- Herbig–Haro object
- Open cluster
- Globular cluster
- Spiral galaxy
- Barred spiral galaxy
- Elliptical galaxy
- Lenticular galaxy
- Irregular galaxy
- Interacting galaxies
- Active galaxy
- Galaxy group
- Galaxy cluster

Subtypes should appear only when relevant. Do not mix top-level groups and subtypes in one long unstructured menu.

## Required data model

Store catalogue records in a separate JavaScript or JSON data file. The UI must be generated from the data rather than hard-coded object by object.

Each object should support these fields:

- Stable internal ID
- Primary name
- Common name or names
- Catalogue identifiers
- Top-level group
- Subtype or subtypes
- Constellation
- Celestial hemisphere or visibility region
- Right ascension
- Declination
- Distance value
- Distance unit
- Distance uncertainty or approximate flag
- Apparent magnitude, when meaningful
- Angular size
- Approximate physical size
- Recommended observing method: naked eye, binoculars, telescope, or photographic
- Best observing season, when appropriate
- Short card description
- Longer plain-language explanation
- External thumbnail URL
- External large-image URL
- Image source page URL
- Image credit
- Image licence or usage note
- Image wavelength: visible, infrared, ultraviolet, X-ray, radio, or composite
- Primary factual source URL
- Additional source URLs
- Featured or recommended flag
- Data verification status

Fields may be empty when a value is not meaningful or cannot be established reliably. The interface must handle missing data gracefully.

## External image policy

Preferred source order:

1. NASA, Hubble, or Webb
2. ESA
3. ESO
4. Wikimedia Commons
5. Other reputable observatories or scientific institutions

Requirements:

- Do not download catalogue images into the repository.
- Store only external URLs and attribution metadata.
- Use responsive external thumbnails rather than full-resolution originals in the grid.
- Lazy-load images with `loading="lazy"` and asynchronous decoding.
- Provide useful alternative text.
- Label non-visible-light and composite images clearly.
- Display image credit in the detail view.
- Link to the original source page, not merely the raw image.
- Provide a visual fallback when an external image fails.
- Do not assume that an image is public domain; preserve the source's required credit and licence information.

## Page structure

### Compact introduction

Use a short introduction similar to:

> Explore nebulae, star clusters, galaxies, and large-scale structures. Search the catalogue or filter objects by type, constellation, distance, catalogue, and observing difficulty.

The catalogue and filters should be visible immediately after this introduction.

### Search and filters

Include:

- Free-text search across names and catalogue identifiers
- Top-level object group
- Object subtype
- Constellation
- Northern, southern, or both skies
- Catalogue: Messier, Caldwell, NGC, IC, Sharpless, Barnard, Abell, and others as data is added
- Distance range
- Observing method or difficulty
- Clear-all/reset control

Only show filter values that occur in the current data. Counts should update after filtering.

### Sorting

Include:

- Recommended
- Name
- Catalogue number
- Nearest first
- Farthest first
- Constellation
- Object type
- Brightest first, only where apparent magnitude is meaningful

### Catalogue cards

Each card should show:

- External thumbnail
- Primary or common name
- Main catalogue designation
- Object type
- Constellation
- Distance
- One concise sentence describing what the user is seeing

### Detail view

Opening a card should show:

- Larger external image
- Plain-language explanation
- Catalogue identifiers
- Object type and subtype
- Constellation
- Coordinates
- Distance
- Apparent magnitude, when useful
- Angular and approximate physical size
- Observing information
- Image wavelength
- Image credit and link to its original page
- Factual sources

Do not include a planetarium link.

## Explanations and glossary

Replace the old long explanation page with a more usable system:

- Short expandable explanation for each top-level group
- Small information controls for unfamiliar terms
- Searchable compact glossary farther down the page or in a dialog
- Short comparisons between easily confused classes
- Plain language rather than long encyclopedia-style paragraphs

## Data verification

Do not copy the old catalogue without review. Known examples requiring correction include:

- The Pleiades are M45, not M47.
- IC 348 is in Perseus, not Pegasus.
- The old NGC 2547 entry links to NGC 2736.
- The old NGC 2170 entry links to the Leo Triplet.
- NGC 2392 and the Medusa Nebula are different objects.

Suggested verification sources:

- SIMBAD for Galactic objects, identification, and sky position
- NASA/IPAC Extragalactic Database for galaxies and galaxy systems
- NASA, ESA, ESO, Hubble, and Webb source pages
- Established catalogue references for Messier, Caldwell, NGC, IC, Sharpless, Barnard, and Abell designations

Distances and physical properties can be model-dependent. Mark approximate or uncertain values instead of presenting false precision.

## Expansion strategy

The first 180 records and all later additions must use the same schema. Expanding toward 463 objects should require only:

1. Adding verified data records
2. Adding external image and source metadata
3. Running validation checks
4. Regenerating filter options automatically from the data

Do not create separate HTML for each object. Do not hard-code filter lists that must be manually updated.

## Validation requirements

Before publication:

- Validate that object IDs are unique.
- Detect duplicate catalogue identifiers and duplicate physical objects.
- Check that required names, categories, and sources are present.
- Check that coordinates and numerical fields are valid.
- Check external source and image URLs where practical.
- Confirm every image has a credit and source page.
- Confirm all filters and sorting modes work with 180 and simulated 463-record datasets.
- Test desktop, tablet, and mobile layouts.
- Confirm there is no horizontal page scrolling.
- Confirm normal page scrolling shows the complete result list.
- Include the existing Google Analytics ID used by Space Safari.

## Integration with Space Safari

- Add **Deep-Sky Atlas** to the ordinary Space Safari navigation menu.
- Use the existing Space Safari visual identity and responsive navigation.
- Keep the page independent from the planetarium and H–R diagram.
- Preserve the existing excluded project folders (`book`, `md-files`, and `scripts`) when publishing site changes.

## Recommended implementation phases

1. Build the data schema, validation, responsive page shell, filters, sorting, cards, and detail dialog with a small test dataset.
2. Add and verify the first 60 representative objects across every category.
3. Expand to approximately 180 objects and complete image attribution.
4. Perform factual, accessibility, responsive, and broken-link checks.
5. Publish the page and add it to the Space Safari menu.
6. Add later batches until the catalogue reaches 463 verified objects.

