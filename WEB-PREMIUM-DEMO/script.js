/* ============================================================
   SYNTRA DIGITAL — PREMIUM SCRIPT 2050
   ============================================================ */

'use strict';

// ── LOADER ──────────────────────────────────────────────────
(function initLoader() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loader-fill');
  if (!loader || !fill) return;

  let progress = 0;
  const tick = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      fill.style.width = '100%';
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initAnimations();
      }, 500);
    } else {
      fill.style.width = progress + '%';
    }
  }, 80);

  document.body.style.overflow = 'hidden';
})();

// ── CANVAS BACKGROUND ────────────────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], animId;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const COLORS = {
    node: 'rgba(200,169,107,',
    line: 'rgba(15,45,58,',
    pulse: 'rgba(200,169,107,'
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildNodes();
  }

  function buildNodes() {
    const count = Math.min(Math.floor((W * H) / 28000), 60);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5,
      pulse: Math.random() * Math.PI * 2
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    // Update nodes
    for (const n of nodes) {
      if (!prefersReduced) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.012;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      // Draw node
      const alpha = 0.3 + Math.sin(n.pulse) * 0.15;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.node + alpha + ')';
      ctx.fill();
    }

    // Draw lines
    const maxDist = 160;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.18;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = COLORS.line + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Ambient glow pulse
    const cycle = Math.sin(t * 0.0008) * 0.5 + 0.5;
    const grd = ctx.createRadialGradient(W * 0.75, H * 0.25, 0, W * 0.75, H * 0.25, W * 0.5);
    grd.addColorStop(0, `rgba(15,45,58,${0.12 * cycle})`);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    if (!prefersReduced) {
      animId = requestAnimationFrame(draw);
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  if (prefersReduced) {
    draw(0);
  } else {
    animId = requestAnimationFrame(draw);
  }
})();

// ── CUSTOM CURSOR ────────────────────────────────────────────
(function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mx = -100, my = -100, fx = -100, fy = -100;
  let running = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (!running) { running = true; requestAnimationFrame(animate); }
  }, { passive: true });

  function animate() {
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';

    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';

    running = true;
    requestAnimationFrame(animate);
  }

  const hoverEls = document.querySelectorAll(
    'a, button, .service-card, .diff-card, .portfolio-card, input, select, textarea, .filter-btn'
  );

  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    });
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
})();

// ── HEADER SCROLL ────────────────────────────────────────────
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    last = y;
  }, { passive: true });
})();

// ── MOBILE MENU ──────────────────────────────────────────────
(function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  let open = false;

  function setMenu(state) {
    open = state;
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', !open);
    menu.style.display = open ? 'block' : '';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  menu.style.display = 'none';

  toggle.addEventListener('click', () => setMenu(!open));

  menu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) setMenu(false);
  });
})();

// ── SMOOTH SCROLL ────────────────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

// ── REVEAL ANIMATIONS ────────────────────────────────────────
function initAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

// ── COUNTER ANIMATION ────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.metric-val[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      let current = 0;
      const dur  = 1800;
      const step = 16;
      const inc  = end / (dur / step);

      const timer = setInterval(() => {
        current = Math.min(current + inc, end);
        el.textContent = Math.floor(current);
        if (current >= end) {
          el.textContent = end;
          clearInterval(timer);
        }
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ── BAR ANIMATIONS ───────────────────────────────────────────
(function initBars() {
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
})();

// ── PORTFOLIO FILTER ─────────────────────────────────────────
(function initPortfolioFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          void card.offsetWidth; // force reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

// ── CONTACT FORM ─────────────────────────────────────────────
(function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const waBtn   = document.getElementById('whatsapp-btn');
  if (!form || !success) return;

  function getVal(name) {
    const el = form.querySelector(`[name="${name}"]`);
    return el ? el.value.trim() : '';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nome     = getVal('nome');
    const empresa  = getVal('empresa');
    const whatsapp = getVal('whatsapp');
    const tipo     = getVal('tipo');
    const mensagem = getVal('mensagem');

    if (!nome || !whatsapp) {
      // Highlight empty required fields
      [['nome', nome], ['whatsapp', whatsapp]].forEach(([n, v]) => {
        if (!v) {
          const input = form.querySelector(`[name="${n}"]`);
          if (input) {
            input.style.borderColor = 'rgba(255,90,90,0.6)';
            input.focus();
            setTimeout(() => { input.style.borderColor = ''; }, 2000);
          }
        }
      });
      return;
    }

    // Build WhatsApp message
    const msg = encodeURIComponent(
      `Olá! Vim pelo site da Syntra Digital.\n\n` +
      `*Nome:* ${nome}\n` +
      `*Empresa:* ${empresa || 'Não informado'}\n` +
      `*Tipo de projeto:* ${tipo || 'Não selecionado'}\n` +
      `*Mensagem:* ${mensagem || 'Sem mensagem adicional'}`
    );

    if (waBtn) {
      waBtn.href = `https://wa.me/5500000000000?text=${msg}`;
    }

    // Transition to success
    form.style.transition = 'opacity 0.3s, transform 0.3s';
    form.style.opacity = '0';
    form.style.transform = 'translateY(-8px)';

    setTimeout(() => {
      form.style.display = 'none';
      success.hidden = false;
      success.style.opacity = '0';
      success.style.transform = 'translateY(12px)';
      success.style.transition = 'opacity 0.4s, transform 0.4s';
      requestAnimationFrame(() => {
        success.style.opacity = '1';
        success.style.transform = 'translateY(0)';
      });
    }, 350);
  });
})();

// ── PARALLAX HERO ORBS ───────────────────────────────────────
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const orbs = document.querySelectorAll('.orb-1, .orb-2, .orb-3');
  if (!orbs.length) return;

  let ticking = false;
  document.addEventListener('mousemove', e => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const xRatio = (e.clientX / window.innerWidth  - 0.5);
      const yRatio = (e.clientY / window.innerHeight - 0.5);
      orbs.forEach((orb, i) => {
        const strength = (i + 1) * 12;
        orb.style.transform = `translate(${xRatio * strength}px, ${yRatio * strength}px)`;
      });
      ticking = false;
    });
  }, { passive: true });
})();

// ── ACTIVE NAV LINK HIGHLIGHT ────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.style.color = active ? 'var(--white)' : '';
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => observer.observe(s));
})();

// ── CARD MAGNETIC HOVER ──────────────────────────────────────
(function initMagneticCards() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.service-card, .diff-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      const rotX = (-y / rect.height * 6).toFixed(2);
      const rotY = (x  / rect.width  * 6).toFixed(2);
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s var(--ease-out)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();

// ── GLITCH TEXT EFFECT (logo on hover) ──────────────────────
(function initGlitch() {
  const logo = document.querySelector('.logo-text');
  if (!logo) return;

  let interval;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01';
  const original = logo.textContent;

  logo.parentElement.addEventListener('mouseenter', () => {
    let iter = 0;
    clearInterval(interval);
    interval = setInterval(() => {
      logo.textContent = original.split('').map((char, idx) => {
        if (idx < iter) return original[idx];
        if (char === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iter >= original.length) {
        clearInterval(interval);
        logo.textContent = original;
      }
      iter += 1.5;
    }, 40);
  });

  logo.parentElement.addEventListener('mouseleave', () => {
    clearInterval(interval);
    logo.textContent = original;
  });
})();

// ── TYPED EFFECT (hero eyebrow) ──────────────────────────────
(function initTyped() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const el = document.querySelector('.hero-eyebrow span:nth-child(2)');
  if (!el) return;

  const text = el.textContent;
  el.textContent = '';
  let i = 0;
  const delay = 1800; // after loader

  setTimeout(() => {
    const t = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(t);
    }, 45);
  }, delay);
})();

// ── FOOTER YEAR ──────────────────────────────────────────────
(function initYear() {
  const el = document.querySelector('.footer-bottom p');
  if (el) {
    el.textContent = el.textContent.replace('2025', new Date().getFullYear());
  }
})();
