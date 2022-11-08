import { ImageColorModel } from '../../Image';
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

test('grayscale image, threshold = 100', () => {
  const grey = testUtils.load('various/grayscale_by_zimmyrose.png');
  const keypoints = getFastKeypoints(grey, { threshold: 100 });

  const keypointsCoordinates = keypoints.map((kpt) => kpt.origin);

  const image = grey.convertColor(ImageColorModel.RGB);
  for (let keypoint of keypointsCoordinates) {
    image.drawCircle(keypoint, 5, {
      color: [255, 0, 0],
      out: image,
    });
  }

  expect(keypoints).toHaveLength(19);
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
