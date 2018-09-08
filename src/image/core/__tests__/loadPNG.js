import { Image, load, getImage } from 'test/common';
import * as fs from 'fs';

describe('Load PNG', function () {
  const tests = [
    // ['name', components, alpha, bitDepth]
    ['grey8', 1, 0, 8],
    ['grey16', 1, 0, 16],
    ['greya16', 1, 1, 8],
    ['greya32', 1, 1, 16],
    ['rgb24', 3, 0, 8],
    ['rgb48', 3, 0, 16],
    ['rgba32', 3, 1, 8],
    ['rgba64', 3, 1, 16],
    ['plt-4bpp', 3, 0, 8],
    ['plt-8bpp-color', 3, 0, 8]
  ];

  tests.forEach(function (test) {
    it(`should load from path ${test[0]}`, function () {
      return load(`format/png/${test[0]}.png`).then(function (img) {
        expect(img.components).toBe(test[1]);
        expect(img.alpha).toBe(test[2]);
        expect(img.bitDepth).toBe(test[3]);
      });
    });

    it(`should load from buffer ${test[0]}`, function () {
      const data = fs.readFileSync(getImage(`format/png/${test[0]}.png`));
      return Image.load(data).then(function (img) {
        expect(img.components).toBe(test[1]);
        expect(img.alpha).toBe(test[2]);
        expect(img.bitDepth).toBe(test[3]);
      });
    });
  });
});
