import { ImageColorModel } from '../../Image';
import { bruteForceOneMatch } from '../bruteForceMatch';
import { getBriefDescriptors } from '../getBriefDescriptors';
import { getOrientedFastKeypoints } from '../getOrientedFastKeypoints';

const source = testUtils.load('various/alphabet.jpg');
const grey = source.convertColor(ImageColorModel.GREY);
const sourceKeypoints = getOrientedFastKeypoints(grey);
const sourceDescriptors = getBriefDescriptors(grey, sourceKeypoints);

const destination = testUtils.load('various/alphabet.jpg');
const grey2 = destination.convertColor(ImageColorModel.GREY);
const destinationKeypoints = getOrientedFastKeypoints(grey2);
const destinationDescriptors = getBriefDescriptors(grey2, destinationKeypoints);

test('nbBestMatches = 5', () => {
  const matches = bruteForceOneMatch(
    sourceDescriptors,
    destinationDescriptors,
    { nbBestMatches: 5 },
  );

  expect(matches.length).toBe(5);
});
