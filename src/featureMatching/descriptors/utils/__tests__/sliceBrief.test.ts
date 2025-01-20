import { getOrientedFastKeypoints } from '../../../keypoints/getOrientedFastKeypoints.js';
import { getBriefDescriptors } from '../../getBriefDescriptors.js';
import { sliceBrief } from '../sliceBrief.js';

test('default options', () => {
  const image = testUtils
    .load(`featureMatching/polygons/polygon.png`)
    .convertColor('GREY')
    .invert();

  const keypoints = getOrientedFastKeypoints(image);

  const brief = getBriefDescriptors(image, keypoints);

  const result = sliceBrief(brief);

  expect(result).toStrictEqual(brief);
});

test('slice 0 to 3', () => {
  const image = testUtils
    .load(`featureMatching/polygons/polygon.png`)
    .convertColor('GREY')
    .invert();

  const keypoints = getOrientedFastKeypoints(image);

  const brief = getBriefDescriptors(image, keypoints);

  const result = sliceBrief(brief, { end: 3 });

  expect(result.descriptors.length).toBe(3);
});

test('range error', () => {
  const image = testUtils
    .load(`featureMatching/polygons/polygon.png`)
    .convertColor('GREY')
    .invert();

  const keypoints = getOrientedFastKeypoints(image);

  const brief = getBriefDescriptors(image, keypoints);

  expect(() => sliceBrief(brief, { start: -1 })).toThrow(
    'start or end are out of range',
  );
});
