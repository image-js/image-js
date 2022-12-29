import { ImageColorModel } from '../../Image';
import { drawKeypoints } from '../drawKeypoints';
import { getOrientedFastKeypoints } from '../getOrientedFastKeypoints';

test('alphabet image with score coloring', () => {
  const image = testUtils.load('various/alphabet.jpg');
  const grey = image.convertColor(ImageColorModel.GREY);
  const keypoints = getOrientedFastKeypoints(grey, { maxNbFeatures: 20 });

  const result = drawKeypoints(image, keypoints, {
    showScore: true,
    fill: true,
  });

  expect(result).toMatchImageSnapshot();
});
