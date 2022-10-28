import { Image } from '../Image';
import { BorderType } from '../utils/interpolateBorder';

import { separableConvolution } from './convolution';

interface GaussianBlurBaseOptions {
  /**
   * Specify how the borders should be handled.
   *
   * @default BorderType.REFLECT_101
   */
  borderType?: BorderType;
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Image;
}

export interface GaussianBlurSigmaOptions extends GaussianBlurBaseOptions {
  /**
   * The standard deviation. Specifies the width of the gaussian function in the case where it is the same for x and y.
   */
  sigma: number;
  /**
   * Size of the kernel.
   *
   * @default 2 * Math.ceil(2 * sigma) + 1
   */
  size?: number;
}

export interface GaussianBlurXYOptions extends GaussianBlurBaseOptions {
  /**
   * The standard deviation for the x axis. Specifies the width of the gaussian function along x.
   */
  sigmaX: number;
  /**
   * The standard deviation for the y axis. Specifies the width of the gaussian function along y.
   */
  sigmaY: number;
  /**
   * Size of the X axis kernel
   *
   * @default 2 * Math.ceil(2 * sigmaX) + 1
   */
  sizeX?: number;
  /**
   * Size of the Y axis kernel
   *
   * @default 2 * Math.ceil(2 * sigmaY) + 1
   */
  sizeY?: number;
}

export type GaussianBlurOptions =
  | GaussianBlurSigmaOptions
  | GaussianBlurXYOptions;

function getRadius(size: number): number {
  if (size % 2 !== 1 || size < 0) {
    throw new Error(
      'gaussianBlur: gaussian blur size must be positive and odd',
    );
  }
  return (size - 1) / 2;
}

/**
 * Apply a gaussian filter to an image.
 *
 * @param image - Image to blur.
 * @param options - Gaussian blur options.
 * @returns The blurred image.
 */
export function gaussianBlur(
  image: Image,
  options: GaussianBlurOptions,
): Image {
  if ('sigma' in options) {
    const { sigma, size = getSize(sigma), borderType } = options;
    const radius = getRadius(size);
    const kernel = getKernel(radius, sigma);
    return separableConvolution(image, kernel, kernel, {
      borderType,
    });
  } else {
    const {
      sigmaX,
      sigmaY,
      sizeX = getSize(sigmaX),
      sizeY = getSize(sigmaY),
      borderType,
    } = options;

    const radiusX = getRadius(sizeX);
    const radiusY = getRadius(sizeY);

    const kernelX = getKernel(radiusX, sigmaX);
    const kernelY = getKernel(radiusY, sigmaY);
    return separableConvolution(image, kernelX, kernelY, {
      borderType,
    });
  }
}

function getKernel(radius: number, sigma: number): number[] {
  const n = radius * 2 + 1;
  const kernel = new Array(n);
  // TODO: check if sigma can really be 0 or undefined.
  const sigmaX = sigma || ((n - 1) * 0.5 - 1) * 0.3 + 0.8;
  const scale2X = -0.5 / (sigmaX * sigmaX);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const x = i - radius;
    const t = Math.exp(scale2X * x * x);
    kernel[i] = t;
    sum += t;
  }

  for (let i = 0; i < n; i++) {
    kernel[i] /= sum;
  }
  return kernel;
}

function getSize(sigma: number): number {
  return 2 * Math.ceil(2 * sigma) + 1;
}
