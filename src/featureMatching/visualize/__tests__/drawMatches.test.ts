import { ImageColorModel } from '../../../Image';
import { getBriefDescriptors } from '../../descriptors/getBriefDescriptors';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { bruteForceOneMatch } from '../../matching/bruteForceMatch';
import { Montage } from '../Montage';
import { DrawKeypointsOptions } from '../drawKeypoints';
import { drawMatches } from '../drawMatches';

test('alphabet image as source and destination, nbKeypoint = 10', () => {
  const source = testUtils.load('various/alphabet.jpg');
  const grey = source.convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(grey, { maxNbFeatures: 10 });
  const sourceDescriptors = getBriefDescriptors(grey, sourceKeypoints);

  const destination = testUtils.load('various/alphabet.jpg');
  const grey2 = destination.convertColor(ImageColorModel.GREY);
  const destinationKeypoints = getOrientedFastKeypoints(grey2, {
    maxNbFeatures: 10,
  });
  const destinationDescriptors = getBriefDescriptors(
    grey2,
    destinationKeypoints,
  );

  const matches = bruteForceOneMatch(sourceDescriptors, destinationDescriptors);

  const montage = new Montage(source, destination);

  const result = drawMatches(
    montage,
    matches,
    sourceKeypoints,
    destinationKeypoints,
  );

  expect(result).toMatchImageSnapshot();
});

test('destination rotated +2°', () => {
  const source = testUtils
    .load('featureMatching/alphabet.jpg')
    .convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(source);
  const sourceDescriptors = getBriefDescriptors(source, sourceKeypoints);

  const destination = testUtils
    .load('featureMatching/alphabetRotated2.jpg')
    .convertColor(ImageColorModel.GREY);
  const destinationKeypoints = getOrientedFastKeypoints(destination);
  const destinationDescriptors = getBriefDescriptors(
    destination,
    destinationKeypoints,
  );
  expect(sourceKeypoints.length).toBe(119);
  expect(destinationKeypoints.length).toBe(135);

  const matches = bruteForceOneMatch(
    sourceDescriptors,
    destinationDescriptors,
    { nbBestMatches: 20 },
  );

  const montage = new Montage(source, destination);

  const result = drawMatches(
    montage,
    matches,
    sourceKeypoints,
    destinationKeypoints,
  );

  expect(result).toMatchImageSnapshot();
});

test('destination rotated +10°', () => {
  const source = testUtils.load('featureMatching/alphabet.jpg');
  const grey = source.convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(grey);
  const sourceDescriptors = getBriefDescriptors(grey, sourceKeypoints);

  const destination = testUtils.load('featureMatching/alphabetRotated10.jpg');
  const grey2 = destination.convertColor(ImageColorModel.GREY);
  const destinationKeypoints = getOrientedFastKeypoints(grey2);
  const destinationDescriptors = getBriefDescriptors(
    grey2,
    destinationKeypoints,
  );

  const matches = bruteForceOneMatch(
    sourceDescriptors,
    destinationDescriptors,
    { nbBestMatches: 10 },
  );
  const montage = new Montage(source, destination);

  montage.drawMatches(matches, sourceKeypoints, destinationKeypoints);

  const options: DrawKeypointsOptions = {
    fill: true,
    color: [0, 255, 0],
    showScore: true,
    markerSize: 6,
  };
  montage.drawKeypoints(sourceKeypoints, options);
  montage.drawKeypoints(destinationKeypoints, {
    ...options,
    origin: montage.leftOrigin,
  });

  expect(montage.image).toMatchImageSnapshot();
});

test('showDistance = true', () => {
  const source = testUtils.load('featureMatching/alphabet.jpg');
  const grey = source.convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(grey);
  const sourceDescriptors = getBriefDescriptors(grey, sourceKeypoints);

  const destination = testUtils.load('featureMatching/alphabetRotated10.jpg');
  const grey2 = destination.convertColor(ImageColorModel.GREY);
  const destinationKeypoints = getOrientedFastKeypoints(grey2);
  const destinationDescriptors = getBriefDescriptors(
    grey2,
    destinationKeypoints,
  );

  const matches = bruteForceOneMatch(
    sourceDescriptors,
    destinationDescriptors,
    { nbBestMatches: 10 },
  );
  const montage = new Montage(source, destination);

  montage.drawMatches(matches, sourceKeypoints, destinationKeypoints, {
    showDistance: true,
  });

  expect(montage.image).toMatchImageSnapshot();
});
