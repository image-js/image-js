import { ImageColorModel } from '../../../Image';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { drawKeypoints } from '../drawKeypoints';

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
