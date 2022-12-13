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

test.only('should work with small patch size', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoints = getOrientedFastKeypoints(grey, { maxNbFeatures: 10 });
  expect(keypoints).toHaveLength(10);

  const keypoint = keypoints.slice(0, 1);
  console.log(keypoint);

  const keypointCoordinates = keypoint.map((kpt) => kpt.origin);

  let imageWithKeypoints = image.clone();

  imageWithKeypoints.drawCircle(keypointCoordinates[0], 5, {
    color: [255, 0, 0, 255],
    out: imageWithKeypoints,
  });

  expect(imageWithKeypoints).toMatchImageSnapshot();

  const descriptor = getBriefDescriptors(grey, keypoint, { patchSize: 5 });

  console.log(descriptor);
  expect(descriptor).toMatchSnapshot();
});
