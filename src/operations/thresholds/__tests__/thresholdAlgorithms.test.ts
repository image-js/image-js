import { computeThreshold } from '../../threshold';

test('Huang should work similarily to ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'huang')).toBe(132);
});

test('Intermodes should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'intermodes')).toBe(166);
});

test('Isodata should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'isodata')).toBe(135);
});

test('Percentile should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'percentile')).toBe(90);
});

test('Li should work similarily to ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'li')).toBe(117);
});

test('MaxEntropy should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'maxEntropy')).toBe(126);
});

test('Mean should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'mean')).toBe(106);
});

test('MinError should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'minError')).toBe(101);
});

test('Minimum should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'minimum')).toBe(234);
});

test('Moments should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'moments')).toBe(127);
});

test('Otsu should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'otsu')).toBe(135);
});

test('RenyiEntropy should work similarily to ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'renyiEntropy')).toBe(116);
});

test('Shanbhag should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'shanbhag')).toBe(116);
});

test('Triangle should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'triangle')).toBe(87);
});

test('Yen should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, 'yen')).toBe(108);
});
