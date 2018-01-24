import { load } from 'test/common';
import { methods } from '../maskAlgorithms';

// if the values are the same as in imageJ we consider it as currently correct
// TODO not obivious that those algorithms can deal with 16 bits images !

/*
Here are the results from imageJ

 Default: 134
 Huang: 134
 Intermodes: 166
 IsoData: 135
 Li: 115
 MaxEntropy: 126
 Mean: 106
 MinError(I): 101
 Minimum: 234
 Moments: 127
 Otsu: 135
 Percentile: 90
 RenyiEntropy: 115
 Shanbhag: 116
 Triangle: 87
 Yen: 108
*/

describe('Threshold calculation', function () {
  it.skip('Huang should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.huang(img.histogram)).toBe(134);
    });
  });

  it('Intermodes should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.intermodes(img.histogram)).toBe(166);
    });
  });

  it('Isodata should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.isodata(img.histogram)).toBe(135);
    });
  });

  it('Percentile should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.percentile(img.histogram)).toBe(90);
    });
  });

  it.skip('Li should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.li(img.histogram)).toBe(115);
    });
  });

  it.skip('MaxEntropy should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.maxEntropy(img.histogram)).toBe(126);
    });
  });

  it.skip('Mean should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.mean(img.histogram)).toBe(106);
    });
  });

  it.skip('MinError should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.minError(img.histogram)).toBe(101);
    });
  });

  it('Minimum should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.minimum(img.histogram)).toBe(234);
    });
  });

  it.skip('Moments should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.moments(img.histogram)).toBe(127);
    });
  });

  it.skip('Otsu should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.otsu(img.histogram)).toBe(135);
    });
  });

  it.skip('RenyiEntropy should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.renyiEntropy(img.histogram)).toBe(115);
    });
  });

  it.skip('Shanbhag should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.shanbhag(img.histogram)).toBe(116);
    });
  });

  it('Triangle should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.triangle(img.histogram)).toBe(87);
    });
  });

  it.skip('Yem should work like ImageJ', function () {
    return load('grayscale_by_zimmyrose.png').then(function (img) {
      expect(methods.yen(img.histogram)).toBe(108);
    });
  });
});
