/* ═══════════════════════════════════════════════════════════════
   SYNTRA BARBER — script.js
   Partículas · Scroll · Animações · Interações
═══════════════════════════════════════════════════════════════ */

'use strict';

// ── CANVAS PARTICLE SYSTEM ──────────────────────────────────────
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const PARTICLE_COUNT = 80;
  const LINE_DIST = 120;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  // Gold, steel, warm-white palette for barber theme
  const COLORS = [
    'rgba(184,146,42,',
    'rgba(212,168,67,',
    'rgba(138,155,176,',
    'rgba(240,192,96,',
  ];

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      vx: randomBetween(-0.25, 0.25),
      vy: randomBetween(-0.25, 0.25),
      r: randomBetween(1, 2.2),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: randomBetween(0.2, 0.7),
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    // Lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p = particles[i], q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINE_DIST) {
          const alpha = (1 - dist / LINE_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(184,146,42,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5;
      if (p.y > H + 5) p.y = -5;
    });
  }

  function loop() {
    drawParticles();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  resize();
  initParticles();
  loop();
})();

// ── CURSOR GLOW ────────────────────────────────────────────────
(function () {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  let mx = -999, my = -999;
  let cx = -999, cy = -999;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => glow.style.opacity = '0');
  document.addEventListener('mouseenter', () => glow.style.opacity = '1');

  function moveGlow() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(moveGlow);
  }
  moveGlow();
})();

// ── NAV SCROLL ─────────────────────────────────────────────────
(function () {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ── HAMBURGER MENU ─────────────────────────────────────────────
(function () {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('navMobile');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', menu.classList.contains('open'));
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
})();

// ── SCROLL REVEAL ──────────────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));

  // Trigger hero elements immediately
  window.addEventListener('load', () => {
    const hero = document.querySelectorAll('.hero .reveal');
    hero.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 180);
    });
  });
})();

// ── SERVICE CARDS STAGGER REVEAL ──────────────────────────────
(function () {
  const cards = document.querySelectorAll('.service-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => observer.observe(card));
})();

// ── SECTION REVEAL ────────────────────────────────────────────
(function () {
  const sections = document.querySelectorAll(
    '.sobre-content, .sobre-visual, .section-header, .local-content, .gallery-grid, .cta-final-inner'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal', 'visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(s => observer.observe(s));
})();

// ── TEAM CARDS REVEAL ─────────────────────────────────────────
(function () {
  const cards = document.querySelectorAll('.team-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('reveal', 'visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
})();

// ── REVIEW CARDS REVEAL ───────────────────────────────────────
(function () {
  const cards = document.querySelectorAll('.review-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('reveal', 'visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
})();

// ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 110; // account for banner + nav
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── BUTTON RIPPLE ─────────────────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      pointer-events: none;
      transform: scale(0);
      animation: ripple-anim 0.5s ease-out forwards;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple-anim { to { transform: scale(1); opacity: 0; } }`;
document.head.appendChild(rippleStyle);

// ── CARD MAGNETIC HOVER ───────────────────────────────────────
document.querySelectorAll('.service-card, .team-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-4px) rotateX(${-dy * 2.5}deg) rotateY(${dx * 2.5}deg)`;
  });
  card.addEventListener('mouseleave', function () {
    card.style.transform = '';
  });
});

console.log('%c SYNTRA BARBER ', 'background: linear-gradient(135deg, #B8922A, #F0C060); color: #0A0800; font-size: 14px; font-weight: bold; padding: 6px 12px; border-radius: 6px;');
console.log('%c Demo desenvolvida por Syntra Digital · syntra.tec.br ', 'color: #D4A843; font-size: 11px;');
