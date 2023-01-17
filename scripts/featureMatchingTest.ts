import {
  Montage,
  drawKeypoints,
  drawMatches,
  getOrientedFastKeypoints,
  getBriefDescriptors,
  bruteForceOneMatch,
  DrawKeypointsOptions,
} from '../src/featureMatching';
import { ImageColorModel, readSync, writeSync } from '../src';

const source = readSync('../test/img/featureMatching/crop1.png').convertColor(
  ImageColorModel.GREY,
);
const sourceKeypoints = getOrientedFastKeypoints(source);
const sourceDescriptors = getBriefDescriptors(source, sourceKeypoints);

const destination = readSync(
  '../test/img/featureMatching/crop3.png',
).convertColor(ImageColorModel.GREY);
const destinationKeypoints = getOrientedFastKeypoints(destination);
const destinationDescriptors = getBriefDescriptors(
  destination,
  destinationKeypoints,
);

const matches = bruteForceOneMatch(sourceDescriptors, destinationDescriptors, {
  nbBestMatches: 5,
});

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

console.log(montage.height);

writeSync('./result.png', montage.image);
