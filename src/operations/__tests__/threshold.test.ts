import { ImageColorModel } from '../../utils/colorModels';
import { computeThreshold, threshold, ThresholdAlgorithm } from '../threshold';

test('threshold with a fixed value of 100', () => {
  const testImage = testUtils.load('opencv/test.png');
  const grey = testImage.convertColor(ImageColorModel.GREY);
  const th = threshold(grey, { threshold: 100 });

  const expected = testUtils.createMask([
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ]);

  expect(th).toMatchMask(expected);
});

test('computeThreshold with OTSU', () => {
  const testImage = testUtils.load('opencv/test.png');

  const grey = testImage.convertColor(ImageColorModel.GREY);
  const thresholdValue = computeThreshold(grey, ThresholdAlgorithm.OTSU);
  expect(thresholdValue).toBe(127);
});

test('computeThreshold with OTSU (2)', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  const thresholdValue = computeThreshold(img, ThresholdAlgorithm.OTSU);
  expect(thresholdValue).toBe(135);
});

test('automatic threshold with OTSU', () => {
  const testImage = testUtils.load('opencv/test.png');

  const grey = testImage.convertColor(ImageColorModel.GREY);
  const th = threshold(grey, { algorithm: ThresholdAlgorithm.OTSU });
  const expected = testUtils.createMask([
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ]);
  expect(th).toMatchMask(expected);
});

test('error too many channels', () => {
  const testImage = testUtils.load('opencv/test.png');

  expect(() =>
    threshold(testImage, { algorithm: ThresholdAlgorithm.OTSU }),
  ).toThrow(/threshold can only be computed on images with one channel/);
});
