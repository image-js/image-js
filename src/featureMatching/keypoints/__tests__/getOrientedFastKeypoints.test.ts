import { expect, test } from 'vitest';

import type { TestImagePath } from '../../../../test/TestImagePath.js';
import { drawKeypoints } from '../../visualize/drawKeypoints.js';
import { getOrientedFastKeypoints } from '../getOrientedFastKeypoints.js';

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

test.each([
  {
    message: 'scaleneTriangle',
    image: 'scaleneTriangle',
  },
  {
    message: 'scaleneTriangle90',
    image: 'scaleneTriangle90',
  },
])('centroidPatchDiameter = 31 ($message)', (data) => {
  const centroidPatchDiameter = 31;

  const image = testUtils
    .load(`featureMatching/polygons/${data.image}.png` as TestImagePath)
    .convertColor('GREY')
    .invert();

  const keypoints = getOrientedFastKeypoints(image, { centroidPatchDiameter });

  expect(
    drawKeypoints(image, keypoints, {
      markerSize: centroidPatchDiameter,
      showOrientation: true,
    }),
  ).toMatchImageSnapshot();
});

test('verify single keypoint orientation', () => {
  const origin = { row: 332, column: 253 };
  const size = 51;
  const radius = (size - 1) / 2;

  const cropOrigin = {
    row: origin.row - radius,
    column: origin.column - radius,
  };

  const centroidPatchDiameter = 31;

  const origialImage = testUtils
    .load('featureMatching/polygons/scaleneTriangle.png')
    .convertColor('GREY')
    .invert();

  const image = origialImage.crop({
    origin: cropOrigin,
    width: size,
    height: size,
  });

  const keypoints = getOrientedFastKeypoints(image, { centroidPatchDiameter });

  expect(keypoints).toHaveLength(1);

  const result = drawKeypoints(image, keypoints, {
    markerSize: centroidPatchDiameter,
    showOrientation: true,
  });

  expect(result).toMatchImageSnapshot();
});

test('small patchsize and large marker', () => {
  // this test shows that the orientation is not good when the centroidPatchDiameter is too small
  // ideally we should use the same patch size for orientation and descriptors (getKeypointPatch)
  const origin = { row: 868, column: 332 };
  const size = 51;
  const radius = (size - 1) / 2;

  const cropOrigin = {
    row: origin.row - radius,
    column: origin.column - radius,
  };

  const centroidPatchDiameter = 7;

  const origialImage = testUtils
    .load('featureMatching/polygons/scaleneTriangle90.png')
    .convertColor('GREY')
    .invert();

  const image = origialImage.crop({
    origin: cropOrigin,
    width: size,
    height: size,
  });

  const keypoints = getOrientedFastKeypoints(image, { centroidPatchDiameter });

  expect(keypoints).toHaveLength(1);

  const result = drawKeypoints(image, keypoints, {
    markerSize: 31,
    showOrientation: true,
  });

  expect(result).toMatchImageSnapshot();
});

test('check angle for different centroidPatchDiameter', () => {
  // we can see the impact of patch size on the orientation
  const image = testUtils
    .load('featureMatching/polygons/scaleneTriangle10.png')
    .convertColor('GREY')
    .invert();

  const angle77 = getOrientedFastKeypoints(image)[0].angle;
  const angle15 = getOrientedFastKeypoints(image, {
    centroidPatchDiameter: 15,
  })[0].angle;
  const angle31 = getOrientedFastKeypoints(image, {
    centroidPatchDiameter: 31,
  })[0].angle;

  expect([angle15, angle31, angle77]).toBeDeepCloseTo([5.15, 3.64, 9.71], 0);
});
