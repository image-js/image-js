import { BorderType } from '../../utils/interpolateBorder';
import { gaussianBlur } from '../gaussianBlur';

describe('gaussianBlur', () => {
  it('symmetrical kernel, should return the kernel itself', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 255, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    const options = { size: 5, sigma: 1, borderType: BorderType.REPLICATE };

    let result = image.gaussianBlur(options);

    let sum = 0;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        sum += result.getValue(i, j, 0);
      }
    }

    // expect the value to be close to 255
    expect(sum).toBe(253);

    expect(result).toMatchImageData([
      [1, 3, 6, 3, 1],
      [3, 15, 25, 15, 3],
      [6, 25, 41, 25, 6],
      [3, 15, 25, 15, 3],
      [1, 3, 6, 3, 1],
    ]);
  });
  it('size error', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 255, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    const options = { size: 4, sigma: 1 };

    expect(() => {
      image.gaussianBlur(options);
    }).toThrow('gaussianBlur: gaussian blur size must be positive and odd');
  });
  it('x and y kernels', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 255, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    const options = {
      size: 5,
      sigmaX: 1,
      sigmaY: 1,
      borderType: BorderType.REPLICATE,
    };

    let result = image.gaussianBlur(options);

    let sum = 0;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        sum += result.getValue(i, j, 0);
      }
    }

    // expect the value to be close to 255
    expect(sum).toBe(253);

    expect(result).toMatchImageData([
      [1, 3, 6, 3, 1],
      [3, 15, 25, 15, 3],
      [6, 25, 41, 25, 6],
      [3, 15, 25, 15, 3],
      [1, 3, 6, 3, 1],
    ]);
  });

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
