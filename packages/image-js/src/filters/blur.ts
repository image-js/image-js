import { Image } from '../Image';
import { BorderType } from '../types';

import { separableConvolution } from './convolution';

export interface IBlurOptions {
  width: number;
  height: number;
  borderType?: BorderType;
  borderValue?: number;
  out?: Image;
}

export function blur(image: Image, options: IBlurOptions): Image {
  const { width, height } = options;
  const kernelX = new Array(width).fill(1);
  const kernelY = new Array(height).fill(1);

  return separableConvolution(image, kernelX, kernelY, {
    normalize: true,
    ...options
  });
}
