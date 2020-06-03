import { direct, fft } from 'ml-matrix-convolution';

import { validateArrayOfChannels } from '../../util/channel';
import { validateKernel } from '../../util/kernel';
import Image from '../Image';
import { clamp } from '../internal/clamp';

import convolutionSeparable from './convolutionSeparable';
import getSeparatedKernel from './getSeparatedKernel';

/**
 * @memberof Image
 * @instance
 * @param {Array<Array<number>>} kernel
 * @param {object} [options] - options
 * @param {Array} [options.channels] - Array of channels to treat. Defaults to all channels
 * @param {number} [options.bitDepth=this.bitDepth] - A new bit depth can be specified. This allows to use 32 bits to avoid clamping of floating-point numbers.
 * @param {boolean} [options.normalize=false]
 * @param {number} [options.divisor=1]
 * @param {string} [options.border='copy']
 * @param {string} [options.algorithm='auto'] - Either 'auto', 'direct', 'fft' or 'separable'. fft is much faster for large kernel.
 * If the separable algorithm is used, one must provide as kernel an array of two 1D kernels.
 * The 'auto' option will try to separate the kernel if that is possible.
 * @return {Image}
 */
export default function convolution(kernel, options = {}) {
  let {
    channels,
    bitDepth,
    normalize = false,
    divisor = 1,
    border = 'copy',
    algorithm = 'auto',
  } = options;
  let createOptions = {};
  if (bitDepth) createOptions.bitDepth = bitDepth;
  let newImage = Image.createFrom(this, createOptions);

  channels = validateArrayOfChannels(this, channels, true);

  if (algorithm !== 'separable') {
    ({ kernel } = validateKernel(kernel));
  } else if (!Array.isArray(kernel) || kernel.length !== 2) {
    throw new RangeError(
      'separable convolution requires two arrays of numbers to represent the kernel',
    );
  }

  if (algorithm === 'auto') {
    let separatedKernel = getSeparatedKernel(kernel);
    if (separatedKernel !== null) {
      algorithm = 'separable';
      kernel = separatedKernel;
    } else if (
      (kernel.length > 9 || kernel[0].length > 9) &&
      this.width <= 4096 &&
      this.height <= 4096
    ) {
      algorithm = 'fft';
    } else {
      algorithm = 'direct';
    }
  }

  let halfHeight, halfWidth;
  if (algorithm === 'separable') {
    halfHeight = Math.floor(kernel[0].length / 2);
    halfWidth = Math.floor(kernel[1].length / 2);
  } else {
    halfHeight = Math.floor(kernel.length / 2);
    halfWidth = Math.floor(kernel[0].length / 2);
  }
  let clamped = newImage.isClamped;

  let tmpData = new Array(this.height * this.width);
  let index, x, y, channel, c, tmpResult;
  for (channel = 0; channel < channels.length; channel++) {
    c = channels[channel];
    // Copy the channel in a single array
    for (y = 0; y < this.height; y++) {
      for (x = 0; x < this.width; x++) {
        index = y * this.width + x;
        tmpData[index] = this.data[index * this.channels + c];
      }
    }
    if (algorithm === 'direct') {
      tmpResult = direct(tmpData, kernel, {
        rows: this.height,
        cols: this.width,
        normalize: normalize,
        divisor: divisor,
      });
    } else if (algorithm === 'separable') {
      tmpResult = convolutionSeparable(
        tmpData,
        kernel,
        this.width,
        this.height,
      );
      if (normalize) {
        divisor = 0;
        for (let i = 0; i < kernel[0].length; i++) {
          for (let j = 0; j < kernel[1].length; j++) {
            divisor += kernel[0][i] * kernel[1][j];
          }
        }
      }
      if (divisor !== 1) {
        for (let i = 0; i < tmpResult.length; i++) {
          tmpResult[i] /= divisor;
        }
      }
    } else {
      tmpResult = fft(tmpData, kernel, {
        rows: this.height,
        cols: this.width,
        normalize: normalize,
        divisor: divisor,
      });
    }

    // Copy the result to the output image
    for (y = 0; y < this.height; y++) {
      for (x = 0; x < this.width; x++) {
        index = y * this.width + x;
        if (clamped) {
          newImage.data[index * this.channels + c] = clamp(
            tmpResult[index],
            newImage,
          );
        } else {
          newImage.data[index * this.channels + c] = tmpResult[index];
        }
      }
    }
  }
  // if the kernel was not applied on the alpha channel we just copy it
  // TODO: in general we should copy the channels that where not changed
  // TODO: probably we should just copy the image at the beginning ?
  if (this.alpha && !channels.includes(this.channels)) {
    for (x = this.components; x < this.data.length; x = x + this.channels) {
      newImage.data[x] = this.data[x];
    }
  }

  // I only can have 3 types of borders:
  //  1. Considering the image as periodic: periodic
  //  2. Extend the interior borders: copy
  //  3. fill with a color: set
  if (border !== 'periodic') {
    newImage.setBorder({ size: [halfWidth, halfHeight], algorithm: border });
  }

  return newImage;
}
