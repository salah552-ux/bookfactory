import sharp from 'sharp';
import { mkdirSync, statSync } from 'fs';

const SRC   = 'books/untitled-cosy-mystery/exports/cover-master.png';
const OUT   = 'books/untitled-cosy-mystery/exports/final/cover-kdp.jpg';
const W = 941, H = 1672;
const GOLD  = '#C9A84C';

// ── Step 1: Cover the misplaced series label (y=235–350) ─────────────────────
// Strategy: blur heavily then darken with an SVG rect to match the stone colour
const labelRegion = await sharp(SRC)
  .extract({ left: 0, top: 235, width: W, height: 115 })
  .blur(30)
  .modulate({ brightness: 0.55 })   // darken to match surrounding stone
  .toBuffer();

const withLabelRemoved = await sharp(SRC)
  .composite([{ input: labelRegion, left: 0, top: 235 }])
  .toBuffer();

// ── Step 2: Add series label at the TOP (design brief spec) ──────────────────
// Baseline y=100 → top of text ≈ y=60 (6.4% from top — inside safe zone)
// At W=941: font-size 34px italic serif, gold, centred
const svgTop = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .series {
      font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;
      font-size: 34px;
      font-style: italic;
      fill: ${GOLD};
      text-anchor: middle;
      letter-spacing: 2px;
    }
  </style>
  <text class="series" x="${W / 2}" y="100">The Cathedral Close Mysteries</text>
</svg>`;

const withLabel = await sharp(withLabelRemoved)
  .composite([{ input: Buffer.from(svgTop), gravity: 'northwest' }])
  .toBuffer();

// ── Step 3: Resize to KDP spec and save ──────────────────────────────────────
mkdirSync('books/untitled-cosy-mystery/exports/final', { recursive: true });

await sharp(withLabel)
  .resize(1600, 2560, { fit: 'fill' })
  .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
  .toFile(OUT);

// ── Step 4: Compliance checks ─────────────────────────────────────────────────
const meta = await sharp(OUT).metadata();
const size = statSync(OUT).size;
const p = (ok, l) => console.log(ok ? '✓' : '✗', l);
console.log('\n── KDP Compliance ──');
p(meta.format === 'jpeg',                         'Format: ' + meta.format);
p(meta.width === 1600,                            'Width: ' + meta.width);
p(meta.height === 2560,                           'Height: ' + meta.height);
p(meta.space === 'srgb',                          'Color space: ' + meta.space);
p(meta.channels === 3,                            'Channels: ' + meta.channels);
p(meta.hasAlpha === false,                        'Has alpha: ' + meta.hasAlpha);
p(size < 50 * 1024 * 1024,                       'Size: ' + (size/1024/1024).toFixed(2) + 'MB');
p(Math.round(meta.height/meta.width*10)/10===1.6,'Ratio: ' + (meta.height/meta.width).toFixed(4));
console.log('\nSaved:', OUT);
