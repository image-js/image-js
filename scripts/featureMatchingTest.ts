import {
  Montage,
  drawKeypoints,
  drawMatches,
  getOrientedFastKeypoints,
  getBriefDescriptors,
  bruteForceOneMatch,
} from '../src/featureMatching';
import { ImageColorModel, readSync } from '../src';

const source = readSync('../test/img/featureMatching/crop1.png').convertColor(
  ImageColorModel.GREY,
);
const sourceKeypoints = getOrientedFastKeypoints(source);
const sourceDescriptors = getBriefDescriptors(source, sourceKeypoints);

const destination = readSync(
  '../test/img/featureMatching/crop2.png',
).convertColor(ImageColorModel.GREY);
const destinationKeypoints = getOrientedFastKeypoints(destination);
const destinationDescriptors = getBriefDescriptors(
  destination,
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
