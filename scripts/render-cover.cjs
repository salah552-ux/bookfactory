const puppeteer = require('C:/Users/salah/AppData/Roaming/npm/node_modules/md-to-pdf/node_modules/puppeteer');
const sharp     = require('sharp');
const { mkdirSync, statSync } = require('fs');
const { resolve } = require('path');

const HTML   = resolve('books/untitled-cosy-mystery/exports/cover.html');
const TMPOUT = resolve('books/untitled-cosy-mystery/exports/cover-rendered.png');
const FINAL  = resolve('books/untitled-cosy-mystery/exports/final/cover-kdp.jpg');

mkdirSync('books/untitled-cosy-mystery/exports/final', { recursive: true });

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page    = await browser.newPage();

  await page.setViewport({ width: 1600, height: 2560, deviceScaleFactor: 1 });
  await page.goto('file:///' + HTML.replace(/\\/g, '/'), { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000)); // wait for Google Font

  console.log('Rendering cover...');
  await page.screenshot({ path: TMPOUT, fullPage: false, type: 'png' });
  await browser.close();
  console.log('PNG saved:', TMPOUT);

  await sharp(TMPOUT)
    .resize(1600, 2560, { fit: 'fill' })
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(FINAL);

  const meta = await sharp(FINAL).metadata();
  const size = statSync(FINAL).size;
  const p = (ok, l) => console.log(ok ? '✓' : '✗', l);
  console.log('\n── KDP Compliance ──');
  p(meta.format === 'jpeg',                           'Format: ' + meta.format);
  p(meta.width  === 1600,                             'Width: ' + meta.width);
  p(meta.height === 2560,                             'Height: ' + meta.height);
  p(meta.space  === 'srgb',                           'Color space: ' + meta.space);
  p(meta.channels === 3,                              'Channels: ' + meta.channels);
  p(meta.hasAlpha === false,                          'Has alpha: ' + meta.hasAlpha);
  p(size < 50*1024*1024,                              'Size: ' + (size/1024/1024).toFixed(2) + 'MB');
  p(Math.round(meta.height/meta.width*10)/10 === 1.6, 'Ratio: ' + (meta.height/meta.width).toFixed(4));
  console.log('\n✓ Final cover:', FINAL);
})();
