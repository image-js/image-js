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
    showScoreOptions: { font: 'sans-serif 20px', fontColor: [255, 0, 0] },
  });

  expect(result).toMatchImageSnapshot();

  const maxNbKeypoints = drawKeypoints(image, keypoints, {
    showScore: true,
    fill: true,
    maxNbKeypoints: 50,
    showScoreOptions: { font: 'sans-serif 20px', fontColor: [255, 0, 0] },
  });

  expect(maxNbKeypoints).toMatchImage(result);
});

test('only draw 5 best matches', () => {
  const result = drawKeypoints(image, keypoints, {
    maxNbKeypoints: 5,
    showScoreOptions: { font: 'sans-serif 30px', fontColor: [255, 0, 0] },
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
