import {
  DirectConvolution,
  BorderType as ConvolutionBorderType
} from 'ml-convolution';
import { Matrix } from 'ml-matrix';

import { Image } from '../Image';
import { getClamp, ClampFunction } from '../utils/clamp';
import { BorderType } from '../types';
import { interpolateBorder } from '../utils/interpolateBorder';
import { round } from '../utils/round';
import { getOutputImage } from '../utils/getOutputImage';

interface ISeparableConvolutionOptions {
  borderType?: BorderType;
  normalize?: boolean;
  out?: Image;
}

export function directConvolution(
  image: Image,
  kernel: number[][],
  options: ISeparableConvolutionOptions = {}
): Image {
  const { borderType } = options;

  const newImage = getOutputImage(image, options);
  const clamp = getClamp(newImage);

  for (let c = 0; c < image.channels; c++) {
    for (let x = 0; x < image.width; x++) {
      for (let y = 0; y < image.height; y++) {
        const idx = (y * image.width + x) * image.channels + c;
        newImage.data[idx] = computeConvolutionPixel(
          x,
          y,
          c,
          image,
          kernel,
          borderType,
          clamp
        );
      }
    }
  }

  return newImage;
}

export function separableConvolution(
  image: Image,
  kernelX: number[],
  kernelY: number[],
  options: ISeparableConvolutionOptions = {}
): Image {
  const { normalize, borderType } = options;
  if (normalize) {
    [kernelX, kernelY] = normalizeSeparatedKernel(kernelX, kernelY);
  }
  const doubleKernelOffsetX = kernelX.length - 1;
  const kernelOffsetX = doubleKernelOffsetX / 2;
  const doubleKernelOffsetY = kernelY.length - 1;
  const kernelOffsetY = doubleKernelOffsetY / 2;

  const { width, height, channels, data } = image;

  const hFactor = channels * width;
  const cutWidth = width - doubleKernelOffsetX;

  const newImage = Image.createFrom(image);
  const clamp = getClamp(newImage);

  const rowConvolution = new DirectConvolution(
    width,
    kernelX,
    ConvolutionBorderType.CUT
  );
  const columnConvolution = new DirectConvolution(
    height,
    kernelY,
    ConvolutionBorderType.CUT
  );

  const rowData = new Float64Array(width);
  const columnData = new Float64Array(height);
  const convolvedData = new Float64Array(cutWidth * height);

  for (let c = 0; c < channels; c++) {
    for (let y = 0; y < height; y++) {
      const rowIndex = y * hFactor;
      for (let x = 0; x < width; x++) {
        rowData[x] = data[rowIndex + x * channels + c];
      }
      const convolvedRow = rowConvolution.convolve(rowData);
      for (let x = 0; x < cutWidth; x++) {
        convolvedData[y * cutWidth + x] = convolvedRow[x];
      }
    }

    for (let x = 0; x < cutWidth; x++) {
      const wOffset = (x + kernelOffsetX) * channels;
      for (let y = 0; y < height; y++) {
        columnData[y] = convolvedData[y * cutWidth + x];
      }
      const result = columnConvolution.convolve(columnData);
      for (let i = 0; i < result.length; i++) {
        const idx = (i + kernelOffsetY) * hFactor + wOffset + c;
        newImage.data[idx] = round(clamp(result[i]));
      }
    }
  }

  // Calculate kernel from separated kernels.

  const matrixX = Matrix.rowVector(kernelX);
  const matrixY = Matrix.columnVector(kernelY);
  const kernel = matrixY.mmul(matrixX).to2DArray();

  // Apply convolution on the left and right borders
  for (let c = 0; c < channels; c++) {
    for (let bY = 0; bY < height; bY++) {
      for (let bX = 0; bX < kernelOffsetX; bX++) {
        const idx = (bY * width + bX) * channels + c;

        const bXopp = width - bX - 1;
        const bYopp = height - bY - 1;
        const idxOpp = (bYopp * width + bXopp) * channels + c;

        newImage.data[idx] = computeConvolutionPixel(
          bX,
          bY,
          c,
          image,
          kernel,
          borderType,
          clamp
        );
        newImage.data[idxOpp] = computeConvolutionPixel(
          bXopp,
          bYopp,
          c,
          image,
          kernel,
          borderType,
          clamp
        );
      }
    }
  }

  // apply the convolution on the top and bottom borders
  for (let c = 0; c < channels; c++) {
    for (let bX = 0; bX < width; bX++) {
      for (let bY = 0; bY < kernelOffsetY; bY++) {
        const idx = (bY * width + bX) * channels + c;
        const bXopp = width - bX - 1;
        const bYopp = height - bY - 1;
        const idxOpp = (bYopp * width + bXopp) * channels + c;

        newImage.data[idx] = computeConvolutionPixel(
          bX,
          bY,
          c,
          image,
          kernel,
          borderType,
          clamp
        );
        newImage.data[idxOpp] = computeConvolutionPixel(
          bXopp,
          bYopp,
          c,
          image,
          kernel,
          borderType,
          clamp
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
  image: Image,
  kernel: number[][],
  borderType: BorderType = BorderType.REFLECT_101,
  clamp: ClampFunction
): number {
  let val = 0;
  const kernelWidth = kernel[0].length;
  const kernelHeight = kernel.length;
  const kernelOffsetX = (kernelWidth - 1) / 2;
  const kernelOffsetY = (kernelHeight - 1) / 2;

  for (let kY = 0; kY < kernelHeight; kY++) {
    for (let kX = 0; kX < kernelWidth; kX++) {
      const kernelValue = kernel[kY][kX];
      const imgX = interpolateBorder(
        x + kX - kernelOffsetX,
        image.width,
        borderType
      );
      const imgY = interpolateBorder(
        y + kY - kernelOffsetY,
        image.height,
        borderType
      );
      val += kernelValue * image.getValue(imgY, imgX, channel);
    }
  }

  return round(clamp(val));
}

function normalizeSeparatedKernel(
  kernelX: number[],
  kernelY: number[]
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
