import type { TestImagePath } from '../../../../../test/TestImagePath.js';
import { getOrientedFastKeypoints } from '../../../keypoints/getOrientedFastKeypoints.js';
import { drawKeypoints } from '../../../visualize/drawKeypoints.js';
import { getKeypointPatch } from '../getKeypointPatch.js';

test.each([
  {
    message: 'scalene triangle',
    image: 'scaleneTriangle',
    expected: 2,
  },
  {
    message: 'scalene triangle rotated 90',
    image: 'scaleneTriangle90',
    expected: 2,
  },
])('default options ($message)', (data) => {
  const image = testUtils
    .load(`featureMatching/polygons/${data.image}.png` as TestImagePath)
    .convertColor('GREY')
    .invert();

  const keypoints = getOrientedFastKeypoints(image);

  expect(keypoints).toHaveLength(data.expected);

  const kptImage = drawKeypoints(image, keypoints, { showOrientation: true });

  expect(kptImage).toMatchImageSnapshot();

  for (const keypoint of keypoints) {
    expect(getKeypointPatch(image, keypoint)).toMatchImageSnapshot();
  }
});

test.each([
  {
    message: 'scalene triangle',
    image: 'scaleneTriangle',
    expected: 2,
  },
  {
    message: 'scalene triangle rotated 90',
    image: 'scaleneTriangle90',
    expected: 2,
  },
])('centroidPatchDiameter = 31 ($message)', (data) => {
  const image = testUtils
    .load(`featureMatching/polygons/${data.image}.png` as TestImagePath)
    .convertColor('GREY')
    .invert();

  const keypoints = getOrientedFastKeypoints(image, {
    centroidPatchDiameter: 31,
  });

  expect(keypoints).toHaveLength(data.expected);

  const kptImage = drawKeypoints(image, keypoints, {
    showOrientation: true,
    markerSize: 31,
  });

  expect(kptImage).toMatchImageSnapshot();

  for (const keypoint of keypoints) {
    expect(getKeypointPatch(image, keypoint)).toMatchImageSnapshot();
  }
});
