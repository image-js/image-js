import { load } from 'test/common';

import { methods } from '../thresholdAlgorithms';

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
  it.skip('Huang should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.huang(img.histogram, img.size)).toBe(134);
  });

  it('Intermodes should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.intermodes(img.histogram, img.size)).toBe(166);
  });

  it('Isodata should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.isodata(img.histogram, img.size)).toBe(135);
  });

  it('Percentile should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.percentile(img.histogram, img.size)).toBe(90);
  });

  it.skip('Li should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.li(img.histogram, img.size)).toBe(115);
  });

  it('MaxEntropy should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.maxentropy(img.histogram, img.size)).toBe(126);
  });

  it('Mean should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.mean(img.histogram, img.size)).toBe(106);
  });

  it('MinError should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.minerror(img.histogram, img.size)).toBe(101);
  });

  it('Minimum should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.minimum(img.histogram, img.size)).toBe(234);
  });

  it('Moments should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.moments(img.histogram, img.size)).toBe(127);
  });

  it('Otsu should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.otsu(img.histogram, img.size)).toBe(135);
  });

  it.skip('RenyiEntropy should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.renyientropy(img.histogram, img.size)).toBe(115);
  });

  it('Shanbhag should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.shanbhag(img.histogram, img.size)).toBe(116);
  });

  it('Triangle should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.triangle(img.histogram, img.size)).toBe(87);
  });

  it('Yem should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(methods.yen(img.histogram, img.size)).toBe(108);
  });
});
