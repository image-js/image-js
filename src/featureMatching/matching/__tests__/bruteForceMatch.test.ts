import { TestImagePath } from '../../../../test/TestImagePath';
import { ImageColorModel, Image } from '../../../Image';
import {
  BriefDescriptor,
  getBriefDescriptors,
} from '../../descriptors/getBriefDescriptors';
import { getBestKeypointsInRadius } from '../../keypoints/getBestKeypointsInRadius';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { Montage } from '../../visualize/Montage';
import { bruteForceOneMatch } from '../bruteForceMatch';

/**
 * Get BRIEF descriptors for an image.
 *
 * @param image - The image.
 * @returns The descriptors.
 */
function getDescriptors(image: Image): BriefDescriptor[] {
  const grey = image.convertColor(ImageColorModel.GREY);
  const keypoints = getOrientedFastKeypoints(grey);
  return getBriefDescriptors(grey, keypoints).descriptors;
}

test('nbBestMatches = 5', () => {
  const source = testUtils.load('featureMatching/alphabet.jpg');
  const sourceDescriptors = getDescriptors(source);
  const destination = testUtils.load('featureMatching/alphabet.jpg');
  const destinationDescriptors = getDescriptors(destination);

  const matches = bruteForceOneMatch(
    sourceDescriptors,
    destinationDescriptors,
    { nbBestMatches: 5 },
  );

  expect(matches.length).toBe(5);
});

test.each([
  {
    message: 'scalene triangle',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle2',
    expected: 2,
  },
  {
    message: 'scalene triangle rotated 10°',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle10',
    expected: 2,
  },
  {
    message: 'scalene triangle rotated 90°',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle90',
    expected: 2,
  },
  {
    message: 'scalene triangle rotated 180°',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle180',
    expected: 2,
  },
  {
    message: 'polygon',
    source: 'polygon',
    destination: 'polygon2',
    expected: 7,
  },
  {
    message: 'polygon rotated 180°',
    source: 'polygon',
    destination: 'polygonRotated180degrees',
    expected: 7,
  },
  {
    message: 'polygon rotated 10°',
    source: 'polygon',
    destination: 'polygonRotated10degrees',
    expected: 7,
  },
])('various polygons ($message)', (data) => {
  const source = testUtils
    .load(`featureMatching/polygons/${data.source}.png` as TestImagePath)
    .convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(source);
  const sourceDescriptors = getBriefDescriptors(
    source,
    sourceKeypoints,
  ).descriptors;
  const destination = testUtils
    .load(`featureMatching/polygons/${data.destination}.png` as TestImagePath)
    .convertColor(ImageColorModel.GREY);
  const destinationKeypoints = getOrientedFastKeypoints(destination);
  const destinationDescriptors = getBriefDescriptors(
    destination,
    destinationKeypoints,
  ).descriptors;

  const matches = bruteForceOneMatch(sourceDescriptors, destinationDescriptors);

  expect(matches.length).toBe(data.expected);

  const montage = new Montage(source, destination);
  montage.drawKeypoints(sourceKeypoints);
  montage.drawKeypoints(destinationKeypoints, {
    origin: montage.destinationOrigin,
  });
  montage.drawMatches(matches, sourceKeypoints, destinationKeypoints);

  expect(montage.image).toMatchImageSnapshot();
});

test.each([
  {
    message: 'scalene triangle',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle2',
    expected: 2,
  },
  {
    message: 'scalene triangle rotated 10°',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle10',
    expected: 2,
  },
  {
    message: 'scalene triangle rotated 90°',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle90',
    expected: 2,
  },
  {
    message: 'scalene triangle rotated 180°',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle180',
    expected: 2,
  },
  {
    message: 'polygon',
    source: 'polygon',
    destination: 'polygon2',
    expected: 7,
  },
  {
    message: 'polygon rotated 180°',
    source: 'polygon',
    destination: 'polygonRotated180degrees',
    expected: 7,
  },
  {
    message: 'polygon rotated 10°',
    source: 'polygon',
    destination: 'polygonRotated10degrees',
    expected: 7,
  },
])('various polygons, windowSize = 15 ($message)', (data) => {
  const kptWindowSize = 15;
  const bestKptRadius = 10;

  const source = testUtils
    .load(`featureMatching/polygons/${data.source}.png` as TestImagePath)
    .convertColor(ImageColorModel.GREY);
  const allSourceKeypoints = getOrientedFastKeypoints(source, {
    windowSize: kptWindowSize,
  });
  const sourceKeypoints = getBestKeypointsInRadius(
    allSourceKeypoints,
    bestKptRadius,
  );
  const sourceDescriptors = getBriefDescriptors(
    source,
    sourceKeypoints,
  ).descriptors;
  const destination = testUtils
    .load(`featureMatching/polygons/${data.destination}.png` as TestImagePath)
    .convertColor(ImageColorModel.GREY);
  const allDestinationKeypoints = getOrientedFastKeypoints(destination, {
    windowSize: kptWindowSize,
  });
  const destinationKeypoints = getBestKeypointsInRadius(
    allDestinationKeypoints,
    bestKptRadius,
  );
  const destinationDescriptors = getBriefDescriptors(
    destination,
    destinationKeypoints,
  ).descriptors;

  const matches = bruteForceOneMatch(sourceDescriptors, destinationDescriptors);

  expect(matches.length).toBe(data.expected);

  const montage = new Montage(source, destination);
  montage.drawKeypoints(sourceKeypoints);
  montage.drawKeypoints(destinationKeypoints, {
    origin: montage.destinationOrigin,
  });
  montage.drawMatches(matches, sourceKeypoints, destinationKeypoints);

  expect(montage.image).toMatchImageSnapshot();
});

test('scalene triangle', () => {
  const data = {
    message: 'scalene triangle rotated 10°',
    source: 'scaleneTriangle',
    destination: 'scaleneTriangle10',
    expected: 2,
  };

  const source = testUtils
    .load(`featureMatching/polygons/${data.source}.png` as TestImagePath)
    .convertColor(ImageColorModel.GREY);
  const allSourceKeypoints = getOrientedFastKeypoints(source, {});
  const sourceKeypoints = getBestKeypointsInRadius(allSourceKeypoints);
  const sourceDescriptors = getBriefDescriptors(
    source,
    sourceKeypoints,
  ).descriptors;
  const destination = testUtils
    .load(`featureMatching/polygons/${data.destination}.png` as TestImagePath)
    .convertColor(ImageColorModel.GREY);
  const allDestinationKeypoints = getOrientedFastKeypoints(destination, {});
  const destinationKeypoints = getBestKeypointsInRadius(
    allDestinationKeypoints,
  );
  const destinationDescriptors = getBriefDescriptors(
    destination,
    destinationKeypoints,
  ).descriptors;

  const matches = bruteForceOneMatch(sourceDescriptors, destinationDescriptors);

  expect(matches.length).toBe(data.expected);

  const montage = new Montage(source, destination);
  montage.drawKeypoints(sourceKeypoints);
  montage.drawKeypoints(destinationKeypoints, {
    origin: montage.destinationOrigin,
  });
  montage.drawMatches(matches, sourceKeypoints, destinationKeypoints);

  expect(montage.image).toMatchImageSnapshot();
});
