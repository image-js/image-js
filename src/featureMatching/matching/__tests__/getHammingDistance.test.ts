import { ImageColorModel } from '../../../Image';
import { getBriefDescriptors } from '../../descriptors/getBriefDescriptors';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { getHammingDistance } from '../getHammingDistance';

test('distance should be 0', () => {
  const a = new Uint8Array([0, 1, 0, 0, 0, 0, 0]);
  expect(getHammingDistance(a, a)).toBe(0);
});

test('distance should be array length', () => {
  const a = new Uint8Array([0, 1, 0, 0, 0, 0, 0]);
  const b = new Uint8Array([1, 0, 1, 1, 1, 1, 1]);

  expect(getHammingDistance(a, b)).toBe(a.length);
});

test('two random arrays', () => {
  const a = new Uint8Array([1, 0, 0, 0, 1, 1, 0]);
  const b = new Uint8Array([0, 0, 1, 0, 1, 1, 0]);

  expect(getHammingDistance(a, b)).toBe(2);
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
