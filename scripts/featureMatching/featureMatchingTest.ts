import util from 'node:util';

import type { GetBriefOptions } from '../../src/featureMatching/descriptors/getBrief.js';
import { getBrief } from '../../src/featureMatching/descriptors/getBrief.js';
import type {
  DrawKeypointsOptions,
  GetColorsOptions,
} from '../../src/index.js';
import {
  Montage,
  getCrosscheckMatches,
  readSync,
  writeSync,
} from '../../src/index.js';
import { getMinMax } from '../../src/utils/getMinMax.js';

util.inspect.defaultOptions.depth = 5;

const getBriefOptions: GetBriefOptions = {
  centroidPatchDiameter: 31,
  bestKptRadius: 5,
};

// define the two images to analyse
const firstNumber = 1;
const secondNumber = 2;

const source = readSync(
  `../../test/img/featureMatching/id-crops/crop${firstNumber}.png`,
).convertColor('GREY');
// fix contrast
const sourceExtremums = getMinMax(source);
source.level({
  inputMin: sourceExtremums.min[0],
  inputMax: sourceExtremums.max[0],
  out: source,
});

const destination = readSync(
  `../../test/img/featureMatching/id-crops/crop${secondNumber}.png`,
).convertColor('GREY');

// fix contrast
const destinationExtremums = getMinMax(destination);
destination.level({
  inputMin: destinationExtremums.min[0],
  inputMax: destinationExtremums.max[0],
  out: destination,
});

console.log({
  source: { width: source.width, height: source.height },
  destination: { width: destination.width, height: destination.height },
});

const sourceBrief = getBrief(source, getBriefOptions);
const destinationBrief = getBrief(destination, getBriefOptions);

console.table(sourceBrief.keypoints);

console.log({
  keypoints: {
    sourceLength: sourceBrief.keypoints.length,
    destinationLength: destinationBrief.keypoints.length,
  },
  descriptors: {
    sourceLength: sourceBrief.descriptors.length,
    destinationLength: destinationBrief.descriptors.length,
  },
  maxScore: {
    source: sourceBrief.keypoints[0].score,
    destination: destinationBrief.keypoints[0].score,
  },
});

const crossMatches = getCrosscheckMatches(
  sourceBrief.descriptors,
  destinationBrief.descriptors,
);
console.log(`nb crosscheck matches: ${crossMatches.length}`);

const montage = new Montage(source, destination, {
  scale: 2,
  disposition: 'vertical',
});

const showDistanceOptions: GetColorsOptions = { minValueFactor: 0.2 };

// montage.drawMatches(
//   matches,
//   sourceBrief.keypoints,
//   destinationBrief.keypoints,
//   {
//     showDistance: true,
//     color: [255, 0, 0],
//     circleDiameter: getBriefOptions.centroidPatchDiameter,
//     showDistanceOptions,
//   },
// );

montage.drawMatches(
  crossMatches,
  sourceBrief.keypoints,
  destinationBrief.keypoints,
  {
    showDistance: true,
    strokeColor: [0, 0, 255],
    circleDiameter: getBriefOptions.centroidPatchDiameter,
    showDistanceOptions,
  },
);

const kptOptions: DrawKeypointsOptions = {
  markerSize: 3,
  strokeColor: [0, 255, 0],
  showScore: true,
  fill: true,
};

montage.drawKeypoints(sourceBrief.keypoints, kptOptions);
montage.drawKeypoints(destinationBrief.keypoints, {
  ...kptOptions,
  origin: montage.destinationOrigin,
});

writeSync(`./results/result-${firstNumber}-${secondNumber}.png`, montage.image);

console.log('IMAGE WRITTEN TO DISK');
