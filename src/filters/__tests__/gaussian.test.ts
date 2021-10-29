import { BorderType } from '../../utils/interpolateBorder';
import { gaussianBlur } from '../gaussianBlur';

describe('gaussianBlur', () => {
  it.skip('gaussian blur should have same result as opencv', async () => {
    const img = testUtils.load('opencv/test.png');
    const options = {
      borderType: BorderType.REFLECT,
      size: 3,
      sigmaX: 1,
      sigmaY: 1,
    };
    const blurred = gaussianBlur(img, options);

    // const grey = convertColor(img, ImageKind.GREY);
    // const greyBlurred = gaussianBlur(grey, options);
    // console.log(greyBlurred.data);

    const expected = testUtils.load('opencv/testGaussianBlur.png');
    // write('gaussian.png', blurred);
    expect(expected).toMatchImage(blurred);
  });
});
