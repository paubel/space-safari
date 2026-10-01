const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const lightboxImage = lightbox.querySelector('img');
  const lightboxTitle = lightbox.querySelector('figcaption strong');
  const lightboxMeta = lightbox.querySelector('figcaption span');
  const galleryCards = [...document.querySelectorAll('.gallery-card')];
  const galleryObjects = {
    'The Andromeda Galaxy': { type: 'Galaxy group', distance: 2500000, distanceLabel: '2.5 million light-years', size: 3.2, sizeLabel: '3.2° × 1.0°', moons: '6.4 × 2.0 Moon diameters', summary: 'Our nearest large galactic neighbour, accompanied by M32 and M110. Its faint outer disc spans far more sky than the bright core suggests.' },
    "Bode's Galaxy & friends": { type: 'Interacting galaxy group', distance: 11800000, distanceLabel: '11.8 million light-years', size: .45, sizeLabel: '0.45° × 0.24° (M81)', moons: '0.9 × 0.5 Moon diameters', summary: 'A nearby group led by the grand-design spiral M81 and the starburst galaxy M82, distorted by their gravitational encounter.' },
    'The Whirlpool Galaxy': { type: 'Interacting galaxies', distance: 31000000, distanceLabel: 'about 31 million light-years', size: .19, sizeLabel: '0.19° × 0.12°', moons: '0.37 × 0.23 Moon diameters', summary: 'A face-on spiral and its smaller companion. Their interaction helps make the Whirlpool’s two sweeping arms so distinct.' },
    "NGC 7331 & Stephan’s Quintet": { type: 'Spiral galaxy field · compact galaxy group', distance: 50000000, distanceLabel: 'NGC 7331: about 50 million light-years · Quintet: about 290 million light-years', size: .18, sizeLabel: 'NGC 7331: about 0.18° × 0.06°', moons: 'about 0.35 × 0.12 Moon diameters', summary: 'NGC 7331 is the bright spiral near the centre. Look carefully near the lower right of the frame: Stephan’s Quintet appears as a very faint, diffuse smudge. Four of its galaxies form a distant interacting group; NGC 7320 is a foreground galaxy.' },
    'The Dumbbell Nebula': { type: 'Planetary nebula', distance: 1360, distanceLabel: 'about 1,360 light-years', size: .13, sizeLabel: '0.13° × 0.10°', moons: '0.27 × 0.19 Moon diameters', summary: 'Expanding gas cast off by a dying Sun-like star, now lit by its hot exposed core.' },
    'The North America Nebula': { type: 'Emission nebula · H II region', distance: 2600, distanceLabel: 'about 2,600 light-years', size: 2, sizeLabel: '2.0° × 1.7°', moons: '4.0 × 3.4 Moon diameters', summary: 'A vast hydrogen-emission region whose bright clouds and dark dust lanes trace a familiar continental silhouette.' },
    'The Crescent Nebula': { type: 'Wind-blown emission nebula', distance: 4700, distanceLabel: 'about 4,700 light-years', size: .3, sizeLabel: 'about 0.30° × 0.20°', moons: 'about 0.6 × 0.4 Moon diameters', summary: 'A glowing shell of gas driven outward by fierce winds from WR 136, the massive Wolf-Rayet star near its centre.' },
    "The Elephant's Trunk Nebula": { type: 'Dark nebula · star-forming region', distance: 2400, distanceLabel: 'about 2,400 light-years', size: .33, sizeLabel: 'about 0.33° long', moons: 'about 0.7 Moon diameters', summary: 'A dense pillar of gas and dust inside the much larger IC 1396 star-forming region, sculpted by nearby massive stars.' },
    'The Eastern Veil Nebula': { type: 'Supernova remnant', distance: 2000, distanceLabel: 'about 2,000 light-years', size: 1.3, sizeLabel: 'about 1.3° × 0.2°', moons: '2.7 × 0.4 Moon diameters', summary: 'The bright eastern arc of the Veil Nebula, a filamentary shell of gas expanding from an ancient supernova.' },
    'The Question Mark Nebula': { type: 'Emission nebula · star-forming complex', distance: 3000, distanceLabel: 'about 3,000 light-years', size: 3, sizeLabel: 'about 3° across', moons: 'about 6 Moon diameters', summary: 'A vast cloud of ionised hydrogen and dark dust shaped like a question mark, including NGC 7822 and the region around V398 Cephei.' },
    'The Western Veil Nebula': { type: 'Supernova remnant', distance: 2000, distanceLabel: 'about 2,000 light-years', size: 1.2, sizeLabel: 'about 1.2° × 0.1°', moons: '2.3 × 0.2 Moon diameters', summary: 'The western arc of the Veil Nebula, also called the Witch’s Broom. Its glowing filaments form an expanding shock front.' },
    'Bubble Nebula & friends': { type: 'Wind-blown emission nebula', distance: 7100, distanceLabel: 'about 7,100 light-years', size: .05, sizeLabel: 'about 0.05° across (bubble)', moons: 'about 0.1 Moon diameters', summary: 'A bubble of gas inflated by a massive hot star. The wide field also shows open cluster M52 and the larger Sh2-157 region.' },
    'The Heart Nebula': { type: 'Emission nebula · star-forming region', distance: 7500, distanceLabel: 'about 7,500 light-years', size: 2, sizeLabel: 'about 2° across', moons: 'about 4 Moon diameters', summary: 'A vast complex of glowing hydrogen and dark dust. Radiation and stellar winds from the young stars of Melotte 15 sculpt its clouds and central pillars.' },
    'The Pacman Nebula': { type: 'Emission nebula · star-forming region', distance: 6500, distanceLabel: 'about 6,500 light-years', size: .6, sizeLabel: 'about 0.6° across', moons: 'about 1.2 Moon diameters', summary: 'A vast star-forming cloud shaped by the hot young stars of cluster IC 1590. Dark dust lanes and dense Bok globules create its Pac-Man-like silhouette.' },
    'The Soul Nebula': { type: 'Emission nebula · star-forming complex', distance: 6500, distanceLabel: 'about 6,500 light-years', size: 2.5, sizeLabel: 'about 2.5° × 1.25°', moons: 'about 5 × 2.5 Moon diameters', summary: 'A vast complex of glowing gas, dark dust and young stars. Winds and ultraviolet radiation from the embedded clusters have carved large cavities through the cloud.' },
    'The Wizard Nebula': { type: 'Emission nebula · young open cluster', distance: 7000, distanceLabel: 'about 7,000 light-years', size: .5, sizeLabel: 'about 0.5° across', moons: 'about 1 Moon diameter', summary: 'A young open cluster embedded in a star-forming cloud. Bright ionisation fronts and dark dust lanes create the outline that inspired the nebula’s nickname.' },
    'The Great Cluster in Hercules': { type: 'Globular star cluster', distance: 22200, distanceLabel: 'about 22,200 light-years', size: .33, sizeLabel: '0.33° across', moons: '0.67 Moon diameters', summary: 'Several hundred thousand ancient stars gathered into one of the northern sky’s finest globular clusters.' },
    'The Pleiades': { type: 'Open star cluster · reflection nebula', distance: 445, distanceLabel: 'about 445 light-years', size: 1.3, sizeLabel: 'about 1.3° across', moons: 'about 2.6 Moon diameters', summary: 'A nearby young open cluster whose brightest blue stars are visible to the unaided eye. Their light is scattered by surrounding dust, producing the delicate blue reflection nebulosity.' },
    'The Double Cluster': { type: 'Pair of open star clusters', distance: 7500, distanceLabel: 'about 7,500 light-years', size: 1, sizeLabel: 'about 1° across (the pair)', moons: 'about 2 Moon diameters', summary: 'NGC 869 and NGC 884—also called h and Chi Persei—are neighbouring young open clusters born from the same star-forming region. Together they contain hundreds of hot, luminous stars.' },
    'Sun & Moon': { type: 'Solar-system event', distance: .0000000406, distanceLabel: 'Moon: about 384,400 km', size: .5, sizeLabel: 'about 0.5° across', moons: '1 Moon diameter', summary: 'The Moon passes between Earth and the Sun during a partial solar eclipse.' }
  };
  const lightboxSummary = lightbox.querySelector('.lightbox-summary');
  const lightboxFacts = Object.fromEntries([...lightbox.querySelectorAll('[data-lightbox-fact]')].map(item => [item.dataset.lightboxFact, item]));
  const slideshowCounter = document.querySelector('#slideshow-counter');
  const playButton = document.querySelector('#slideshow-play');
  const normalViewButton = document.querySelector('#slideshow-normal');
  const fullscreenButton = document.querySelector('#slideshow-fullscreen');
  const previousButton = lightbox.querySelector('.slideshow-previous');
  const nextButton = lightbox.querySelector('.slideshow-next');
  const startSlideshow = document.querySelector('#start-slideshow');
  const startFullscreenSlideshow = document.querySelector('#start-fullscreen-slideshow');
  let currentCard = galleryCards[0];
  let slideshowTimer = null;

  function visibleCards() {
    return [...document.querySelectorAll('.gallery-card')].filter(card => !card.closest('[hidden]'));
  }

  function showCard(card) {
    if (!card) return;
    currentCard = card;
    const info = galleryObjects[card.dataset.title];
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = card.querySelector('img').alt;
    lightboxTitle.textContent = card.dataset.title;
    lightboxMeta.textContent = card.dataset.meta;
    if (lightboxSummary && info) {
      lightboxSummary.textContent = info.summary;
      lightboxFacts.type.textContent = info.type;
      lightboxFacts.distance.textContent = info.distanceLabel;
      lightboxFacts.size.textContent = info.sizeLabel;
      lightboxFacts.moons.textContent = info.moons;
    }
    const cards = visibleCards();
    const currentIndex = Math.max(0, cards.indexOf(card));
    slideshowCounter.textContent = `${currentIndex + 1} / ${cards.length}`;
    const nextCard = cards[(currentIndex + 1) % cards.length];
    if (nextCard) {
      const preload = new Image();
      preload.src = nextCard.dataset.full;
    }
  }

  function moveSlide(direction) {
    const cards = visibleCards();
    if (!cards.length) return;
    const currentIndex = Math.max(0, cards.indexOf(currentCard));
    const nextIndex = (currentIndex + direction + cards.length) % cards.length;
    showCard(cards[nextIndex]);
  }

  function setAutoplay(shouldPlay) {
    if (slideshowTimer) window.clearInterval(slideshowTimer);
    slideshowTimer = shouldPlay ? window.setInterval(() => moveSlide(1), 5000) : null;
    playButton.setAttribute('aria-pressed', String(shouldPlay));
    playButton.classList.toggle('is-active', shouldPlay);
    playButton.querySelector('.control-icon').textContent = shouldPlay ? 'Ⅱ' : '▶';
    playButton.querySelector('.control-label').textContent = shouldPlay ? 'Pause' : 'Play';
  }

  function setImageOnly(isImageOnly) {
    lightbox.classList.toggle('is-image-only', isImageOnly);
    normalViewButton.classList.toggle('is-active', !isImageOnly);
    normalViewButton.setAttribute('aria-pressed', String(!isImageOnly));
    fullscreenButton.classList.toggle('is-active', isImageOnly);
    fullscreenButton.setAttribute('aria-pressed', String(isImageOnly));
  }

  function enterImageOnly() {
    setImageOnly(true);
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  function leaveImageOnly() {
    setImageOnly(false);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  function openViewer(card, options = {}) {
    showCard(card);
    if (!lightbox.open) lightbox.showModal();
    setAutoplay(Boolean(options.autoplay));
    if (options.imageOnly) enterImageOnly();
    else leaveImageOnly();
  }

  galleryCards.forEach(card => {
    const info = galleryObjects[card.dataset.title];
    if (info) {
      card.dataset.distance = info.distance;
      card.dataset.size = info.size;
      const facts = document.createElement('span');
      facts.className = 'gallery-card-facts';
      facts.innerHTML = `<span>${info.distanceLabel}</span><span>${info.sizeLabel}</span>`;
      card.querySelector('.gallery-overlay > span:first-child').append(facts);
    }
    card.addEventListener('click', () => openViewer(card));
  });

  const gallerySort = document.querySelector('#gallery-sort');
  if (gallerySort && galleryCards.length) {
    const categories = [...document.querySelectorAll('.gallery-category')];
    const originalParents = new Map(galleryCards.map(card => [card, card.parentElement]));
    const sortedView = document.querySelector('.gallery-sorted-view');
    const sortedGrid = sortedView.querySelector('.gallery-grid-sorted');
    const sortedHeading = sortedView.querySelector('h2');
    const sortStatus = document.querySelector('#gallery-sort-status');
    const sortLabels = {
      'distance-asc': 'Distance · nearest first',
      'distance-desc': 'Distance · farthest first',
      'size-desc': 'Sky size · largest first',
      'size-asc': 'Sky size · smallest first'
    };
    gallerySort.addEventListener('change', () => {
      const mode = gallerySort.value;
      if (mode === 'category') {
        galleryCards.forEach(card => originalParents.get(card).append(card));
        categories.forEach(category => { category.hidden = false; });
        sortedView.hidden = true;
        sortStatus.textContent = 'Showing four object categories.';
        return;
      }
      const [property, direction] = mode.split('-');
      [...galleryCards]
        .sort((a, b) => ((Number(a.dataset[property]) - Number(b.dataset[property])) * (direction === 'asc' ? 1 : -1)) || a.dataset.title.localeCompare(b.dataset.title))
        .forEach(card => sortedGrid.append(card));
      categories.forEach(category => { category.hidden = true; });
      sortedView.hidden = false;
      sortedHeading.textContent = sortLabels[mode];
      const orderLabel = property === 'distance'
        ? (direction === 'asc' ? 'nearest first' : 'farthest first')
        : (direction === 'asc' ? 'smallest first' : 'largest first');
      sortStatus.textContent = `Showing all ${galleryCards.length} photographs sorted by ${property === 'size' ? 'angular size' : 'distance'}, ${orderLabel}.`;
    });
  }
  startSlideshow.addEventListener('click', () => openViewer(visibleCards()[0], { autoplay: true }));
  startFullscreenSlideshow.addEventListener('click', () => openViewer(visibleCards()[0], { autoplay: true, imageOnly: true }));
  previousButton.addEventListener('click', () => moveSlide(-1));
  nextButton.addEventListener('click', () => moveSlide(1));
  playButton.addEventListener('click', () => setAutoplay(!slideshowTimer));
  normalViewButton.addEventListener('click', leaveImageOnly);
  fullscreenButton.addEventListener('click', enterImageOnly);
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('close', () => {
    setAutoplay(false);
    leaveImageOnly();
  });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && lightbox.classList.contains('is-image-only')) setImageOnly(false);
  });
  document.addEventListener('keydown', event => {
    if (!lightbox.open) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveSlide(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveSlide(1);
    } else if (event.key === ' ') {
      event.preventDefault();
      setAutoplay(!slideshowTimer);
    }
  });
}

const checks = [...document.querySelectorAll('.checklist input')];
checks.forEach((check, index) => {
  check.checked = localStorage.getItem(`seestar-check-${index}`) === 'true';
  check.addEventListener('change', () => localStorage.setItem(`seestar-check-${index}`, check.checked));
});
const resetChecklist = document.querySelector('.reset-checklist');
if (resetChecklist) {
  resetChecklist.addEventListener('click', () => {
    checks.forEach((check, index) => {
      check.checked = false;
      localStorage.removeItem(`seestar-check-${index}`);
    });
  });
}

const guideLinks = [...document.querySelectorAll('.guide-nav a')];
const guideSections = guideLinks.map(link => document.querySelector(link.hash));
if (guideLinks.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      guideLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-18% 0px -70% 0px' });
  guideSections.forEach(section => section && observer.observe(section));
}
