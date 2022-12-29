import { ImageColorModel } from '../../Image';
import { getBriefDescriptors } from '../getBriefDescriptors';
import { getOrientedFastKeypoints } from '../getOrientedFastKeypoints';

test('alphabet image, maxNbFeatures = 10', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoints = getOrientedFastKeypoints(grey, { maxNbFeatures: 10 });
  expect(keypoints).toHaveLength(10);

  const keypointsCoordinates = keypoints.map((kpt) => kpt.origin);

  let imageWithKeypoints = image.clone();
  for (let i = 0; i < 10; i++) {
    imageWithKeypoints.drawCircle(keypointsCoordinates[i], 5, {
      color: [255, 0, 0, 255],
      out: imageWithKeypoints,
    });
  }

  expect(imageWithKeypoints).toMatchImageSnapshot();

  const descriptors = getBriefDescriptors(grey, keypoints);

  expect(descriptors).toMatchSnapshot();
});

test('should work with small patch size', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoints = getOrientedFastKeypoints(grey, { maxNbFeatures: 10 });
  expect(keypoints).toHaveLength(10);

  const keypoint = keypoints.slice(0, 1);

  const keypointCoordinates = keypoint.map((kpt) => kpt.origin);

  let imageWithKeypoints = image.clone();

  imageWithKeypoints.drawCircle(keypointCoordinates[0], 5, {
    color: [255, 0, 0, 255],
    out: imageWithKeypoints,
  });

  expect(imageWithKeypoints).toMatchImageSnapshot();

  const descriptor = getBriefDescriptors(grey, keypoint, { patchSize: 5 });

  expect(descriptor).toMatchSnapshot();
});

test('count occurences of 1 and 0 with default options', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoint = getOrientedFastKeypoints(grey, { maxNbFeatures: 1 });

  const descriptor = getBriefDescriptors(grey, keypoint)[0];

  let nbOnes = 0;
  for (let element of descriptor) {
    if (element) nbOnes++;
  }
  const onesPercentage = (nbOnes / descriptor.length) * 100;

  // in the BRIEF article, they say that the optimal value would be 50%
  expect(onesPercentage).toBeCloseTo(11.33);
});

test('patch size error', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoint = getOrientedFastKeypoints(grey, { maxNbFeatures: 1 });

  expect(() => getBriefDescriptors(grey, keypoint, { patchSize: 4 })).toThrow(
    'getBriefDescriptors: patchSize should be an odd integer',
  );
});

test('alphabet image should work', () => {
  const source = testUtils.load('various/alphabet.jpg');
  const grey = source.convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(grey);
  expect(() => getBriefDescriptors(grey, sourceKeypoints)).not.toThrow();
});
