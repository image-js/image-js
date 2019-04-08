import {
  directConvolution as directConvolution1D,
  BorderType as ConvolutionBorderType
} from 'ml-convolution';
import { Matrix } from 'ml-matrix';

import { Image } from '../Image';
import { clamp } from '../utils/clamp';
import { BorderType } from '../types';
import { interpolateBorder } from '../utils/interpolateBorder';
import { round } from '../utils/round';

interface ISeparableConvolutionOptions {
  borderType?: BorderType;
  normalize?: boolean;
}

export function directConvolution(
  image: Image,
  kernel: number[][],
  options: ISeparableConvolutionOptions = {}
): Image {
  const { borderType } = options;

  const newImage = Image.createFrom(image);

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
          borderType
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
  const kernelOffsetX = (kernelX.length - 1) / 2;
  const kernelOffsetY = (kernelY.length - 1) / 2;
  const hFactor = image.channels * image.width;
  const newImage = Image.createFrom(image);

  for (let c = 0; c < image.channels; c++) {
    const imgArr = [];
    for (let y = 0; y < image.height; y++) {
      const row = [];
      const rowIndex = y * image.width * image.channels;
      for (let x = 0; x < image.width; x++) {
        row.push(image.data[rowIndex + x * image.channels + c]);
      }
      imgArr.push(directConvolution1D(row, kernelX, ConvolutionBorderType.CUT));
    }

    for (let x = 0; x < image.width - 2 * kernelOffsetX; x++) {
      const wOffset = (x + kernelOffsetX) * image.channels;
      const column = [];
      for (let y = 0; y < image.height; y++) {
        column.push(imgArr[y][x]);
      }
      const result = directConvolution1D(
        column,
        kernelY,
        ConvolutionBorderType.CUT
      );
      for (let i = 0; i < result.length; i++) {
        const idx = (i + kernelOffsetY) * hFactor + wOffset + c;
        newImage.data[idx] = round(clamp(result[i], newImage));
      }
    }
  }

  // Calculate kernel from separated kernels.

  const matrixX = Matrix.rowVector(kernelX);
  const matrixY = Matrix.columnVector(kernelY);
  const kernel = matrixY.mmul(matrixX).to2DArray();

  // Apply convolution on the left and right borders
  for (let c = 0; c < image.channels; c++) {
    for (let bY = 0; bY < image.height; bY++) {
      for (let bX = 0; bX < kernelOffsetX; bX++) {
        const idx = (bY * image.width + bX) * image.channels + c;

        const bXopp = image.width - bX - 1;
        const bYopp = image.height - bY - 1;
        const idxOpp = (bYopp * image.width + bXopp) * image.channels + c;

        newImage.data[idx] = computeConvolutionPixel(
          bX,
          bY,
          c,
          image,
          kernel,
          borderType
        );
        newImage.data[idxOpp] = computeConvolutionPixel(
          bXopp,
          bYopp,
          c,
          image,
          kernel,
          borderType
        );
      }
    }
  }

  // apply the convolution on the top and bottom borders
  for (let c = 0; c < image.channels; c++) {
    for (let bX = 0; bX < image.width; bX++) {
      for (let bY = 0; bY < kernelOffsetY; bY++) {
        const idx = (bY * image.width + bX) * image.channels + c;
        const bXopp = image.width - bX - 1;
        const bYopp = image.height - bY - 1;
        const idxOpp = (bYopp * image.width + bXopp) * image.channels + c;

        newImage.data[idx] = computeConvolutionPixel(
          bX,
          bY,
          c,
          image,
          kernel,
          borderType
        );
        newImage.data[idxOpp] = computeConvolutionPixel(
          bXopp,
          bYopp,
          c,
          image,
          kernel,
          borderType
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
  borderType: BorderType = BorderType.REFLECT_101
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
      // console.log(x, y, imgX, imgY);
      val += kernelValue * image.getValue(imgY, imgX, channel);
    }
  }

  return round(clamp(val, image));
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
