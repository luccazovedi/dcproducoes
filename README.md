# DC Produções & Eventos

Site institucional da DC Produções — empresa especializada em produção de eventos corporativos, shows, festivais e audiovisual em São Paulo desde 2019.

## Stack

- HTML5 semântico + CSS modular + JavaScript vanilla (sem frameworks)
- Deploy via GitHub Pages com CDN Cloudflare
- Imagens otimizadas em WebP via script Sharp

## Estrutura

```
/
├── index.html          # Página principal
├── cookies.html        # Política de cookies
├── privacidade.html    # Política de privacidade
├── termos.html         # Termos de uso
├── css/
│   ├── base.css        # Reset, tokens e componentes globais
│   ├── nav.css         # Header e navegação
│   ├── hero.css        # Seção hero
│   ├── sections.css    # About, serviços, portfolio, clientes, stats
│   ├── testimonials.css
│   ├── contact.css     # Formulário de orçamento
│   ├── footer.css      # CTA e rodapé
│   ├── legal.css       # Páginas de política (cookies, privacidade, termos)
│   ├── transitions.css # Animações premium e scroll reveals
│   └── responsive.css  # Media queries
├── js/
│   ├── nav.js          # Comportamento do header (scroll, mobile)
│   ├── animations.js   # Animações de entrada (port-item stagger, drag-to-scroll)
│   ├── transitions.js  # Cursor, parallax, magnetic cards, contadores, Swiper mobile
│   ├── carousel.js     # Carrossel de depoimentos (desktop)
│   ├── form.js         # Formulário de orçamento (WhatsApp)
│   └── cookies.js      # Banner de cookies (usado em todas as páginas)
├── img/                # Assets em WebP (fontes .png/.jpg mantidas para reconversão)
│   ├── hero.webp       # Hero principal
│   ├── logo.webp / logo.png  # Logotipo (webp no conteúdo, png no favicon)
│   ├── hero-og.jpg     # Imagem Open Graph / Twitter Card
│   ├── 1.webp, 3.webp  # About — equipe e bastidores
│   ├── 4,9,10,11,12,15,16,17,18,19,20,21,22.webp  # Portfólio (galeria + carrossel mobile)
│   └── monster.webp, oab.webp, xiaomi.svg, baciodilatte.webp, maccaferri.webp,
│       aphrodite-egg-bank.png, oceanus.png, negrao.png  # Logos de clientes
├── scripts/
│   └── optimize-images.js  # Converte PNG → WebP com Sharp
├── sitemap.xml
├── robots.txt
├── llms.txt
└── _headers            # Headers HTTP (Cloudflare Pages)
```

## Otimização de imagens

```bash
npm install
node scripts/optimize-images.js
```

Converte imagens em `img/` para WebP com qualidade 85.

## Funcionalidades

- **SEO completo** — Schema.org, Open Graph, hreflang, sitemap com image sitemap, robots.txt, llms.txt
- **Core Web Vitals** — LCP otimizado, imagens lazy, CSS crítico inline, preload hero, scripts com `defer`
- **Transições premium** — scroll reveals, cursor customizado, parallax, magnetic cards, blue shimmer
- **Formulário** — envia orçamento direto via WhatsApp com campos condicionais
- **Cookies LGPD** — banner de consentimento com localStorage
- **Carrossel** — depoimentos reais (Google) com navegação e progress bar
- **Mobile-first** — layout responsivo, menu hamburger, cursor desativado em touch
