// generate some variations of the alphabet image for feature matching
import { join } from 'node:path';

import { readSync, writeSync } from '../../src/index.js';

const basePath = join(
  import.meta.dirname,
  '../test/img/featureMatching/polygons',
);

console.log(basePath);

const original = readSync(`${basePath}/betterScaleneTriangle.png`);

const angles = [2, 10, 90, 180];
for (const angle of angles) {
  const rotated = original.transformRotate(angle, { fullImage: true });
  writeSync(`${basePath}/scaleneTriangle${angle}.png`, rotated);
}

// const translations = [10, 20, 50];
// const empty = new Image(original.width + 100, original.height + 100, {
//   colorModel: 'RGBA',
// }).fill(100);

// for (let translation of translations) {
//   const translated = original.copyTo(empty, {
//     origin: { column: 50, row: translation },
//   });
//   writeSync(
//     `../test/img/featureMatching/alphabetTranslated${translation}.jpg`,
//     translated,
//   );
// }
