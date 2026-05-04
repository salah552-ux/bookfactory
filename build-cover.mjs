import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// KDP eBook cover spec
const KDP_WIDTH = 1600;
const KDP_HEIGHT = 2560;

const COVER_DIR = 'c:/Users/salah/BookFactory/books/fix-your-gut-for-good/exports/cover';
const INPUT = join(COVER_DIR, 'Keep_everything_exactly_202604170145.jpeg');
const OUTPUT = join(COVER_DIR, 'cover-kdp-final.jpg');

// The approved design is a mockup (landscape, book on grey background).
// We need to crop the book face from the mockup, then scale to KDP portrait spec.

sharp(INPUT)
  .metadata()
  .then(meta => {
    console.log(`Input: ${meta.width}x${meta.height}`);

    // The mockup has grey padding around the book.
    // Crop to the book face — estimated from visual inspection of the 1376x768 mockup.
    // Book face occupies roughly center 62% width, 88% height.
    const cropLeft   = Math.round(meta.width * 0.330);
    const cropTop    = Math.round(meta.height * 0.040);
    const cropWidth  = Math.round(meta.width * 0.355);
    const cropHeight = Math.round(meta.height * 0.920);

    console.log(`Cropping to book face: ${cropWidth}x${cropHeight} from (${cropLeft}, ${cropTop})`);

    return sharp(INPUT)
      .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
      .resize(KDP_WIDTH, KDP_HEIGHT, {
        fit: 'fill',
        kernel: sharp.kernel.lanczos3,
      })
      .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
      .toFile(OUTPUT);
  })
  .then(info => {
    console.log(`\n✅ KDP cover saved: ${OUTPUT}`);
    console.log(`   Dimensions: ${info.width}x${info.height}px`);
    console.log(`   File size: ${Math.round(info.size / 1024)}KB`);
    console.log(`   KDP minimum: 1600x2560px ✓`);
  })
  .catch(err => console.error('Error:', err.message));
