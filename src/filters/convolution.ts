import {
  DirectConvolution,
  BorderType as ConvolutionBorderType,
} from 'ml-convolution';
import { Matrix } from 'ml-matrix';

import { IJS } from '../IJS';
import { getClamp, ClampFunction } from '../utils/clamp';
import { getOutputImage } from '../utils/getOutputImage';
import {
  BorderType,
  getBorderInterpolation,
  BorderInterpolationFunction,
} from '../utils/interpolateBorder';
import { round } from '../utils/round';

export interface ConvolutionOptions {
  borderType?: BorderType;
  borderValue?: number;
  normalize?: boolean;
  out?: IJS;
}

export function directConvolution(
  image: IJS,
  kernel: number[][],
  options: ConvolutionOptions = {},
): IJS {
  const { borderType = BorderType.REFLECT_101, borderValue = 0 } = options;
  const interpolateBorder = getBorderInterpolation(borderType, borderValue);

  const newImage = getOutputImage(image, options);
  const clamp = getClamp(newImage);

  for (let channel = 0; channel < image.channels; channel++) {
    for (let column = 0; column < image.width; column++) {
      for (let row = 0; row < image.height; row++) {
        newImage.setValue(
          row,
          column,
          channel,
          computeConvolutionPixel(
            column,
            row,
            channel,
            image,
            kernel,
            interpolateBorder,
            clamp,
          ),
        );
      }
    }
  }

  return newImage;
}

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

  const hFactor = channels * width;
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
      const wOffset = (column + kernelOffsetX) * channels;
      for (let y = 0; y < height; y++) {
        columnData[y] = convolvedData[y * cutWidth + column];
      }
      const result = columnConvolution.convolve(columnData);
      for (let i = 0; i < result.length; i++) {
        const index = (i + kernelOffsetY) * hFactor + wOffset;
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
        const index = (bY * width + bX) * channels;

        const bXopp = width - bX - 1;
        const bYopp = height - bY - 1;
        const indexOpp = (bYopp * width + bXopp) * channels;
        newImage.setValueByIndex(
          index,
          channel,
          computeConvolutionPixel(
            bX,
            bY,
            channel,
            image,
            kernel,
            interpolateBorder,
            clamp,
          ),
        );
        newImage.setValueByIndex(
          indexOpp,
          channel,
          computeConvolutionPixel(
            bXopp,
            bYopp,
            channel,
            image,
            kernel,
            interpolateBorder,
            clamp,
          ),
        );
      }
    }
  }

  // apply the convolution on the top and bottom borders
  for (let channel = 0; channel < channels; channel++) {
    for (let bX = 0; bX < width; bX++) {
      for (let bY = 0; bY < kernelOffsetY; bY++) {
        const index = (bY * width + bX) * channels;
        const bXopp = width - bX - 1;
        const bYopp = height - bY - 1;
        const indexOpp = (bYopp * width + bXopp) * channels;

        newImage.setValueByIndex(
          index,
          channel,
          computeConvolutionPixel(
            bX,
            bY,
            channel,
            image,
            kernel,
            interpolateBorder,
            clamp,
          ),
        );
        newImage.setValueByIndex(
          indexOpp,
          channel,
          computeConvolutionPixel(
            bXopp,
            bYopp,
            channel,
            image,
            kernel,
            interpolateBorder,
            clamp,
          ),
        );
      }
    }
  }

  return newImage;
}

function computeConvolutionPixel(
  x: number,
  y: number,
  channel: number,
  image: IJS,
  kernel: number[][],
  interpolateBorder: BorderInterpolationFunction,
  clamp: ClampFunction,
): number {
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
          x + kX - kernelOffsetX,
          y + kY - kernelOffsetY,
          channel,
          image,
        );
    }
  }

  return round(clamp(val));
}

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
