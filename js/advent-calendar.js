import { ADVENT_DAYS, ADVENT_YEAR } from '../data/advent-calendar.js';

const grid = document.querySelector('#advent-grid');
const status = document.querySelector('#advent-status');
const dialog = document.querySelector('#advent-dialog');
const closeButton = document.querySelector('#advent-dialog-close');
const countdown = document.querySelector('#advent-countdown');
const countdownZone = document.querySelector('#advent-countdown-zone');
// Test openings use a different key and cannot leak into the real calendar.
const storageKey = `spaceSafariAdventOpened:${ADVENT_YEAR}:live-1`;
const VISUAL_ORDER = [13, 2, 19, 7, 22, 5, 16, 1, 11, 20, 8, 15, 4, 18, 10, 23, 6, 14, 3, 21, 9, 17, 12, 24];
let lastTrigger = null;

export function availableThrough(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (year < ADVENT_YEAR || (year === ADVENT_YEAR && month < 12)) return 0;
  if (year > ADVENT_YEAR || month > 12) return 24;
  return Math.min(24, day);
}

function readOpened() {
  try { return new Set(JSON.parse(localStorage.getItem(storageKey) || '[]').filter(day => Number.isInteger(day) && day >= 1 && day <= 24)); }
  catch { return new Set(); }
}

const opened = readOpened();
function saveOpened() { localStorage.setItem(storageKey, JSON.stringify([...opened].sort((a,b) => a-b))); }

function visualMarkup(item) {
  return item.image ? `<img src="${item.image}" alt="${item.imageAlt || item.objectName}" loading="lazy" referrerpolicy="no-referrer">` : '';
}

function buildCell(item, available) {
  const cell = document.createElement('article');
  const isOpen = opened.has(item.day) && available;
  cell.className = `advent-cell${isOpen ? ' is-open' : ''}`;
  cell.dataset.day = item.day;
  cell.dataset.shape = item.day === 24 ? 'finale' : ['square', 'wide', 'tall', 'soft'][item.day % 4];
  cell.style.order = VISUAL_ORDER.indexOf(item.day) + 1;
  cell.style.setProperty('--object-colour', item.colour || '#dbeaff');
  cell.style.setProperty('--object-glow', item.glow || '#315d97');
  cell.style.setProperty('--door-image', `url("${item.image}")`);
  cell.innerHTML = `
    <button class="advent-object${item.image ? ' has-image' : ''}" type="button" aria-label="Day ${item.day}: open the story of ${item.objectName}" ${isOpen ? '' : 'hidden tabindex="-1"'}>
      ${visualMarkup(item)}<span>${item.objectName}<small>Day ${item.day}</small></span>
    </button>
    <button class="advent-door" type="button" aria-label="${available ? `Open day ${item.day}` : `Day ${item.day} unlocks on December ${item.day}`}" ${available ? '' : 'disabled'}>
      <span class="advent-door-number">${item.day}</span>
    </button>`;
  const door = cell.querySelector('.advent-door');
  const object = cell.querySelector('.advent-object');
  const image = object.querySelector('img');
  image?.addEventListener('error', () => {
    object.classList.remove('has-image');
    object.classList.add('image-failed');
    image.remove();
  }, { once:true });
  door.addEventListener('click', () => openDoor(cell, object, item));
  object.addEventListener('click', () => showStory(item, object));
  return cell;
}

function openDoor(cell, object, item) {
  if (opened.has(item.day)) return showStory(item, object);
  object.hidden = false;
  cell.classList.add('is-opening');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.setTimeout(() => {
    opened.add(item.day); saveOpened();
    cell.classList.remove('is-opening'); cell.classList.add('is-open');
    object.tabIndex = 0;
    showStory(item, object);
  }, reduced ? 20 : 850);
}

function showStory(item, trigger) {
  lastTrigger = trigger;
  document.querySelector('#advent-dialog-day').textContent = `Day ${item.day} · ${item.objectName}`;
  document.querySelector('#advent-dialog-title').textContent = item.title;
  document.querySelector('#advent-dialog-question').textContent = item.question;
  const chapterBridge = item.chapter
    ? 'The chapter places this object within the wider journey from our local sky to cosmic history.'
    : 'This bonus day brings the calendar’s outward journey back to a human perspective.';
  document.querySelector('#advent-dialog-body').textContent = `${item.body} ${chapterBridge}`;
  document.querySelector('#advent-dialog-chapter').textContent = item.chapter ? `Chapter ${item.chapter} — ${item.chapterTitle}${item.section ? ` · ${item.section}` : ''}` : item.chapterTitle;
  document.querySelector('#advent-dialog-credit').textContent = item.credit || 'Draft illustrative visual. Image source and licence must be verified before publication.';
  const source = document.querySelector('#advent-dialog-source');
  source.hidden = !item.sourceUrl;
  source.href = item.sourceUrl || '#';
  const visual = document.querySelector('#advent-dialog-visual');
  visual.className = `advent-dialog-visual${item.image ? ' has-image' : ''}`;
  visual.style.setProperty('--object-colour', item.colour || '#dbeaff');
  visual.style.setProperty('--object-glow', item.glow || '#315d97');
  visual.style.setProperty('--dialog-image', item.image ? `url("${item.image}")` : 'none');
  const link = document.querySelector('#advent-dialog-link');
  link.hidden = !item.link; link.href = item.link || '#';
  dialog.showModal(); closeButton.focus();
}

function closeDialog() { dialog.close(); lastTrigger?.focus(); }
closeButton.addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });

function render() {
  const available = availableThrough();
  grid.replaceChildren(...ADVENT_DAYS.map(item => buildCell(item, item.day <= available)));
  status.textContent = available === 0 ? `The first door opens December 1, ${ADVENT_YEAR}.` : available < 24 ? `${available} of 24 doors are available.` : 'All 24 cosmic discoveries are available.';
}

function updateCountdown() {
  // The Date constructor uses the visitor's own time zone, so the countdown
  // and each door's calendar-date check agree at local midnight.
  const target = new Date(ADVENT_YEAR, 11, 1, 0, 0, 0, 0);
  const difference = target.getTime() - Date.now();
  if (difference <= 0) {
    countdown.textContent = 'The calendar is open';
    return;
  }
  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);
  countdown.textContent = `${days} days · ${String(hours).padStart(2,'0')} hours · ${String(minutes).padStart(2,'0')} minutes · ${String(seconds).padStart(2,'0')} seconds`;
}

function showLocalTimeZone() {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  countdownZone.textContent = zone ? `Midnight in your local time · ${zone.replaceAll('_', ' ')}` : 'Midnight in your local time';
}

render();
updateCountdown();
showLocalTimeZone();
window.setInterval(render, 1000);
window.setInterval(updateCountdown, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
