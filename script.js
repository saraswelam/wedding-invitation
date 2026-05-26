let envelopeOpened = false;

// 🎵 get audio element once
const music = document.getElementById('bg-music');

let redirectTimer;
let musicStopTimer;

/**
 * Toggles the envelope open/closed on each click.
 */
function toggleEnvelope() {
  const scene = document.getElementById('envelopeScene');
  const label = document.getElementById('clickLabel');
  const scrollHint = document.getElementById('scrollHint');

  if (!envelopeOpened) {
    // --- OPEN ---
    envelopeOpened = true;
    scene.classList.add('opened');
    spawnConfetti();
    startConfettiTrickle();
    
    const isArabic = document.documentElement.lang === 'ar';
    label.textContent = isArabic ? 'اضغط للإغلاق' : 'TAP TO CLOSE';
    label.classList.remove('hidden');

    // 🎵 play music: 6s from start, then jump to last 2s, then stop (audio + petals)
    if (music) {
      music.volume = 0.35;
      music.currentTime = 0;
      music.play().catch(() => { });
      clearTimeout(musicStopTimer);
      musicStopTimer = setTimeout(() => {
        if (music.duration && isFinite(music.duration) && music.duration > 2) {
          music.currentTime = Math.max(0, music.duration - 2);
        }
        musicStopTimer = setTimeout(() => {
          music.pause();
          stopConfettiTrickle();
        }, 2000);
      }, 6000);
    }

    // Show scroll hint after animation settles
    setTimeout(() => {
      scrollHint.style.display = 'flex';

      redirectTimer = setTimeout(() => {
        scrollToPage(1);
      }, 5000);

    }, 1400);

  } else {
    // --- CLOSE ---
    envelopeOpened = false;
    scene.classList.remove('opened');
    stopConfettiTrickle();
    
    const isArabic = document.documentElement.lang === 'ar';
    label.textContent = isArabic ? 'اضغط للفتح' : 'TAP TO OPEN';
    label.classList.remove('hidden');
    scrollHint.style.display = 'none';

    // Clear timer if they close it early
    clearTimeout(redirectTimer);

    // 🎵 optional: pause when closing
    if (music) {
      music.pause();
      clearTimeout(musicStopTimer);
    }
  }
}

/**
 * Scrolls to a given page index.
 * 0 = entrance, 1 = save the date
 */
function scrollToPage(idx) {
  const ids = ['page-entrance', 'page-save'];
  const el = document.getElementById(ids[idx]);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ---- Update nav dots based on which page is visible ---- */
const pages = document.querySelectorAll('.page');
const navDots = document.querySelectorAll('.nav-dot');

const pageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const activeIndex = [...pages].indexOf(entry.target);
      navDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
    }
  });
}, { threshold: 0.55 });

pages.forEach((page) => pageObserver.observe(page));

/**
 * Spawns a shower of cream petals + gold sparkles inside the
 * #confettiContainer. Used for both the initial burst on envelope open
 * and the ongoing trickle as the user scrolls to page 2.
 */
let confettiTrickleInterval = null;
let confettiTrickleStop = null;

function spawnConfetti(count = 36) {
  const container = document.getElementById('confettiContainer');
  if (!container) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = Math.random() < 0.55 ? 'petal' : 'sparkle';
    el.style.left = Math.random() * 100 + '%';
    el.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
    el.style.setProperty('--spin', (Math.random() * 720 - 360) + 'deg');
    const duration = 4 + Math.random() * 3;
    const delay = Math.random() * 0.8;
    el.style.animation = `confetti-fall ${duration}s ${delay}s linear forwards`;
    container.appendChild(el);
    setTimeout(() => el.remove(), (duration + delay) * 1000 + 100);
  }
}

function startConfettiTrickle() {
  stopConfettiTrickle();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  confettiTrickleInterval = setInterval(() => spawnConfetti(3), 700);
  // Trickle stops when the audio sequence ends (handled in toggleEnvelope),
  // or immediately when the user closes the envelope.
}

function stopConfettiTrickle() {
  if (confettiTrickleInterval) {
    clearInterval(confettiTrickleInterval);
    confettiTrickleInterval = null;
  }
  if (confettiTrickleStop) {
    clearTimeout(confettiTrickleStop);
    confettiTrickleStop = null;
  }
}

/**
 * Live countdown to the wedding (11 July 2026, 6:00 pm local time).
 * Updates the DOM once per minute.
 */
const WEDDING_AT = new Date('2026-07-11T18:00:00').getTime();
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
function formatNum(n) {
  const s = String(n);
  return document.documentElement.lang === 'ar'
    ? s.replace(/\d/g, d => AR_DIGITS[d])
    : s;
}
function initCountdown() {
  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-minutes');
  if (!dEl || !hEl || !mEl) return;
  function tick() {
    const diff = WEDDING_AT - Date.now();
    if (diff <= 0) {
      dEl.textContent = formatNum(0);
      hEl.textContent = formatNum(0);
      mEl.textContent = formatNum(0);
      return;
    }
    dEl.textContent = formatNum(Math.floor(diff / 86400000));
    hEl.textContent = formatNum(Math.floor((diff / 3600000) % 24));
    mEl.textContent = formatNum(Math.floor((diff / 60000) % 60));
  }
  tick();
  setInterval(tick, 60 * 1000);
}
initCountdown();