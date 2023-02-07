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
  MontageDispositions,
} from '../src/featureMatching';
import { ImageColorModel, readSync, writeSync } from '../src';
import { IsFastKeypointOptions } from '../src/featureMatching/keypoints/isFastKeypoint';

const keypointOptions: GetFastKeypointsOptions = {};

const source = readSync('../test/img/featureMatching/crop1.png').convertColor(
  ImageColorModel.GREY,
);

const sourceKeypoints = getOrientedFastKeypoints(source, keypointOptions);
const sourceBrief = getBriefDescriptors(source, sourceKeypoints);

const destination = readSync(
  '../test/img/featureMatching/crop3.png',
).convertColor(ImageColorModel.GREY);
const destinationKeypoints = getOrientedFastKeypoints(
  destination,
  keypointOptions,
);
const destinationBrief = getBriefDescriptors(destination, destinationKeypoints);

console.log({
  source: { width: source.width, height: source.height },
  destination: { width: destination.width, height: destination.height },
});
console.log({
  keypoints: {
    sourceLength: sourceKeypoints.length,
    destinationLength: destinationKeypoints.length,
  },
  descriptors: {
    sourceLength: sourceBrief.descriptors.length,
    destinationLength: destinationBrief.descriptors.length,
  },
});

const crossMatches = getCrosscheckMatches(
  sourceBrief.descriptors,
  destinationBrief.descriptors,
);

const matches = bruteForceOneMatch(
  sourceBrief.descriptors,
  destinationBrief.descriptors,
  { nbBestMatches: 20 },
);

console.log('nb matches: ' + crossMatches.length);

const montage = new Montage(source, destination, {
  scale: 2,
  disposition: MontageDispositions.VERTICAL,
});

montage.drawMatches(matches, sourceKeypoints, destinationKeypoints, {
  showDistance: true,
  color: [255, 0, 0],
});

montage.drawMatches(crossMatches, sourceKeypoints, destinationKeypoints, {
  showDistance: true,
  color: [0, 0, 255],
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
  origin: montage.destinationOrigin,
});

writeSync('./result.png', montage.image);
