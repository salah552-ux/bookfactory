#!/usr/bin/env node
// Builds EPUB3 from manuscript-kdp.html
// Output: exports/final/manuscript-kdp.epub

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BOOK_DIR = path.resolve(__dirname);
const FINAL_DIR = path.join(BOOK_DIR, 'exports', 'final');
const EPUB_DIR = path.join(BOOK_DIR, 'exports', 'epub-build');
const OEBPS = path.join(EPUB_DIR, 'OEBPS');
const META_INF = path.join(EPUB_DIR, 'META-INF');
const IMAGES_DIR = path.join(OEBPS, 'images');

// Clean and create structure
if (fs.existsSync(EPUB_DIR)) fs.rmSync(EPUB_DIR, { recursive: true });
fs.mkdirSync(OEBPS, { recursive: true });
fs.mkdirSync(META_INF, { recursive: true });
fs.mkdirSync(IMAGES_DIR, { recursive: true });

// Read manuscript HTML
const manuscriptHtml = fs.readFileSync(path.join(FINAL_DIR, 'manuscript-kdp.html'), 'utf8');

// Extract body content (strip full HTML wrapper for EPUB content)
const bodyMatch = manuscriptHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
const bodyContent = bodyMatch ? bodyMatch[1] : manuscriptHtml;

// Extract CSS from manuscript
const styleMatch = manuscriptHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
const embeddedCss = styleMatch ? styleMatch[1] : '';

// Copy cover image
fs.copyFileSync(
  path.join(FINAL_DIR, 'cover-kdp-final.jpg'),
  path.join(IMAGES_DIR, 'cover.jpg')
);

// 1. mimetype (must be first, uncompressed)
fs.writeFileSync(path.join(EPUB_DIR, 'mimetype'), 'application/epub+zip', 'utf8');

// 2. META-INF/container.xml
fs.writeFileSync(path.join(META_INF, 'container.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:schemas:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
`, 'utf8');

// 3. OEBPS/content.opf
const opfContent = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:identifier id="book-id">fix-your-gut-for-good-2026</dc:identifier>
    <dc:title>Fix Your Gut for Good</dc:title>
    <dc:creator>S.A. Ibrahim</dc:creator>
    <dc:language>en</dc:language>
    <dc:date>2026</dc:date>
    <dc:subject>Health &amp; Fitness</dc:subject>
    <dc:description>The root-cause SIBO recovery protocol — a four-phase framework for people who have tried everything and are still sick.</dc:description>
    <meta property="dcterms:modified">2026-04-18T00:00:00Z</meta>
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
</package>
`;
fs.writeFileSync(path.join(OEBPS, 'content.opf'), opfContent, 'utf8');

// 4. Extract chapters for TOC — use existing div ids as anchors, h1 content as title
const chapters = [];
const sectionPattern = /<div[^>]*\sid="([^"]*)"[^>]*>\s*<h1[^>]*>([\s\S]*?)<\/h1>/gi;
let match;
while ((match = sectionPattern.exec(bodyContent)) !== null) {
  const id = match[1];
  const titleRaw = match[2].replace(/<[^>]+>/g, '').trim();
  if (titleRaw) chapters.push({ id, title: titleRaw });
}

// bodyContent is used as-is — div ids already serve as valid TOC anchors
const bodyContentWithIds = bodyContent;

// 5. nav.xhtml
const navItems = chapters.map(c =>
  `      <li><a href="content.xhtml#${c.id}">${c.title.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</a></li>`
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
</html>
`, 'utf8');

// 6. toc.ncx
const navPoints = chapters.map((c, i) => `  <navPoint id="navPoint-${i+1}" playOrder="${i+1}">
    <navLabel><text>${c.title.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text></navLabel>
    <content src="content.xhtml#${c.id}"/>
  </navPoint>`).join('\n');

fs.writeFileSync(path.join(OEBPS, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="fix-your-gut-for-good-2026"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>Fix Your Gut for Good</text></docTitle>
  <navMap>
${navPoints}
  </navMap>
</ncx>
`, 'utf8');

// 7. style.css
fs.writeFileSync(path.join(OEBPS, 'style.css'), embeddedCss || `
body { font-family: Georgia, serif; font-size: 1em; line-height: 1.6; margin: 0; padding: 0; }
h1, h2, h3 { font-family: "Libre Baskerville", Georgia, serif; }
h1 { font-size: 1.8em; margin-top: 2em; text-align: center; }
h2 { font-size: 1.3em; margin-top: 1.5em; }
p { margin: 0.5em 0 0.8em 0; text-align: justify; }
blockquote { border-left: 3px solid #ccc; margin-left: 1em; padding-left: 1em; font-style: italic; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; }
td, th { border: 1px solid #ccc; padding: 0.4em 0.6em; }
`, 'utf8');

// 8. content.xhtml — full book content (use bodyContentWithIds so TOC anchors resolve)
const contentXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Fix Your Gut for Good</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
${bodyContentWithIds}
</body>
</html>
`;
fs.writeFileSync(path.join(OEBPS, 'content.xhtml'), contentXhtml, 'utf8');

// 9. ZIP into EPUB
const epubOut = path.join(FINAL_DIR, 'manuscript-kdp.epub');
if (fs.existsSync(epubOut)) fs.unlinkSync(epubOut);

// Use PowerShell Compress-Archive (Windows — no zip command available)
try {
  // First add mimetype uncompressed (EPUB spec requires this)
  // PowerShell doesn't support store compression easily, so we use a workaround:
  // Build the zip with PowerShell then note the mimetype issue
  const psCmd = `powershell -Command "
    Set-Location '${EPUB_DIR.replace(/\//g, '\\\\')}';
    $items = Get-ChildItem -Recurse | Where-Object { !\\$_.PSIsContainer };
    Compress-Archive -Path '${EPUB_DIR.replace(/\//g, '\\\\')}\\\\*' -DestinationPath '${epubOut.replace(/\//g, '\\\\')}' -Force
  "`;
  execSync(psCmd, { stdio: 'pipe' });
  console.log('EPUB built (PowerShell): ' + epubOut);
  console.log('NOTE: mimetype entry may be compressed — valid for most readers but strictly non-conformant.');
  console.log('For fully conformant EPUB, install 7-zip and re-run with: 7z a -tzip -mx=0 manuscript-kdp.epub mimetype');
} catch (e) {
  console.error('ZIP failed:', e.message);
  process.exit(1);
}

// Verify
const stats = fs.statSync(epubOut);
console.log(`\nEPUB size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
console.log('Chapters found in TOC: ' + chapters.length);
chapters.forEach((c, i) => console.log(`  ${i+1}. ${c.title}`));

// Write build report
const report = `# EPUB Build Report
Generated: 2026-04-18

## Output
- File: exports/final/manuscript-kdp.epub
- Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB
- Chapters in TOC: ${chapters.length}

## EPUB3 Structure
- mimetype ✓
- META-INF/container.xml ✓
- OEBPS/content.opf ✓ (package manifest, spine, metadata)
- OEBPS/nav.xhtml ✓ (EPUB3 navigation document)
- OEBPS/toc.ncx ✓ (NCX for legacy reader compatibility)
- OEBPS/content.xhtml ✓ (full book content)
- OEBPS/images/cover.jpg ✓
- OEBPS/style.css ✓

## Compliance Notes
- mimetype compression: PowerShell Compress-Archive compresses all entries.
  Strict EPUB spec requires mimetype be the first entry, stored uncompressed.
  Amazon KDP's validator accepts compressed mimetype. Apple Books may warn.
  Fix: install 7-Zip and run: cd epub-build && 7z a -tzip -mx0 ../final/manuscript-kdp.epub mimetype && 7z a -tzip ../final/manuscript-kdp.epub . -xr!mimetype

## Chapter List
${chapters.map((c, i) => `${i+1}. ${c.title}`).join('\n')}
`;
fs.writeFileSync(path.join(FINAL_DIR, 'EPUB-BUILD-REPORT.md'), report, 'utf8');
console.log('\nEPUB-BUILD-REPORT.md written.');
