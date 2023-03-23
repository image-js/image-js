import { TestImagePath } from '../../../../../test/TestImagePath';
import { ImageColorModel } from '../../../../Image';
import { getOrientedFastKeypoints } from '../../../keypoints/getOrientedFastKeypoints';
import { drawKeypoints } from '../../../visualize/drawKeypoints';
import { getKeypointPatch } from '../getKeypointPatch';

test.each([
  {
    message: 'better scalene triangle',
    image: 'betterScaleneTriangle',
    expected: 2,
  },
  {
    message: 'better scalene triangle rotated 90',
    image: 'betterScaleneTriangle90',
    expected: 2,
  },
])('default options ($message)', (data) => {
  const image = testUtils
    .load(`featureMatching/polygons/${data.image}.png` as TestImagePath)
    .convertColor(ImageColorModel.GREY)
    .invert();

  const keypoints = getOrientedFastKeypoints(image);

  expect(keypoints).toHaveLength(data.expected);

  const kptImage = drawKeypoints(image, keypoints, { showOrientation: true });

  expect(kptImage).toMatchImageSnapshot();

  for (let keypoint of keypoints) {
    expect(getKeypointPatch(image, keypoint)).toMatchImageSnapshot();
  }
});

test.each([
  {
    message: 'better scalene triangle',
    image: 'betterScaleneTriangle',
    expected: 2,
  },
  {
    message: 'better scalene triangle rotated 90',
    image: 'betterScaleneTriangle90',
    expected: 2,
  },
])('centroidPatchDiameter = 31 ($message)', (data) => {
  const image = testUtils
    .load(`featureMatching/polygons/${data.image}.png` as TestImagePath)
    .convertColor(ImageColorModel.GREY)
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

  for (let keypoint of keypoints) {
    expect(getKeypointPatch(image, keypoint)).toMatchImageSnapshot();
  }
});
