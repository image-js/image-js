import { Image, load, getImage } from 'test/common';
import { readFileSync } from 'fs';

describe('Load JPEG', function () {
  const tests = [
    // ['name', components, alpha, bitDepth]
    ['grey6', 3, 1, 8],
    ['grey12', 3, 1, 8],
    ['rgb6', 3, 1, 8],
    ['rgb12', 3, 1, 8]
  ];

  tests.forEach(function (test) {
    it(`should load from path ${test[0]}`, function () {
      return load(`format/jpg/${test[0]}.jpg`).then(function (img) {
        expect(img.components).toBe(test[1]);
        expect(img.alpha).toBe(test[2]);
        expect(img.bitDepth).toBe(test[3]);
      });
    });

    it(`should load from buffer ${test[0]}`, function () {
      const data = readFileSync(getImage(`format/jpg/${test[0]}.jpg`));
      return Image.load(data).then(function (img) {
        expect(img.components).toBe(test[1]);
        expect(img.alpha).toBe(test[2]);
        expect(img.bitDepth).toBe(test[3]);
      });
    });
  });
});
