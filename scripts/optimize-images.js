// Converte todas as imagens PNG/JPG para WebP otimizado
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'img');

const configs = [
  // Hero: redimensionar para 1920px largo, qualidade alta mas comprimida
  { input: 'hero.png',                    output: 'hero.webp',    width: 1920, quality: 82 },
  // Open Graph: JPEG para compatibilidade com Facebook/LinkedIn
  { input: 'hero.png',                    output: 'hero-og.jpg',  width: 1200, quality: 85, format: 'jpeg' },
  // Logo local
  { input: 'logo.png',                    output: 'logo.webp',    width: 280,  quality: 88 },
  // Portfólio e sobre: máx 900px
  { input: '1_20260619_220347_0000.png',  output: '1.webp',       width: 900,  quality: 80 },
  { input: '3_20260619_220347_0002.png',  output: '3.webp',       width: 900,  quality: 80 },
  { input: '4_20260619_220347_0003.png',  output: '4.webp',       width: 900,  quality: 80 },
  { input: '5_20260619_220347_0004.png',  output: '5.webp',       width: 900,  quality: 80 },
  { input: '6_20260619_220347_0005.png',  output: '6.webp',       width: 900,  quality: 80 },
  { input: '7_20260619_220347_0006.png',  output: '7.webp',       width: 900,  quality: 80 },
  { input: '8_20260619_220347_0007.png',  output: '8.webp',       width: 900,  quality: 80 },
  { input: '9_20260619_220348_0008.png',  output: '9.webp',       width: 900,  quality: 80 },
  { input: '10_20260619_220348_0009.png', output: '10.webp',      width: 900,  quality: 80 },
  { input: '11_20260619_220348_0010.png', output: '11.webp',      width: 900,  quality: 80 },
  { input: '12_20260619_220348_0011.png', output: '12.webp',      width: 900,  quality: 80 },
  { input: '13_20260619_220348_0012.png', output: '13.webp',      width: 900,  quality: 80 },
  { input: '14_20260619_220348_0013.png', output: '14.webp',      width: 900,  quality: 80 },
  // Logos de clientes: manter pequenos
  { input: 'oab.png',                     output: 'oab.webp',     width: 240,  quality: 85 },
  { input: 'maccaferri.png',              output: 'maccaferri.webp', width: 240, quality: 85 },
];

async function run() {
  let saved = 0;
  for (const cfg of configs) {
    const inputPath  = path.join(imgDir, cfg.input);
    const outputPath = path.join(imgDir, cfg.output);
    if (!fs.existsSync(inputPath)) { console.log(`SKIP (not found): ${cfg.input}`); continue; }

    const before = fs.statSync(inputPath).size;
    const pipeline = sharp(inputPath).resize({ width: cfg.width, withoutEnlargement: true });
    if (cfg.format === 'jpeg') {
      pipeline.jpeg({ quality: cfg.quality, mozjpeg: true });
    } else {
      pipeline.webp({ quality: cfg.quality, effort: 6 });
    }
    await pipeline.toFile(outputPath);

    const after = fs.statSync(outputPath).size;
    const pct = Math.round((1 - after / before) * 100);
    saved += (before - after);
    console.log(`✓ ${cfg.input} → ${cfg.output}  ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB  (-${pct}%)`);
  }
  console.log(`\nTotal saved: ${(saved/1024/1024).toFixed(2)} MB`);
}

run().catch(console.error);
