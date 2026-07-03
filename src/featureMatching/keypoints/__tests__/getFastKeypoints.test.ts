import { expect, test } from 'vitest';

import { drawKeypoints } from '../../visualize/drawKeypoints.js';
import { getFastKeypoints } from '../getFastKeypoints.js';

test('alphabet image, default options', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor('GREY');

  const keypoints = getFastKeypoints(grey);

  expect(keypoints).toHaveLength(119);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('alphabet image, nonMaxSuppression = false', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor('GREY');

  const keypoints = getFastKeypoints(grey, { nonMaxSuppression: false });

  expect(keypoints).toHaveLength(500);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('alphabet image, maxNbFeatures = 50', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor('GREY');

  const keypoints = getFastKeypoints(grey, { maxNbFeatures: 50 });

  expect(keypoints).toHaveLength(50);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('alphabet image, threshold = 150', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor('GREY');

  const keypoints = getFastKeypoints(grey, { threshold: 150 });

  expect(keypoints).toHaveLength(60);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('alphabet image, scoreAlgorithm = HARRIS, maxNbFeatures = 50', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor('GREY');
  const keypoints = getFastKeypoints(grey, {
    scoreAlgorithm: 'HARRIS',
    maxNbFeatures: 50,
  });

  expect(keypoints).toHaveLength(50);
  expect(
    drawKeypoints(image, keypoints, { showScore: true }),
  ).toMatchImageSnapshot({
    failureThreshold: 0.025,
    failureThresholdType: 'percent',
  });
});

test('star', () => {
  const image = testUtils.load('featureMatching/polygons/star.png');
  const grey = image.convertColor('GREY');
  const keypoints = getFastKeypoints(grey, { scoreAlgorithm: 'HARRIS' });

  expect(keypoints).toHaveLength(22);
  expect(
    drawKeypoints(image, keypoints, {
      showScore: true,
      showScoreOptions: { font: 'Helvetica 30px', fontColor: [255, 0, 0] },
    }),
  ).toMatchImageSnapshot({
    failureThreshold: 0.025,
    failureThresholdType: 'percent',
  });
});

test('star with harris', () => {
  const image = testUtils.load('featureMatching/polygons/star.png');
  const grey = image.convertColor('GREY');
  const keypoints = getFastKeypoints(grey, {
    scoreAlgorithm: 'HARRIS',
    nonMaxSuppression: true,
  });

  expect(keypoints).toHaveLength(22);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('star with harris and quality threshold', () => {
  // It's a basic test is to check that we get the same keypoints as
  // opencv implementation with the same parameters.
  const image = testUtils.load('featureMatching/checkerboard.jpg');
  const grey = image.convertColor('GREY');
  const keypoints = getFastKeypoints(grey, {
    scoreAlgorithm: 'HARRIS',
    nonMaxSuppression: false,
    fastRadius: 0,
    nbContiguousPixels: 0,
    qualityThreshold: 0.01,
    maxNbFeatures: 3600,
    scoreOptions: { windowSize: 7, harrisConstant: 0.01 },
  });

  expect(keypoints).toHaveLength(3600);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('star with shi-tomasi', () => {
  const image = testUtils.load('featureMatching/polygons/star.png');
  const grey = image.convertColor('GREY');
  const keypoints = getFastKeypoints(grey, {
    scoreAlgorithm: 'TOMASI',
    nonMaxSuppression: true,
  });

  expect(keypoints).toHaveLength(22);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('wrong color model error', () => {
  const image = testUtils.load('various/alphabet.jpg');

  expect(() => {
    getFastKeypoints(image);
  }).toThrowError('image channels must be 1 to apply this algorithm');
});

test('undefined score algorithm error', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor('GREY');

  expect(() => {
    // @ts-expect-error: test for js users
    getFastKeypoints(grey, { scoreAlgorithm: 'test' });
  }).toThrowError('test');
});
