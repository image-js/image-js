import { computeThreshold, ThresholdAlgorithm } from '../../threshold';

test.skip('Huang should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.HUANG)).toBe(134);
});

test('Intermodes should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.INTERMODES)).toBe(166);
});

test('Isodata should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.ISODATA)).toBe(135);
});

test('Percentile should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.PERCENTILE)).toBe(90);
});

test.skip('Li should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.LI)).toBe(115);
});

test('MaxEntropy should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.MAX_ENTROPY)).toBe(126);
});

test('Mean should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.MEAN)).toBe(106);
});

test('MinError should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.MIN_ERROR)).toBe(101);
});

test('Minimum should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.MINIMUM)).toBe(234);
});

test('Moments should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.MOMENTS)).toBe(127);
});

test('Otsu should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.OTSU)).toBe(135);
});

test.skip('RenyiEntropy should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.RENYI_ENTROPY)).toBe(115);
});

test('Shanbhag should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.SHANBHAG)).toBe(116);
});

test('Triangle should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.TRIANGLE)).toBe(87);
});

test('Yen should work like ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.YEN)).toBe(108);
});
