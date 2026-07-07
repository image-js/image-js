import { expect, test } from 'vitest';

import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints.js';
import { drawKeypoints } from '../drawKeypoints.js';

const image = testUtils.load('various/alphabet.jpg');
const grey = image.convertColor('GREY');
const keypoints = getOrientedFastKeypoints(grey, { maxNbFeatures: 20 });

test('alphabet image with score coloring', () => {
  const result = drawKeypoints(image, keypoints, {
    showScore: true,
    fill: true,
    showScoreOptions: { font: '35px sans-serif', fontColor: [255, 0, 0] },
  });

  expect(result).toMatchImageSnapshot({
    failureThreshold: 0.025,
    failureThresholdType: 'percent',
  });

  const maxNbKeypoints = drawKeypoints(image, keypoints, {
    showScore: true,
    fill: true,
    maxNbKeypoints: 50,
    showScoreOptions: { font: '35px sans-serif', fontColor: [255, 0, 0] },
  });

  expect(maxNbKeypoints).toMatchImage(result);
});

test('only draw 5 best matches', () => {
  const result = drawKeypoints(image, keypoints, {
    maxNbKeypoints: 5,
    showScoreOptions: { font: '35px sans-serif', fontColor: [255, 0, 0] },
  });

  expect(result).toMatchImageSnapshot();
});

test('draw orientation', () => {
  const result = drawKeypoints(image, keypoints, {
    showOrientation: true,
    strokeColor: [0, 255, 0],
  });

  expect(result).toMatchImageSnapshot();
});
