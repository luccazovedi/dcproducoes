/* ══════════════════════════════════════════════════════════════
   PREMIUM TRANSITIONS — DC Produções
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.innerWidth < 768;


  /* ── SCROLL PROGRESS BAR ── */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  function updateProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / total * 100) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ── CUSTOM CURSOR ── */
  if (!prefersReduced && !isMobile()) {
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    const spot = document.createElement('div');
    dot.className   = 'cursor-dot';
    ring.className  = 'cursor-ring';
    spot.className  = 'cursor-spotlight';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.appendChild(spot);

    let mx = 0, my = 0, rx = 0, ry = 0, sx = 0, sy = 0;
    let rafCursor;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
    }, { passive: true });

    function animCursor() {
      // dot: instant
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';

      // ring: lag
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';

      // spotlight: slower lag
      sx += (mx - sx) * 0.07;
      sy += (my - sy) * 0.07;
      spot.style.left = sx + 'px';
      spot.style.top  = sy + 'px';

      rafCursor = requestAnimationFrame(animCursor);
    }
    rafCursor = requestAnimationFrame(animCursor);

    // grow on interactive elements
    const grows = 'a, button, .svc-item, .port-item, .client-cell, .test-btn, .nav-cta, .btn-p, .btn-o, .form-submit, .soc, .wa-fab';
    document.querySelectorAll(grows).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
    });
  }

  /* ── SCROLL REVEAL (IntersectionObserver) ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('revealed');
        // stagger children
        if (el.dataset.stagger !== undefined) {
          el.querySelectorAll(':scope > *').forEach((child, i) => {
            child.style.transitionDelay = (i * 0.08) + 's';
          });
        }
      }, delay * 1000);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-reveal], [data-stagger]').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── SECTION IN TRANSITIONS ── */
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-in');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(
    '.about-svc, .portfolio, .clients, .stats-bar, .testimonials, .contact-section, .bottom'
  ).forEach(el => sectionObserver.observe(el));

  /* ── ABOUT IMAGE STAGGER ── */
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        imgObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.about-img-row').forEach(el => imgObserver.observe(el));

  /* ── MAGNETIC CARDS (desktop only) ── */
  if (!prefersReduced && !isMobile()) {
    document.querySelectorAll('.client-cell, .test-card, .svc-item').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx   = rect.left + rect.width / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) / rect.width;
        const dy   = (e.clientY - cy) / rect.height;
        const maxT = card.classList.contains('test-card') ? 6 : 4;
        card.style.transform = `perspective(600px) rotateY(${dx * maxT}deg) rotateX(${-dy * maxT}deg) translateZ(6px)`;

        // tilt shine
        const shine = card.querySelector('.tilt-shine');
        if (shine) {
          shine.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
          shine.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100) + '%');
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // inject tilt-shine into test-cards
    document.querySelectorAll('.test-card').forEach(card => {
      if (!card.querySelector('.tilt-shine')) {
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        const shine = document.createElement('div');
        shine.className = 'tilt-shine';
        card.appendChild(shine);
      }
    });
  }

  /* ── PORTFOLIO OVERLAY INJECT ── */
  document.querySelectorAll('.port-item').forEach(item => {
    if (item.querySelector('.port-overlay')) return;
    const tag = item.querySelector('.port-tag');
    const title = tag ? tag.textContent.trim() : '';
    const overlay = document.createElement('div');
    overlay.className = 'port-overlay';
    overlay.innerHTML = `
      <div class="port-overlay-title">${title}</div>
      <div class="port-overlay-arrow">
        <svg viewBox="0 0 24 24"><polyline points="5 12 19 12"/><polyline points="12 5 19 12 12 19"/></svg>
      </div>`;
    item.appendChild(overlay);
    if (tag) tag.remove();
  });

  /* ── PREMIUM STAT COUNTERS ── */
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      el.closest('.stat-cell')?.classList.add('counting');

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const value = Math.round(eased * target);
        el.innerHTML = `${value}<sup>${suffix}</sup>`;
        if (progress < 1) requestAnimationFrame(tick);
        else {
          el.innerHTML = `${target}<sup>${suffix}</sup>`;
          setTimeout(() => el.closest('.stat-cell')?.classList.remove('counting'), 400);
        }
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-n[data-target]').forEach(el => statObserver.observe(el));

  /* ── HERO STAT COUNTERS (already in view) ── */
  window.addEventListener('load', () => {
    document.querySelectorAll('.hstat-num[data-target]').forEach((el, i) => {
      const target   = parseInt(el.dataset.target);
      const suffix   = el.dataset.suffix || '';
      const duration = 1800;
      const delay    = 900 + i * 180;

      setTimeout(() => {
        const start = performance.now();
        function tick(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          el.innerHTML = `${Math.round(eased * target)}<sup>${suffix}</sup>`;
          if (progress < 1) requestAnimationFrame(tick);
          else el.innerHTML = `${target}<sup>${suffix}</sup>`;
        }
        requestAnimationFrame(tick);
      }, delay);
    });
  });

  /* ── PARALLAX HERO IMAGE ── */
  if (!prefersReduced && !isMobile()) {
    const heroImg = document.querySelector('.hero-img');
    if (heroImg) {
      let lastScroll = -1;
      function onScroll() {
        const s = window.scrollY;
        if (Math.abs(s - lastScroll) < 1) return;
        lastScroll = s;
        heroImg.style.transform = `translateY(${s * 0.28}px)`;
      }
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  /* ── GOLD SHIMMER ON .sec-label ── */
  document.querySelectorAll('.sec-label').forEach(el => {
    const span = el.querySelector('span') || el;
    span.classList.add('shimmer-text');
  });

  /* ── NAV LINK CURSOR GROW ── */
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
    a.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
  });

  /* ── SMOOTH SECTION SCROLLING (via Lenis se disponível) ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { offset: -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70) });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── PORTFOLIO STICKY GALLERY — entrada dos itens ── */
  const portItemObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = Array.from(el.closest('.psg-col, .psg-sticky')?.children || [el]);
      const idx = siblings.indexOf(el);
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      }, idx * 80);
      portItemObserver.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.psg-wrap .port-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.96)';
    el.style.transition = 'opacity .5s cubic-bezier(0.22,1,0.36,1), transform .5s cubic-bezier(0.22,1,0.36,1)';
    portItemObserver.observe(el);
  });

  /* ── FORM INTERACTION MICRO-ANIMATIONS ── */
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    const label = input.closest('.form-group')?.querySelector('label');
    input.addEventListener('focus', () => {
      if (label) label.style.color = 'var(--gold)';
      input.style.borderColor = 'var(--gold)';
    });
    input.addEventListener('blur', () => {
      if (label) label.style.color = '';
      input.style.borderColor = '';
    });
  });

  /* ── REVEAL .about-text OVERRIDE ── */
  const aboutTextObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        aboutTextObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.about-text').forEach(el => aboutTextObserver.observe(el));

  /* ── SWIPER COVERFLOW — galeria mobile ── */
  (function () {
    if (typeof Swiper === 'undefined') return;
    if (!isMobile()) return;

    new Swiper('.port-swiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      slidesPerView: 'auto',
      spaceBetween: 24,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
        slideShadows: false,
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.port-swiper-pagination',
        clickable: true,
      },
    });
  })();

})();
