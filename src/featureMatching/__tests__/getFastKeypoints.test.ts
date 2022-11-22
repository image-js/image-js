import { ImageColorModel } from '../../Image';
import { writeSync } from '../../save';
import { getFastKeypoints } from '../getFastKeypoints';

test('alphabet image, default options', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoints = getFastKeypoints(grey);

  const keypointsCoordinates = keypoints.map((kpt) => kpt.origin);

  image.drawPoints(keypointsCoordinates, {
    color: [255, 0, 0, 255],
    out: image,
  });

  expect(keypoints).toHaveLength(119);
  expect(image).toMatchImageSnapshot();
});

test('alphabet image, nonMaxSuppression = false', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoints = getFastKeypoints(grey, { nonMaxSuppression: false });

  const keypointsCoordinates = keypoints.map((kpt) => kpt.origin);

  image.drawPoints(keypointsCoordinates, {
    color: [255, 0, 0, 255],
    out: image,
  });

  expect(keypoints).toHaveLength(500);
  expect(image).toMatchImageSnapshot();
});

test('alphabet image, maxNbFeatures = 10', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoints = getFastKeypoints(grey, { maxNbFeatures: 10 });

  const keypointsCoordinates = keypoints.map((kpt) => kpt.origin);

  image.drawPoints(keypointsCoordinates, {
    color: [255, 0, 0, 255],
    out: image,
  });

  expect(keypoints).toHaveLength(10);
  expect(image).toMatchImageSnapshot();
});

test('alphabet image, threshold = 100', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoints = getFastKeypoints(grey, { threshold: 150 });

  const keypointsCoordinates = keypoints.map((kpt) => kpt.origin);

  for (let keypoint of keypointsCoordinates) {
    image.drawCircle(keypoint, 5, {
      color: [255, 0, 0, 255],
      out: image,
    });
  }

  expect(keypoints).toHaveLength(60);
  expect(image).toMatchImageSnapshot();
});

test('alphabet, fastRadius = 5', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);
  const keypoints = getFastKeypoints(grey, { fastRadius: 5 });

  const keypointsCoordinates = keypoints.map((kpt) => kpt.origin);

  for (let keypoint of keypointsCoordinates) {
    image.drawCircle(keypoint, 5, {
      color: [255, 0, 0, 255],
      out: image,
    });
  }

  expect(keypoints).toHaveLength(137);
  expect(image).toMatchImageSnapshot();
});

test('grayscale image, threshold = 100, normaliseScores = true', () => {
  const grey = testUtils.load('various/grayscale_by_zimmyrose.png');
  const keypoints = getFastKeypoints(grey, {
    threshold: 100,
    normaliseScores: true,
  });

  const keypointsCoordinates = keypoints.map((kpt) => kpt.origin);

  const image = grey.convertColor(ImageColorModel.RGB);
  for (let keypoint of keypointsCoordinates) {
    image.drawCircle(keypoint, 5, {
      color: [255, 0, 0],
      out: image,
    });
  }

  expect(keypoints).toHaveLength(19);
  expect(keypoints[0].score).toBe(1);
  expect(keypoints).toMatchSnapshot();
  expect(image).toMatchImageSnapshot();
});

test('alphabet image, scoreAlgorithm = HARRIS, nms = false, normaliseScores=true', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);
  const keypoints = getFastKeypoints(grey, {
    scoreAlgorithm: 'HARRIS',
    nonMaxSuppression: false,
    normaliseScores: true,
  });

  const keypointsCoordinates = keypoints.map((kpt) => kpt.origin);

  for (let keypoint of keypointsCoordinates) {
    image.drawCircle(keypoint, 5, {
      color: [255, 0, 0, 255],
      out: image,
    });
  }

  writeSync('./src/featureMatching/__tests__/harrisScore.png', image);

  expect(keypoints).toMatchSnapshot();
  expect(keypoints).toHaveLength(500);
  expect(image).toMatchImageSnapshot();
});

test('alphabet image, scoreAlgorithm = HARRIS', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);
  const keypoints = getFastKeypoints(grey, {
    scoreAlgorithm: 'HARRIS',
  });

  const keypointsCoordinates = keypoints.map((kpt) => kpt.origin);

  for (let keypoint of keypointsCoordinates) {
    image.drawCircle(keypoint, 5, {
      color: [255, 0, 0, 255],
      out: image,
    });
  }

  writeSync('./src/featureMatching/__tests__/harrisScore.png', image);

  expect(keypoints).toHaveLength(158);
  expect(image).toMatchImageSnapshot();
});

test('wrong color model error', () => {
  const image = testUtils.load('various/alphabet.jpg');
  expect(() => {
    getFastKeypoints(image);
  }).toThrow(
    'The process "getFastKeypoints" can only be applied if the number of channels is 1',
  );
});
