import { computeThreshold, ThresholdAlgorithm } from '../../threshold';

test('Huang should work similarily to ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.HUANG)).toBe(132);
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

test('Li should work similarily to ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.LI)).toBe(117);
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

test('RenyiEntropy should work similarily to ImageJ', async () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, ThresholdAlgorithm.RENYI_ENTROPY)).toBe(116);
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
