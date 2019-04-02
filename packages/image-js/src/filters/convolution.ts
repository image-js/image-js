// @ts-ignore
import { directConvolution } from 'ml-convolution';
import { Matrix } from 'ml-matrix';

import { Image } from '../Image';
import { BorderType } from '../types';
import { interpolateBorder } from '../utils/interpolateBorder';

// import { BorderType } from '../types';

export function separatedConvolution(
  image: Image,
  kernelX: number[],
  kernelY: number[],
  borderType: BorderType
): Image {
  const kernelOffset = (kernelY.length - 1) / 2;
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
      imgArr.push(directConvolution(row, kernelX, 'CUT'));
    }

    for (let x = 0; x < image.width; x++) {
      const wOffset = (x + kernelOffset) * image.channels;
      const column = [];
      for (let y = 0; y < image.height; y++) {
        column.push(imgArr[y][x]);
      }
      const result = directConvolution(column, kernelY, 'CUT');
      for (let i = 0; i < result.length; i++) {
        const idx = (i + kernelOffset) * hFactor + wOffset + c;
        newImage.data[idx] = clamp(result[i], newImage);
      }
    }
  }

  // calculate kernel from separated kernels
  const matrixX = Matrix.rowVector(kernelX);
  const matrixY = Matrix.columnVector(kernelY);
  const kernel = matrixY.mmul(matrixX).to2DArray();

  for (let c = 0; c < image.channels; c++) {
    for (let bX = 0; bX < kernelOffset; bX++) {
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
      for (let bY = 0; bY < kernelOffset; bY++) {
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
  borderType: BorderType
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

  return val;
}

function clamp(value: number, image: Image) {
  return Math.round(Math.min(Math.max(value, 0), image.maxValue));
}
