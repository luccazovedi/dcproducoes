// Port-item stagger delays (animação via CSS fadeInScale)
document.querySelectorAll('.port-item').forEach((item, index) => {
  item.style.animationDelay = `${index * 120}ms`;
});

// about-text: observed via transitions.js (classe .visible)
