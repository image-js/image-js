import { ImageColorModel, Image } from '../../../Image';
import {
  BriefDescriptor,
  getBriefDescriptors,
} from '../../descriptors/getBriefDescriptors';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { Montage } from '../../visualize/Montage';
import { bruteForceOneMatch } from '../bruteForceMatch';

/**
 * Get BRIEF descriptors for an image
 *
 * @param image - The image.
 * @returns The descriptors.
 */
function getDescriptors(image: Image): BriefDescriptor[] {
  const grey = image.convertColor(ImageColorModel.GREY);
  const keypoints = getOrientedFastKeypoints(grey);
  return getBriefDescriptors(grey, keypoints).descriptors;
}

test('nbBestMatches = 5', () => {
  const source = testUtils.load('featureMatching/alphabet.jpg');
  const sourceDescriptors = getDescriptors(source);
  const destination = testUtils.load('featureMatching/alphabet.jpg');
  const destinationDescriptors = getDescriptors(destination);

  const matches = bruteForceOneMatch(
    sourceDescriptors,
    destinationDescriptors,
    { nbBestMatches: 5 },
  );

  expect(matches.length).toBe(5);
});

test.only('scalene triangle', () => {
  const source = testUtils
    .load('featureMatching/scaleneTriangle.png')
    .convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(source);
  const sourceDescriptors = getBriefDescriptors(
    source,
    sourceKeypoints,
  ).descriptors;
  const destination = testUtils
    .load('featureMatching/scaleneTriangle2.png')
    .convertColor(ImageColorModel.GREY);
  const destinationKeypoints = getOrientedFastKeypoints(destination);
  const destinationDescriptors = getBriefDescriptors(
    destination,
    destinationKeypoints,
  ).descriptors;

  const matches = bruteForceOneMatch(sourceDescriptors, destinationDescriptors);

  // expect(matches.length).toBe(2);

  const montage = new Montage(source, destination);
  montage.drawKeypoints(sourceKeypoints);
  montage.drawKeypoints(destinationKeypoints, {
    origin: montage.destinationOrigin,
  });
  montage.drawMatches(matches, sourceKeypoints, destinationKeypoints);

  expect(montage.image).toMatchImageSnapshot();
});
