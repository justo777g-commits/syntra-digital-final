/* ═══════════════════════════════════════════════════════════════
   SYNTRA ACADEMY — script.js
   Partículas · Scroll · Animações · Interações
═══════════════════════════════════════════════════════════════ */

'use strict';

// ── CANVAS PARTICLE SYSTEM ──────────────────────────────────────
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const PARTICLE_COUNT = 90;
  const LINE_DIST = 130;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  // Cores adaptadas ao tema Academia: vermelho, laranja, cinza metálico
  const COLORS = [
    'rgba(229,57,53,',
    'rgba(255,109,0,',
    'rgba(255,158,64,',
    'rgba(180,180,180,',
  ];

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      vx: randomBetween(-0.3, 0.3),
      vy: randomBetween(-0.3, 0.3),
      r: randomBetween(1, 2.5),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: randomBetween(0.3, 0.8),
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
          const alpha = (1 - dist / LINE_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(229,57,53,${alpha})`;
          ctx.lineWidth = 0.7;
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
  }, { threshold: 0.15 });

  els.forEach(el => observer.observe(el));

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
  const sections = document.querySelectorAll('.sobre-inner, .trainers-inner .section-header, .avaliacoes-inner .section-header, .galeria-inner .section-header, .planos-inner .section-header, .cta-final-inner, .contato-info .section-header');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal', 'visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(s => observer.observe(s));
})();

// ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
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

// Ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple-anim { to { transform: scale(1); opacity: 0; } }`;
document.head.appendChild(rippleStyle);

// ── CARD MAGNETIC HOVER ───────────────────────────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-4px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
  });
  card.addEventListener('mouseleave', function () {
    card.style.transform = '';
  });
});

// ── TRAINER CARD HOVER ────────────────────────────────────────
document.querySelectorAll('.trainer-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-4px) rotateX(${-dy * 2}deg) rotateY(${dx * 2}deg)`;
  });
  card.addEventListener('mouseleave', function () {
    card.style.transform = '';
  });
});

// ── PERFORMANCE: pause animations when tab hidden ─────────────
document.addEventListener('visibilitychange', () => {
  // Canvas RAF auto-pauses via requestAnimationFrame
});

console.log('%c SYNTRA ACADEMY ', 'background: linear-gradient(135deg, #E53935, #FF6D00); color: #fff; font-size: 14px; font-weight: bold; padding: 6px 12px; border-radius: 6px;');
console.log('%c Academia Premium · Resultados Reais ', 'color: #FF9E40; font-size: 11px;');
console.log('%c Demo desenvolvida por Syntra Digital · syntra.tec.br ', 'color: #888; font-size: 10px;');
