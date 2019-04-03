import { separableConvolution, write, BorderType } from 'ijs';
import { getTestImage } from 'test';

describe('convolution functions', () => {
  it('separable convolution', () => {
    const img = getTestImage();
    const convoluted = separableConvolution(
      img,
      [0.3, 0.3, 0.3],
      [0.3, 0.3, 0.3],
      BorderType.REFLECT
    );

    write('test.png', convoluted);
    expect(convoluted.width).toStrictEqual(img.width);
  });
});
