import { separatedConvolution, ImageKind, write, BorderType } from 'ijs';
import { getTestImage } from 'test';

describe('convolution functions', () => {
  it('separated convolution', () => {
    const img = getTestImage();
    const convoluted = separatedConvolution(
      img,
      [0.3, 0.3, 0.3],
      [0.3, 0.3, 0.3],
      BorderType.REFLECT
    );

    write('test.png', convoluted);
    expect(convoluted.width).toStrictEqual(img.width);
  });
});
