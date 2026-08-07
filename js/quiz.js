const questionBank = [
  { question: "From which layer does most visible sunlight escape?", options: ["Photosphere", "Chromosphere", "Corona", "Radiative zone"], answer: "Photosphere" },
  { question: "What is the photosphere's approximate effective temperature?", options: ["5,800 K", "3,900 K", "9,600 K", "1.2 million K"], answer: "5,800 K" },
  { question: "Why can the corona be far hotter than the photosphere without containing more heat overall?", options: ["It is extremely thin and contains little material", "It reflects most of the Sun's visible light", "It is shielded from the solar magnetic field", "It is made primarily of cold neutral hydrogen"], answer: "It is extremely thin and contains little material" },
  { question: "Which object is the only dwarf planet in the inner Solar System?", options: ["Ceres", "Vesta", "Pallas", "Hygiea"], answer: "Ceres" },
  { question: "Which sequence describes the Dawn spacecraft's visits?", options: ["Vesta first, then Ceres", "Ceres first, then Vesta", "Mars first, then Ceres", "Vesta first, then Pluto"], answer: "Vesta first, then Ceres" },
  { question: "Which feature best distinguishes Vesta from water-rich Ceres?", options: ["A differentiated crust, mantle, and core", "A thick nitrogen atmosphere", "A global subsurface ocean confirmed by radar", "A ring system shaped by shepherd moons"], answer: "A differentiated crust, mantle, and core" },
  { question: "How is a short-period comet defined?", options: ["An orbit shorter than 200 years", "An orbit shorter than 20 years", "An orbit shorter than 500 years", "An orbit shorter than 1,000 years"], answer: "An orbit shorter than 200 years" },
  { question: "What is the main observational evidence for the inferred Oort Cloud?", options: ["Long-period comets arriving from many directions", "A continuous infrared glow beyond Neptune", "Radio echoes from a spherical shell", "Direct images of millions of icy bodies"], answer: "Long-period comets arriving from many directions" },
  { question: "Which boundary marks where the solar wind no longer controls the surrounding plasma?", options: ["Heliopause", "Termination shock", "Heliosheath", "Kuiper cliff"], answer: "Heliopause" },
  { question: "What is the correct outward sequence near the edge of the heliosphere?", options: ["Termination shock, heliosheath, heliopause", "Heliosheath, termination shock, heliopause", "Heliopause, termination shock, heliosheath", "Termination shock, heliopause, heliosheath"], answer: "Termination shock, heliosheath, heliopause" },
  { question: "When did Voyager 1 cross the heliopause?", options: ["2012", "2004", "2018", "2021"], answer: "2012" },
  { question: "What are most cosmic rays?", options: ["High-energy atomic nuclei", "High-frequency radio waves", "Packets of visible starlight", "Streams of neutral hydrogen atoms"], answer: "High-energy atomic nuclei" },
  { question: "How many known Earth-sized planets orbit TRAPPIST-1?", options: ["Seven", "Five", "Six", "Eight"], answer: "Seven" },
  { question: "Why is TRAPPIST-1 especially useful for atmospheric studies?", options: ["Its planets transit a small, dim star", "It is the closest star system to Earth", "Its planets emit strong visible light", "It has no stellar flares or magnetic activity"], answer: "Its planets transit a small, dim star" },
  { question: "What most likely helped carve out the Local Bubble?", options: ["Multiple supernova explosions and stellar feedback", "A collision between the Milky Way and Andromeda", "The expansion of the Sun's heliosphere", "A single supermassive black-hole jet"], answer: "Multiple supernova explosions and stellar feedback" },
  { question: "What kind of objects make up Luhman 16?", options: ["A pair of brown dwarfs", "A red dwarf and a white dwarf", "Two neutron stars", "A star and a gas giant"], answer: "A pair of brown dwarfs" },
  { question: "How does a nearby star's parallax change as its distance decreases?", options: ["The apparent shift becomes larger", "The apparent shift becomes smaller", "The shift disappears completely", "The shift changes from angular to radial motion"], answer: "The apparent shift becomes larger" },
  { question: "Which description matches a typical white dwarf?", options: ["Roughly Earth-sized with about 60% of the Sun's mass", "Roughly Moon-sized with twice the Sun's mass", "Roughly Jupiter-sized with 10% of the Sun's mass", "Roughly Mars-sized with the same mass as Earth"], answer: "Roughly Earth-sized with about 60% of the Sun's mass" },
  { question: "Which nearby group is identified as the nearest open star cluster?", options: ["The Hyades", "The Pleiades", "The Trapezium", "Omega Centauri"], answer: "The Hyades" },
  { question: "What mainly causes the Orion Nebula's gas to glow?", options: ["Ultraviolet radiation from the Trapezium stars", "Friction between colliding planets", "Reflected light from Betelgeuse", "Radio emission from a central black hole"], answer: "Ultraviolet radiation from the Trapezium stars" },
  { question: "What caused Betelgeuse's famous dimming in 2019–2020?", options: ["Dust formed from ejected and cooling gas", "Its core briefly stopped nuclear fusion", "An exoplanet crossed its entire surface", "A nearby black hole bent its light away"], answer: "Dust formed from ejected and cooling gas" },
  { question: "Which future stellar encounter may disturb the Oort Cloud in about 1.3 million years?", options: ["Gliese 710", "Barnard's Star", "Sirius B", "Proxima Centauri"], answer: "Gliese 710" },
  { question: "What will the Sun's remnant eventually become after its red-giant phases?", options: ["A white dwarf", "A neutron star", "A stellar-mass black hole", "A brown dwarf"], answer: "A white dwarf" },
  { question: "Which three galaxies are the largest members of the Local Group?", options: ["The Milky Way, Andromeda, and Triangulum", "The Milky Way, Virgo A, and the Large Magellanic Cloud", "Andromeda, Sombrero, and Whirlpool", "The Milky Way, Centaurus A, and Triangulum"], answer: "The Milky Way, Andromeda, and Triangulum" },
  { question: "Approximately how far away is the Andromeda Galaxy?", options: ["2.5 million light-years", "250,000 light-years", "25 million light-years", "50–60 million light-years"], answer: "2.5 million light-years" },
  { question: "Approximately how far away is the Virgo Cluster?", options: ["50–60 million light-years", "5–6 million light-years", "150 million light-years", "500 million light-years"], answer: "50–60 million light-years" },
  { question: "What does Laniakea describe?", options: ["A flow-defined basin of galaxy motions", "A single permanently bound galaxy cluster", "A spherical void with no galaxies", "The Milky Way's central stellar bar"], answer: "A flow-defined basin of galaxy motions" },
  { question: "When was the cosmic microwave background released?", options: ["About 380,000 years after the Big Bang", "About 38 million years after the Big Bang", "About 3,800 years after the Big Bang", "About 1 billion years after the Big Bang"], answer: "About 380,000 years after the Big Bang" },
  { question: "Approximately what share of today's cosmic energy content is ordinary atomic matter?", options: ["5%", "16%", "26%", "69%"], answer: "5%" },
  { question: "Which statement about Hawking radiation is accurate?", options: ["It has not been directly observed from an astrophysical black hole", "It has been measured from every known stellar black hole", "It makes black holes gain mass over time", "It is ordinary visible light reflected by an accretion disk"], answer: "It has not been directly observed from an astrophysical black hole" },
  { question: "Why can no black dwarf exist yet?", options: ["The universe is not old enough for a white dwarf to cool completely", "Black dwarfs immediately collapse into neutron stars", "White dwarfs cannot lose thermal energy", "Dark energy prevents their formation"], answer: "The universe is not old enough for a white dwarf to cool completely" },
  { question: "Why did early astronomers use the name ‘planetary nebula’?", options: ["Some looked small, round, and planet-like through early telescopes", "They were believed to be nurseries where planets formed", "They were first detected inside planetary atmospheres", "Their spectra matched those of the giant planets"], answer: "Some looked small, round, and planet-like through early telescopes" },
  { question: "Which event marked the beginning of the space age on 4 October 1957?", options: ["The launch of Sputnik 1", "The launch of Explorer 1", "The first flight of Vostok 1", "The creation of the GPS constellation"], answer: "The launch of Sputnik 1" },
  { question: "At approximately what altitude do geostationary satellites orbit above the equator?", options: ["35,786 kilometres", "20,200 kilometres", "2,000 kilometres", "400 kilometres"], answer: "35,786 kilometres" },
  { question: "Why are four satellites normally needed for a complete GPS position fix?", options: ["To find three spatial coordinates and correct the receiver's clock", "To measure altitude without using signal timing", "To cancel all atmospheric delays automatically", "To keep the receiver aligned with Earth's magnetic field"], answer: "To find three spatial coordinates and correct the receiver's clock" },
  { question: "Why do astronauts appear weightless aboard the International Space Station?", options: ["The station and its contents are continuously falling around Earth", "Earth's gravity ends at the station's altitude", "Centrifugal force removes the station's mass", "The station is held motionless between Earth and the Moon"], answer: "The station and its contents are continuously falling around Earth" },
  { question: "What is the approximate one-way communication delay between Earth and Mars, depending on their positions?", options: ["4 to 24 minutes", "4 to 24 seconds", "40 to 48 minutes", "1 to 3 hours"], answer: "4 to 24 minutes" },
  { question: "What causes the Moon's phases under normal circumstances?", options: ["We see changing fractions of its sunlit half", "Earth's shadow covers different parts of it", "The Moon produces varying amounts of light", "Clouds in Earth's atmosphere block it in a monthly cycle"], answer: "We see changing fractions of its sunlit half" },
  { question: "Why does the Moon keep nearly the same face toward Earth?", options: ["Its rotation period matches its orbital period", "It does not rotate on its axis", "Earth's magnetic field locks its surface in place", "Its far side is substantially heavier than its near side"], answer: "Its rotation period matches its orbital period" },
  { question: "At approximately what present rate is the Moon receding from Earth?", options: ["3.8 centimetres per year", "3.8 millimetres per year", "38 centimetres per year", "3.8 metres per year"], answer: "3.8 centimetres per year" },
  { question: "What are the Moon's dark maria?", options: ["Basalt plains that filled ancient impact basins", "Oceans of frozen water beneath a thin crust", "Regions permanently covered by volcanic ash", "Deep valleys carved by flowing liquid water"], answer: "Basalt plains that filled ancient impact basins" },
  { question: "What name is commonly given to the roughly Mars-sized body in the giant-impact hypothesis?", options: ["Theia", "Selene", "Vulcan", "Eris"], answer: "Theia" },
  { question: "Why is Venus hotter at the surface than Mercury?", options: ["Its dense atmosphere traps heat", "Its metal-rich core generates more radioactive heat", "It rotates much faster and creates stronger friction", "Its clouds concentrate sunlight onto the ground"], answer: "Its dense atmosphere traps heat" },
  { question: "How long is one solar day on Mercury, measured from noon to noon?", options: ["176 Earth days", "88 Earth days", "59 Earth days", "243 Earth days"], answer: "176 Earth days" },
  { question: "Which evidence most strongly shows that ancient Mars had wetter surface conditions?", options: ["Valley networks, deltas, and water-altered minerals", "A present global ocean beneath its atmosphere", "Continuous rainfall measured by landers", "A dense oxygen atmosphere trapped in polar ice"], answer: "Valley networks, deltas, and water-altered minerals" },
  { question: "What is a meteorite?", options: ["A surviving fragment that reaches the ground", "A small fragment while it is still in space", "The flash produced during atmospheric entry", "A stream of comet dust before it meets Earth"], answer: "A surviving fragment that reaches the ground" },
  { question: "Which parent body supplies the debris that creates the Perseid meteor shower?", options: ["Comet Swift–Tuttle", "Asteroid 3200 Phaethon", "Comet Halley", "Asteroid Bennu"], answer: "Comet Swift–Tuttle" },
  { question: "What do organic molecules in a meteorite demonstrate by themselves?", options: ["The presence of carbon-based chemistry, not evidence of life", "That living organisms formed inside the meteorite", "That the meteorite originated on Earth", "That liquid water currently exists inside every asteroid"], answer: "The presence of carbon-based chemistry, not evidence of life" },
  { question: "What helps generate Jupiter's powerful magnetic field?", options: ["Motion within electrically conducting metallic hydrogen", "Friction between its atmosphere and a solid iron surface", "Charged ice particles in the Great Red Spot", "Tidal currents created only by the Galilean moons"], answer: "Motion within electrically conducting metallic hydrogen" },
  { question: "Approximately how thick are Saturn's main rings vertically?", options: ["About 10 metres", "About 10 kilometres", "About 1,000 kilometres", "About 100,000 kilometres"], answer: "About 10 metres" },
  { question: "Which substances drive Titan's clouds, rain, rivers, lakes, and seas?", options: ["Methane and ethane", "Liquid water and ammonia", "Hydrogen and helium", "Carbon dioxide and nitrogen ice"], answer: "Methane and ethane" },
  { question: "What is unusual about Uranus's rotation?", options: ["Its axis is tilted by about 98 degrees", "It rotates in exactly one Earth year", "Its axis points directly at the Sun throughout its orbit", "It is the only planet that does not rotate"], answer: "Its axis is tilted by about 98 degrees" },
  { question: "What does Triton's backward orbit around Neptune strongly suggest?", options: ["It was captured rather than formed in place", "It was created by Neptune's ring system", "It once orbited Jupiter", "It is an artificial satellite"], answer: "It was captured rather than formed in place" },
  { question: "What can the depth of a repeating exoplanet transit reveal most directly?", options: ["The planet's size relative to its star", "The planet's exact surface temperature", "The age of the host star", "The chemical composition of the planet's core"], answer: "The planet's size relative to its star" },
  { question: "What does the radial-velocity method detect?", options: ["A star's motion toward and away from us due to a planet's gravity", "Radio pulses transmitted by a planet's magnetic field", "A planet's shadow moving across another planet", "Heat emitted directly from a planet's night side"], answer: "A star's motion toward and away from us due to a planet's gravity" },
  { question: "What does the term ‘super-Earth’ describe?", options: ["A planet larger than Earth but smaller than Neptune", "An Earth-sized planet confirmed to support life", "A rocky planet with more than ten times the Sun's mass", "Any planet with a stronger magnetic field than Earth"], answer: "A planet larger than Earth but smaller than Neptune" },
  { question: "Approximately what fraction of stars and brown dwarfs within 10 parsecs are M-type red dwarfs?", options: ["61%", "18%", "35%", "84%"], answer: "61%" },
  { question: "What do heavy elements in the atmosphere of a polluted white dwarf usually indicate?", options: ["Recent accretion of debris from a former planetary system", "Ongoing hydrogen fusion in the white dwarf's core", "A new planet forming inside the star", "Contamination by Earth's atmosphere during observation"], answer: "Recent accretion of debris from a former planetary system" },
  { question: "Why are OB associations useful tracers of recent star formation?", options: ["Their massive stars have short lives and cannot travel far from where they formed", "Their stars never move relative to one another", "They contain only stars older than the Milky Way", "They form exclusively at the centers of galaxies"], answer: "Their massive stars have short lives and cannot travel far from where they formed" },
  { question: "Which nearby open cluster is about 100 million years old?", options: ["The Pleiades", "The Hyades", "The Ursa Major Moving Group", "Omega Centauri"], answer: "The Pleiades" },
  { question: "What is a typical temperature inside the well-shielded regions of a molecular cloud?", options: ["About 10 to 20 K", "About 100 to 200 K", "About 1,000 to 2,000 K", "About 10,000 to 20,000 K"], answer: "About 10 to 20 K" },
  { question: "Why does much of the material falling toward a protostar form a rotating disk?", options: ["The infalling gas carries angular momentum", "The protostar repels all material along its equator", "Radiation freezes the gas into a flat sheet", "Nearby stars compress the cloud from exactly two sides"], answer: "The infalling gas carries angular momentum" },
  { question: "Approximately how long does the Sun take to complete one orbit around the Milky Way?", options: ["230 million years", "23 million years", "2.3 billion years", "4.6 billion years"], answer: "230 million years" },
  { question: "What is the approximate mass of Sagittarius A*?", options: ["4.15 million times the Sun's mass", "415,000 times the Sun's mass", "41.5 million times the Sun's mass", "4.15 billion times the Sun's mass"], answer: "4.15 million times the Sun's mass" }
];

const chapterReferences = [
  [1, "The Sun and the Edge of Home"],
  [1, "The Sun and the Edge of Home"],
  [1, "The Sun and the Edge of Home"],
  [5, "The Asteroid Belt"],
  [5, "The Asteroid Belt"],
  [5, "The Asteroid Belt"],
  [8, "Comets, the Kuiper Belt, and the Oort Cloud"],
  [8, "Comets, the Kuiper Belt, and the Oort Cloud"],
  [9, "Leaving the Solar System"],
  [9, "Leaving the Solar System"],
  [9, "Leaving the Solar System"],
  [9, "Leaving the Solar System"],
  [10, "Worlds Around Other Stars"],
  [10, "Worlds Around Other Stars"],
  [11, "The Local Bubble and the Sun's Galactic Neighborhood"],
  [12, "Our Nearest Stars"],
  [12, "Our Nearest Stars"],
  [13, "The Solar Neighborhood"],
  [14, "Stellar Associations and Moving Groups"],
  [17, "The Stellar Life Cycle in Orion"],
  [17, "The Stellar Life Cycle in Orion"],
  [18, "The Solar System's Future Journey"],
  [18, "The Solar System's Future Journey"],
  [19, "Beyond the Milky Way: The Cosmic Web"],
  [19, "Beyond the Milky Way: The Cosmic Web"],
  [19, "Beyond the Milky Way: The Cosmic Web"],
  [19, "Beyond the Milky Way: The Cosmic Web"],
  [19, "Beyond the Milky Way: The Cosmic Web"],
  [20, "Cosmic Origins: A Journey Through Time and Space"],
  [22, "The Fate of Light and Time"],
  [22, "The Fate of Light and Time"],
  [1, "The Sun and the Edge of Home"],
  [2, "Human Satellites and Exploration"],
  [2, "Human Satellites and Exploration"],
  [2, "Human Satellites and Exploration"],
  [2, "Human Satellites and Exploration"],
  [2, "Human Satellites and Exploration"],
  [3, "The Moon"],
  [3, "The Moon"],
  [3, "The Moon"],
  [3, "The Moon"],
  [3, "The Moon"],
  [4, "The Inner Planets"],
  [4, "The Inner Planets"],
  [4, "The Inner Planets"],
  [6, "Meteoroids, Meteors, and Meteorites"],
  [6, "Meteoroids, Meteors, and Meteorites"],
  [6, "Meteoroids, Meteors, and Meteorites"],
  [7, "The Outer Planets and the Migrating Worlds"],
  [7, "The Outer Planets and the Migrating Worlds"],
  [7, "The Outer Planets and the Migrating Worlds"],
  [7, "The Outer Planets and the Migrating Worlds"],
  [7, "The Outer Planets and the Migrating Worlds"],
  [10, "Worlds Around Other Stars"],
  [10, "Worlds Around Other Stars"],
  [10, "Worlds Around Other Stars"],
  [13, "The Solar Neighborhood"],
  [13, "The Solar Neighborhood"],
  [14, "Stellar Associations and Moving Groups"],
  [14, "Stellar Associations and Moving Groups"],
  [15, "The Interstellar Medium and Molecular Clouds"],
  [15, "The Interstellar Medium and Molecular Clouds"],
  [16, "The Local Arm and the Milky Way"],
  [16, "The Local Arm and the Milky Way"]
].map(([number, title]) => ({ number, title }));

const setupPanel = document.getElementById("quiz-setup");
const quizArea = document.getElementById("quiz-area");
const resultPanel = document.getElementById("quiz-result");
const quizForm = document.getElementById("quiz-form");
const questionsContainer = document.getElementById("questions-container");
const quizProgress = document.getElementById("quiz-progress");
const quizMessage = document.getElementById("quiz-message");
const quizFeedback = document.getElementById("quiz-feedback");
const scoreLine = document.getElementById("score-line");
const checkAnswerButton = document.getElementById("check-answer");
const nextQuestionButton = document.getElementById("next-question");

let activeQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function showPanel(panel) {
  [setupPanel, quizArea, resultPanel].forEach((item) => {
    item.hidden = item !== panel;
  });
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function startQuiz() {
  const selectedLength = Number(document.querySelector('input[name="quiz-length"]:checked').value);
  const questionsWithChapters = questionBank.map((item, index) => ({
    ...item,
    chapter: chapterReferences[index]
  }));
  activeQuestions = shuffle(questionsWithChapters).slice(0, selectedLength).map((item) => ({
    ...item,
    options: shuffle(item.options)
  }));
  currentQuestionIndex = 0;
  score = 0;
  renderQuestion();
  showPanel(quizArea);
}

function renderQuestion() {
  const item = activeQuestions[currentQuestionIndex];
  questionsContainer.innerHTML = `
    <fieldset class="quiz-question">
      <legend>${item.question}</legend>
      ${item.options.map((option, optionIndex) => `
        <label class="answer-option">
          <input type="radio" name="current-answer" value="${optionIndex}">
          <span>${option}</span>
        </label>
      `).join("")}
    </fieldset>
  `;

  quizProgress.textContent = `Question ${currentQuestionIndex + 1} of ${activeQuestions.length}`;
  quizMessage.textContent = "";
  quizFeedback.hidden = true;
  quizFeedback.className = "quiz-feedback";
  quizFeedback.innerHTML = "";
  checkAnswerButton.hidden = false;
  nextQuestionButton.hidden = true;
  nextQuestionButton.textContent = currentQuestionIndex === activeQuestions.length - 1
    ? "See my score"
    : "Next question";
}

function submitQuiz(event) {
  event.preventDefault();
  const selected = quizForm.querySelector('input[name="current-answer"]:checked');
  if (!selected) {
    quizMessage.textContent = "Choose an answer before continuing.";
    return;
  }

  const item = activeQuestions[currentQuestionIndex];
  const selectedAnswer = item.options[Number(selected.value)];
  const isCorrect = selectedAnswer === item.answer;
  if (isCorrect) score += 1;

  quizForm.querySelectorAll('input[name="current-answer"]').forEach((input) => {
    input.disabled = true;
  });
  quizMessage.textContent = "";
  quizFeedback.classList.add(isCorrect ? "is-correct" : "is-incorrect");
  quizFeedback.innerHTML = `
    <strong>${isCorrect ? "Correct!" : "Not quite."}</strong>
    <span>The correct answer is: ${item.answer}</span>
    <span>Read more in Chapter ${item.chapter.number}: <em>${item.chapter.title}</em>.</span>
  `;
  quizFeedback.hidden = false;
  checkAnswerButton.hidden = true;
  nextQuestionButton.hidden = false;
}

function goToNextQuestion() {
  if (currentQuestionIndex === activeQuestions.length - 1) {
    scoreLine.textContent = `${score} out of ${activeQuestions.length} correct`;
    showPanel(resultPanel);
    return;
  }
  currentQuestionIndex += 1;
  renderQuestion();
  quizArea.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.getElementById("start-quiz").addEventListener("click", startQuiz);
document.getElementById("restart-quiz").addEventListener("click", () => showPanel(setupPanel));
nextQuestionButton.addEventListener("click", goToNextQuestion);
quizForm.addEventListener("submit", submitQuiz);
