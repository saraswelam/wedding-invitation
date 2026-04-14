let envelopeOpened = false;

// 🎵 get audio element once
const music = document.getElementById('bg-music');

/**
 * Toggles the envelope open/closed on each click.
 */
function toggleEnvelope() {
  const scene      = document.getElementById('envelopeScene');
  const label      = document.getElementById('clickLabel');
  const scrollHint = document.getElementById('scrollHint');

  if (!envelopeOpened) {
    // --- OPEN ---
    envelopeOpened = true;
    scene.classList.add('opened');
    label.textContent = 'CLICK TO CLOSE';
    label.classList.remove('hidden');

    // 🎵 play music (only when opened)
    if (music) {
      music.currentTime = 0; // optional: restart each time
      music.play().catch(() => {});
    }

    // Show scroll hint after animation settles
    setTimeout(() => {
      scrollHint.style.display = 'flex';
    }, 1400);

  } else {
    // --- CLOSE ---
    envelopeOpened = false;
    scene.classList.remove('opened');
    label.textContent = 'CLICK TO OPEN';
    label.classList.remove('hidden');
    scrollHint.style.display = 'none';

    // 🎵 optional: pause when closing
    if (music) {
      music.pause();
    }
  }
}

/**
 * Scrolls to a given page index.
 * 0 = entrance, 1 = save the date
 */
function scrollToPage(idx) {
  const ids = ['page-entrance', 'page-save'];
  const el  = document.getElementById(ids[idx]);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ---- Update nav dots based on which page is visible ---- */
const pages   = document.querySelectorAll('.page');
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