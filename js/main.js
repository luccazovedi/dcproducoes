// Menu hamburger + overlay
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
const siteHeader = document.getElementById('siteHeader');

function openMenu() {
  siteHeader.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  siteHeader.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  siteHeader.classList.contains('open') ? closeMenu() : openMenu();
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Scroll effect
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > 10) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
});

// Animate counters
window.addEventListener('load', () => {
  document.querySelectorAll('.hstat-num[data-target]').forEach((el, i) => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = i === 2 ? 1000 : 1500;
    setTimeout(() => {
      const increment = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.innerHTML = `${target}<sup>${suffix}</sup>`;
          clearInterval(timer);
        } else {
          el.innerHTML = `${Math.floor(current)}<sup>${suffix}</sup>`;
        }
      }, 16);
    }, 1000 + i * 200);
  });
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      const children = entry.target.querySelectorAll('[data-animate]');
      children.forEach((child, index) => {
        setTimeout(() => {
          child.classList.add('visible');
        }, index * 100);
      });
    }
  });
}, observerOptions);

document.querySelectorAll('.about-text, .svc-item, .port-item, .test-card, h2.display').forEach(el => {
  observer.observe(el);
});

// Staggered animations
document.querySelectorAll('.svc-item').forEach((item, index) => {
  item.setAttribute('data-animate', index);
  item.style.opacity = '0';
  item.style.animation = `slideUp .6s cubic-bezier(0.32, 0.08, 0.24, 1) forwards`;
  item.style.animationDelay = `${index * 100}ms`;
});

document.querySelectorAll('.port-item').forEach((item, index) => {
  item.style.animationDelay = `${index * 150}ms`;
});

document.querySelectorAll('.test-card').forEach((item, index) => {
  item.style.animationDelay = `${index * 100}ms`;
});

// Contact form — conditional fields
(function () {
  const serviceSelect = document.getElementById('service');
  const fieldsMap = {
    corporativo:          'fields-evento',
    sociais:              'fields-evento',
    outros:               'fields-evento',
    feiras_stands:        'fields-feiras',
    producao_audiovisual: 'fields-audiovisual',
  };
  const allConditionals = ['fields-evento', 'fields-feiras', 'fields-audiovisual'];

  function showFields(service) {
    allConditionals.forEach(function(id) {
      const el = document.getElementById(id);
      if (fieldsMap[service] === id) {
        el.style.display = 'block';
        el.classList.add('visible');
      } else {
        el.style.display = 'none';
        el.classList.remove('visible');
      }
    });
  }

  serviceSelect.addEventListener('change', function() {
    showFields(this.value);
  });

  // "Já tenho local" — oculta o input de texto quando marcado
  [
    { checkbox: 'has-venue',      input: 'event-location' },
    { checkbox: 'has-venue-fair', input: 'fair-location'  },
    { checkbox: 'has-venue-av',   input: 'av-location'    },
  ].forEach(function(pair) {
    const cb    = document.getElementById(pair.checkbox);
    const input = document.getElementById(pair.input);
    if (!cb || !input) return;

    cb.addEventListener('change', function() {
      if (this.checked) {
        input.style.opacity  = '.35';
        input.style.pointerEvents = 'none';
        input.value          = '';
        input.placeholder    = 'Local já definido';
      } else {
        input.style.opacity  = '1';
        input.style.pointerEvents = 'auto';
        input.placeholder    = 'Endereço ou nome do espaço';
      }
    });
  });
})();

// Contact form — submit
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name     = document.getElementById('name').value.trim();
  const company  = document.getElementById('company').value.trim();
  const service  = document.getElementById('service').value;
  const budget   = document.getElementById('budget').value.trim();
  const feedback = document.getElementById('formFeedback');

  if (!name || !service) {
    feedback.textContent = 'Por favor, preencha os campos obrigatórios.';
    feedback.classList.remove('success');
    feedback.classList.add('error');
    return;
  }

  const serviceLabels = {
    corporativo:          'Corporativo',
    feiras_stands:        'Feiras e Stands',
    producao_audiovisual: 'Produção Audiovisual',
    sociais:              'Sociais',
    outros:               'Outros',
  };

  const solicitacaoLabels = {
    producao_evento:  'Produção de Eventos',
    audiovisual:      'Produção Audiovisual',
    stand_cenografia: 'Stand / Cenografia',
    completo:         'Pacote Completo',
  };

  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }
  function checked(id) {
    const el = document.getElementById(id);
    return el && el.checked ? 'Sim' : 'Não';
  }
  function formatDate(d) {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  let extra = '';

  if (service === 'corporativo' || service === 'sociais' || service === 'outros') {
    const guests   = val('event-guests');
    const date     = formatDate(val('event-date'));
    const location = val('event-location');
    const hasVenue = checked('has-venue');
    if (guests)   extra += `*Quantidade de Pessoas:* ${guests}\n`;
    if (date)     extra += `*Data do Evento:* ${date}\n`;
    if (location) extra += `*Local:* ${location}\n`;
    extra += `*Já tem local:* ${hasVenue}\n`;
  }

  if (service === 'feiras_stands') {
    const area       = val('fair-area');
    const date       = formatDate(val('fair-date'));
    const location   = val('fair-location');
    const hasVenue   = checked('has-venue-fair');
    const solic      = val('fair-solicitation');
    if (area)     extra += `*Área em m²:* ${area}\n`;
    if (date)     extra += `*Data do Evento:* ${date}\n`;
    if (location) extra += `*Local:* ${location}\n`;
    extra += `*Já tem local:* ${hasVenue}\n`;
    if (solic)    extra += `*Tipo de Solicitação:* ${solicitacaoLabels[solic] || solic}\n`;
  }

  if (service === 'producao_audiovisual') {
    const date     = formatDate(val('av-date'));
    const solic    = val('av-solicitation');
    const location = val('av-location');
    const hasVenue = checked('has-venue-av');
    if (date)     extra += `*Data do Evento:* ${date}\n`;
    if (solic)    extra += `*Tipo de Solicitação:* ${solicitacaoLabels[solic] || solic}\n`;
    if (location) extra += `*Local:* ${location}\n`;
    extra += `*Já tem local:* ${hasVenue}\n`;
  }

  const whatsappMessage =
    `*Orçamento - DC Produções*\n\n` +
    `*Nome:* ${name}\n` +
    `*Empresa/Evento:* ${company || 'Não informado'}\n` +
    `*Tipo de Serviço:* ${serviceLabels[service] || service}\n` +
    (extra ? `\n${extra}` : '') +
    `*Orçamento Disponível:* ${budget || 'Não informado'}`;

  const encodedMessage = encodeURIComponent(whatsappMessage);
  window.open(`https://wa.me/5511965723939?text=${encodedMessage}`, '_blank');

  feedback.textContent = '✓ Abrindo WhatsApp... você será direcionado para enviar sua solicitação.';
  feedback.classList.remove('error');
  feedback.classList.add('success');

  setTimeout(function() {
    document.getElementById('contactForm').reset();
    ['fields-evento','fields-feiras','fields-audiovisual'].forEach(function(id) {
      const el = document.getElementById(id);
      el.style.display = 'none';
      el.classList.remove('visible');
    });
    feedback.textContent = '';
    feedback.classList.remove('success');
  }, 2000);
});

// Testimonials carousel
(function () {
  var track       = document.getElementById('testTrack');
  var prevBtn     = document.getElementById('testPrev');
  var nextBtn     = document.getElementById('testNext');
  var progressFill  = document.getElementById('testProgress');
  var currentLabel  = document.getElementById('testCurrent');
  var totalLabel    = document.getElementById('testTotal');
  if (!track) return;

  var cards     = Array.prototype.slice.call(track.querySelectorAll('.test-card'));
  var total     = cards.length;
  var current   = 0;
  var perView   = 4;
  var gap       = 16;
  var autoTimer;

  function getPerView() {
    var w = window.innerWidth;
    if (w < 600)  return 1;
    if (w < 900)  return 2;
    if (w < 1200) return 3;
    return 4;
  }

  function updateUI() {
    var pages = Math.ceil(total / perView);
    var page  = Math.floor(current / perView);
    var pct   = pages <= 1 ? 100 : ((page + 1) / pages) * 100;
    if (progressFill) progressFill.style.width = pct + '%';
    if (currentLabel) currentLabel.textContent = page + 1;
    if (totalLabel)   totalLabel.textContent   = pages;
  }

  function updateSizes() {
    perView = getPerView();
    var wrap     = track.parentElement;
    var totalGap = gap * (perView - 1);
    var cardW    = (wrap.offsetWidth - totalGap) / perView;
    cards.forEach(function (c) {
      c.style.flex     = '0 0 ' + cardW + 'px';
      c.style.minWidth = cardW + 'px';
    });
    track.style.gap       = gap + 'px';
    current               = 0;
    track.style.transform = 'translateX(0)';
    updateUI();
  }

  function goTo(idx) {
    var pages = Math.ceil(total / perView);
    var page  = Math.floor(idx / perView);
    if (page >= pages) page = 0;
    if (page < 0)      page = pages - 1;
    current = page * perView;
    if (current > total - perView) current = Math.max(0, total - perView);
    var wrap     = track.parentElement;
    var totalGap = gap * (perView - 1);
    var cardW    = (wrap.offsetWidth - totalGap) / perView;
    var offset   = current * (cardW + gap);
    track.style.transform = 'translateX(-' + offset + 'px)';
    updateUI();
  }

  function next() { goTo(current + perView); }
  function prev() { goTo(current - perView); }
  function resetAuto() { clearInterval(autoTimer); autoTimer = setInterval(next, 6000); }

  prevBtn.addEventListener('click', function () { prev(); resetAuto(); });
  nextBtn.addEventListener('click', function () { next(); resetAuto(); });

  var startX = 0;
  track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   function (e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetAuto(); }
  });

  updateSizes();
  window.addEventListener('resize', function () { updateSizes(); });
  resetAuto();
})();
