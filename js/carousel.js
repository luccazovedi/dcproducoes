/* ── DRAG-TO-SCROLL (mouse) ──────────────────────────────────────
   Funciona em dois modos:
   • scroll  — para elementos com overflow-x:auto (psg-wrap)
   • transform — para tracks movidos por translateX (test-track)
   ────────────────────────────────────────────────────────────── */
function makeDraggable(el, opts) {
  opts = opts || {};
  const mode = opts.mode || 'scroll'; // 'scroll' | 'transform'
  let isDown = false, startX = 0, startVal = 0, velX = 0, lastX = 0, rafId;

  function getTranslateX() {
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    return m.m41;
  }

  el.style.cursor = 'grab';

  el.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    isDown  = true;
    startX  = e.pageX;
    lastX   = e.pageX;
    velX    = 0;
    startVal = mode === 'scroll' ? el.scrollLeft : getTranslateX();
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
    cancelAnimationFrame(rafId);
    e.preventDefault();
  });

  window.addEventListener('mousemove', function (e) {
    if (!isDown) return;
    const dx = e.pageX - startX;
    velX = e.pageX - lastX;
    lastX = e.pageX;
    if (mode === 'scroll') {
      el.scrollLeft = startVal - dx;
    } else {
      if (opts.clamp) {
        const next = startVal + dx;
        const min  = opts.clamp.min !== undefined ? opts.clamp.min : -Infinity;
        const max  = opts.clamp.max !== undefined ? opts.clamp.max : Infinity;
        el.style.transform = `translateX(${Math.max(min, Math.min(max, next))}px)`;
      } else {
        el.style.transform = `translateX(${startVal + dx}px)`;
      }
    }
  });

  function onUp(e) {
    if (!isDown) return;
    isDown = false;
    el.style.cursor = 'grab';
    el.style.userSelect = '';

    /* momentum suave */
    if (Math.abs(velX) > 2) {
      let v = velX * 0.85;
      function momentum() {
        if (Math.abs(v) < 0.5) return;
        if (mode === 'scroll') {
          el.scrollLeft -= v;
        } else {
          const cur = getTranslateX();
          const next = cur + v;
          if (opts.clamp) {
            const min = opts.clamp.min !== undefined ? opts.clamp.min : -Infinity;
            const max = opts.clamp.max !== undefined ? opts.clamp.max : Infinity;
            if (next < min || next > max) { v = 0; return; }
          }
          el.style.transform = `translateX(${next}px)`;
        }
        v *= 0.88;
        rafId = requestAnimationFrame(momentum);
      }
      rafId = requestAnimationFrame(momentum);
    }

    /* snap para o slide mais próximo (modo scroll) */
    if (mode === 'scroll' && opts.snapCallback) opts.snapCallback();
  }

  window.addEventListener('mouseup',   onUp);
  window.addEventListener('mouseleave', onUp);

  /* Impede click acidental após drag */
  el.addEventListener('click', function (e) {
    if (Math.abs(el.scrollLeft - startVal) > 4 || Math.abs(getTranslateX() - startVal) > 4) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

/* ── Aplica drag no grid desktop de projetos ── */
(function () {
  const wrap = document.querySelector('.psg-desktop');
  if (!wrap) return;
  makeDraggable(wrap, { mode: 'scroll' });
})();

// Testimonials carousel
(function () {
  const track       = document.getElementById('testTrack');
  const prevBtn     = document.getElementById('testPrev');
  const nextBtn     = document.getElementById('testNext');
  const progressFill  = document.getElementById('testProgress');
  const currentLabel  = document.getElementById('testCurrent');
  const totalLabel    = document.getElementById('testTotal');
  if (!track) return;

  const cards   = Array.from(track.querySelectorAll('.test-card'));
  const total   = cards.length;
  let current   = 0;
  let perView   = 4;
  const gap     = 16;
  let autoTimer;

  function getPerView() {
    const w = window.innerWidth;
    if (w < 600)  return 1;
    if (w < 900)  return 2;
    if (w < 1200) return 3;
    return 4;
  }

  function updateUI() {
    const pages = Math.ceil(total / perView);
    const page  = Math.floor(current / perView);
    const pct   = pages <= 1 ? 100 : ((page + 1) / pages) * 100;
    if (progressFill) progressFill.style.width = pct + '%';
    if (currentLabel) currentLabel.textContent = page + 1;
    if (totalLabel)   totalLabel.textContent   = pages;
  }

  function updateSizes() {
    perView = getPerView();
    const wrap   = track.parentElement;
    const cardW  = (wrap.offsetWidth - gap * (perView - 1)) / perView;
    cards.forEach(c => { c.style.flex = `0 0 ${cardW}px`; c.style.minWidth = `${cardW}px`; });
    track.style.gap = gap + 'px';
    current = 0;
    track.style.transform = 'translateX(0)';
    updateUI();
  }

  function goTo(idx) {
    const pages = Math.ceil(total / perView);
    let page = Math.floor(idx / perView);
    if (page >= pages) page = 0;
    if (page < 0)      page = pages - 1;
    current = Math.min(page * perView, total - perView);
    current = Math.max(0, current);
    const cardW  = (track.parentElement.offsetWidth - gap * (perView - 1)) / perView;
    track.style.transform = `translateX(-${current * (cardW + gap)}px)`;
    updateUI();
  }

  function next() { goTo(current + perView); }
  function prev() { goTo(current - perView); }
  function resetAuto() { clearInterval(autoTimer); autoTimer = setInterval(next, 6000); }

  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetAuto(); }
  });

  updateSizes();
  window.addEventListener('resize', updateSizes, { passive: true });
  resetAuto();

  /* Drag com mouse — desativa transição durante arrasto e faz snap ao soltar */
  (function () {
    let isDragging = false;
    let dragStartX = 0;
    let dragStartTranslate = 0;
    let lastDragX = 0;
    let velX = 0;
    let rafId;

    function getTranslateX() {
      return new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
    }

    function applyClamp(val) {
      const cardW = (track.parentElement.offsetWidth - gap * (perView - 1)) / perView;
      const maxOffset = -(total - perView) * (cardW + gap);
      return Math.max(maxOffset, Math.min(0, val));
    }

    function snapToNearest(fromVelocity) {
      cancelAnimationFrame(rafId);
      track.classList.remove('is-dragging');

      const cardW = (track.parentElement.offsetWidth - gap * (perView - 1)) / perView;
      const slideWidth = cardW + gap;
      let curX = getTranslateX();

      /* projeta um pouco com a velocidade antes de calcular o snap */
      curX = applyClamp(curX + fromVelocity * 3.5);

      const idx = Math.round(-curX / slideWidth);
      goTo(Math.max(0, Math.min(idx, total - perView)));
      resetAuto();
    }

    track.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      cancelAnimationFrame(rafId);
      isDragging = true;
      dragStartX = e.pageX;
      lastDragX  = e.pageX;
      velX = 0;
      dragStartTranslate = getTranslateX();
      track.classList.add('is-dragging');
      track.style.cursor = 'grabbing';
      e.preventDefault();
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      const dx = e.pageX - dragStartX;
      velX = e.pageX - lastDragX;
      lastDragX = e.pageX;
      track.style.transform = `translateX(${applyClamp(dragStartTranslate + dx)}px)`;
    });

    function onUp() {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = 'grab';
      snapToNearest(velX);
    }

    window.addEventListener('mouseup',    onUp);
    window.addEventListener('mouseleave', onUp);

    /* bloqueia click acidental após drag */
    track.addEventListener('click', function (e) {
      if (Math.abs(getTranslateX() - dragStartTranslate) > 5) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  })();
})();
