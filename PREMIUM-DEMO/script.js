/* ═══════════════════════════════════════════════════════
   SYNTRA DIGITAL — Premium JavaScript
   Smooth scroll · Header state · Mobile menu · Reveal
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── UTILS ─────────────────────────────────────────── */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── DOM REFS ───────────────────────────────────────── */
const header      = $('#header');
const menuToggle  = $('#menuToggle');
const nav         = $('#nav');
const contactForm = $('#contactForm');
const formSuccess = $('#formSuccess');
const yearEl      = $('#year');
const whatsappLink = $('#whatsappLink');

/* ══════════════════════════════════════════════════════
   1. FOOTER YEAR
══════════════════════════════════════════════════════ */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ══════════════════════════════════════════════════════
   2. HEADER — scroll state
══════════════════════════════════════════════════════ */
let lastScrollY = 0;
let ticking = false;

function updateHeader() {
  const scrollY = window.scrollY;

  if (scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScrollY = scrollY;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateHeader);
    ticking = true;
  }
}, { passive: true });

/* ══════════════════════════════════════════════════════
   3. MOBILE MENU
══════════════════════════════════════════════════════ */
function openMenu() {
  nav.classList.add('is-open');
  menuToggle.classList.add('is-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Fechar menu');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  nav.classList.remove('is-open');
  menuToggle.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  document.body.style.overflow = '';
}

function toggleMenu() {
  if (nav.classList.contains('is-open')) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (menuToggle) {
  menuToggle.addEventListener('click', toggleMenu);
}

// Close menu when nav link is clicked
$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) closeMenu();
  });
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (
    nav.classList.contains('is-open') &&
    !nav.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    closeMenu();
  }
});

/* ══════════════════════════════════════════════════════
   4. ACTIVE NAV LINK (intersection-based)
══════════════════════════════════════════════════════ */
const sections = $$('main section[id]');
const navLinks = $$('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(section => sectionObserver.observe(section));

/* ══════════════════════════════════════════════════════
   5. REVEAL ANIMATIONS
══════════════════════════════════════════════════════ */
if (!prefersReducedMotion) {
  const revealEls = $$('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  // If reduced motion, reveal everything immediately
  $$('.reveal').forEach(el => el.classList.add('is-visible'));
}

/* ══════════════════════════════════════════════════════
   6. SMOOTH SCROLL (for browsers that need help)
══════════════════════════════════════════════════════ */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = $(targetId);
    if (!target) return;

    e.preventDefault();

    const headerHeight = header ? header.offsetHeight : 80;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? 'instant' : 'smooth'
    });

    // Update URL hash without jumping
    history.pushState(null, '', targetId);
  });
});

/* ══════════════════════════════════════════════════════
   7. CONTACT FORM
══════════════════════════════════════════════════════ */
if (contactForm) {
  contactForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;

  // Basic validation
  const nome     = form.querySelector('#nome');
  const whatsapp = form.querySelector('#whatsapp');

  if (!nome.value.trim()) {
    shakeField(nome);
    nome.focus();
    return;
  }

  if (!whatsapp.value.trim()) {
    shakeField(whatsapp);
    whatsapp.focus();
    return;
  }

  // Gather values
  const data = {
    nome:     nome.value.trim(),
    empresa:  form.querySelector('#empresa').value.trim(),
    whatsapp: whatsapp.value.trim(),
    projeto:  form.querySelector('#projeto').value,
    mensagem: form.querySelector('#mensagem').value.trim(),
  };

  // Build WhatsApp message
  const waMsgParts = [
    `*Nova solicitação — Syntra Digital*`,
    ``,
    `*Nome:* ${data.nome}`,
    data.empresa ? `*Empresa:* ${data.empresa}` : null,
    `*WhatsApp:* ${data.whatsapp}`,
    data.projeto ? `*Projeto:* ${formatProjeto(data.projeto)}` : null,
    data.mensagem ? `*Mensagem:* ${data.mensagem}` : null,
  ].filter(Boolean).join('\n');

  const waNumber = '5500000000000'; // Placeholder — troque pelo número real
  const waURL = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsgParts)}`;

  // Show success
  showSuccess(waURL);
}

function formatProjeto(val) {
  const map = {
    'site-institucional': 'Site institucional',
    'landing-page':       'Landing page',
    'identidade-visual':  'Identidade visual digital',
    'catalogo':           'Catálogo ou página comercial',
    'sistema':            'Sistema sob medida',
    'outro':              'Outro projeto',
  };
  return map[val] || val;
}

function showSuccess(waURL) {
  if (!contactForm || !formSuccess) return;

  // Fade out form
  contactForm.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  contactForm.style.opacity = '0';
  contactForm.style.transform = 'translateY(10px)';

  setTimeout(() => {
    contactForm.hidden = true;

    // Set WhatsApp link
    if (whatsappLink) whatsappLink.href = waURL;

    // Show success
    formSuccess.hidden = false;
    formSuccess.style.opacity = '0';
    formSuccess.style.transform = 'translateY(10px)';
    formSuccess.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        formSuccess.style.opacity = '1';
        formSuccess.style.transform = 'translateY(0)';
      });
    });

    // Animate success icon circle
    animateSuccessIcon();
  }, 400);
}

function animateSuccessIcon() {
  const circle = formSuccess.querySelector('circle');
  const path   = formSuccess.querySelector('path');
  if (!circle || !path || prefersReducedMotion) return;

  const circumference = 2 * Math.PI * 22; // r=22
  circle.style.strokeDasharray  = circumference;
  circle.style.strokeDashoffset = circumference;
  circle.style.transition = 'stroke-dashoffset 0.8s ease 0.2s';

  path.style.opacity = '0';
  path.style.transition = 'opacity 0.4s ease 0.8s';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      circle.style.strokeDashoffset = '0';
      path.style.opacity = '1';
    });
  });
}

/* ── Field shake animation ──────────────────────────── */
function shakeField(input) {
  input.style.animation = 'none';
  input.style.borderColor = 'rgba(220, 80, 80, 0.6)';
  input.style.transition = 'border-color 0.3s ease';

  if (!prefersReducedMotion) {
    let start = null;
    const duration = 400;
    const amplitude = 6;

    function shake(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = elapsed / duration;

      if (progress < 1) {
        const x = Math.sin(progress * Math.PI * 5) * amplitude * (1 - progress);
        input.style.transform = `translateX(${x}px)`;
        requestAnimationFrame(shake);
      } else {
        input.style.transform = '';
        setTimeout(() => { input.style.borderColor = ''; }, 1500);
      }
    }

    requestAnimationFrame(shake);
  } else {
    setTimeout(() => { input.style.borderColor = ''; }, 1500);
  }
}

/* ══════════════════════════════════════════════════════
   8. HERO PARALLAX (subtle, desktop only)
══════════════════════════════════════════════════════ */
if (!prefersReducedMotion && window.innerWidth > 1024) {
  const heroGlows = $$('.hero-glow');
  const geoShapes = $$('.geo-shape');

  let rafId = null;

  window.addEventListener('mousemove', (e) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 to 1
      const dy = (e.clientY - cy) / cy;

      heroGlows.forEach((el, i) => {
        const factor = (i + 1) * 10;
        el.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      });

      geoShapes.forEach((el, i) => {
        const factor = (i + 1) * 5;
        const baseRot = [45, 20, -15][i] || 0;
        el.style.transform = `rotate(${baseRot + dx * 3}deg) translate(${dx * factor}px, ${dy * factor}px)`;
      });
    });
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════
   9. PORTFOLIO CARD TILT (subtle mouse tracking)
══════════════════════════════════════════════════════ */
if (!prefersReducedMotion && window.innerWidth > 768) {
  $$('.portfolio-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const rotX  = ((e.clientY - cy) / (rect.height / 2)) * -4;
      const rotY  = ((e.clientX - cx) / (rect.width  / 2)) *  4;

      card.style.transform     = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
      card.style.transition    = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });
}

/* ══════════════════════════════════════════════════════
   10. SOLUTION / DIFF CARD GLOW ON HOVER
══════════════════════════════════════════════════════ */
$$('.solution-card, .diff-card, .auth-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

/* ══════════════════════════════════════════════════════
   11. PHONE MASK (WhatsApp field)
══════════════════════════════════════════════════════ */
const whatsappInput = $('#whatsapp');
if (whatsappInput) {
  whatsappInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (val.length > 6) {
      val = `(${val.slice(0,2)}) ${val.slice(2,7)}-${val.slice(7)}`;
    } else if (val.length > 2) {
      val = `(${val.slice(0,2)}) ${val.slice(2)}`;
    } else if (val.length > 0) {
      val = `(${val}`;
    }
    e.target.value = val;
  });
}

/* ══════════════════════════════════════════════════════
   12. INIT LOG
══════════════════════════════════════════════════════ */
console.log(
  '%cSyntra Digital',
  'font-family:Georgia,serif;font-size:18px;font-style:italic;color:#C8A96B;',
  '\nExperiências digitais premium · syntradigital.com.br'
);
