import { expect, test } from 'vitest';

import { Image } from '../../Image.ts';
import { ImageColorModel } from '../../utils/constants/colorModels.ts';
import { computeThreshold, threshold } from '../threshold.ts';

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

test('error too many components with algorithm', () => {
  const testImage = testUtils.load('opencv/test.png');
  const message =
    'image components must be 1 to apply this algorithm. The image can be converted using "image.grey()"';

  expect(() => threshold(testImage, { algorithm: 'otsu' })).toThrow(message);
  expect(() => computeThreshold(testImage)).toThrow(message);
});

test('error too many components with numeric threshold', () => {
  const testImage = testUtils.load('opencv/test.png');

  expect(() => threshold(testImage, { threshold: 0.5 })).toThrow(
    'image components must be 1 to apply this algorithm. The image can be converted using "image.grey()"',
  );
});

test('error threshold out of range', () => {
  const testImage = testUtils.createGreyImage([
    [1, 2],
    [3, 4],
  ]);

  expect(() => threshold(testImage, { threshold: 450 })).toThrow(
    /threshold must be a value between 0 and 1/,
  );
});

test('threshold GREYA image with a fixed value', () => {
  const image = testUtils.createGreyaImage([
    [1, 255, 2, 0, 3, 128],
    [10, 255, 20, 0, 30, 255],
    [50, 0, 60, 255, 70, 0],
  ]);

  const th = threshold(image, { threshold: 0.1 });

  const expected = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 1],
    [1, 1, 1],
  ]);

  expect(th).toMatchMask(expected);
});

test('computeThreshold on GREYA uses the grey component', () => {
  const grey = testUtils.createGreyImage([
    [1, 2, 3],
    [10, 20, 30],
    [50, 60, 70],
  ]);
  const greya = testUtils.createGreyaImage([
    [1, 255, 2, 0, 3, 128],
    [10, 255, 20, 0, 30, 255],
    [50, 0, 60, 255, 70, 0],
  ]);

  expect(computeThreshold(greya)).toBe(computeThreshold(grey));
  expect(threshold(greya)).toMatchMask(threshold(grey));
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
