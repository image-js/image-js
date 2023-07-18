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
    message: 'centroidPatchDiameter = 7',
    centroidPatchDiameter: 7,
    expected: [
      { srcIndex: 0, dstIndex: 0, distance: 18 },
      { srcIndex: 0, dstIndex: 1, distance: 36 },
      { srcIndex: 1, dstIndex: 0, distance: 34 },
      { srcIndex: 1, dstIndex: 1, distance: 10 },
    ],
  },
  {
    message: 'centroidPatchDiameter = 15',
    centroidPatchDiameter: 15,
    expected: [
      { srcIndex: 0, dstIndex: 0, distance: 6 },
      { srcIndex: 0, dstIndex: 1, distance: 37 },
      { srcIndex: 1, dstIndex: 0, distance: 28 },
      { srcIndex: 1, dstIndex: 1, distance: 11 },
    ],
  },
  {
    message: 'centroidPatchDiameter = 31',
    centroidPatchDiameter: 31,
    expected: [
      { srcIndex: 0, dstIndex: 0, distance: 4 },
      { srcIndex: 0, dstIndex: 1, distance: 36 },
      { srcIndex: 1, dstIndex: 0, distance: 29 },
      { srcIndex: 1, dstIndex: 1, distance: 11 },
    ],
  },
])('check distance for each keypoint pair ($message)', (data) => {
  const source = testUtils
    .load('featureMatching/polygons/scaleneTriangle.png')
    .convertColor('GREY');
  const sourceKeypoints = getOrientedFastKeypoints(source, {
    centroidPatchDiameter: data.centroidPatchDiameter,
  });
  const sourceBrief = getBriefDescriptors(source, sourceKeypoints);
  const destination = testUtils
    .load('featureMatching/polygons/scaleneTriangle10.png')
    .convertColor('GREY');
  const destinationKeypoints = getOrientedFastKeypoints(destination, {
    centroidPatchDiameter: data.centroidPatchDiameter,
  });
  const destinationBrief = getBriefDescriptors(
    destination,
    destinationKeypoints,
  );
  const result = [];

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
