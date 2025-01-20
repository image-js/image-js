import { Image } from '../Image.js';
import { Mask } from '../Mask.js';
import { checkKernel } from '../utils/validators/checkKernel.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

export interface ErodeOptions {
  /**
   * Matrix with odd dimensions (e.g. 1 by 3). The kernel can only have ones and zeros.
   * Accessing a value: kernel[row][column].
   * @default `[[1, 1, 1], [1, 1, 1], [1, 1, 1]]`
   */
  kernel?: number[][];
  /**
   * Number of iterations of the algorithm.
   * @default `1`
   */
  iterations?: number;
}

export function erode(image: Image, options?: ErodeOptions): Image;
export function erode(image: Mask, options?: ErodeOptions): Mask;
/**
 * Erosion is one of two fundamental operations (with dilatation) in morphological
 * Image processing from which all other morphological operations are based (from Wikipedia).
 * Replaces each value with it's local minimum among the pixels with a kernel value of 1.
 * @see {@link http://docs.opencv.org/2.4/doc/tutorials/imgproc/erosion_dilatation/erosion_dilatation.html}
 * @see {@link https://en.wikipedia.org/wiki/Erosion_(morphology)}
 * @param image - The image to erode.
 * @param options - Erode options.
 * @returns - The eroded image.
 */
export function erode(
  image: Image | Mask,
  options: ErodeOptions = {},
): Image | Mask {
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
      for (const bit of row) {
        if (bit !== 1) {
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
        const newImage = result.clone();
        result = erodeMaskOnlyOnes(
          result,
          newImage,
          kernel[0].length,
          kernel.length,
        );
      } else {
        const newImage = Mask.createFrom(image);
        result = erodeMask(result, newImage, kernel);
      }
    } else if (onlyOnes) {
      const newImage = Image.createFrom(image);
      result = erodeGreyOnlyOnes(
        result,
        newImage,
        kernel[0].length,
        kernel.length,
      );
    } else {
      const newImage = Image.createFrom(image);
      result = erodeGrey(result, newImage, kernel);
    }
  }
  return result;
}

function erodeGrey(img: Image, newImage: Image, kernel: number[][]): Image {
  const kernelWidth = kernel[0].length;
  const kernelHeight = kernel.length;
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;
  for (let row = 0; row < img.height; row++) {
    for (let column = 0; column < img.width; column++) {
      let min = img.maxValue;
      for (let kernelRow = 0; kernelRow < kernelHeight; kernelRow++) {
        for (let kernelColumn = 0; kernelColumn < kernelWidth; kernelColumn++) {
          if (kernel[kernelRow][kernelColumn] !== 1) continue;
          const currentColumn = kernelColumn - radiusX + column;
          const currentRow = kernelRow - radiusY + row;
          if (
            currentColumn < 0 ||
            currentRow < 0 ||
            currentColumn >= img.width ||
            currentRow >= img.height
          ) {
            continue;
          }
          const value = img.getValue(currentColumn, currentRow, 0);
          if (value < min) min = value;
        }
      }
      newImage.setValue(column, row, 0, min);
    }
  }
  return newImage;
}

function erodeGreyOnlyOnes(
  image: Image,
  newImage: Image,
  kernelWidth: number,
  kernelHeight: number,
): Image {
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;

  const minList = [];
  for (let column = 0; column < image.width; column++) {
    minList.push(0);
  }

  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      let min = image.maxValue;
      for (
        let h = Math.max(0, row - radiusY);
        h < Math.min(image.height, row + radiusY + 1);
        h++
      ) {
        const value = image.getValue(column, h, 0);
        if (value < min) {
          min = value;
        }
      }
      minList[column] = min;
    }

    for (let column = 0; column < image.width; column++) {
      let min = image.maxValue;
      for (
        let i = Math.max(0, column - radiusX);
        i < Math.min(image.width, column + radiusX + 1);
        i++
      ) {
        if (minList[i] < min) {
          min = minList[i];
        }
      }
      newImage.setValue(column, row, 0, min);
    }
  }
  return newImage;
}

function erodeMask(mask: Mask, newMask: Mask, kernel: number[][]): Mask {
  const kernelWidth = kernel[0].length;
  const kernelHeight = kernel.length;
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;
  for (let row = 0; row < mask.height; row++) {
    for (let column = 0; column < mask.width; column++) {
      let min = 1;
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
          if (value === 0) {
            min = 0;
            break;
          }
        }
      }
      if (min === 1) {
        newMask.setBit(column, row, 1);
      }
    }
  }
  return newMask;
}

function erodeMaskOnlyOnes(
  mask: Mask,
  newMask: Mask,
  kernelWidth: number,
  kernelHeight: number,
): Mask {
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;

  const minList = [];
  for (let column = 0; column < mask.width; column++) {
    minList.push(0);
  }

  for (let row = 0; row < mask.height; row++) {
    for (let column = 0; column < mask.width; column++) {
      minList[column] = 1;
      for (
        let h = Math.max(0, row - radiusY);
        h < Math.min(mask.height, row + radiusY + 1);
        h++
      ) {
        if (mask.getBit(column, h) === 0) {
          minList[column] = 0;
          break;
        }
      }
    }

    for (let column = 0; column < mask.width; column++) {
      if (newMask.getBit(column, row) === 0) continue;
      for (
        let i = Math.max(0, column - radiusX);
        i < Math.min(mask.width, column + radiusX + 1);
        i++
      ) {
        if (minList[i] === 0) {
          newMask.setBit(column, row, 0);
          break;
        }
      }
    }
  }
  return newMask;
}
