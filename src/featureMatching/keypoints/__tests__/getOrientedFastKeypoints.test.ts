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

  const result = getOrientedFastKeypoints(image)[0];
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

  const result = getOrientedFastKeypoints(image)[0];
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

  const result = getOrientedFastKeypoints(image)[0];
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

  const result = getOrientedFastKeypoints(image)[0];
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

test('check angle for different windowSize', () => {
  const image = testUtils
    .load('featureMatching/polygons/scaleneTriangle10.png')
    .convertColor(ImageColorModel.GREY);

  const keypoints7 = getOrientedFastKeypoints(image);
  const keypoints15 = getOrientedFastKeypoints(image, { windowSize: 15 });
  const keypoints31 = getOrientedFastKeypoints(image, { windowSize: 31 });

  expect([keypoints7, keypoints15, keypoints31]).toBeDeepCloseTo(
    [
      [
        {
          origin: { row: 607, column: 132 },
          score: 2680,
          angle: 145.3,
        },
        {
          origin: { row: 50, column: 292 },
          score: 2662,
          angle: -112.2,
        },
      ],
      [
        {
          origin: { row: 607, column: 132 },
          score: 2680,
          angle: 123.7,
        },
        {
          origin: { row: 50, column: 292 },
          score: 2662,
          angle: -95.4,
        },
      ],
      [
        {
          origin: { row: 607, column: 132 },
          score: 2680,
          angle: 120,
        },
        {
          origin: { row: 50, column: 292 },
          score: 2662,
          angle: -92.1,
        },
      ],
    ],
    1,
  );
});
