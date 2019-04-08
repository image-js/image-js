import {
  gaussianBlur,
  read,
  //   write,
  BorderType
  //   convertColor,
  //   ImageKind
} from 'ijs';
import { getTestImage } from 'test';

describe('gaussianBlur', () => {
  it.skip('gaussian blur should have same result as opencv', async () => {
    const img = getTestImage();
    const options = {
      borderType: BorderType.REFLECT,
      size: 3,
      sigmaX: 1,
      sigmaY: 1
    };
    const blurred = gaussianBlur(img, options);

    // const grey = convertColor(img, ImageKind.GREY);
    // const greyBlurred = gaussianBlur(grey, options);
    // console.log(greyBlurred.data);

    const expected = await read('test/img/testGaussianBlur.png');
    // write('gaussian.png', blurred);
    expect(expected.data).toStrictEqual(blurred.data);
  });
});
