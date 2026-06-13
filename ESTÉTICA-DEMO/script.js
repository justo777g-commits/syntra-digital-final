/* ═══════════════════════════════════════════════════════════════
   SYNTRA ESTÉTICA — script.js
   Partículas · Scroll · Animações · Interações
   Paleta: Rosé Gold · Nude · Dourado Claro
═══════════════════════════════════════════════════════════════ */

'use strict';

// ── CANVAS PARTICLE SYSTEM ──────────────────────────────────────
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];
  const PARTICLE_COUNT = 80;   // ligeiramente menos → elegância
  const LINE_DIST      = 120;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  // Paleta Rosé Gold · Nude · Dourado Claro · Branco perolado
  const COLORS = [
    'rgba(201,116,143,',   // rose
    'rgba(201,168,76,',    // gold
    'rgba(232,169,184,',   // rose-light
    'rgba(212,184,150,',   // nude
    'rgba(245,232,184,',   // gold-pale
  ];

  function createParticle() {
    return {
      x:     randomBetween(0, W),
      y:     randomBetween(0, H),
      vx:    randomBetween(-0.25, 0.25),
      vy:    randomBetween(-0.25, 0.25),
      r:     randomBetween(0.8, 2.2),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: randomBetween(0.25, 0.70),
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    // Linhas entre partículas próximas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p = particles[i], q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINE_DIST) {
          const alpha = (1 - dist / LINE_DIST) * 0.14;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(201,116,143,${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    // Partículas
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
  let mx = -999, my = -999, cx = -999, cy = -999;

  document.addEventListener('mousemove',  e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => glow.style.opacity = '0');
  document.addEventListener('mouseenter', () => glow.style.opacity = '1');

  function moveGlow() {
    cx += (mx - cx) * 0.09;
    cy += (my - cy) * 0.09;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(moveGlow);
  }
  moveGlow();
})();

// ── NAV SCROLL ─────────────────────────────────────────────────
(function () {
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else                     nav.classList.remove('scrolled');
  }, { passive: true });
})();

// ── HAMBURGER MENU ─────────────────────────────────────────────
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('navMobile');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', menu.classList.contains('open'));
  });

  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => menu.classList.remove('open'))
  );
})();

// ── SCROLL REVEAL ──────────────────────────────────────────────
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Hero: dispara ao carregar
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 200);
    });
  });
})();

// ── SERVICE CARDS STAGGER ─────────────────────────────────────
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.service-card').forEach(c => observer.observe(c));
})();

// ── SMOOTH SCROLL ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── BUTTON RIPPLE ─────────────────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY  - rect.top  - size / 2}px;
      background:rgba(255,255,255,0.15);
      border-radius:50%;pointer-events:none;
      transform:scale(0);
      animation:ripple-anim 0.5s ease-out forwards;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});
const rs = document.createElement('style');
rs.textContent = `@keyframes ripple-anim { to { transform:scale(1); opacity:0; } }`;
document.head.appendChild(rs);

// ── CARD MAGNETIC HOVER ───────────────────────────────────────
function addMagneticHover(selector, intensity = 3) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      card.style.transform = `translateY(-4px) rotateX(${-dy * intensity}deg) rotateY(${dx * intensity}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
}
addMagneticHover('.service-card',      3);
addMagneticHover('.profissional-card', 2);
addMagneticHover('.dif-item',          2);
addMagneticHover('.review-card',       1.5);

// ── CONSOLE BRAND ─────────────────────────────────────────────
console.log('%c SYNTRA ESTÉTICA ', 'background:linear-gradient(135deg,#C9748F,#C9A84C);color:#fff;font-size:14px;font-weight:bold;padding:6px 14px;border-radius:100px;');
console.log('%c Clínica de Estética Premium · Resultados Naturais ', 'color:#E8A4B8;font-size:11px;');
console.log('%c Demo desenvolvida por Syntra Digital · syntra.tec.br ', 'color:#666;font-size:10px;');
