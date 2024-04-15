import { computeThreshold } from '../../threshold';

test('Huang should work similarily to ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'huang' })).toBe(132);
});

test('Intermodes should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'intermodes' })).toBe(166);
});

test('Isodata should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'isodata' })).toBe(135);
});

test('Percentile should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'percentile' })).toBe(90);
});

test('Li should work similarily to ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'li' })).toBe(117);
});

test('MaxEntropy should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'maxEntropy' })).toBe(126);
});

test('Mean should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'mean' })).toBe(106);
});

test('MinError should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'minError' })).toBe(101);
});

test('Minimum should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'minimum' })).toBe(234);
});

test('Moments should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'moments' })).toBe(127);
});

test('Otsu should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'otsu' })).toBe(135);
});

test('RenyiEntropy should work similarily to ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'renyiEntropy' })).toBe(116);
});

test('Shanbhag should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'shanbhag' })).toBe(116);
});

test('Triangle should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'triangle' })).toBe(87);
});

test('Yen should work like ImageJ', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  expect(computeThreshold(img, { algorithm: 'yen' })).toBe(108);
});
