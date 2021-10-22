import { IJS } from '../IJS';
import { BorderType } from '../utils/interpolateBorder';

import { separableConvolution } from './convolution';

interface GaussianBlurBaseOptions {
  size: number;
  borderType?: BorderType;
  out?: IJS;
}

export interface GaussianBlurSigmaOptions extends GaussianBlurBaseOptions {
  sigma: number;
}

export interface GaussianBlurXYOptions extends GaussianBlurBaseOptions {
  sigmaX: number;
  sigmaY: number;
}

export type GaussianBlurOptions =
  | GaussianBlurSigmaOptions
  | GaussianBlurXYOptions;

function getRadius(size: number): number {
  if (size % 2 !== 1 || size < 0) {
    throw new Error('gaussian blur size must be positive and odd');
  }
  return (size - 1) / 2;
}

export function gaussianBlur(image: IJS, options: GaussianBlurOptions): IJS {
  if ('sigma' in options) {
    const { size, sigma } = options;
    const radius = getRadius(size);
    const kernel = getKernel(radius, sigma);
    return separableConvolution(image, kernel, kernel, {
      borderType: options.borderType,
    });
  } else {
    getRadius(options.size);
    const { sigmaX, sigmaY } = options;
    const radius = getRadius(options.size);
    const kernelX = getKernel(radius, sigmaX);
    const kernelY = getKernel(radius, sigmaY);
    return separableConvolution(image, kernelX, kernelY, {
      borderType: options.borderType,
    });
  }
}

function getKernel(radius: number, sigma: number): number[] {
  const n = radius * 2 + 1;
  const kernel = new Array(n);
  const sigmaX = sigma ? sigma : ((n - 1) * 0.5 - 1) * 0.3 + 0.8;
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
