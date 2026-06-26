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
})();
