import { Image } from '../Image.js';
import { Mask } from '../Mask.js';
import { checkKernel } from '../utils/validators/checkKernel.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

export interface DilateOptions {
  /**
   * Matrix with odd dimensions (e.g. 1 by 3). The kernel can only have ones and zeros.
   * Accessing a value: kernel[row][column].
   * @default `[[1, 1, 1], [1, 1, 1], [1, 1, 1]]`
   */
  kernel?: number[][];
  /**
   * Number of iterations of the algorithm.
   *  @default `1`
   */
  iterations?: number;
}

export function dilate(image: Image, options?: DilateOptions): Image;
export function dilate(image: Mask, options?: DilateOptions): Mask;
/**
 * Dilatation is one of two fundamental operations (with erosion) in morphological
 * image processing from which all other morphological operations are based (from Wikipedia).
 * Replaces each value with it's local maximum among the pixels with a kernel value of 1.
 * @see {@link http://docs.opencv.org/2.4/doc/tutorials/imgproc/erosion_dilatation/erosion_dilatation.html}
 * @see {@link https://en.wikipedia.org/wiki/Dilation_(morphology)}
 * @param image - Image to dilate.
 * @param options - Dilate options.
 * @returns Dilated image.
 */
export function dilate(
  image: Image | Mask,
  options: DilateOptions = {},
): Mask | Image {
  let defaultKernel = false;
  if (options.kernel === undefined) {
    defaultKernel = true;
  }

  const {
    kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    iterations = 1,
  } = options;

  if (image instanceof Image) {
    checkProcessable(image, {
      bitDepth: [1, 8, 16],
      components: 1,
      alpha: false,
    });
  }

  checkKernel(kernel);

  let onlyOnes = true;
  if (!defaultKernel) {
    outer: for (const row of kernel) {
      for (const value of row) {
        if (value !== 1) {
          onlyOnes = false;
          break outer;
        }
      }
    }
  }

  let result = image;
  for (let i = 0; i < iterations; i++) {
    if (result instanceof Mask) {
      if (onlyOnes) {
        const newMask = result.clone();
        result = dilatMaskOnlyOnes(
          result,
          newMask,
          kernel[0].length,
          kernel.length,
        );
      } else {
        const newMask = Mask.createFrom(result);
        result = dilateMask(result, newMask, kernel);
      }
    } else if (onlyOnes) {
      const newImage = Image.createFrom(result);
      result = dilateGreyOnlyOnes(
        result,
        newImage,
        kernel[0].length,
        kernel.length,
      );
    } else {
      const newImage = Image.createFrom(result);
      result = dilateGrey(result, newImage, kernel);
    }
  }
  return result;
}

function dilateGrey(image: Image, newImage: Image, kernel: number[][]): Image {
  const kernelWidth = kernel[0].length;
  const kernelHeight = kernel.length;
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;
  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      let max = 0;
      for (let kernelRow = 0; kernelRow < kernelHeight; kernelRow++) {
        for (let kernelColumn = 0; kernelColumn < kernelWidth; kernelColumn++) {
          if (kernel[kernelRow][kernelColumn] !== 1) continue;
          const currentColumn = kernelColumn - radiusX + column;
          const currentRow = kernelRow - radiusY + row;
          if (
            currentColumn < 0 ||
            currentRow < 0 ||
            currentColumn >= image.width ||
            currentRow >= image.height
          ) {
            continue;
          }
          const value = image.getValue(currentColumn, currentRow, 0);
          if (value > max) max = value;
        }
      }
      newImage.setValue(column, row, 0, max);
    }
  }
  return newImage;
}

function dilateGreyOnlyOnes(
  image: Image,
  newImage: Image,
  kernelWidth: number,
  kernelHeight: number,
): Image {
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;

  const maxList = [];
  for (let column = 0; column < image.width; column++) {
    maxList.push(0);
  }

  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      let max = 0;
      for (
        let h = Math.max(0, row - radiusY);
        h < Math.min(image.height, row + radiusY + 1);
        h++
      ) {
        const value = image.getValue(column, h, 0);
        if (value > max) {
          max = value;
        }
      }
      maxList[column] = max;
    }

    for (let column = 0; column < image.width; column++) {
      let max = 0;
      for (
        let i = Math.max(0, column - radiusX);
        i < Math.min(image.width, column + radiusX + 1);
        i++
      ) {
        if (maxList[i] > max) {
          max = maxList[i];
        }
      }
      newImage.setValue(column, row, 0, max);
    }
  }
  return newImage;
}

function dilateMask(mask: Mask, newMask: Mask, kernel: number[][]): Mask {
  const kernelWidth = kernel[0].length;
  const kernelHeight = kernel.length;
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;
  for (let row = 0; row < mask.height; row++) {
    for (let column = 0; column < mask.width; column++) {
      let max = 0;
      for (let kernelRow = 0; kernelRow < kernelHeight; kernelRow++) {
        for (let kernelColumn = 0; kernelColumn < kernelWidth; kernelColumn++) {
          if (kernel[kernelRow][kernelColumn] !== 1) continue;
          const currentColumn = kernelColumn - radiusX + column;
          const currentRow = kernelRow - radiusY + row;
          if (
            currentRow < 0 ||
            currentColumn < 0 ||
            currentColumn >= mask.width ||
            currentRow >= mask.height
          ) {
            continue;
          }
          const value = mask.getBit(currentColumn, currentRow);
          if (value === 1) {
            max = 1;
            break;
          }
        }
      }
      if (max === 1) {
        newMask.setBit(column, row, 1);
      }
    }
  }
  return newMask;
}

function dilatMaskOnlyOnes(
  mask: Mask,
  newMask: Mask,
  kernelWidth: number,
  kernelHeight: number,
): Mask {
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;

  const maxList = [];
  for (let column = 0; column < mask.width; column++) {
    maxList.push(1);
  }

  for (let row = 0; row < mask.height; row++) {
    for (let column = 0; column < mask.width; column++) {
      maxList[column] = 0;
      for (
        let h = Math.max(0, row - radiusY);
        h < Math.min(mask.height, row + radiusY + 1);
        h++
      ) {
        if (mask.getBit(column, h) === 1) {
          maxList[column] = 1;
          break;
        }
      }
    }

    for (let column = 0; column < mask.width; column++) {
      if (newMask.getBit(column, row) === 1) continue;
      for (
        let i = Math.max(0, column - radiusX);
        i < Math.min(mask.width, column + radiusX + 1);
        i++
      ) {
        if (maxList[i] === 1) {
          newMask.setBit(column, row, 1);
          break;
        }
      }
    }
  }
  return newMask;
}
