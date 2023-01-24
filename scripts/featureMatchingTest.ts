import {
  Montage,
  drawKeypoints,
  drawMatches,
  getOrientedFastKeypoints,
  getBriefDescriptors,
  bruteForceOneMatch,
  DrawKeypointsOptions,
  GetFastKeypointsOptions,
  getCrosscheckMatches,
} from '../src/featureMatching';
import { ImageColorModel, readSync, writeSync } from '../src';
import { IsFastKeypointOptions } from '../src/featureMatching/keypoints/isFastKeypoint';

const keypointOptions: GetFastKeypointsOptions = { maxNbFeatures: 50 };

const source = readSync('../test/img/featureMatching/crop1.png').convertColor(
  ImageColorModel.GREY,
);

const sourceKeypoints = getOrientedFastKeypoints(source, keypointOptions);
const sourceDescriptors = getBriefDescriptors(source, sourceKeypoints);

const destination = readSync(
  '../test/img/featureMatching/crop3.png',
).convertColor(ImageColorModel.GREY);
const destinationKeypoints = getOrientedFastKeypoints(
  destination,
  keypointOptions,
);
const destinationDescriptors = getBriefDescriptors(
  destination,
  destinationKeypoints,
);

console.log({
  keypoints: {
    sourceLength: sourceKeypoints.length,
    destinationLength: destinationKeypoints.length,
  },
  descriptors: {
    sourceLength: sourceDescriptors.length,
    destinationLength: destinationDescriptors.length,
  },
});

const matches = getCrosscheckMatches(sourceDescriptors, destinationDescriptors);

console.log('nb matches: ' + matches.length);

const montage = new Montage(source, destination, { scale: 2 });

montage.drawMatches(matches, sourceKeypoints, destinationKeypoints, {
  showDistance: true,
});

const kptOptions: DrawKeypointsOptions = {
  markerSize: 5,
  color: [0, 255, 0],
  showScore: true,
  fill: true,
};

montage.drawKeypoints(sourceKeypoints, kptOptions);
montage.drawKeypoints(destinationKeypoints, {
  ...kptOptions,
  origin: montage.leftOrigin,
});

writeSync('./result.png', montage.image);
