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

// Scroll shrink
window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', (window.pageYOffset || document.documentElement.scrollTop) > 10);
}, { passive: true });
