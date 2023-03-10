import { ImageColorModel, Image, ImageCoordinates } from '../../../Image';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { getBriefDescriptors } from '../getBriefDescriptors';

test('count occurences of 1 and 0 with default options', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoint = getOrientedFastKeypoints(grey, { maxNbFeatures: 1 });

  const descriptor = getBriefDescriptors(grey, keypoint).descriptors[0];

  let nbOnes = 0;
  for (let element of descriptor) {
    if (element) nbOnes++;
  }
  const onesPercentage = (nbOnes / descriptor.length) * 100;

  // in the BRIEF article, they say that the optimal value would be 50%
  expect(onesPercentage).toBeCloseTo(47.66);
});

test('patch size error', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoint = getOrientedFastKeypoints(grey, { maxNbFeatures: 1 });

  expect(() => getBriefDescriptors(grey, keypoint, { patchSize: 4 })).toThrow(
    'getBriefDescriptors: patchSize must be an odd integer',
  );
});

test('alphabet image should work', () => {
  const source = testUtils.load('various/alphabet.jpg');
  const grey = source.convertColor(ImageColorModel.GREY);

  const sourceKeypoints = getOrientedFastKeypoints(grey);
  expect(() => getBriefDescriptors(grey, sourceKeypoints)).not.toThrow();
  const result = getBriefDescriptors(grey, sourceKeypoints);
  expect(result.descriptors.length).toBe(result.keypoints.length);
});

test('image too small for patchsize', () => {
  const image = new Image(5, 5, { colorModel: ImageColorModel.GREY });
  const sourceKeypoints = getOrientedFastKeypoints(image);
  expect(() => getBriefDescriptors(image, sourceKeypoints)).toThrow(
    'image is too small for patchSize = 31',
  );
});

test('verify descriptor is correct (descriptorLength = 10)', () => {
  const size = 5;
  const image = new Image(size, size, { colorModel: ImageColorModel.GREY });
  for (let i = 0; i < 2 * size; i++) {
    image.setPixelByIndex(i, [255]);
  }

  const keypoint = [
    {
      origin: image.getCoordinates(ImageCoordinates.CENTER),
      angle: 0,
      score: 1,
    },
  ];

  const descriptor = getBriefDescriptors(image, keypoint, {
    patchSize: size,
    descriptorLength: 10,
    smoothingOptions: { sigma: 1.4, size: 1 }, // disabling smoothing
  }).descriptors[0];

  expect(descriptor).toStrictEqual(
    new Uint8Array([0, 0, 0, 0, 0, 0, 1, 0, 1, 0]),
  );
});
