import { expect, test } from 'vitest';

import { getBriefDescriptors } from '../../descriptors/getBriefDescriptors.js';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints.js';
import { bruteForceOneMatch } from '../../matching/bruteForceMatch.js';
import { Montage } from '../Montage.js';
import type { DrawKeypointsOptions } from '../drawKeypoints.js';
import { drawMatches } from '../drawMatches.js';

test('alphabet image as source and destination, nbKeypoint = 10', () => {
  const source = testUtils.load('various/alphabet.jpg');
  const grey = source.convertColor('GREY');
  const sourceKeypoints = getOrientedFastKeypoints(grey, { maxNbFeatures: 10 });
  const sourceBrief = getBriefDescriptors(grey, sourceKeypoints);

  const destination = testUtils.load('various/alphabet.jpg');
  const grey2 = destination.convertColor('GREY');
  const destinationKeypoints = getOrientedFastKeypoints(grey2, {
    maxNbFeatures: 10,
  });
  const destinationBrief = getBriefDescriptors(grey2, destinationKeypoints);

  const matches = bruteForceOneMatch(
    sourceBrief.descriptors,
    destinationBrief.descriptors,
  );

  const montage = new Montage(source, destination);

  const result = drawMatches(
    montage,
    matches,
    sourceBrief.keypoints,
    destinationBrief.keypoints,
  );

  expect(result).toMatchImageSnapshot();
});

test('destination rotated +2°', () => {
  const source = testUtils
    .load('featureMatching/alphabet.jpg')
    .convertColor('GREY');
  const sourceKeypoints = getOrientedFastKeypoints(source);
  const sourceBrief = getBriefDescriptors(source, sourceKeypoints);

  const destination = testUtils
    .load('featureMatching/alphabetRotated2.jpg')
    .convertColor('GREY');
  const destinationKeypoints = getOrientedFastKeypoints(destination);
  const destinationBrief = getBriefDescriptors(
    destination,
    destinationKeypoints,
  );

  expect(sourceBrief.keypoints).toHaveLength(114);
  expect(destinationBrief.keypoints).toHaveLength(135);

  const matches = bruteForceOneMatch(
    sourceBrief.descriptors,
    destinationBrief.descriptors,
    { nbBestMatches: 20 },
  );

  const montage = new Montage(source, destination);

  const result = drawMatches(
    montage,
    matches,
    sourceBrief.keypoints,
    destinationBrief.keypoints,
  );

  expect(result).toMatchImageSnapshot();
});

test('destination rotated +10°', () => {
  const source = testUtils.load('featureMatching/alphabet.jpg');
  const grey = source.convertColor('GREY');
  const sourceKeypoints = getOrientedFastKeypoints(grey);
  const sourceBrief = getBriefDescriptors(grey, sourceKeypoints);

  const destination = testUtils.load('featureMatching/alphabetRotated10.jpg');
  const grey2 = destination.convertColor('GREY');
  const destinationKeypoints = getOrientedFastKeypoints(grey2);
  const destinationBrief = getBriefDescriptors(grey2, destinationKeypoints);

  const matches = bruteForceOneMatch(
    sourceBrief.descriptors,
    destinationBrief.descriptors,
    { nbBestMatches: 10 },
  );
  const montage = new Montage(source, destination);

  montage.drawMatches(
    matches,
    sourceBrief.keypoints,
    destinationBrief.keypoints,
    {
      maxNbMatches: 20,
    },
  );

  const options: DrawKeypointsOptions = {
    fill: true,
    strokeColor: [0, 255, 0],
    showScore: true,
    markerSize: 6,
  };
  montage.drawKeypoints(sourceBrief.keypoints, options);
  montage.drawKeypoints(destinationBrief.keypoints, {
    ...options,
    origin: montage.destinationOrigin,
  });

  expect(montage.image).toMatchImageSnapshot();
});

test('showDistance = true', () => {
  const source = testUtils.load('featureMatching/alphabet.jpg');
  const grey = source.convertColor('GREY');
  const sourceKeypoints = getOrientedFastKeypoints(grey);
  const sourceBrief = getBriefDescriptors(grey, sourceKeypoints);

  const destination = testUtils.load('featureMatching/alphabetRotated10.jpg');
  const grey2 = destination.convertColor('GREY');
  const destinationKeypoints = getOrientedFastKeypoints(grey2);
  const destinationBrief = getBriefDescriptors(grey2, destinationKeypoints);

  const matches = bruteForceOneMatch(
    sourceBrief.descriptors,
    destinationBrief.descriptors,
    { nbBestMatches: 10 },
  );
  const montage = new Montage(source, destination);

  montage.drawMatches(
    matches,
    sourceBrief.keypoints,
    destinationBrief.keypoints,
    {
      showDistance: true,
      maxNbMatches: 5,
    },
  );

  expect(montage.image).toMatchImageSnapshot();
});
