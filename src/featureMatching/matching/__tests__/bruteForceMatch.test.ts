import { ImageColorModel, Image } from '../../../Image';
import {
  BriefDescriptor,
  getBriefDescriptors,
} from '../../descriptors/getBriefDescriptors';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { bruteForceOneMatch } from '../bruteForceMatch';

/**
 * Get BRIEF descriptors for an image
 *
 * @param image - The image.
 * @returns The descriptors.
 */
function getDescriptors(image: Image): BriefDescriptor[] {
  const grey = image.convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(grey);
  return getBriefDescriptors(grey, sourceKeypoints);
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
