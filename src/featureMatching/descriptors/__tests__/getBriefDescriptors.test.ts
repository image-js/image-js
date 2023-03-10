import { ImageColorModel, Image, ImageCoordinates } from '../../../Image';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { getHammingDistance } from '../../matching/getHammingDistance';
import { drawKeypoints } from '../../visualize/drawKeypoints';
import { getBriefDescriptors } from '../getBriefDescriptors';

test('alphabet image, maxNbFeatures = 10', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoints = getOrientedFastKeypoints(grey, { maxNbFeatures: 10 });
  expect(keypoints).toHaveLength(10);

  let imageWithKeypoints = drawKeypoints(image, keypoints);

  expect(imageWithKeypoints).toMatchImageSnapshot();

  const result = getBriefDescriptors(grey, keypoints);

  expect(result.descriptors).toMatchSnapshot();
  expect(result.descriptors.length).toBe(keypoints.length);
});

test('should work with small patch size', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);

  const keypoints = getOrientedFastKeypoints(grey, { maxNbFeatures: 10 });
  expect(keypoints).toHaveLength(10);

  const keypoint = keypoints.slice(0, 1);

  let imageWithKeypoints = drawKeypoints(image, keypoints);
  expect(imageWithKeypoints).toMatchImageSnapshot();

  const descriptor = getBriefDescriptors(grey, keypoint, {
    patchSize: 5,
  }).descriptors;

  expect(descriptor).toMatchSnapshot();
});

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

test.each([
  {
    message: 'windowSize = 7',
    windowSize: 7,
    expected: [
      { srcIndex: 0, dstIndex: 0, distance: 15 },
      { srcIndex: 0, dstIndex: 1, distance: 73 },
      { srcIndex: 1, dstIndex: 0, distance: 77 },
      { srcIndex: 1, dstIndex: 1, distance: 11 },
    ],
  },
  {
    message: 'windowSize = 15',
    windowSize: 15,
    expected: [
      { srcIndex: 0, dstIndex: 0, distance: 13 },
      { srcIndex: 0, dstIndex: 1, distance: 11 },
      { srcIndex: 1, dstIndex: 0, distance: 23 },
      { srcIndex: 1, dstIndex: 1, distance: 7 },
    ],
  },
  {
    message: 'windowSize = 31',
    windowSize: 31,
    expected: [
      { srcIndex: 0, dstIndex: 0, distance: 11 },
      { srcIndex: 0, dstIndex: 1, distance: 14 },
      { srcIndex: 1, dstIndex: 0, distance: 20 },
      { srcIndex: 1, dstIndex: 1, distance: 9 },
    ],
  },
])('check distance for each keypoint pair ($message)', (data) => {
  const source = testUtils
    .load('featureMatching/polygons/scaleneTriangle.png')
    .convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(source, {
    windowSize: data.windowSize,
  });
  const sourceBrief = getBriefDescriptors(source, sourceKeypoints);
  const destination = testUtils
    .load('featureMatching/polygons/scaleneTriangle10.png')
    .convertColor(ImageColorModel.GREY);
  const destinationKeypoints = getOrientedFastKeypoints(destination, {
    windowSize: data.windowSize,
  });
  const destinationBrief = getBriefDescriptors(
    destination,
    destinationKeypoints,
  );
  let result = [];

  for (
    let srcIndex = 0;
    srcIndex < sourceBrief.descriptors.length;
    srcIndex++
  ) {
    for (
      let dstIndex = 0;
      dstIndex < destinationBrief.descriptors.length;
      dstIndex++
    ) {
      const distance = getHammingDistance(
        sourceBrief.descriptors[srcIndex],
        destinationBrief.descriptors[dstIndex],
      );
      result.push({ srcIndex, dstIndex, distance });
    }
  }

  // 0-0 and 1-1 are the correct matches
  expect(result).toStrictEqual(data.expected);
});
