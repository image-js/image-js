import { ImageColorModel } from '../../../Image';
import { getBriefDescriptors } from '../../descriptors/getBriefDescriptors';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { bruteForceOneMatch } from '../../matching/bruteForceMatch';
import { Montage } from '../Montage';

test('drawKeypoints with default options', () => {
  const source = testUtils.load('featureMatching/alphabet.jpg');
  const grey = source.convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(grey);

  const montage = new Montage(source, source);
  montage.drawKeypoints(sourceKeypoints);

  expect(montage.image).toMatchImageSnapshot();
});

test('drawKeypoints with scale = 2', () => {
  const source = testUtils.load('featureMatching/alphabet.jpg');
  const grey = source.convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(grey);

  const montage = new Montage(source, source, { scale: 2 });
  montage.drawKeypoints(sourceKeypoints);

  expect(montage.image).toMatchImageSnapshot();
});

test('drawMatches with scale = 1.5', () => {
  const source = testUtils.load('featureMatching/alphabet.jpg');
  const grey = source.convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(grey);
  const descriptors = getBriefDescriptors(grey, sourceKeypoints);
  const matches = bruteForceOneMatch(descriptors, descriptors);

  const montage = new Montage(source, source, { scale: 2 });
  montage.drawMatches(matches, sourceKeypoints, sourceKeypoints);

  expect(montage.image).toMatchImageSnapshot();
});
