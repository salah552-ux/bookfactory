const fs = require('fs');
const path = require('path');

const BOOK = 'books/untitled-cosy-mystery';
const MANUSCRIPT = path.join(BOOK, 'manuscript');
const OUT_DIR = path.join(BOOK, 'exports/final');
const OUT_HTML = path.join(OUT_DIR, 'manuscript-kdp.html');

fs.mkdirSync(OUT_DIR, { recursive: true });

// Basic markdown → HTML converter (covers patterns used in this book)
function mdToHtml(md, chapterBreak = false) {
  let html = md
    // Strip metadata footer lines
    .replace(/^\*Word count:.*Status:.*APPROVED\*$/gm, '')
    // Headings
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    // Bold + italic combined
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr>')
    // Remove blank lines around headings/hr (will be re-paragraphed)
    .trim();

  // Split into blocks and wrap paragraphs
  const blocks = html.split(/\n{2,}/);
  const result = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<h') || block.startsWith('<hr')) return block;
    // Multi-line paragraph: join lines
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean).join(' ');
    if (!lines) return '';
    return `<p>${lines}</p>`;
  }).filter(Boolean).join('\n');

  return result;
}

// Read KDP-LISTING.md for metadata
const listing = fs.readFileSync(path.join(BOOK, 'KDP-LISTING.md'), 'utf8');

// Extract title, subtitle, author from listing
const titleMatch = listing.match(/\*\*Death in the Cathedral Close\*\*/);
const title = 'Death in the Cathedral Close';
const series = 'The Cathedral Close Mysteries';
const author = 'S. A. Ibrahim';

// Read copyright page
const copyright = fs.readFileSync(path.join(MANUSCRIPT, '00-00-copyright.md'), 'utf8');

// Read all chapters in order
const chapterFiles = fs.readdirSync(MANUSCRIPT)
  .filter(f => f.match(/^ch-\d+\.md$/))
  .sort();

console.log(`Found ${chapterFiles.length} chapter files`);

// Extract chapter titles for TOC
const chapters = chapterFiles.map(f => {
  const content = fs.readFileSync(path.join(MANUSCRIPT, f), 'utf8');
  const titleMatch = content.match(/^#+ (.+)$/m);
  const chTitle = titleMatch ? titleMatch[1].trim() : f.replace('.md', '');
  const id = f.replace('.md', '').replace('ch-', 'chapter-');
  return { file: f, id, title: chTitle, content };
});

// Read back matter
const backMatter = fs.readFileSync(path.join(MANUSCRIPT, '99-back-matter.md'), 'utf8');

// ── Build HTML ────────────────────────────────────────────────────────────────

const tocItems = chapters.map(ch =>
  `    <li><a href="#${ch.id}">${ch.title}</a></li>`
).join('\n');

const chaptersHtml = chapters.map(ch => {
  const html = mdToHtml(ch.content, true);
  return `<div class="chapter" id="${ch.id}">\n${html}\n</div>`;
}).join('\n\n');

const html = `<!DOCTYPE html>
<html xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body {
      font-family: 'EB Garamond', Georgia, serif;
      font-size: 11pt;
      line-height: 1.7;
      color: #1a1a1a;
      max-width: 32em;
      margin: 0 auto;
      padding: 0 1em;
    }
    h1 {
      font-family: 'Libre Baskerville', Georgia, serif;
      font-size: 20pt;
      font-weight: 700;
      margin: 2em 0 0.75em;
      line-height: 1.2;
      page-break-before: always;
    }
    h2 {
      font-family: 'Libre Baskerville', Georgia, serif;
      font-size: 14pt;
      font-weight: 700;
      margin: 1.5em 0 0.5em;
    }
    h3 {
      font-family: 'Libre Baskerville', Georgia, serif;
      font-size: 12pt;
      font-weight: 700;
      margin: 1.2em 0 0.4em;
    }
    p {
      margin: 0 0 0.5em 0;
      text-indent: 1.5em;
    }
    h1 + p, h2 + p, h3 + p, .chapter > p:first-of-type {
      text-indent: 0;
    }
    hr {
      border: none;
      border-top: 1pt solid #bbb;
      margin: 1.5em auto;
      width: 4em;
    }
    .title-page {
      text-align: center;
      padding: 4em 0 3em;
      page-break-after: always;
    }
    .title-page .series-label {
      font-size: 9pt;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #888;
      margin-bottom: 1em;
    }
    .title-page h1 {
      font-size: 26pt;
      page-break-before: avoid;
      margin: 0 0 0.25em;
    }
    .title-page .author {
      font-size: 12pt;
      letter-spacing: 0.1em;
      margin-top: 2em;
    }
    .title-page .rule {
      width: 3em;
      height: 1px;
      background: #888;
      margin: 1.5em auto;
    }
    nav { page-break-after: always; }
    nav h2 { page-break-before: always; }
    nav ol { list-style: none; padding: 0; }
    nav ol li { padding: 0.25em 0; border-bottom: 0.5pt solid #eee; }
    nav ol li a { text-decoration: none; color: #1a1a1a; }
    .copyright { font-size: 9pt; color: #555; page-break-after: always; }
    .back-matter { page-break-before: always; }
    .chapter { page-break-before: always; }
  </style>
</head>
<body>

<!-- TITLE PAGE -->
<div class="title-page">
  <p class="series-label">${series}</p>
  <h1>${title}</h1>
  <div class="rule"></div>
  <p class="author">${author}</p>
</div>

<!-- COPYRIGHT PAGE -->
<div class="copyright">
${mdToHtml(copyright)}
</div>

<!-- TABLE OF CONTENTS -->
<nav epub:type="toc" id="toc">
  <h2>Contents</h2>
  <ol>
${tocItems}
  </ol>
</nav>

<!-- CHAPTERS -->
${chaptersHtml}

<!-- BACK MATTER -->
<div class="back-matter">
${mdToHtml(backMatter)}
</div>

</body>
</html>`;

fs.writeFileSync(OUT_HTML, html, 'utf8');

const size = fs.statSync(OUT_HTML).size;
console.log(`\n✓ manuscript-kdp.html written`);
console.log(`  Size: ${(size / 1024).toFixed(1)} KB`);
console.log(`  Chapters: ${chapters.length}`);
console.log(`  Path: ${path.resolve(OUT_HTML)}`);
