const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BOOK     = 'books/untitled-cosy-mystery';
const FINAL    = path.join(BOOK, 'exports/final');
const BUILD    = path.join(BOOK, 'exports/epub-build');
const OEBPS    = path.join(BUILD, 'OEBPS');
const META_INF = path.join(BUILD, 'META-INF');
const IMAGES   = path.join(OEBPS, 'images');
const OUT_EPUB = path.join(FINAL, 'manuscript-kdp.epub');

// ── Create directory structure ────────────────────────────────────────────────
[BUILD, OEBPS, META_INF, IMAGES].forEach(d => fs.mkdirSync(d, { recursive: true }));

// ── Read assembled HTML ───────────────────────────────────────────────────────
const srcHtml = fs.readFileSync(path.join(FINAL, 'manuscript-kdp.html'), 'utf8');

// Extract body content
const bodyMatch = srcHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) { console.error('Could not extract body from HTML'); process.exit(1); }
const bodyContent = bodyMatch[1].trim();

// Extract chapter IDs and titles for TOC
const chapterRegex = /<div class="chapter" id="(chapter-\d+)">\s*\n?<h1>([^<]+)<\/h1>/g;
const chapters = [];
let m;
while ((m = chapterRegex.exec(bodyContent)) !== null) {
  chapters.push({ id: m[1], title: m[2].trim() });
}
console.log(`Found ${chapters.length} chapters for TOC`);

// ── mimetype ──────────────────────────────────────────────────────────────────
fs.writeFileSync(path.join(BUILD, 'mimetype'), 'application/epub+zip', 'utf8');

// ── META-INF/container.xml ────────────────────────────────────────────────────
fs.writeFileSync(path.join(META_INF, 'container.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:schemas:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`, 'utf8');

// ── OEBPS/style.css ───────────────────────────────────────────────────────────
fs.writeFileSync(path.join(OEBPS, 'style.css'), `body { font-family: serif; font-size: 1em; line-height: 1.7; margin: 0; padding: 0; color: #000; }
h1 { font-size: 1.8em; font-weight: bold; margin-top: 3em; margin-bottom: 0.5em; page-break-before: always; line-height: 1.2; }
h2 { font-size: 1.3em; font-weight: bold; margin-top: 2em; margin-bottom: 0.4em; }
h3 { font-size: 1.1em; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.3em; }
p { margin: 0; padding: 0; text-indent: 1.5em; }
h1 + p, h2 + p, h3 + p { text-indent: 0; }
.chapter > p:first-of-type { text-indent: 0; }
hr { border: none; border-top: 1pt solid #bbb; margin: 1.5em auto; width: 4em; }
img { max-width: 100%; }
.title-page { text-align: center; page-break-after: always; padding: 3em 0; }
.copyright { font-size: 0.85em; color: #555; page-break-after: always; }
.back-matter { page-break-before: always; }
.chapter { page-break-before: always; }`, 'utf8');

// ── OEBPS/content.xhtml ───────────────────────────────────────────────────────
fs.writeFileSync(path.join(OEBPS, 'content.xhtml'), `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en-GB">
<head>
  <meta charset="UTF-8"/>
  <title>Death in the Cathedral Close</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
${bodyContent}
</body>
</html>`, 'utf8');

// ── OEBPS/nav.xhtml ───────────────────────────────────────────────────────────
const navItems = chapters.map(ch =>
  `      <li><a href="content.xhtml#${ch.id}">${ch.title}</a></li>`
).join('\n');

fs.writeFileSync(path.join(OEBPS, 'nav.xhtml'), `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Table of Contents</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Table of Contents</h1>
    <ol>
${navItems}
    </ol>
  </nav>
</body>
</html>`, 'utf8');

// ── OEBPS/toc.ncx ─────────────────────────────────────────────────────────────
const ncxPoints = chapters.map((ch, i) => `  <navPoint id="navPoint-${i+1}" playOrder="${i+1}">
    <navLabel><text>${ch.title}</text></navLabel>
    <content src="content.xhtml#${ch.id}"/>
  </navPoint>`).join('\n');

fs.writeFileSync(path.join(OEBPS, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="death-in-the-cathedral-close-2026"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>Death in the Cathedral Close</text></docTitle>
  <navMap>
${ncxPoints}
  </navMap>
</ncx>`, 'utf8');

// ── OEBPS/content.opf ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(OEBPS, 'content.opf'), `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:identifier id="book-id">death-in-the-cathedral-close-2026</dc:identifier>
    <dc:title>Death in the Cathedral Close</dc:title>
    <dc:creator>S. A. Ibrahim</dc:creator>
    <dc:language>en-GB</dc:language>
    <dc:date>2026</dc:date>
    <dc:subject>Fiction; Mystery; Cozy Mystery; British Mystery</dc:subject>
    <dc:description>A retired forensic pathologist and a cathedral lawyer investigate a murder in a medieval English cathedral close. Book 1 of The Cathedral Close Mysteries.</dc:description>
    <meta property="dcterms:modified">2026-04-28T00:00:00Z</meta>
    <meta name="cover" content="cover-image"/>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
    <item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>
    <item id="stylesheet" href="style.css" media-type="text/css"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="nav"/>
    <itemref idref="content"/>
  </spine>
  <guide>
    <reference type="cover" title="Cover" href="images/cover.jpg"/>
    <reference type="toc" title="Table of Contents" href="nav.xhtml"/>
    <reference type="text" title="Begin Reading" href="content.xhtml"/>
  </guide>
</package>`, 'utf8');

// ── Copy cover image ──────────────────────────────────────────────────────────
fs.copyFileSync(
  path.join(FINAL, 'cover-kdp.jpg'),
  path.join(IMAGES, 'cover.jpg')
);
console.log('Cover copied');

// ── Package as EPUB using PowerShell Compress-Archive ────────────────────────
if (fs.existsSync(OUT_EPUB)) fs.unlinkSync(OUT_EPUB);

const buildAbs = path.resolve(BUILD);
const epubAbs  = path.resolve(OUT_EPUB);

// Write a temp PS1 script to avoid quoting/newline issues
const zipAbs = epubAbs.replace(/\.epub$/, '.zip');
if (fs.existsSync(zipAbs)) fs.unlinkSync(zipAbs);

const ps1 = `Set-Location "${buildAbs}"
Compress-Archive -Path "mimetype" -DestinationPath "${zipAbs}" -CompressionLevel NoCompression
Compress-Archive -Path "META-INF","OEBPS" -DestinationPath "${zipAbs}" -Update
Write-Host "Done"
`;
const ps1Path = path.resolve('scripts/_epub-pack.ps1');
fs.writeFileSync(ps1Path, ps1, 'utf8');
execSync(`powershell -ExecutionPolicy Bypass -File "${ps1Path}"`, { stdio: 'inherit' });
fs.unlinkSync(ps1Path);
// Rename .zip → .epub
fs.renameSync(zipAbs, epubAbs);

// ── Verify output ─────────────────────────────────────────────────────────────
const epubSize = fs.statSync(OUT_EPUB).size;
console.log(`\n✓ manuscript-kdp.epub written`);
console.log(`  Size: ${(epubSize / 1024).toFixed(1)} KB`);
console.log(`  Chapters in TOC: ${chapters.length}`);
console.log(`  Path: ${path.resolve(OUT_EPUB)}`);
