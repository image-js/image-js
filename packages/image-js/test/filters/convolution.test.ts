import { separableConvolution, directConvolution, BorderType, read } from 'ijs';
import { Matrix } from 'ml-matrix';
import { getTestImage } from 'test';

describe('convolution functions', () => {
  it('separable convolution compared to opencv', async () => {
    const img = getTestImage();
    const convoluted = separableConvolution(
      img,
      [0.1, 0.2, 0.3],
      [0.4, 0.5, 0.6],
      {
        borderType: BorderType.REFLECT
      }
    );

    const expected = await read('test/img/testConv.png');
    expect(convoluted.width).toStrictEqual(img.width);
    expect(convoluted.height).toStrictEqual(img.height);
    expect(convoluted.data).toStrictEqual(expected.data);
  });

  it('direct convolution compared to opencv', async () => {
    const img = getTestImage();
    const kernelY = Matrix.columnVector([0.4, 0.5, 0.6]);
    const kernelX = Matrix.rowVector([0.1, 0.2, 0.3]);
    const kernel = kernelY.mmul(kernelX).to2DArray();
    const convoluted = directConvolution(img, kernel, {
      borderType: BorderType.REFLECT
    });

    const expected = await read('test/img/testConv.png');
    expect(convoluted.data).toStrictEqual(expected.data);
  });
});
