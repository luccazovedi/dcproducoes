// ── DC Produções — Gerenciador de Consentimento LGPD ──

const COOKIE_KEY = 'dc_cookie_consent';
const COOKIE_DAYS = 365;

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce(function(acc, pair) {
    const [k, v] = pair.split('=');
    return k === name ? decodeURIComponent(v) : acc;
  }, null);
}

function getConsent() {
  try { return JSON.parse(getCookie(COOKIE_KEY)); } catch { return null; }
}

function saveConsent(prefs) {
  prefs.date = new Date().toISOString();
  setCookie(COOKIE_KEY, JSON.stringify(prefs), COOKIE_DAYS);
}

function applyConsent(prefs) {
  // Analytics — adicionar scripts de rastreamento aqui quando necessário
  // if (prefs.analytics) { /* carregar GA, etc. */ }
}

function hideBanner() {
  const banner = document.getElementById('cookieBanner');
  const details = document.getElementById('cookieDetails');
  if (banner) {
    banner.classList.add('cookie-hide');
    setTimeout(function() { banner.style.display = 'none'; }, 400);
  }
  if (details) details.style.display = 'none';
}

function showDetails() {
  const details = document.getElementById('cookieDetails');
  const btn = document.querySelector('.cookie-btn--customize');
  if (details) {
    const isVisible = getComputedStyle(details).display !== 'none';
    details.style.display = isVisible ? 'none' : 'block';
    if (btn) btn.textContent = isVisible ? 'Personalizar' : 'Fechar ▲';
  }
}

function acceptAll() {
  const prefs = { essential: true, analytics: true, marketing: true };
  saveConsent(prefs);
  applyConsent(prefs);
  hideBanner();
}

function acceptEssential() {
  const prefs = { essential: true, analytics: false, marketing: false };
  saveConsent(prefs);
  applyConsent(prefs);
  hideBanner();
}

function saveCustom() {
  const prefs = {
    essential: true,
    analytics: document.getElementById('ck-analytics') ? document.getElementById('ck-analytics').checked : false,
    marketing: document.getElementById('ck-marketing') ? document.getElementById('ck-marketing').checked : false,
  };
  saveConsent(prefs);
  applyConsent(prefs);
  hideBanner();
}

// Inicializa
document.addEventListener('DOMContentLoaded', function() {
  const existing = getConsent();
  if (existing) {
    applyConsent(existing);
    return;
  }

  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.style.display = 'flex';
    setTimeout(function() { banner.classList.add('cookie-show'); }, 100);
  }
});
