import { expect, test } from 'vitest';

import { Image } from '../../Image.js';
import { ImageColorModel } from '../../utils/constants/colorModels.js';
import { computeThreshold, threshold } from '../threshold.js';

test('threshold with a fixed value of 100', () => {
  const testImage = testUtils.load('opencv/test.png');
  const grey = testImage.convertColor('GREY');
  const th = threshold(grey, { threshold: 100 / 255 });

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

  const grey = testImage.convertColor('GREY');
  const thresholdValue = computeThreshold(grey, { algorithm: 'otsu' });

  expect(thresholdValue).toBe(127);
});

test('computeThreshold with OTSU (2)', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  const thresholdValue = computeThreshold(img, { algorithm: 'otsu' });

  expect(thresholdValue).toBe(135);
});

test('computeThreshold default should be Otsu', () => {
  const img = testUtils.load('various/grayscale_by_zimmyrose.png');
  const thresholdValue = computeThreshold(img);

  expect(thresholdValue).toBe(135);
});

test('automatic threshold with OTSU', () => {
  const testImage = testUtils.load('opencv/test.png');

  const grey = testImage.convertColor('GREY');
  const th = threshold(grey, { algorithm: 'otsu' });
  const defaultThreshold = threshold(grey);

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
  expect(defaultThreshold).toMatchMask(expected);
});

test('threshold in percents', () => {
  const grey = testUtils.createGreyImage([
    [1, 2, 3],
    [10, 20, 30],
    [50, 60, 70],
  ]);

  const th = threshold(grey, { threshold: 0.1 });

  const expected = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 1],
    [1, 1, 1],
  ]);

  expect(th).toMatchMask(expected);
});

test('error too many channels', () => {
  const testImage = testUtils.load('opencv/test.png');

  expect(() => threshold(testImage, { algorithm: 'otsu' })).toThrow(
    /threshold can only be computed on images with one channel/,
  );
});

test('error threshold out of range', () => {
  const testImage = testUtils.load('opencv/test.png');

  expect(() => threshold(testImage, { threshold: 450 })).toThrow(
    /threshold must be a value between 0 and 1/,
  );
});

test('16 bits image simple', () => {
  const image = new Image(2, 2, {
    colorModel: ImageColorModel.GREY,
    bitDepth: 16,
    data: new Uint16Array([0, 100, 20000, 30000]),
  });
  const threshold = image.threshold();

  expect(threshold).toMatchImageData([
    [0, 0],
    [1, 1],
  ]);
});

test('16 bits image', () => {
  const image = testUtils.load('formats/grey16.png');
  const threshold = image.threshold();

  expect(threshold).toMatchImageSnapshot();
});

test('16 bits image simple with default number of slots 2**16', () => {
  const image = new Image(2, 2, {
    colorModel: ImageColorModel.GREY,
    bitDepth: 16,
    data: new Uint16Array([0, 100, 20000, 30000]),
  });
  const threshold = image.threshold({ slots: 2 ** image.bitDepth });
  const defaultSlotsThreshold = image.threshold();

  expect(threshold).toStrictEqual(defaultSlotsThreshold);
});

test('16 bits image simple with custom number of slots 2**8', () => {
  const image = new Image(2, 2, {
    colorModel: ImageColorModel.GREY,
    bitDepth: 16,
    data: new Uint16Array([0, 100, 20000, 30000]),
  });
  const threshold = image.threshold({ slots: 2 ** 8 });
  const defaultSlotsThreshold = image.threshold();

  expect(threshold).toStrictEqual(defaultSlotsThreshold);
});
