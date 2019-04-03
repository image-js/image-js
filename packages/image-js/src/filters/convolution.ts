import {
  directConvolution,
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
      imgArr.push(directConvolution(row, kernelX, ConvolutionBorderType.CUT));
    }

    for (let x = 0; x < image.width - 2 * kernelOffsetX; x++) {
      const wOffset = (x + kernelOffsetY) * image.channels;
      const column = [];
      for (let y = 0; y < image.height; y++) {
        column.push(imgArr[y][x]);
      }
      const result = directConvolution(
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

  for (let c = 0; c < image.channels; c++) {
    for (let bX = 0; bX < kernelOffsetY; bX++) {
      for (let bY = 0; bY < image.height; bY++) {
        const idx = (bY * image.width + bX) * image.channels + c;
        const bXopp = image.width - bX - 1;
        const bYopp = image.height - bY - 1;
        const idxOpp = (bYopp * image.width + bXopp) * image.channels + c;

        newImage.data[idx] = computeConvolutionBorder(
          bX,
          bY,
          c,
          image,
          kernel,
          borderType
        );
        newImage.data[idxOpp] = computeConvolutionBorder(
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

  for (let c = 0; c < image.channels; c++) {
    for (let bX = 0; bX < image.width; bX++) {
      for (let bY = 0; bY < kernelOffsetY; bY++) {
        const idx = (bY * image.width + bX) * image.channels + c;
        const bXopp = image.width - bX - 1;
        const bYopp = image.height - bY - 1;
        const idxOpp = (bYopp * image.width + bXopp) * image.channels + c;

        newImage.data[idx] = computeConvolutionBorder(
          bX,
          bY,
          c,
          image,
          kernel,
          borderType
        );
        newImage.data[idxOpp] = computeConvolutionBorder(
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

function computeConvolutionBorder(
  bX: number,
  bY: number,
  c: number,
  image: Image,
  kernel: number[][],
  borderType: BorderType = BorderType.REFLECT_101
): number {
  let val = 0;
  const kernelOffsetX = (kernel[0].length - 1) / 2;
  const kernelOffsetY = (kernel.length - 1) / 2;

  for (let kY = 0; kY < kernel.length; kY++) {
    for (let kX = 0; kX < kernel.length; kX++) {
      const kernelValue = kernel[kY][kX];
      const x = interpolateBorder(
        bX + kX - kernelOffsetX,
        image.width,
        borderType
      );
      const y = interpolateBorder(
        bY + kY - kernelOffsetY,
        image.height,
        borderType
      );
      val += kernelValue * image.getValue(y, x, c);
    }
  }

  return round(clamp(val, image));
}

export function normalizeSeparatedKernel(
  kernelX: number[],
  kernelY: number[]
): [number[], number[]] {
  const sumKernelX = kernelX.reduce((prev, current) => prev + current, 0);
  const sumKernelY = kernelY.reduce((prev, current) => prev + current, 0);
  const factor = 1 / Math.sqrt(sumKernelX * sumKernelY);
  return [kernelX.map((v) => v * factor), kernelY.map((v) => v * factor)];
}
