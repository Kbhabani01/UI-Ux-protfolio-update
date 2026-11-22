// =========================================================
// Mobile nav toggle
// =========================================================
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

if (navBurger && mobileMenu) {
  navBurger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navBurger.setAttribute('aria-expanded', String(isOpen));
  });
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navBurger.setAttribute('aria-expanded', 'false');
    });
  });
}

// =========================================================
// Filmstrip accordion — one frame open at a time
// =========================================================
const frames = document.querySelectorAll('.frame');

function closeFrame(frame) {
  const toggle = frame.querySelector('.frame-toggle');
  const panel  = frame.querySelector('.frame-panel');
  frame.removeAttribute('data-open');
  toggle.setAttribute('aria-expanded', 'false');
  panel.style.maxHeight = null;
  window.setTimeout(() => {
    if (!frame.hasAttribute('data-open')) panel.hidden = true;
  }, 450);
}

function openFrame(frame) {
  const toggle = frame.querySelector('.frame-toggle');
  const panel  = frame.querySelector('.frame-panel');
  panel.hidden = false;
  frame.setAttribute('data-open', 'true');
  toggle.setAttribute('aria-expanded', 'true');
  panel.style.maxHeight = panel.scrollHeight + 'px';
}

frames.forEach((frame) => {
  const toggle = frame.querySelector('.frame-toggle');
  toggle.addEventListener('click', () => {
    const isOpen = frame.hasAttribute('data-open');
    frames.forEach((other) => {
      if (other !== frame && other.hasAttribute('data-open')) closeFrame(other);
    });
    isOpen ? closeFrame(frame) : openFrame(frame);
  });
});

window.addEventListener('resize', () => {
  document.querySelectorAll('.frame[data-open="true"]').forEach((frame) => {
    const panel = frame.querySelector('.frame-panel');
    panel.style.maxHeight = panel.scrollHeight + 'px';
  });
});

// =========================================================
// Footer year
// =========================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =========================================================
// Scroll progress bar
// =========================================================
const progressBar = document.getElementById('scrollProgress');
function updateProgress() {
  const doc     = document.documentElement;
  const scrolled = doc.scrollTop;
  const max     = doc.scrollHeight - doc.clientHeight;
  const pct     = max > 0 ? (scrolled / max) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}
document.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// =========================================================
// Custom cursor (fine pointer devices only)
// =========================================================
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (window.matchMedia('(pointer: fine)').matches) {
  document.body.classList.add('cursor-active');
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorDot.style.left  = e.clientX + 'px';
    cursorDot.style.top   = e.clientY + 'px';
    ringX += (e.clientX - ringX) * 0.12;
    ringY += (e.clientY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
  });

  function animateRing() {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
}

// =========================================================
// Scroll-reveal (IntersectionObserver)
// =========================================================
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// =========================================================
// Active nav link on scroll (IntersectionObserver)
// =========================================================
const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
const sections = ['work', 'about', 'toolkit', 'experience', 'contact']
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (sections.length && navLinks.length) {
  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((a) => a.classList.remove('active'));
        const match = document.querySelector(`.nav-links a[data-nav="${entry.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => sectionIO.observe(s));
}
