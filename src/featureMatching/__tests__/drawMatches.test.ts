import { ImageColorModel } from '../../Image';
import { bruteForceOneMatch } from '../bruteForceMatch';
import { drawMatches } from '../drawMatches';
import { getBriefDescriptors } from '../getBriefDescriptors';
import { getOrientedFastKeypoints } from '../getOrientedFastKeypoints';

test('alphabet image as source and destination', () => {
  const source = testUtils.load('various/alphabet.jpg');
  const grey = source.convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(grey, { maxNbFeatures: 10 });
  const sourceDescriptors = getBriefDescriptors(grey, sourceKeypoints);

  const destination = testUtils.load('various/alphabet.jpg');
  const grey2 = source.convertColor(ImageColorModel.GREY);
  const destinationKeypoints = getOrientedFastKeypoints(grey2, {
    maxNbFeatures: 10,
  });
  const destinationDescriptors = getBriefDescriptors(
    grey2,
    destinationKeypoints,
  );

  const matches = bruteForceOneMatch(sourceDescriptors, destinationDescriptors);

  const result = drawMatches(
    source,
    destination,
    sourceKeypoints,
    destinationKeypoints,
    matches,
  );

  expect(result).toMatchImageSnapshot();
});
