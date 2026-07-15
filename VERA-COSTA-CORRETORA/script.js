/*
  VERA COSTA CORRETORA DE IMÓVEIS
  Site estático de alta conversão · catálogo digital · Typebot integrado
*/
const TYPEBOT_URL = 'https://typebot.co/corretor-de-im-veis-portf-lio-completo-2f5wgak';

const EMPREENDIMENTOS = [
  {
    id: 'morada-dos-passaros',
    nome: 'Morada dos Pássaros',
    localizacao: 'Marivan · Aracaju/SE',
    categorias: ['mcmv','familia'],
    selo: 'Minha Casa Minha Vida',
    capa: 'assets/empreendimentos/morada-dos-passaros-capa.webp',
    resumo: 'Apartamentos de 2 quartos com lazer completo, quatro opções de planta e estrutura pensada para a família.',
    tags: ['2 quartos','47,47 a 53,52 m²','192 unidades'],
    destaque: 'Subsídio informado no material comercial: até R$ 75 mil, sujeito às regras vigentes e à análise do perfil.',
    estatisticas: [['6','blocos'],['192','apartamentos'],['4','plantas'],['1','vaga por unidade']],
    plantas: [
      ['Tipo I','47,87 m²','2 quartos, WC social, sala de estar/jantar, cozinha e área de serviço.'],
      ['Tipo II','47,47 m²','2 quartos, WC social, sala de estar/jantar, cozinha e área de serviço.'],
      ['Tipo III PCD','53,52 m²','Planta acessível com 2 quartos e ambientes adaptados.'],
      ['Tipo IV','53,52 m²','2 quartos com distribuição ampliada dos ambientes.']
    ],
    lazer: ['Piscina','Churrasqueira','Academia e jogos','Academia ao ar livre','Pet park','Pergolado','Playground','Salão de festas'],
    ficha: [['Endereço','Rua N, Marivan — Aracaju/SE'],['Área do terreno','10.398,35 m²'],['Pavimentos','Térreo + 3 pavimentos tipo'],['Apartamentos por andar','8'],['Garagem','1 vaga privativa por unidade'],['Água','Previsão de medição individual'],['Climatização','Preparação para split em 1 quarto']],
    galeria: ['assets/empreendimentos/morada-dos-passaros-1.webp','assets/empreendimentos/morada-dos-passaros-2.webp','assets/empreendimentos/morada-dos-passaros-3.webp']
  },
  {
    id: 'solare-residence',
    nome: 'Solare Residence',
    localizacao: 'Jabotiana · Aracaju/SE',
    categorias: ['familia'],
    selo: 'Plantas versáteis',
    capa: 'assets/empreendimentos/solare-residence-capa.webp',
    resumo: 'Opções de 2 e 3 quartos, varanda gourmet e apartamentos giardino em localização conectada ao Sol Nascente.',
    tags: ['2 e 3 quartos','59,84 a 81,39 m²','Varanda gourmet'],
    destaque: 'Condomínio com duas torres, lazer completo e opções com suíte, giardino e plantas versáteis.',
    estatisticas: [['2','torres'],['198','unidades'],['8','aptos por andar'],['2','elevadores por torre']],
    plantas: [
      ['Tipo 01','66,89 m²','3 quartos, sendo 1 suíte, WC social, sala, cozinha, serviço e varanda gourmet.'],
      ['Tipo 02','59,84 m²','2 quartos, WC social e varanda gourmet.'],
      ['Tipo 03 PNE','66,89 m²','Unidade acessível com suíte e varanda gourmet.'],
      ['Tipo 04','81,39 m²','3 quartos, sendo 1 suíte, varanda gourmet e giardino.']
    ],
    lazer: ['Piscina adulta e infantil','Deck e prainha','Churrasqueira','Fitness center','Espaço festas','Praça Sunset','Play Baby','Cine Kids','Bicicletário'],
    ficha: [['Endereço','Rua Jovino Santana, s/n — Sol Nascente, Jabotiana'],['Terreno','4.127,50 m²'],['Pavimentos','Torre 1: térreo + 11; Torre 2: térreo + 12'],['Garagem','1 vaga por unidade'],['Visitantes','7 vagas, além de vagas PCD'],['Água','Medição individual'],['Climatização','Preparação para split em todos os quartos']],
    galeria: ['assets/empreendimentos/solare-residence-1.webp','assets/empreendimentos/solare-residence-2.webp']
  },
  {
    id: 'viver-aruana',
    nome: 'Viver Aruana',
    localizacao: 'Aruana · Aracaju/SE',
    categorias: ['familia'],
    selo: 'Lazer completo e equipado',
    capa: 'assets/empreendimentos/viver-aruana-capa.webp',
    resumo: 'Apartamentos de 2 quartos com suíte, varanda gourmet e amplo conjunto de lazer na Aruana.',
    tags: ['2 quartos com suíte','52,14 a 52,19 m²','3 torres'],
    destaque: 'Varanda gourmet integrada à cozinha e ambientes comuns entregues equipados ou mobiliados conforme o memorial.',
    estatisticas: [['3','torres'],['192','unidades'],['8','pavimentos'],['2','elevadores por torre']],
    plantas: [
      ['Planta 52,14 m²','52,14 m²','2 quartos, sendo 1 suíte, cozinha americana, serviço e varanda gourmet.'],
      ['Planta 52,19 m²','52,19 m²','2 quartos, sendo 1 suíte, estar/jantar e varanda gourmet integrada.'],
      ['Unidade acessível','Conforme coluna','Planta adaptada no térreo, sujeita à confirmação de disponibilidade.']
    ],
    lazer: ['Piscina adulto e infantil','Churrasqueira','Salão de festas','Salão de jogos','Academia','Coworking','Espaço criança','Parque infantil','Espaço zen','Pet park','Horta','Espaço mulher','Bicicletário'],
    ficha: [['Endereço','Rua A, s/n — Aruana, Aracaju/SE'],['Pavimentos','Térreo + 7 tipos'],['Apartamentos por andar','8'],['Garagem','192 vagas privativas e 13 visitantes'],['Motos','13 vagas'],['Gás','Natural, medição coletiva'],['Climatização','Preparação para split nos quartos']],
    galeria: ['assets/empreendimentos/viver-aruana-1.webp','assets/empreendimentos/viver-aruana-2.webp','assets/empreendimentos/viver-aruana-3.webp']
  },
  {
    id: 'eloisio-sobral',
    nome: 'Residencial Eloisio Sobral da Silveira',
    localizacao: 'Bairro Industrial · Aracaju/SE',
    categorias: ['familia'],
    selo: 'Residencial + área comercial',
    capa: 'assets/empreendimentos/eloisio-sobral-capa.webp',
    resumo: 'Apartamentos de 2 quartos com suíte, varanda integrada e área comercial em uma região central e conectada.',
    tags: ['2 quartos com suíte','52,99 a 53,44 m²','Até 2 vagas'],
    destaque: 'Localização próxima ao Mercado Municipal, Terminal do Mercado, Avenida João Ribeiro e Ponte Construtor João Alves.',
    estatisticas: [['2','blocos'],['256','unidades'],['16','pavimentos'],['2','elevadores por bloco']],
    plantas: [
      ['Tipo I','52,99 m²','2 quartos, sendo 1 suíte, sala, cozinha, serviço, WC social e varanda integrada.'],
      ['Tipo II','53,44 m²','2 quartos, sendo 1 suíte, com varanda integrada.'],
      ['Tipo III','53,17 m²','2 quartos, sendo 1 suíte, e ambientes integrados.'],
      ['Tipo IV PCD','52,99 m²','Opção acessível, sujeita à disponibilidade.']
    ],
    lazer: ['Piscina adulta e infantil','Deck e prainha','Churrasqueira','Academia ao ar livre','Salão de festas','Espaço para esportes','Academia','Salão de jogos','Playground','Pet play','Bicicletário','Mini market'],
    ficha: [['Endereço','Rua Autran Azevedo, 80 — Bairro Industrial'],['Terreno','6.361,81 m²'],['Pavimentos','Térreo + 15 pavimentos tipo'],['Apartamentos por andar','8'],['Garagem','Até 2 vagas privativas por apartamento'],['Visitantes','13 vagas, incluindo idoso e PCD'],['Motos','23 vagas'],['Climatização','Preparação para split']],
    galeria: ['assets/empreendimentos/eloisio-sobral-1.webp','assets/empreendimentos/eloisio-sobral-2.webp','assets/empreendimentos/eloisio-sobral-3.webp']
  },
  {
    id: 'summer-barra',
    nome: 'Summer Barra',
    localizacao: 'Barra dos Coqueiros/SE',
    categorias: ['familia'],
    selo: 'Lazer e apoio praia',
    capa: 'assets/empreendimentos/summer-barra-capa.webp',
    resumo: 'Apartamentos de 2 e 3 quartos com suíte, opções térreas com jardim e estrutura completa na Barra dos Coqueiros.',
    tags: ['2 e 3 quartos','59,84 a 71,27 m²','216 unidades'],
    destaque: 'Diferenciais de conectividade, tomadas USB e infraestrutura de Wi-Fi nas áreas comuns conforme o projeto.',
    estatisticas: [['3','blocos'],['216','unidades'],['9','pavimentos'],['2','elevadores por bloco']],
    plantas: [
      ['2 quartos','59,84 m²','2 quartos, sendo 1 suíte, sala, cozinha, serviço e varanda.'],
      ['2 quartos ampliado','61,39 m²','Opção de 2 quartos com distribuição ampliada.'],
      ['3 quartos','68,89 m²','3 quartos, sendo 1 suíte, e varanda.'],
      ['Térreo com jardim','71,27 m²','Unidade térrea com área externa privativa.']
    ],
    lazer: ['Piscina adulto e infantil','Deck','Churrasqueiras','Salão de festas','Salão de jogos','Academia','Pet park','Campinho','Coworking','Apoio praia','Play Kids','Bicicletário'],
    ficha: [['Endereço','Av. Mangabeira, 555 — Espaço Tropical, Barra dos Coqueiros'],['Pavimentos','Térreo + 8 tipos'],['Apartamentos por andar','8'],['Garagem','216 vagas privativas e 27 visitantes'],['Motos','11 vagas'],['Gás','GLP, medição coletiva'],['Água','Previsão de medição individual'],['Climatização','Preparação para split em 2 quartos']],
    galeria: ['assets/empreendimentos/summer-barra-1.webp','assets/empreendimentos/summer-barra-2.webp']
  },
  {
    id: 'lumiere-art-home',
    nome: 'Lumière Art Home',
    localizacao: 'Atalaia · Aracaju/SE',
    categorias: ['premium','familia'],
    selo: 'Próximo à Orla de Atalaia',
    capa: 'assets/empreendimentos/lumiere-art-home-capa.webp',
    resumo: 'Empreendimento de padrão superior com opções de 2 e 3 quartos, varanda gourmet e lazer completo próximo à Orla.',
    tags: ['2 e 3 quartos','64,28 a 87,05 m²','Até 2 vagas'],
    destaque: 'Vista privilegiada, três elevadores, energia solar nas áreas indicadas e espaços como pet care e mini market.',
    estatisticas: [['1','torre'],['8','aptos por andar'],['3','elevadores'],['Até 2','vagas']],
    plantas: [
      ['Tipo 01','87,05 m²','3 quartos, sendo 1 suíte, WC social, lavabo, varanda gourmet, sala e cozinha/serviço.'],
      ['Tipo 02','64,28 m²','2 quartos, sendo 1 suíte, WC social, varanda gourmet e ambientes integrados.'],
      ['Tipo 03','77,45 m²','3 quartos, sendo 1 suíte, varanda gourmet, sala, cozinha e serviço.']
    ],
    lazer: ['Piscina adulta e infantil','Sundeck e prainha','Churrasqueira','Espaço gourmet','Salão de festas','Academia','Coworking','Espaço kids','Parque infantil','Espaço pet','Pet care','Mini market'],
    ficha: [['Região','Jardim Atlântico / Atalaia — Aracaju/SE'],['Tipologia','2 e 3 quartos, 1 suíte'],['Garagem','Opções com até 2 vagas'],['Elevadores','2 sociais e 1 de serviço'],['Fachada','Textura e revestimento'],['Conectividade','Wi-Fi nas áreas comuns e tomadas USB conforme projeto'],['Climatização','Preparação para split']],
    galeria: ['assets/empreendimentos/lumiere-art-home-1.webp','assets/empreendimentos/lumiere-art-home-2.webp']
  },
  {
    id: 'dune-simple-life',
    nome: 'Dune Simple Life',
    localizacao: 'Aruana · Aracaju/SE',
    categorias: ['premium'],
    selo: 'Frente-mar · rooftop',
    capa: 'assets/empreendimentos/dune-simple-life-capa.webp',
    resumo: 'Torre exclusiva com apenas 50 unidades, apartamentos de 2 suítes e rooftop panorâmico de frente para o mar.',
    tags: ['2 suítes','77,30 a 79,38 m²','50 unidades'],
    destaque: 'Rooftop com piscina de borda infinita, hidromassagem, sauna, Sky Gym e ambientes panorâmicos.',
    estatisticas: [['1','torre'],['50','apartamentos'],['15','pavimentos'],['Até 2','vagas']],
    plantas: [
      ['Tipo I','77,73 m²','2 suítes, living integrado, lavabo, varanda, cozinha e área de serviço.'],
      ['Tipo II','77,30 m²','2 suítes, varanda e ambientes integrados.'],
      ['Tipo III','78,44 m²','2 suítes, living integrado e varanda.'],
      ['Tipo IV','79,38 m²','2 suítes, varanda e distribuição ampliada.']
    ],
    lazer: ['Infinity pool','Hidromassagem','Deck e deck molhado','Solarium','Sauna a vapor','Sky Gym','Gourmet VIP','Garden Grill','Sunset Place','Coworking','Bike & Tools','Mini market'],
    ficha: [['Endereço','Rua Maria Geovelícia Bomfim Costa, 466 — Aruana'],['Apartamentos por pavimento','4, com configuração específica no G3'],['Elevadores','2'],['Garagem','Até 2 vagas privativas por apartamento'],['Visitantes','4 vagas, incluindo idoso e PCD'],['Motos','7 vagas'],['Acesso','Reconhecimento facial em ambientes selecionados'],['Fechadura','Eletrônica na entrada dos apartamentos']],
    galeria: ['assets/empreendimentos/dune-simple-life-1.webp','assets/empreendimentos/dune-simple-life-3.webp']
  },
  {
    id: 'reserva-das-cores',
    nome: 'Reserva das Cores',
    localizacao: 'Nossa Senhora do Socorro/SE',
    categorias: ['mcmv','familia'],
    selo: 'Minha Casa Minha Vida',
    capa: 'assets/empreendimentos/reserva-das-cores-capa.webp',
    resumo: 'Apartamentos de 2 quartos com cinco opções de planta, lazer equipado e localização conectada ao centro de Socorro.',
    tags: ['2 quartos','47,47 a 53,52 m²','232 unidades'],
    destaque: 'Próximo a comércio, transporte, serviços, instituições de ensino e Shopping Prêmio.',
    estatisticas: [['8','blocos'],['232','unidades'],['5','plantas'],['1','vaga por unidade']],
    plantas: [
      ['Tipo 01','47,87 m²','2 quartos, WC social, estar/jantar, cozinha e área de serviço.'],
      ['Tipo 02','47,47 m²','2 quartos e ambientes funcionais.'],
      ['Tipo 03 PCD','53,52 m²','Planta acessível.'],
      ['Tipo 04','47,47 m²','2 quartos, WC social, sala e cozinha/serviço.'],
      ['Tipo 05','53,52 m²','2 quartos com distribuição ampliada.']
    ],
    lazer: ['Piscinas','Salão de festas','Churrasqueira','Parquinho','Play Kids','Espaço Kids','Pet Park','Academia e jogos','Fitness ao ar livre','Redário e quiosque','Espaço para esportes','Bicicletário'],
    ficha: [['Endereço','Av. Rosemary Vieira de Jesus — Jardim Marajá, Nossa Senhora do Socorro/SE'],['Pavimentos','Térreo + 3 pavimentos tipo'],['Configuração','5 blocos com 8 aptos/andar e 3 blocos com 6'],['Garagem','1 vaga por unidade e 4 vagas visitantes'],['Motos','12 vagas'],['Água','Medição individualizada'],['Conectividade','Infraestrutura de Wi-Fi e tomadas USB conforme projeto'],['Climatização','Preparação para split em 1 quarto']],
    galeria: ['assets/empreendimentos/reserva-das-cores-1.webp','assets/empreendimentos/reserva-das-cores-2.webp','assets/empreendimentos/reserva-das-cores-3.webp']
  }
];

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];


// ── ABERTURA RESPONSIVA EM VÍDEO ──────────────────────────────
(() => {
  const loader = qs('#siteLoader');
  const video = qs('#siteIntroVideo');
  const skipButton = qs('#siteLoaderSkip');
  const status = qs('#siteLoaderStatus');
  if (!loader) {
    document.body.classList.remove('loader-active');
    return;
  }

  const version = loader.dataset.loaderVersion || '1';
  const storageKey = `vera-costa-intro-${version}`;
  let dismissed = false;
  let safetyTimer = 0;

  const wasSeen = () => {
    try { return window.sessionStorage.getItem(storageKey) === 'seen'; }
    catch { return false; }
  };

  const markSeen = () => {
    try { window.sessionStorage.setItem(storageKey, 'seen'); }
    catch { /* armazenamento pode estar bloqueado */ }
  };

  const dismissLoader = (immediate = false) => {
    if (dismissed) return;
    dismissed = true;
    window.clearTimeout(safetyTimer);
    markSeen();
    if (video) video.pause();
    document.body.classList.remove('loader-active');

    if (immediate) {
      loader.classList.add('is-hidden');
      loader.setAttribute('aria-hidden', 'true');
      return;
    }

    loader.classList.add('is-leaving');
    loader.setAttribute('aria-hidden', 'true');
    window.setTimeout(() => loader.classList.add('is-hidden'), 580);
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (wasSeen() || reduceMotion || !video) {
    dismissLoader(true);
    return;
  }

  const mobileQuery = window.matchMedia('(max-width: 760px), (orientation: portrait) and (max-width: 900px)');
  const isMobile = mobileQuery.matches;
  const source = isMobile ? video.dataset.mobileSrc : video.dataset.desktopSrc;
  const poster = isMobile ? video.dataset.mobilePoster : video.dataset.desktopPoster;

  if (poster) video.poster = poster;
  if (!source) {
    dismissLoader(true);
    return;
  }

  video.src = source;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  video.addEventListener('ended', () => dismissLoader(), { once: true });
  video.addEventListener('error', () => {
    if (status) status.textContent = 'Abrindo o site…';
    window.setTimeout(() => dismissLoader(), 250);
  }, { once: true });

  skipButton?.addEventListener('click', () => dismissLoader());

  safetyTimer = window.setTimeout(() => dismissLoader(), 8000);
  const playPromise = video.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(() => {
      if (status) status.textContent = 'Abrindo o site…';
      window.setTimeout(() => dismissLoader(), 350);
    });
  }

  window.addEventListener('pagehide', () => video.pause(), { once: true });
})();

// ── ANO DO RODAPÉ ─────────────────────────────────────────────
const yearElement = qs('#currentYear');
if (yearElement) yearElement.textContent = new Date().getFullYear();

// ── CANVAS: PARTÍCULAS E LINHAS ───────────────────────────────
(() => {
  const canvas = qs('#bg-canvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = 0;
  let running = true;

  const isMobile = () => window.innerWidth < 720;
  const particleCount = () => isMobile() ? 42 : 82;
  const lineDistance = () => isMobile() ? 95 : 135;
  const colors = [
    'rgba(202,163,77,',
    'rgba(232,201,120,',
    'rgba(143,106,33,',
    'rgba(247,242,231,'
  ];

  const random = (min, max) => min + Math.random() * (max - min);

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    createParticles();
  }

  function createParticles() {
    particles = Array.from({ length: particleCount() }, () => ({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.24, 0.24),
      vy: random(-0.24, 0.24),
      radius: random(0.8, 2.1),
      alpha: random(0.25, 0.72),
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }

  function draw() {
    if (!running || document.hidden) return;
    ctx.clearRect(0, 0, width, height);
    const maxDistance = lineDistance();

    for (let i = 0; i < particles.length; i += 1) {
      const particle = particles[i];

      for (let j = i + 1; j < particles.length; j += 1) {
        const other = particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(202,163,77,${opacity})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color}${particle.alpha})`;
      ctx.fill();

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -5) particle.x = width + 5;
      if (particle.x > width + 5) particle.x = -5;
      if (particle.y < -5) particle.y = height + 5;
      if (particle.y > height + 5) particle.y = -5;
    }

    animationFrame = window.requestAnimationFrame(draw);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resizeCanvas, 120);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    window.cancelAnimationFrame(animationFrame);
    if (running) draw();
  });

  resizeCanvas();
  draw();
})();

// ── CURSOR GLOW ────────────────────────────────────────────────
(() => {
  const glow = qs('#cursorGlow');
  if (!glow || !window.matchMedia('(pointer: fine)').matches) return;

  let mouseX = -500;
  let mouseY = -500;
  let currentX = -500;
  let currentY = -500;

  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    glow.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function animateGlow() {
    currentX += (mouseX - currentX) * 0.11;
    currentY += (mouseY - currentY) * 0.11;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    window.requestAnimationFrame(animateGlow);
  }

  animateGlow();
})();

// ── NAVEGAÇÃO ─────────────────────────────────────────────────
(() => {
  const nav = qs('#mainNav');
  const hamburger = qs('#hamburger');
  const mobileMenu = qs('#navMobile');

  if (nav) {
    const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 45);
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  if (!hamburger || !mobileMenu) return;

  const setMenuState = (isOpen) => {
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  };
  const closeMenu = () => setMenuState(false);

  hamburger.addEventListener('click', () => {
    setMenuState(!mobileMenu.classList.contains('open'));
  });

  qsa('a, button', mobileMenu).forEach((element) => {
    element.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!mobileMenu.classList.contains('open')) return;
    if (mobileMenu.contains(event.target) || hamburger.contains(event.target)) return;
    closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) closeMenu();
  }, { passive: true });

  window.__closeVeraMobileMenu = closeMenu;
  setMenuState(false);
})();

// ── ROLAGEM SUAVE COM COMPENSAÇÃO DO MENU ─────────────────────
qsa('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = qs(href);
    if (!target) return;

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── REVEAL AO ROLAR ────────────────────────────────────────────
(() => {
  const elements = qsa('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const delay = Number(entry.target.dataset.delay || 0);
      window.setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -45px 0px' });

  elements.forEach((element) => observer.observe(element));

  window.addEventListener('load', () => {
    qsa('.hero .reveal').forEach((element, index) => {
      window.setTimeout(() => element.classList.add('visible'), 120 + (index * 130));
    });
  });
})();

// ── EFEITO RIPPLE NOS BOTÕES ───────────────────────────────────
document.addEventListener('click', (event) => {
  const button = event.target.closest('.btn, .nav-cta');
  if (!button) return;

  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const ripple = document.createElement('span');
  const hasPointerCoordinates = event.clientX > 0 || event.clientY > 0;
  const x = hasPointerCoordinates ? event.clientX - rect.left : rect.width / 2;
  const y = hasPointerCoordinates ? event.clientY - rect.top : rect.height / 2;

  ripple.className = 'js-ripple';
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x - (size / 2)}px`;
  ripple.style.top = `${y - (size / 2)}px`;

  button.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 650);
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  .js-ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,.22);
    pointer-events: none;
    transform: scale(0);
    animation: vc-ripple .6s ease-out forwards;
  }
  @keyframes vc-ripple {
    to { transform: scale(1); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);


// ── HELPERS DE SEGURANÇA ─────────────────────────────────────
function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
function escapeAttribute(value) { return escapeHTML(value).replaceAll('`', '&#096;'); }

// ── CATÁLOGO DIGITAL ──────────────────────────────────────────
const catalogGrid = qs('#catalogGrid');
const catalogFilters = qs('#catalogFilters');
let activeCatalogFilter = 'todos';

function renderCatalog(filter = 'todos') {
  if (!catalogGrid) return;
  const items = filter === 'todos'
    ? EMPREENDIMENTOS
    : EMPREENDIMENTOS.filter((item) => item.categorias.includes(filter));

  catalogGrid.innerHTML = items.map((item) => `
    <article class="catalog-card reveal visible" data-property-id="${escapeAttribute(item.id)}">
      <div class="catalog-card-image">
        <img src="${escapeAttribute(item.capa)}" alt="Capa digital do empreendimento ${escapeAttribute(item.nome)}" loading="lazy" />
        <span>${escapeHTML(item.selo)}</span>
      </div>
      <div class="catalog-card-body">
        <div class="catalog-card-place">${escapeHTML(item.localizacao)}</div>
        <h3>${escapeHTML(item.nome)}</h3>
        <div class="catalog-card-meta">${item.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join('')}</div>
        <p>${escapeHTML(item.resumo)}</p>
        <div class="catalog-card-actions">
          <button class="btn btn-primary btn-sm" type="button" data-open-property="${escapeAttribute(item.id)}">Abrir book digital</button>
          <button class="catalog-simulate" type="button" data-open-typebot data-property="${escapeAttribute(item.nome)}">Simular</button>
        </div>
      </div>
    </article>
  `).join('');
  bindTiltCards();
}

catalogFilters?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-catalog-filter]');
  if (!button) return;
  activeCatalogFilter = button.dataset.catalogFilter || 'todos';
  qsa('[data-catalog-filter]', catalogFilters).forEach((item) => {
    const selected = item === button;
    item.classList.toggle('is-active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  renderCatalog(activeCatalogFilter);
});
renderCatalog();

// ── BOOK DIGITAL / MODAL DO EMPREENDIMENTO ───────────────────
const propertyDialog = qs('#propertyDialog');
const propertyDialogContent = qs('#propertyDialogContent');
const propertyDialogTitle = qs('#propertyDialogTitle');
let currentProperty = null;
let lastPropertyTrigger = null;

function propertyById(id) { return EMPREENDIMENTOS.find((item) => item.id === id); }

function syncModalLock() {
  const hasOpenDialog = qsa('dialog').some((dialog) => dialog.open);
  document.body.classList.toggle('modal-open', hasOpenDialog);
}

function renderPropertyDialog(item) {
  const gallery = item.galeria.map((src, index) => `
    <button class="property-gallery-item" type="button" data-lightbox="${escapeAttribute(src)}" aria-label="Ampliar imagem ${index + 1} de ${escapeAttribute(item.nome)}">
      <img src="${escapeAttribute(src)}" alt="Material visual do empreendimento ${escapeAttribute(item.nome)} — imagem ${index + 1}" loading="lazy" />
    </button>`).join('');
  const stats = item.estatisticas.map(([value,label]) => `<div><strong>${escapeHTML(value)}</strong><span>${escapeHTML(label)}</span></div>`).join('');
  const plants = item.plantas.map(([name,area,text]) => `
    <article class="floorplan-card"><span>${escapeHTML(name)}</span><strong>${escapeHTML(area)}</strong><p>${escapeHTML(text)}</p></article>`).join('');
  const leisure = item.lazer.map((value) => `<li><span>✓</span>${escapeHTML(value)}</li>`).join('');
  const ficha = item.ficha.map(([label,value]) => `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join('');

  propertyDialogContent.innerHTML = `
    <section class="property-book-hero" style="--property-cover:url('${escapeAttribute(item.capa)}')">
      <img src="${escapeAttribute(item.capa)}" alt="Capa digital de ${escapeAttribute(item.nome)}" />
      <div>
        <span>${escapeHTML(item.selo)}</span>
        <h2>${escapeHTML(item.nome)}</h2>
        <p>${escapeHTML(item.localizacao)}</p>
        <div class="property-book-tags">${item.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join('')}</div>
        <button class="btn btn-primary" type="button" data-open-typebot data-property="${escapeAttribute(item.nome)}">Simular ou agendar visita</button>
      </div>
    </section>
    <nav class="property-book-tabs" role="tablist" aria-label="Seções do book digital">
      <button id="property-tab-visao" type="button" role="tab" aria-controls="property-panel-visao" aria-selected="true" tabindex="0" class="is-active" data-property-tab="visao">Visão geral</button>
      <button id="property-tab-plantas" type="button" role="tab" aria-controls="property-panel-plantas" aria-selected="false" tabindex="-1" data-property-tab="plantas">Plantas</button>
      <button id="property-tab-lazer" type="button" role="tab" aria-controls="property-panel-lazer" aria-selected="false" tabindex="-1" data-property-tab="lazer">Lazer</button>
      <button id="property-tab-ficha" type="button" role="tab" aria-controls="property-panel-ficha" aria-selected="false" tabindex="-1" data-property-tab="ficha">Ficha técnica</button>
    </nav>
    <div class="property-book-panels">
      <section id="property-panel-visao" class="property-book-panel is-active" role="tabpanel" aria-labelledby="property-tab-visao" data-property-panel="visao">
        <div class="property-overview-copy"><span>Apresentação</span><h3>${escapeHTML(item.resumo)}</h3><p>${escapeHTML(item.destaque)}</p></div>
        <div class="property-stats">${stats}</div>
        <div class="property-visual-grid">${gallery}</div>
      </section>
      <section id="property-panel-plantas" class="property-book-panel" role="tabpanel" aria-labelledby="property-tab-plantas" data-property-panel="plantas" hidden>
        <div class="property-panel-heading"><span>Configurações</span><h3>Plantas disponíveis no material comercial</h3></div>
        <div class="floorplan-grid">${plants}</div>
      </section>
      <section id="property-panel-lazer" class="property-book-panel" role="tabpanel" aria-labelledby="property-tab-lazer" data-property-panel="lazer" hidden>
        <div class="property-panel-heading"><span>Condomínio</span><h3>Estrutura de lazer e conveniência</h3></div>
        <ul class="amenities-grid">${leisure}</ul>
      </section>
      <section id="property-panel-ficha" class="property-book-panel" role="tabpanel" aria-labelledby="property-tab-ficha" data-property-panel="ficha" hidden>
        <div class="property-panel-heading"><span>Dados técnicos</span><h3>Ficha do empreendimento</h3></div>
        <dl class="property-spec-list">${ficha}</dl>
      </section>
    </div>
    <aside class="property-book-disclaimer">As imagens são ilustrações tratadas a partir do material comercial recebido. Disponibilidade, unidades, valores, subsídios, metragens e condições podem ser alterados pela incorporadora e devem ser confirmados com Vera Costa.</aside>
    <div class="property-book-cta">
      <div><strong>Gostou de ${escapeHTML(item.nome)}?</strong><span>Faça uma simulação ou agende uma apresentação personalizada.</span></div>
      <button class="btn btn-gold" type="button" data-open-typebot data-property="${escapeAttribute(item.nome)}">Quero atendimento</button>
    </div>`;
}

function openProperty(id, trigger) {
  const item = propertyById(id);
  if (!item || !propertyDialog || !propertyDialogContent) return;
  currentProperty = item;
  lastPropertyTrigger = trigger || document.activeElement;
  renderPropertyDialog(item);
  if (propertyDialogTitle) propertyDialogTitle.textContent = item.nome;
  if (typeof propertyDialog.showModal === 'function') {
    if (!propertyDialog.open) propertyDialog.showModal();
  } else propertyDialog.setAttribute('open','');
  syncModalLock();
  propertyDialogContent.scrollTop = 0;
}
function closeProperty(restoreFocus = true) {
  if (!propertyDialog) return;
  if (typeof propertyDialog.close === 'function' && propertyDialog.open) propertyDialog.close();
  else propertyDialog.removeAttribute('open');
  currentProperty = null;
  syncModalLock();
  if (restoreFocus && lastPropertyTrigger?.focus) setTimeout(() => lastPropertyTrigger.focus(), 0);
}

propertyDialog?.addEventListener('click', (event) => {
  if (event.target === propertyDialog) {
    closeProperty();
    return;
  }
  const tab = event.target.closest('[data-property-tab]');
  if (tab) activatePropertyTab(tab);
});

function activatePropertyTab(tab, moveFocus = false) {
  if (!tab || !propertyDialog) return;
  const name = tab.dataset.propertyTab;
  qsa('[data-property-tab]', propertyDialog).forEach((button) => {
    const selected = button === tab;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  qsa('[data-property-panel]', propertyDialog).forEach((panel) => {
    const selected = panel.dataset.propertyPanel === name;
    panel.classList.toggle('is-active', selected);
    panel.hidden = !selected;
  });
  if (moveFocus) tab.focus();
}

propertyDialog?.addEventListener('keydown', (event) => {
  const currentTab = event.target.closest('[data-property-tab]');
  if (!currentTab) return;
  const tabs = qsa('[data-property-tab]', propertyDialog);
  const index = tabs.indexOf(currentTab);
  let nextIndex = index;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
  else if (event.key === 'Home') nextIndex = 0;
  else if (event.key === 'End') nextIndex = tabs.length - 1;
  else return;
  event.preventDefault();
  activatePropertyTab(tabs[nextIndex], true);
});
qsa('[data-close-property]').forEach((button) => button.addEventListener('click', () => closeProperty()));
propertyDialog?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeProperty();
});
propertyDialog?.addEventListener('close', () => {
  currentProperty = null;
  syncModalLock();
});

// ── MODAL DO TYPEBOT ──────────────────────────────────────────
const typebotDialog = qs('#typebotDialog');
const typebotFrame = qs('#typebotFrame');
const typebotPlaceholder = qs('#typebotPlaceholder');
const typebotTitle = qs('#typebotTitle');
const typebotStatus = qs('#typebotStatus');
const typebotExternalLink = qs('#typebotExternalLink');
const typebotExternalHeader = qs('#typebotExternalHeader');
let lastTypebotTrigger = null;
let activeTypebotProperty = '';
let typebotLoadTimer = 0;

function buildTypebotURL(propertyName = '') {
  try {
    const url = new URL(TYPEBOT_URL);
    if (url.protocol !== 'https:' || url.hostname !== 'typebot.co') throw new Error('Typebot URL inválida');
    if (propertyName) url.searchParams.set('empreendimento', propertyName);
    url.searchParams.set('origem', 'site-vera-costa');
    return url.toString();
  } catch {
    return '';
  }
}
function showTypebotFallback(message) {
  if (typebotStatus && message) typebotStatus.textContent = message;
  if (typebotPlaceholder) typebotPlaceholder.style.display = 'grid';
}
function openTypebot(event) {
  if (!typebotDialog) return;
  const trigger = event?.currentTarget || document.activeElement;
  const triggerIsInsideProperty = Boolean(trigger?.closest?.('#propertyDialog'));
  lastTypebotTrigger = triggerIsInsideProperty ? lastPropertyTrigger : trigger;
  activeTypebotProperty = trigger?.dataset?.property || '';
  const url = buildTypebotURL(activeTypebotProperty);

  if (typebotExternalLink) typebotExternalLink.href = url || TYPEBOT_URL;
  if (typebotExternalHeader) typebotExternalHeader.href = url || TYPEBOT_URL;
  if (propertyDialog?.open) closeProperty(false);
  if (typebotTitle) typebotTitle.textContent = activeTypebotProperty
    ? `Atendimento — ${activeTypebotProperty}`
    : 'Simulação e visita técnica';

  window.clearTimeout(typebotLoadTimer);
  if (!url) {
    if (typebotFrame) typebotFrame.style.display = 'none';
    showTypebotFallback('O endereço do atendimento está inválido. Continue pelo WhatsApp.');
  } else if (typebotFrame) {
    typebotFrame.style.display = 'block';
    const sameLoadedURL = typebotFrame.dataset.loadedUrl === url && typebotFrame.getAttribute('src') === url;
    if (sameLoadedURL) {
      if (typebotPlaceholder) typebotPlaceholder.style.display = 'none';
    } else {
      showTypebotFallback('Carregando o atendimento imobiliário…');
      if (typebotFrame.getAttribute('src') !== url) typebotFrame.setAttribute('src', url);
      typebotLoadTimer = window.setTimeout(() => {
        if (typebotFrame.dataset.loadedUrl !== url) {
          showTypebotFallback('O atendimento está demorando para carregar. Você pode continuar pelo WhatsApp.');
        }
      }, 12000);
    }
  }

  if (typeof typebotDialog.showModal === 'function') {
    if (!typebotDialog.open) typebotDialog.showModal();
  } else typebotDialog.setAttribute('open','');
  syncModalLock();
}
function closeTypebot() {
  if (!typebotDialog) return;
  window.clearTimeout(typebotLoadTimer);
  if (typeof typebotDialog.close === 'function' && typebotDialog.open) typebotDialog.close();
  else typebotDialog.removeAttribute('open');
  syncModalLock();
  activeTypebotProperty = '';
  const focusTarget = lastTypebotTrigger;
  lastTypebotTrigger = null;
  if (focusTarget?.focus && document.contains(focusTarget)) setTimeout(() => focusTarget.focus(), 0);
}
typebotFrame?.addEventListener('load', () => {
  const loadedURL = typebotFrame.getAttribute('src');
  if (!loadedURL) return;
  typebotFrame.dataset.loadedUrl = loadedURL;
  window.clearTimeout(typebotLoadTimer);
  if (typebotPlaceholder) typebotPlaceholder.style.display = 'none';
});
qsa('[data-close-typebot]').forEach((button) => button.addEventListener('click', closeTypebot));
typebotDialog?.addEventListener('click', (event) => {
  if (event.target === typebotDialog) closeTypebot();
});
typebotDialog?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeTypebot();
});
typebotDialog?.addEventListener('close', syncModalLock);

// ── DELEGAÇÃO DOS BOTÕES DINÂMICOS ───────────────────────────
document.addEventListener('click', (event) => {
  const propertyButton = event.target.closest('[data-open-property]');
  if (propertyButton) { openProperty(propertyButton.dataset.openProperty, propertyButton); return; }
  const typebotButton = event.target.closest('[data-open-typebot]');
  if (typebotButton) { openTypebot({ currentTarget: typebotButton }); }
});

// ── LIGHTBOX DAS FOTOS ────────────────────────────────────────
let closeLightboxDialog = null;
(() => {
  const dialog = qs('#lightboxDialog');
  const image = qs('#lightboxImage');
  if (!dialog || !image) return;
  let lastTrigger = null;
  const close = () => {
    if (typeof dialog.close === 'function' && dialog.open) dialog.close(); else dialog.removeAttribute('open');
    image.removeAttribute('src');
    syncModalLock();
    const focusTarget = lastTrigger;
    lastTrigger = null;
    if (focusTarget?.focus && document.contains(focusTarget)) setTimeout(() => focusTarget.focus(), 0);
  };
  closeLightboxDialog = close;
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-lightbox]');
    if (!button) return;
    lastTrigger = button; image.src = button.dataset.lightbox;
    image.alt = qs('img',button)?.alt || 'Imagem ampliada';
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open','');
    syncModalLock();
  });
  qsa('[data-close-lightbox]').forEach((button) => button.addEventListener('click', close));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => { image.removeAttribute('src'); syncModalLock(); });
})();

// ── TILT SUAVE ────────────────────────────────────────────────
function bindTiltCards() {
  if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  qsa('.service-card, .process-grid article, .catalog-card').forEach((card) => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = 'true';
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `translateY(-5px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform=''; });
  });
}
bindTiltCards();

// ── TECLA ESC E RESTAURAÇÃO DETERMINÍSTICA ───────────────────
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const lightbox = qs('#lightboxDialog');
  if (lightbox?.open) { event.preventDefault(); closeLightboxDialog?.(); return; }
  if (typebotDialog?.open) { event.preventDefault(); closeTypebot(); return; }
  if (propertyDialog?.open) { event.preventDefault(); closeProperty(); return; }
  window.__closeVeraMobileMenu?.();
});

window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  qsa('dialog[open]').forEach((dialog) => {
    try { dialog.close(); } catch { dialog.removeAttribute('open'); }
  });
  window.__closeVeraMobileMenu?.();
  document.body.classList.remove('modal-open');
});
