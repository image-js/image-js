import { separableConvolution, BorderType, read } from 'ijs';
import { getTestImage } from 'test';

describe('convolution functions', () => {
  it('separable convolution', async () => {
    const img = getTestImage();
    const convoluted = separableConvolution(
      img,
      [0.1, 0.2, 0.3],
      [0.4, 0.5, 0.6],
      BorderType.REFLECT
    );

    const expected = await read('test/img/testConv.png');
    expect(convoluted.width).toStrictEqual(img.width);
    expect(convoluted.height).toStrictEqual(img.height);
    expect(convoluted.data).toStrictEqual(expected.data);
  });
});
