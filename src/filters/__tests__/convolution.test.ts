import { Matrix } from 'ml-matrix';

import { getClamp } from '../../utils/clamp.js';
import { getBorderInterpolation } from '../../utils/interpolateBorder.js';
import {
  computeConvolutionValue,
  rawDirectConvolution,
} from '../convolution.js';

describe('convolution functions', () => {
  it('separable convolution compared to opencv', () => {
    const img = testUtils.load('opencv/test.png');
    const convoluted = img.separableConvolution(
      [0.1, 0.2, 0.3],
      [0.4, 0.5, 0.6, -0.3, -0.4],
      {
        borderType: 'reflect',
      },
    );

    const expected = testUtils.load('opencv/testConvolution.png');

    expect(convoluted).toMatchImage(expected);
  });

  it('direct convolution compared to opencv', () => {
    const img = testUtils.load('opencv/test.png');

    const kernelY = Matrix.columnVector([0.4, 0.5, 0.6, -0.3, -0.4]);
    const kernelX = Matrix.rowVector([0.1, 0.2, 0.3]);
    const kernel = kernelY.mmul(kernelX).to2DArray();

    const convoluted = img.directConvolution(kernel, {
      borderType: 'reflect',
    });

    const expected = testUtils.load('opencv/testConvolution.png');
    expect(convoluted).toMatchImage(expected);
  });

  it('normalized separated convolution should normalize as for direct convolution', () => {
    const img = testUtils.load('opencv/test.png');

    const kernelY = Matrix.columnVector([1, 0, 1]);
    const kernelX = Matrix.rowVector([2, 1, 2]);
    const kernel = kernelY.mmul(kernelX);

    const normalizedKernel = kernel.mul(1 / kernel.sum());

    const img1 = img.directConvolution(normalizedKernel.to2DArray());
    const img2 = img.separableConvolution(
      kernelX.to1DArray(),
      kernelY.to1DArray(),
      {
        normalize: true,
      },
    );

    expect(img1).toMatchImage(img2);
  });
});

describe('computeConvolutionValue', () => {
  it('round and clamp', () => {
    const image = testUtils.createGreyImage([
      [1, 1, 20],
      [1, 1, 1],
      [1, 1, 1],
    ]);
    const kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const clamp = getClamp(image);
    const interpolateBorder = getBorderInterpolation('reflect101', 0);
    expect(
      computeConvolutionValue(1, 1, 0, image, kernel, interpolateBorder, {
        clamp,
      }),
    ).toBe(28);
  });
  it('round and clamp with negative kernel values', () => {
    const image = testUtils.createGreyImage([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
    const kernel = [
      [-1, 1, -1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const clamp = getClamp(image);

    const interpolateBorder = getBorderInterpolation('reflect101', 0);
    expect(
      computeConvolutionValue(1, 1, 0, image, kernel, interpolateBorder, {
        clamp,
      }),
    ).toBe(5);
  });
  it('return raw value', () => {
    const image = testUtils.createGreyImage([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
    const kernel = [
      [0.5, 1, -1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const interpolateBorder = getBorderInterpolation('reflect101', 0);

    expect(
      computeConvolutionValue(1, 1, 0, image, kernel, interpolateBorder, {
        returnRawValue: true,
      }),
    ).toBe(6.5);
  });
});

describe('rawDirectConvolution', () => {
  it('3x3 image and kernel', () => {
    const image = testUtils.createGreyImage([
      [1, 1, 20],
      [1, 1, 1],
      [1, 1, 1],
    ]);
    const kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];

    const expected = Float64Array.from([9, 28, 28, 9, 28, 28, 9, 9, 9]);
    expect(rawDirectConvolution(image, kernel)).toStrictEqual(expected);
  });
  it('3x3 image and kernel with floats', () => {
    const image = testUtils.createGreyImage([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
    const kernel = [
      [1, 1, 1],
      [1, 0.5, 1],
      [1, 1, 1],
    ];

    const expected = Float64Array.from([
      8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5,
    ]);
    expect(rawDirectConvolution(image, kernel)).toStrictEqual(expected);
  });
});
