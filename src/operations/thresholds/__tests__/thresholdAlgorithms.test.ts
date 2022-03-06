import huang from '../huang';
import intermodes from '../intermodes';
import isodata from '../isodata';
import li from '../li';
import maxEntropy from '../maxEntropy';
import mean from '../mean';
import minError from '../minError';
import minimum from '../minimum';
import moments from '../moments';
import { otsu } from '../otsu';
import percentile from '../percentile';
import renyiEntropy from '../renyiEntropy';
import shanbhag from '../shanbhag';
import { triangle } from '../triangle';
import yen from '../yen';

describe('Threshold calculation', () => {
  it.skip('Huang should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(huang(img.histogram())).toBe(134);
  });

  it('Intermodes should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(intermodes(img.histogram())).toBe(166);
  });

  it('Isodata should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(isodata(img.histogram())).toBe(135);
  });

  it('Percentile should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(percentile(img.histogram())).toBe(90);
  });

  it.skip('Li should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(li(img.histogram(), img.size)).toBe(115);
  });

  it('MaxEntropy should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(maxEntropy(img.histogram(), img.size)).toBe(126);
  });

  it('Mean should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(mean(img.histogram(), img.size)).toBe(106);
  });

  it('MinError should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(minError(img.histogram(), img.size)).toBe(101);
  });

  it('Minimum should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(minimum(img.histogram())).toBe(234);
  });

  it('Moments should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(moments(img.histogram(), img.size)).toBe(127);
  });

  it('Otsu should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(otsu(img.histogram(), img.size)).toBe(135);
  });

  it.skip('RenyiEntropy should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(renyiEntropy(img.histogram(), img.size)).toBe(115);
  });

  it('Shanbhag should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(shanbhag(img.histogram(), img.size)).toBe(116);
  });

  it('Triangle should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(triangle(img.histogram())).toBe(87);
  });

  it('Yen should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(yen(img.histogram(), img.size)).toBe(108);
  });
});
