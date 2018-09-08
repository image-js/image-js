import { load } from 'test/common';

describe('Load TIFF', function () {
  const tests = [
    // ['name', components, alpha, bitDepth]
    ['grey8', 1, 0, 8],
    ['grey16', 1, 0, 16]
  ];

  tests.forEach(function (test) {
    it(test[0], function () {
      return load(`format/tif/${test[0]}.tif`).then(function (img) {
        expect(img.components).toBe(test[1]);
        expect(img.alpha).toBe(test[2]);
        expect(img.bitDepth).toBe(test[3]);
        expect(img.meta).toMatchObject({
          tiff: expect.any(Object),
          exif: expect.any(Object)
        });
      });
    });
  });
});
