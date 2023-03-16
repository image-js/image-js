import { TestImagePath } from '../../../../test/TestImagePath';
import { ImageColorModel } from '../../../Image';
import { drawKeypoints } from '../../visualize/drawKeypoints';
import { getOrientedFastKeypoints } from '../getOrientedFastKeypoints';

test('7x7 image, angle = -90°', () => {
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
    angle: -90,
    origin: { row: 3, column: 3 },
    score: 2780,
  });
});

test('7x7 image, angle = 135°', () => {
  const image = testUtils.createGreyImage([
    [100, 0, 0, 0, 0, 0, 0],
    [0, 100, 0, 0, 0, 0, 0],
    [0, 0, 100, 0, 0, 0, 0],
    [0, 0, 0, 200, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]);

  const result = getOrientedFastKeypoints(image)[0];
  expect(result).toStrictEqual({
    angle: -225,
    origin: { row: 3, column: 3 },
    score: 2780,
  });
});

test('7x7 image, angle = -135°', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 200, 0, 0, 0],
    [0, 0, 100, 0, 0, 0, 0],
    [0, 100, 0, 0, 0, 0, 0],
    [100, 0, 0, 0, 0, 0, 0],
  ]);

  const result = getOrientedFastKeypoints(image)[0];
  expect(result).toStrictEqual({
    angle: 225,
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
    angle: -0,
    origin: { row: 3, column: 3 },
    score: 2680,
  });
});
test('7x7 image, angle = 45°', () => {
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
    angle: 45,
    origin: { row: 3, column: 3 },
    score: 2780,
  });
});

test('7x7 image, angle = -45°', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 200, 0, 0, 0],
    [0, 0, 0, 0, 100, 0, 0],
    [0, 0, 0, 0, 0, 100, 0],
    [0, 0, 0, 0, 0, 0, 100],
  ]);

  const result = getOrientedFastKeypoints(image)[0];
  expect(result).toBeDeepCloseTo({
    angle: -45,
    origin: { row: 3, column: 3 },
    score: 2780,
  });
});

test('patch with one keypoint', () => {
  const image = testUtils.load('featureMatching/patch.png').invert();

  const keypoints = getOrientedFastKeypoints(image);

  expect(
    drawKeypoints(image, keypoints, { markerSize: 7, showOrientation: true }),
  ).toMatchImageSnapshot();

  expect(keypoints).toBeDeepCloseTo([
    {
      angle: -187.205,
      origin: { row: 15, column: 14 },
      score: 3290,
    },
  ]);
});

test('patch with one keypoint, centroidPatchDiameter=15', () => {
  const image = testUtils.load('featureMatching/patch.png').invert();

  const keypoints = getOrientedFastKeypoints(image, {
    centroidPatchDiameter: 15,
  });

  expect(
    drawKeypoints(image, keypoints, { markerSize: 7, showOrientation: true }),
  ).toMatchImageSnapshot();

  expect(keypoints).toBeDeepCloseTo([
    {
      angle: 191.8,
      origin: { row: 15, column: 14 },
      score: 3290,
    },
  ]);
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

test.each([
  {
    message: 'betterScaleneTriangle',
    image: 'betterScaleneTriangle',
  },
  {
    message: 'betterScaleneTriangle90',
    image: 'betterScaleneTriangle90',
  },
])('orientation should look correct ($message)', (data) => {
  const markerSize = 7;

  const image = testUtils
    .load(`featureMatching/polygons/${data.image}.png` as TestImagePath)
    .convertColor(ImageColorModel.GREY)
    .invert();
  const keypoints = getOrientedFastKeypoints(image);

  expect(
    drawKeypoints(image, keypoints, { markerSize, showOrientation: true }),
  ).toMatchImageSnapshot();
});

test('check angle for different windowSize', () => {
  const image = testUtils
    .load('featureMatching/polygons/scaleneTriangle10.png')
    .convertColor(ImageColorModel.GREY)
    .invert();

  const angle77 = getOrientedFastKeypoints(image)[0].angle;
  const angle15 = getOrientedFastKeypoints(image, {
    centroidPatchDiameter: 15,
  })[0].angle;
  const angle31 = getOrientedFastKeypoints(image, {
    centroidPatchDiameter: 31,
  })[0].angle;

  expect([angle77, angle15, angle31]).toBeDeepCloseTo([69.81, 62.84, 61.79], 0);
});
