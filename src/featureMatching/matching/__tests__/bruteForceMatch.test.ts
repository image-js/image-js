import type { TestImagePath } from '../../../../test/TestImagePath.js';
import { getBriefDescriptors } from '../../descriptors/getBriefDescriptors.js';
import { getBestKeypointsInRadius } from '../../keypoints/getBestKeypointsInRadius.js';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints.js';
import { Montage } from '../../visualize/Montage.js';
import { bruteForceOneMatch } from '../bruteForceMatch.js';

test.each([
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
    message: 'polygon rotated 10°',
    source: 'polygon',
    destination: 'polygonRotated10degrees',
    expected: 7,
  },
  {
    message: 'polygon rotated 180°',
    source: 'polygon',
    destination: 'polygonRotated180degrees',
    expected: 7,
  },
])('various polygons, centroidPatchDiameter = 31 ($message)', (data) => {
  const kptWindowSize = 31;
  const bestKptRadius = 10;

  const source = testUtils
    .load(`featureMatching/polygons/${data.source}.png` as TestImagePath)
    .convertColor('GREY');
  const allSourceKeypoints = getOrientedFastKeypoints(source, {
    centroidPatchDiameter: kptWindowSize,
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
    .convertColor('GREY');
  const allDestinationKeypoints = getOrientedFastKeypoints(destination, {
    centroidPatchDiameter: kptWindowSize,
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

  const montage = new Montage(source, destination, {
    disposition: 'vertical',
  });
  montage.drawKeypoints(sourceKeypoints);
  montage.drawKeypoints(destinationKeypoints, {
    origin: montage.destinationOrigin,
  });
  montage.drawMatches(matches, sourceKeypoints, destinationKeypoints);

  expect(montage.image).toMatchImageSnapshot();
});
