import { ImageColorModel } from '../../../Image';
import { getOrientedFastKeypoints } from '../getOrientedFastKeypoints';

test('7x7 image, angle = 90°', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 200, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
    [0, 0, 0, 100, 0, 0, 0],
  ]);

  const result = getOrientedFastKeypoints(image, { minBorderDistance: 3 })[0];
  expect(result).toStrictEqual({
    angle: 90,
    origin: { row: 3, column: 3 },
    score: 2780,
  });
});

test('7x7 image, angle = 180°', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [100, 100, 100, 200, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]);

  const result = getOrientedFastKeypoints(image, { minBorderDistance: 3 })[0];
  expect(result).toStrictEqual({
    angle: 180,
    origin: { row: 3, column: 3 },
    score: 2780,
  });
});

test('7x7 image, angle = 0°', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 100],
    [0, 0, 0, 0, 0, 100, 0],
    [0, 0, 0, 0, 100, 0, 0],
    [0, 0, 0, 200, 0, 0, 0],
    [0, 0, 0, 0, 100, 0, 0],
    [0, 0, 0, 0, 0, 100, 0],
    [0, 0, 0, 0, 0, 0, 100],
  ]);

  const result = getOrientedFastKeypoints(image, { minBorderDistance: 3 })[0];
  expect(result).toStrictEqual({
    angle: 0,
    origin: { row: 3, column: 3 },
    score: 2680,
  });
});
test('7x7 image, angle = -45°', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 100],
    [0, 0, 0, 0, 0, 100, 0],
    [0, 0, 0, 0, 100, 0, 0],
    [0, 0, 0, 200, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]);

  const result = getOrientedFastKeypoints(image, { minBorderDistance: 3 })[0];
  expect(result).toBeDeepCloseTo({
    angle: -45,
    origin: { row: 3, column: 3 },
    score: 2780,
  });
});

test('check we handle edge cases properly', () => {
  const image = testUtils
    .load('featureMatching/crop1.png')
    .convertColor(ImageColorModel.GREY);

  const keypoints = getOrientedFastKeypoints(image);

  expect(keypoints.length).toBe(403);
});

test('angle should never be NaN', () => {
  const image = testUtils
    .load('featureMatching/crop1.png')
    .convertColor(ImageColorModel.GREY);

  const keypoints = getOrientedFastKeypoints(image);
  for (let keypoint of keypoints) {
    expect(isNaN(keypoint.angle)).toBe(false);
  }
});
