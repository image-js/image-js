import { ImageColorModel } from '../../../Image';
import { drawKeypoints } from '../../draw/drawKeypoints';
import { getFastKeypoints } from '../getFastKeypoints';

test('alphabet image, default options', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoints = getFastKeypoints(grey);

  expect(keypoints).toHaveLength(119);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('alphabet image, nonMaxSuppression = false', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoints = getFastKeypoints(grey, { nonMaxSuppression: false });

  expect(keypoints).toHaveLength(500);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('alphabet image, maxNbFeatures = 50', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoints = getFastKeypoints(grey, { maxNbFeatures: 50 });

  expect(keypoints).toHaveLength(50);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('alphabet image, threshold = 150', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoints = getFastKeypoints(grey, { threshold: 150 });

  expect(keypoints).toHaveLength(60);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('alphabet, fastRadius = 5', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);
  const keypoints = getFastKeypoints(grey, { fastRadius: 5 });

  expect(keypoints).toHaveLength(137);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('grayscale image, threshold = 100, normalizeScores = true', () => {
  const grey = testUtils.load('various/grayscale_by_zimmyrose.png');
  const keypoints = getFastKeypoints(grey, {
    threshold: 100,
    normalizeScores: true,
  });
  const image = grey.convertColor(ImageColorModel.RGB);

  expect(keypoints).toHaveLength(19);
  expect(keypoints[0].score).toBe(1);
  expect(keypoints).toMatchSnapshot();
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('alphabet image, scoreAlgorithm = HARRIS, nms = false, normalizeScores=true', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);
  const keypoints = getFastKeypoints(grey, {
    scoreAlgorithm: 'HARRIS',
    nonMaxSuppression: false,
    normalizeScores: true,
  });

  expect(keypoints).toHaveLength(500);
  expect(keypoints).toMatchSnapshot();
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('alphabet image, scoreAlgorithm = HARRIS', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);
  const keypoints = getFastKeypoints(grey, {
    scoreAlgorithm: 'HARRIS',
  });

  expect(keypoints).toHaveLength(158);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('alphabet image, scoreAlgorithm = HARRIS, maxNbFeatures = 50', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);
  const keypoints = getFastKeypoints(grey, {
    scoreAlgorithm: 'HARRIS',
    maxNbFeatures: 50,
  });

  expect(keypoints).toHaveLength(50);
  expect(drawKeypoints(image, keypoints)).toMatchImageSnapshot();
});

test('wrong color model error', () => {
  const image = testUtils.load('various/alphabet.jpg');
  expect(() => {
    getFastKeypoints(image);
  }).toThrow(
    'The process "getFastKeypoints" can only be applied if the number of channels is 1',
  );
});

test('undefined score algorithm error', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);
  expect(() => {
    // @ts-expect-error: test for js users
    getFastKeypoints(grey, { scoreAlgorithm: 'test' });
  }).toThrow('getFastKeypoints: undefined score algorithm test');
});
