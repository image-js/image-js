import {
  BorderType as ConvolutionBorderType,
  DirectConvolution,
} from 'ml-convolution';

import { Image } from '../Image.js';
import { extendBorders } from '../operations/extendBorders.js';
import { getClamp } from '../utils/clamp.js';
import { getIndex } from '../utils/getIndex.js';
import { getOutputImage } from '../utils/getOutputImage.js';
import type { BorderType } from '../utils/interpolateBorder.js';
import { getBorderInterpolation } from '../utils/interpolateBorder.js';
import { round } from '../utils/round.js';
import type {
  BorderInterpolationFunction,
  ClampFunction,
} from '../utils/utils.types.js';

export interface ConvolutionOptions {
  /**
   * Specify how the borders should be handled.
   * @default `'reflect101'`
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is 'constant'.
   * @default `0`
   */
  borderValue?: number;
  /**
   * Whether the kernel should be normalized.
   * @default `false`
   */
  normalize?: boolean;
  /**
   * Image to which to output.
   */
  out?: Image;
}

/**
 * Apply a direct convolution on an image using the specified kernel. The convolution corresponds of a weighted average of the surrounding pixels, the weights being defined in the kernel.
 * @param image - The image to process.
 * @param kernel - Kernel to use for the convolution. Should be a 2D matrix with odd number of rows and columns.
 * @param options - Convolution options.
 * @returns The convoluted image.
 */
export function directConvolution(
  image: Image,
  kernel: number[][],
  options: ConvolutionOptions = {},
): Image {
  const { borderType = 'reflect101', borderValue = 0 } = options;

  const convolutedData = rawDirectConvolution(image, kernel, {
    borderType,
    borderValue,
  });

  const newImage = getOutputImage(image, options);
  const clamp = getClamp(newImage);

  for (let i = 0; i < image.size; i++) {
    for (let channel = 0; channel < image.channels; channel++) {
      const dataIndex = i * image.channels + channel;
      const newValue = round(clamp(convolutedData[dataIndex]));
      newImage.setValueByIndex(i, channel, newValue);
    }
  }

  return newImage;
}

/**
 * Compute direct convolution of an image and return an array with the raw values.
 * @param image - Image to process.
 * @param kernel - 2D kernel used for the convolution.
 * @param options - Convolution options.
 * @returns Array with the raw convoluted values.
 */
export function rawDirectConvolution(
  image: Image,
  kernel: number[][],
  options: ConvolutionOptions = {},
): Float64Array {
  const { borderType = 'reflect101', borderValue = 0 } = options;
  const interpolateBorder = getBorderInterpolation(borderType, borderValue);

  const result = new Float64Array(image.size * image.channels);

  for (let channel = 0; channel < image.channels; channel++) {
    for (let row = 0; row < image.height; row++) {
      for (let column = 0; column < image.width; column++) {
        const index = getIndex(column, row, image, channel);
        result[index] = computeConvolutionValue(
          column,
          row,
          channel,
          image,
          kernel,
          interpolateBorder,
          { returnRawValue: true },
        );
      }
    }
  }

  return result;
}

/**
 * Compute the separable convolution of an image.
 * @param image - Image to convolute.
 * @param kernelX - Kernel along x axis.
 * @param kernelY - Kernel along y axis.
 * @param options - Convolution options.
 * @returns The convoluted image.
 */
export function separableConvolution(
  image: Image,
  kernelX: number[],
  kernelY: number[],
  options: ConvolutionOptions = {},
): Image {
  const { normalize, borderType = 'reflect101', borderValue = 0 } = options;
  if (normalize) {
    [kernelX, kernelY] = normalizeSeparatedKernel(kernelX, kernelY);
  }

  const doubleKernelOffsetX = kernelX.length - 1;
  const kernelOffsetX = doubleKernelOffsetX / 2;
  const doubleKernelOffsetY = kernelY.length - 1;
  const kernelOffsetY = doubleKernelOffsetY / 2;

  const extendedImage = extendBorders(image, {
    horizontal: kernelOffsetX,
    vertical: kernelOffsetY,
    borderType,
    borderValue,
  });

  const newImage = Image.createFrom(image);
  const clamp = getClamp(newImage);

  const rowConvolution = new DirectConvolution(
    extendedImage.width,
    kernelX,
    ConvolutionBorderType.CUT,
  );
  const columnConvolution = new DirectConvolution(
    extendedImage.height,
    kernelY,
    ConvolutionBorderType.CUT,
  );

  const rowData = new Float64Array(extendedImage.width);
  const columnData = new Float64Array(extendedImage.height);
  const convolvedData = new Float64Array(
    // Use `image.width` because convolution with BorderType.CUT reduces the size of the convolved data.
    image.width * extendedImage.height,
  );

  for (let channel = 0; channel < extendedImage.channels; channel++) {
    for (let row = 0; row < extendedImage.height; row++) {
      for (let column = 0; column < extendedImage.width; column++) {
        rowData[column] = extendedImage.getValue(column, row, channel);
      }
      const convolvedRow = rowConvolution.convolve(rowData);
      for (let column = 0; column < image.width; column++) {
        convolvedData[row * image.width + column] = convolvedRow[column];
      }
    }

    for (let column = 0; column < image.width; column++) {
      for (let row = 0; row < extendedImage.height; row++) {
        columnData[row] = convolvedData[row * image.width + column];
      }
      const convolvedColumn = columnConvolution.convolve(columnData);
      for (let row = 0; row < image.height; row++) {
        newImage.setValue(
          column,
          row,
          channel,
          round(clamp(convolvedColumn[row])),
        );
      }
    }
  }

  return newImage;
}

export interface ComputeConvolutionValueOptions {
  /**
   * Specify wether the return value should not be clamped and rounded.
   */
  returnRawValue?: boolean;
  /**
   * If the value has to be clamped, specify the clamping function.
   */
  clamp?: ClampFunction;
}

/**
 * Compute the convolution of a value of a pixel in an image.
 * @param column - Column of the pixel.
 * @param row - Row of the pixel.
 * @param channel - Channel to process.
 * @param image - Image to process.
 * @param kernel - Kernel for the convolutions.
 * @param interpolateBorder - Function to interpolate the border pixels.
 * @param options - Compute convolution value options.
 * @returns The convoluted value.
 */
export function computeConvolutionValue(
  column: number,
  row: number,
  channel: number,
  image: Image,
  kernel: number[][],
  interpolateBorder: BorderInterpolationFunction,
  options: ComputeConvolutionValueOptions = {},
): number {
  let { clamp } = options;
  const { returnRawValue = false } = options;

  if (returnRawValue) {
    clamp = undefined;
  }

  let val = 0;
  const kernelWidth = kernel[0].length;
  const kernelHeight = kernel.length;
  const kernelOffsetX = (kernelWidth - 1) / 2;
  const kernelOffsetY = (kernelHeight - 1) / 2;

  for (let kY = 0; kY < kernelHeight; kY++) {
    for (let kX = 0; kX < kernelWidth; kX++) {
      const kernelValue = kernel[kY][kX];
      val +=
        kernelValue *
        interpolateBorder(
          column + kX - kernelOffsetX,
          row + kY - kernelOffsetY,
          channel,
          image,
        );
    }
  }
  if (!clamp) {
    return val;
  } else {
    return round(clamp(val));
  }
}

/**
 * Normalize a separated kernel.
 * @param kernelX - Horizontal component of the separated kernel.
 * @param kernelY - Vertical component of the separated kernel.
 * @returns The normalized kernel.
 */
function normalizeSeparatedKernel(
  kernelX: number[],
  kernelY: number[],
): [number[], number[]] {
  const sumKernelX = kernelX.reduce((prev, current) => prev + current, 0);
  const sumKernelY = kernelY.reduce((prev, current) => prev + current, 0);
  const prod = sumKernelX * sumKernelY;
  if (prod < 0) {
    throw new RangeError('this separated kernel cannot be normalized');
  }
  const factor = 1 / Math.sqrt(Math.abs(prod));
  return [kernelX.map((v) => v * factor), kernelY.map((v) => v * factor)];
}
