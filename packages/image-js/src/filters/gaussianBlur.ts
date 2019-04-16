import { BorderType } from '../types';
import { Image } from '../Image';

import { separableConvolution } from './convolution';

interface IGaussianBlurBaseOptions {
  size: number;
  borderType?: BorderType;
  out?: Image;
}

export interface IGaussianBlurSigmaOptions extends IGaussianBlurBaseOptions {
  sigma: number;
}

export interface IGaussianBlurXYOptions extends IGaussianBlurBaseOptions {
  sigmaX: number;
  sigmaY: number;
}

export type GaussianBlurOptions =
  | IGaussianBlurSigmaOptions
  | IGaussianBlurXYOptions;

function getRadius(size: number): number {
  if (size % 2 !== 1 || size < 0) {
    throw new Error('gaussian blur size must be positive and odd');
  }
  return (size - 1) / 2;
}

export function gaussianBlur(
  image: Image,
  options: GaussianBlurOptions
): Image {
  if ('sigma' in options) {
    const { size, sigma } = options;
    const radius = getRadius(size);
    const kernel = getKernel(radius, sigma);
    return separableConvolution(image, kernel, kernel, {
      borderType: options.borderType
    });
  } else {
    getRadius(options.size);
    const { sigmaX, sigmaY } = options;
    const radius = getRadius(options.size);
    const kernelX = getKernel(radius, sigmaX);
    const kernelY = getKernel(radius, sigmaY);
    return separableConvolution(image, kernelX, kernelY, {
      borderType: options.borderType
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
