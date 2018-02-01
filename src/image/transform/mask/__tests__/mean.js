import { load } from 'test/common';

import mean from '../mean';

describe('Mean threshold', function () {
  it('Should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(mean(img.histogram, img.size)).toBe(106);
    });
  });
});
