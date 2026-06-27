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
│   ├── transitions.css # Animações premium e scroll reveals
│   └── responsive.css  # Media queries
├── js/
│   ├── main.js         # Inicialização geral
│   ├── nav.js          # Comportamento do header (scroll, mobile)
│   ├── animations.js   # Animações de entrada (port-item stagger)
│   ├── transitions.js  # Cursor, parallax, magnetic cards, contadores
│   ├── carousel.js     # Carrossel de depoimentos
│   ├── form.js         # Formulário de orçamento (WhatsApp)
│   └── cookies.js      # Banner de cookies
├── img/                # Assets WebP otimizados
│   ├── hero.webp       # Hero principal
│   ├── logo.webp       # Logotipo
│   ├── 1.webp          # About — equipe em evento
│   ├── 3.webp          # About — bastidores
│   ├── 4.webp          # Portfólio — audiovisual
│   ├── 9.webp          # Portfólio — cenografia
│   ├── 10.webp         # Portfólio — palco e iluminação
│   ├── 11.webp         # Portfólio — buffet e catering
│   ├── 12.webp         # Portfólio — corporativo
│   ├── 15.webp         # Portfólio — ao vivo com público
│   ├── 16.webp         # Portfólio — cerimônia e recepção
│   ├── 17.webp         # Portfólio — bastidores (making of)
│   ├── 18.webp         # Portfólio — evento social
│   ├── 19.webp         # Portfólio — palco/estrutura grande porte
│   ├── 20.webp         # Portfólio — iluminação profissional
│   ├── 21.webp         # Portfólio — vista panorâmica
│   ├── 22.webp         # Portfólio — evento exclusivo
│   ├── 23.webp         # Portfólio — adicional
│   ├── monster.webp    # Logo cliente Monster
│   ├── baciodilatte.webp # Logo cliente Bacio di Latte
│   ├── oab.webp        # Logo cliente OAB
│   └── maccaferri.webp # Logo cliente Maccaferri
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
- **Core Web Vitals** — LCP otimizado, imagens lazy, CSS crítico inline, preload hero
- **Transições premium** — scroll reveals, cursor customizado, parallax, magnetic cards, gold shimmer
- **Formulário** — envia orçamento direto via WhatsApp com campos condicionais
- **Cookies LGPD** — banner de consentimento com localStorage
- **Carrossel** — depoimentos com navegação e progress bar
- **Mobile-first** — layout responsivo, menu hamburger, cursor desativado em touch
