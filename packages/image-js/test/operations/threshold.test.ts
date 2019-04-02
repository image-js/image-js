import {
  computeThreshold,
  threshold,
  ImageKind,
  ThresholdAlgorithm
} from 'ijs';
import { getTestImage, getImage, decodeImage } from 'test';

test('threshold with a fixed value of 100', () => {
  const testImage = getTestImage();
  const grey = testImage.convertColor(ImageKind.GREY);
  const th = threshold(grey, { threshold: 100 });

  const expected = getImage(
    [
      [255, 255, 255, 255, 255, 255, 255, 255],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 255, 255, 255, 255, 0],
      [0, 0, 0, 255, 255, 255, 255, 0],
      [0, 255, 255, 0, 0, 255, 255, 0],
      [0, 255, 255, 0, 0, 255, 255, 0],
      [0, 0, 0, 255, 255, 255, 255, 0],
      [0, 0, 0, 255, 255, 255, 255, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [255, 255, 255, 255, 255, 255, 255, 255]
    ],
    ImageKind.GREY
  );

  expect(th.data).toStrictEqual(expected.data);
});

test('computeThreshold with OTSU', () => {
  const testImage = getTestImage();
  const grey = testImage.convertColor(ImageKind.GREY);
  const thresholdValue = computeThreshold(grey, ThresholdAlgorithm.OTSU);
  expect(thresholdValue).toBe(127);
});

test('computeThreshold with OTSU (2)', () => {
  const img = decodeImage('grayscale_by_zimmyrose.png');
  const thresholdValue = computeThreshold(img, ThresholdAlgorithm.OTSU);
  expect(thresholdValue).toBe(135);
});

test('automatic threshold with OTSU', () => {
  const testImage = getTestImage();
  const grey = testImage.convertColor(ImageKind.GREY);
  const th = threshold(grey, { algorithm: ThresholdAlgorithm.OTSU });
  const expected = getImage(
    [
      [255, 255, 255, 255, 255, 255, 255, 255],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 255, 255, 255, 255, 0],
      [0, 0, 0, 255, 255, 255, 255, 0],
      [0, 255, 255, 0, 0, 0, 0, 0],
      [0, 255, 255, 0, 0, 0, 0, 0],
      [0, 0, 0, 255, 255, 255, 255, 0],
      [0, 0, 0, 255, 255, 255, 255, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [255, 255, 255, 255, 255, 255, 255, 255]
    ],
    ImageKind.GREY
  );
  expect(th.data).toStrictEqual(expected.data);
});

test('error too many channels', () => {
  const testImage = getTestImage();
  expect(() => threshold(testImage)).toThrow(
    /threshold can only be computed on images with one channel/
  );
});
