const shell = document.getElementById('shell');
const scroller = document.getElementById('scroller');
const textEl = document.getElementById('text');
const playBtn = document.getElementById('playBtn');
const editBtn = document.getElementById('editBtn');
const resetBtn = document.getElementById('resetBtn');
const closeBtn = document.getElementById('closeBtn');
const minBtn = document.getElementById('minBtn');
const speed = document.getElementById('speed');
const fontSize = document.getElementById('fontSize');
const opacity = document.getElementById('opacity');
const speedVal = document.getElementById('speedVal');
const fontSizeVal = document.getElementById('fontSizeVal');
const opacityVal = document.getElementById('opacityVal');

const STORAGE_KEY = 'telepromptr:v1';

const state = {
  playing: false,
  speed: 60,
  fontSize: 38,
  opacity: 85,
  text: textEl.innerText,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    Object.assign(state, saved);
    if (typeof state.text === 'string' && state.text.length > 0) {
      textEl.innerText = state.text;
    }
    speed.value = state.speed;
    fontSize.value = state.fontSize;
    opacity.value = state.opacity;
  } catch {}
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        speed: state.speed,
        fontSize: state.fontSize,
        opacity: state.opacity,
        text: state.text,
      })
    );
  } catch {}
}

function applyStyles() {
  textEl.style.fontSize = state.fontSize + 'px';
  shell.style.background = `rgba(0, 0, 0, ${state.opacity / 100})`;
  speedVal.textContent = String(state.speed);
  fontSizeVal.textContent = String(state.fontSize);
  opacityVal.textContent = String(state.opacity);
  playBtn.classList.toggle('active', state.playing);
  playBtn.textContent = state.playing ? '⏸' : '▶';
}

let rafId = null;
let lastTs = 0;
let acc = 0;

function tick(ts) {
  if (!state.playing) { rafId = null; return; }
  if (!lastTs) lastTs = ts;
  const dt = (ts - lastTs) / 1000;
  lastTs = ts;
  acc += dt * state.speed;
  if (acc >= 1) {
    const step = Math.floor(acc);
    acc -= step;
    scroller.scrollTop += step;
    const max = scroller.scrollHeight - scroller.clientHeight;
    if (scroller.scrollTop >= max) {
      state.playing = false;
      applyStyles();
      return;
    }
  }
  rafId = requestAnimationFrame(tick);
}

function play() {
  if (state.playing) return;
  state.playing = true;
  lastTs = 0;
  acc = 0;
  applyStyles();
  rafId = requestAnimationFrame(tick);
}

function pause() {
  state.playing = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  applyStyles();
}

function toggle() {
  if (state.playing) pause(); else play();
}

function setEditing(on) {
  textEl.setAttribute('contenteditable', on ? 'true' : 'false');
  editBtn.classList.toggle('active', on);
  editBtn.textContent = on ? 'Done' : 'Edit';
  if (on) {
    pause();
    textEl.focus();
  } else {
    state.text = textEl.innerText;
    saveState();
  }
}

playBtn.addEventListener('click', toggle);
editBtn.addEventListener('click', () => setEditing(textEl.getAttribute('contenteditable') !== 'true'));
resetBtn.addEventListener('click', () => { scroller.scrollTop = 0; });
closeBtn.addEventListener('click', () => window.tp.close());
minBtn.addEventListener('click', () => window.tp.minimize());

speed.addEventListener('input', () => { state.speed = Number(speed.value); applyStyles(); saveState(); });
fontSize.addEventListener('input', () => { state.fontSize = Number(fontSize.value); applyStyles(); saveState(); });
opacity.addEventListener('input', () => { state.opacity = Number(opacity.value); applyStyles(); saveState(); });

textEl.addEventListener('input', () => { state.text = textEl.innerText; saveState(); });

document.addEventListener('keydown', (e) => {
  if (textEl.getAttribute('contenteditable') === 'true') return;
  if (e.code === 'Space') { e.preventDefault(); toggle(); }
  else if (e.key === 'ArrowUp') { scroller.scrollTop -= 40; }
  else if (e.key === 'ArrowDown') { scroller.scrollTop += 40; }
  else if (e.key === 'Home') { scroller.scrollTop = 0; }
  else if (e.key.toLowerCase() === 'e') { setEditing(true); }
  else if (e.key === '+' || e.key === '=') { fontSize.value = Math.min(96, state.fontSize + 2); fontSize.dispatchEvent(new Event('input')); }
  else if (e.key === '-' || e.key === '_') { fontSize.value = Math.max(16, state.fontSize - 2); fontSize.dispatchEvent(new Event('input')); }
});

loadState();
applyStyles();
