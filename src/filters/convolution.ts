import {
  DirectConvolution,
  BorderType as ConvolutionBorderType,
} from 'ml-convolution';
import { Matrix } from 'ml-matrix';

import { IJS } from '../IJS';
import { getClamp, ClampFunction } from '../utils/clamp';
import { getIndex } from '../utils/getIndex';
import { getOutputImage } from '../utils/getOutputImage';
import {
  BorderType,
  getBorderInterpolation,
  BorderInterpolationFunction,
} from '../utils/interpolateBorder';
import { round } from '../utils/round';

export interface ConvolutionOptions {
  /**
   * Specify how the borders should be handled.
   *
   * @default BorderType.REFLECT_101
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is CONSTANT.
   *
   * @default 0
   */
  borderValue?: number;
  /**
   * Should the kernel be normalised?
   *
   * @default false
   */
  normalize?: boolean;
  /**
   * Image to which to output.
   */
  out?: IJS;
}

/**
 * Apply a direct convolution on an image using the specified kernel. The convolution corresponds of a weighted average of the surrounding pixels, the weights being defined in the kernel.
 *
 * @param image - The image to process.
 * @param kernel - Kernel to use for the convolution. Should be a 2D matrix with odd number of rows and columns.
 * @param options - Convolution options.
 * @returns The convoluted image.
 */
export function directConvolution(
  image: IJS,
  kernel: number[][],
  options: ConvolutionOptions = {},
): IJS {
  const { borderType = BorderType.REFLECT_101, borderValue = 0 } = options;

  const convolutedData = rawDirectConvolution(image, kernel, {
    borderType,
    borderValue,
  });

  const newImage = getOutputImage(image, options);
  const clamp = getClamp(newImage);

  for (let i = 0; i < image.size; i++) {
    for (let channel = 0; channel < image.channels; channel++) {
      let dataIndex = i * image.channels + channel;
      let newValue = round(clamp(convolutedData[dataIndex]));
      newImage.setValueByIndex(i, channel, newValue);
    }
  }

  return newImage;
}

/**
 * Compute direct convolution of an image and return an array with the raw values.
 *
 * @param image - Image to process.
 * @param kernel - 2D kernel used for the convolution.
 * @param options - Convolution options.
 * @returns Array with the raw convoluted values.
 */
export function rawDirectConvolution(
  image: IJS,
  kernel: number[][],
  options: ConvolutionOptions = {},
): Float64Array {
  const { borderType = BorderType.REFLECT_101, borderValue = 0 } = options;
  const interpolateBorder = getBorderInterpolation(borderType, borderValue);

  let result = new Float64Array(image.size * image.channels);

  for (let channel = 0; channel < image.channels; channel++) {
    for (let row = 0; row < image.height; row++) {
      for (let column = 0; column < image.width; column++) {
        let index = getIndex(row, column, image, channel);
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
 *
 * @param image - Image to convolute.
 * @param kernelX - Kernel along x axis.
 * @param kernelY - Kernel along y axis.
 * @param options - Convolution options.
 * @returns The convoluted image.
 */
export function separableConvolution(
  image: IJS,
  kernelX: number[],
  kernelY: number[],
  options: ConvolutionOptions = {},
): IJS {
  const {
    normalize,
    borderType = BorderType.REFLECT_101,
    borderValue = 0,
  } = options;
  const interpolateBorder = getBorderInterpolation(borderType, borderValue);
  if (normalize) {
    [kernelX, kernelY] = normalizeSeparatedKernel(kernelX, kernelY);
  }
  const doubleKernelOffsetX = kernelX.length - 1;
  const kernelOffsetX = doubleKernelOffsetX / 2;
  const doubleKernelOffsetY = kernelY.length - 1;
  const kernelOffsetY = doubleKernelOffsetY / 2;

  const { width, height, channels } = image;

  const cutWidth = width - doubleKernelOffsetX;

  const newImage = IJS.createFrom(image);
  const clamp = getClamp(newImage);

  const rowConvolution = new DirectConvolution(
    width,
    kernelX,
    ConvolutionBorderType.CUT,
  );
  const columnConvolution = new DirectConvolution(
    height,
    kernelY,
    ConvolutionBorderType.CUT,
  );

  const rowData = new Float64Array(width);
  const columnData = new Float64Array(height);
  const convolvedData = new Float64Array(cutWidth * height);

  for (let channel = 0; channel < channels; channel++) {
    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        rowData[column] = image.getValue(row, column, channel);
      }
      const convolvedRow = rowConvolution.convolve(rowData);
      for (let column = 0; column < cutWidth; column++) {
        convolvedData[row * cutWidth + column] = convolvedRow[column];
      }
    }

    for (let column = 0; column < cutWidth; column++) {
      const wOffset = column + kernelOffsetX;
      for (let row = 0; row < height; row++) {
        columnData[row] = convolvedData[row * cutWidth + column];
      }
      const result = columnConvolution.convolve(columnData);
      for (let i = 0; i < result.length; i++) {
        const index = (i + kernelOffsetY) * width + wOffset;
        newImage.setValueByIndex(index, channel, round(clamp(result[i])));
      }
    }
  }

  // Calculate kernel from separated kernels.

  const matrixX = Matrix.rowVector(kernelX);
  const matrixY = Matrix.columnVector(kernelY);
  const kernel = matrixY.mmul(matrixX).to2DArray();

  // Apply convolution on the left and right borders
  for (let channel = 0; channel < channels; channel++) {
    for (let bY = 0; bY < height; bY++) {
      for (let bX = 0; bX < kernelOffsetX; bX++) {
        const index = bY * width + bX;

        const bXopp = width - bX - 1;
        const bYopp = height - bY - 1;
        const indexOpp = bYopp * width + bXopp;
        newImage.setValueByIndex(
          index,
          channel,
          computeConvolutionValue(
            bX,
            bY,
            channel,
            image,
            kernel,
            interpolateBorder,
            { clamp },
          ),
        );
        newImage.setValueByIndex(
          indexOpp,
          channel,
          computeConvolutionValue(
            bXopp,
            bYopp,
            channel,
            image,
            kernel,
            interpolateBorder,
            { clamp },
          ),
        );
      }
    }
  }

  // apply the convolution on the top and bottom borders
  for (let channel = 0; channel < channels; channel++) {
    for (let bX = 0; bX < width; bX++) {
      for (let bY = 0; bY < kernelOffsetY; bY++) {
        const index = bY * width + bX;
        const bXopp = width - bX - 1;
        const bYopp = height - bY - 1;
        const indexOpp = bYopp * width + bXopp;

        newImage.setValueByIndex(
          index,
          channel,
          computeConvolutionValue(
            bX,
            bY,
            channel,
            image,
            kernel,
            interpolateBorder,
            { clamp },
          ),
        );
        newImage.setValueByIndex(
          indexOpp,
          channel,
          computeConvolutionValue(
            bXopp,
            bYopp,
            channel,
            image,
            kernel,
            interpolateBorder,
            { clamp },
          ),
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
 *
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
  image: IJS,
  kernel: number[][],
  interpolateBorder: BorderInterpolationFunction,
  options: ComputeConvolutionValueOptions = {},
): number {
  let { returnRawValue = false, clamp } = options;

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
 * @param kernelX
 * @param kernelY
 */
function normalizeSeparatedKernel(
  kernelX: number[],
  kernelY: number[],
): [number[], number[]] {
  const sumKernelX = kernelX.reduce((prev, current) => prev + current, 0);
  const sumKernelY = kernelY.reduce((prev, current) => prev + current, 0);
  const prod = sumKernelX * sumKernelY;
  if (prod < 0) {
    throw new Error('this separated kernel cannot be normalized');
  }
  const factor = 1 / Math.sqrt(Math.abs(prod));
  return [kernelX.map((v) => v * factor), kernelY.map((v) => v * factor)];
}
