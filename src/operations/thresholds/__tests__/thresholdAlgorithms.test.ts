import { computeThreshold, ThresholdAlgorithm } from '../../threshold';

describe('Threshold calculation', () => {
  it.skip('Huang should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.HUANG)).toBe(134);
  });

  it('Intermodes should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.INTERMODES)).toBe(166);
  });

  it('Isodata should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.ISODATA)).toBe(135);
  });

  it('Percentile should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.PERCENTILE)).toBe(90);
  });

  it.skip('Li should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.LI)).toBe(115);
  });

  it('MaxEntropy should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.MAX_ENTROPY)).toBe(126);
  });

  it('Mean should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.MEAN)).toBe(106);
  });

  it('MinError should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.MIN_ERROR)).toBe(101);
  });

  it('Minimum should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.MINIMUM)).toBe(234);
  });

  it('Moments should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.MOMENTS)).toBe(127);
  });

  it('Otsu should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.OTSU)).toBe(135);
  });

  it.skip('RenyiEntropy should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.RENYI_ENTROPY)).toBe(115);
  });

  it('Shanbhag should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.SHANBHAG)).toBe(116);
  });

  it('Triangle should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.TRIANGLE)).toBe(87);
  });

  it('Yen should work like ImageJ', async () => {
    const img = testUtils.load('various/grayscale_by_zimmyrose.png');
    expect(computeThreshold(img, ThresholdAlgorithm.YEN)).toBe(108);
  });
});
