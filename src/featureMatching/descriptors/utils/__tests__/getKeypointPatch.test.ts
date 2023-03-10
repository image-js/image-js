import { TestImagePath } from '../../../../../test/TestImagePath';
import { ImageColorModel } from '../../../../Image';
import { getBestKeypointsInRadius } from '../../../keypoints/getBestKeypointsInRadius';
import { getOrientedFastKeypoints } from '../../../keypoints/getOrientedFastKeypoints';
import { drawKeypoints } from '../../../visualize/drawKeypoints';
import { getKeypointPatch } from '../getKeypointPatch';

test.each([
  {
    message: 'scalene triangle',
    image: 'scaleneTriangle',
    expected: 2,
  },
  {
    message: 'scalene triangle rotated 10°',
    image: 'scaleneTriangle10',
    expected: 2,
  },
  {
    message: 'polygon rotated 180°',
    image: 'polygonRotated180degrees',
    expected: 8,
  },
])('default options ($message)', (data) => {
  const image = testUtils.load(
    `featureMatching/polygons/${data.image}.png` as TestImagePath,
  );

  const grey = image.convertColor(ImageColorModel.GREY);

  const allKeypoints = getOrientedFastKeypoints(grey, { windowSize: 15 });
  const keypoints = getBestKeypointsInRadius(allKeypoints, 10);

  expect(keypoints).toHaveLength(data.expected);

  const kptImage = drawKeypoints(image, keypoints, { showOrientation: true });

  expect(kptImage).toMatchImageSnapshot();

  for (let keypoint of keypoints) {
    expect(getKeypointPatch(image, keypoint)).toMatchImageSnapshot();
  }
});

test('patch had black pixels on border', () => {
  const image = testUtils.load(
    `featureMatching/polygons/polygonRotated180degrees.png`,
  );

  const grey = image.convertColor(ImageColorModel.GREY);

  const allKeypoints = getOrientedFastKeypoints(grey, { windowSize: 15 });
  const keypoints = getBestKeypointsInRadius(allKeypoints, 10);
  const keypoint = keypoints[4];

  const result = getKeypointPatch(image, keypoint);
  expect(result.width).toBe(31);

  expect(result).toMatchImageSnapshot();
});

test.each([
  {
    message: 'scalene triangle',
    image: 'scaleneTriangle',
  },
  {
    message: 'scalene triangle rotated 10°',
    image: 'scaleneTriangle10',
  },
  {
    message: 'better scalene triangle',
    image: 'betterScaleneTriangle',
  },
  {
    message: 'better scalene triangle rotated 90',
    image: 'betterScaleneTriangle90',
  },
])('windowSize = 15 ($message)', (data) => {
  const image = testUtils
    .load(`featureMatching/polygons/${data.image}.png` as TestImagePath)
    .convertColor(ImageColorModel.GREY);

  const keypoints = getOrientedFastKeypoints(image, { windowSize: 15 });

  for (let keypoint of keypoints) {
    expect(getKeypointPatch(image, keypoint)).toMatchImageSnapshot();
  }
});
