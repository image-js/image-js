import { ColorDepth, Mask } from '..';
import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';

export interface ErodeOptions {
  /**
   * 3x3 matrix. The kernel can only have ones and zeros.
   * Accessing a value: kernel[row][column]
   */
  kernel?: number[][];
  /**
   * Number of iterations of the algorithm.
   */
  iterations?: number;
}

export function erode(image: IJS, options?: ErodeOptions): IJS;
export function erode(image: Mask, options?: ErodeOptions): Mask;
/**
 * Erosion is one of two fundamental operations (with dilatation) in morphological
 * IJS processing from which all other morphological operations are based (from Wikipedia).
 * Replaces each value with it's local minimum among the pixels with a kernel value of 1.
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/erosion_dilatation/erosion_dilatation.html
 * https://en.wikipedia.org/wiki/Erosion_(morphology)
 *
 * @param image - The image to process
 * @param options - Erode options
 * @returns - The eroded image.
 */
export function erode(
  image: IJS | Mask,
  options: ErodeOptions = {},
): IJS | Mask {
  let defaultKernel = false;
  if (options.kernel === undefined) {
    defaultKernel = true;
  }

  let {
    kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    iterations = 1,
  } = options;

  if (image instanceof IJS) {
    checkProcessable(image, 'erode', {
      bitDepth: [ColorDepth.UINT1, ColorDepth.UINT8, ColorDepth.UINT16],
      components: 1,
      alpha: false,
    });
  }

  if (kernel.length % 2 === 0 || kernel[0].length % 2 === 0) {
    throw new TypeError(
      'erode: The number of rows and columns of the kernel must be odd',
    );
  }

  let onlyOnes = true;
  if (!defaultKernel) {
    for (const row of kernel) {
      for (const bit of row) {
        if (bit !== 1) {
          onlyOnes = false;
          break;
        }
      }
    }
  }

  console.log(kernel);

  let result = image;
  for (let i = 0; i < iterations; i++) {
    if (result instanceof Mask) {
      if (onlyOnes) {
        console.log('go to erodeMaskOnlyOnes');

        const newImage = result.clone();
        result = erodeMaskOnlyOnes(
          result,
          newImage,
          kernel.length,
          kernel[0].length,
        );
      } else {
        console.log('got to erodeMask');
        const newImage = Mask.createFrom(image);
        result = erodeMask(result, newImage, kernel);
      }
    } else if (onlyOnes) {
      console.log('ERODE GRAY ONLY ONES');
      const newImage = IJS.createFrom(image);
      result = erodeGreyOnlyOnes(
        result,
        newImage,
        kernel.length,
        kernel[0].length,
      );
    } else {
      const newImage = IJS.createFrom(image);
      result = erodeGrey(result, newImage, kernel);
    }
    console.log(result);
  }
  return result;
}

function erodeGrey(img: IJS, newImage: IJS, kernel: number[][]) {
  const kernelWidth = kernel.length;
  const kernelHeight = kernel[0].length;
  let radiusX = (kernelWidth - 1) / 2;
  let radiusY = (kernelHeight - 1) / 2;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let min = img.maxValue;
      for (let jj = 0; jj < kernelHeight; jj++) {
        for (let ii = 0; ii < kernelWidth; ii++) {
          if (kernel[ii][jj] !== 1) continue;
          let i = ii - radiusX + x;
          let j = jj - radiusY + y;
          if (i < 0 || j < 0 || i >= img.width || j >= img.height) continue;
          const value = img.getValue(i, j, 0);
          if (value < min) min = value;
        }
      }
      newImage.setValue(x, y, 0, min);
    }
  }
  return newImage;
}

function erodeGreyOnlyOnes(
  img: IJS,
  newImage: IJS,
  kernelWidth: number,
  kernelHeight: number,
) {
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;

  const minList = [];
  for (let x = 0; x < img.width; x++) {
    minList.push(0);
  }

  for (let row = 0; row < img.height; row++) {
    for (let column = 0; column < img.width; column++) {
      let min = img.maxValue;
      for (
        let h = Math.max(0, row - radiusY);
        h < Math.min(img.height, row + radiusY + 1);
        h++
      ) {
        const value = img.getValue(column, h, 0);
        if (value < min) {
          min = value;
        }
      }
      minList[column] = min;
    }

    for (let x = 0; x < img.width; x++) {
      let min = img.maxValue;
      for (
        let i = Math.max(0, x - radiusX);
        i < Math.min(img.width, x + radiusX + 1);
        i++
      ) {
        if (minList[i] < min) {
          min = minList[i];
        }
      }
      newImage.setValue(x, row, 0, min);
    }
  }
  return newImage;
}

function erodeMask(mask: Mask, newMask: Mask, kernel: number[][]): Mask {
  const kernelWidth = kernel.length;
  const kernelHeight = kernel[0].length;
  let radiusX = (kernelWidth - 1) / 2;
  let radiusY = (kernelHeight - 1) / 2;
  for (let row = 0; row < mask.height; row++) {
    for (let column = 0; column < mask.width; column++) {
      let min = 1;
      intLoop: for (let jj = 0; jj < kernelHeight; jj++) {
        for (let ii = 0; ii < kernelWidth; ii++) {
          if (kernel[ii][jj] !== 1) continue;
          let i = ii - radiusX + column;
          let j = jj - radiusY + row;
          if (j < 0 || i < 0 || i >= mask.width || j >= mask.height) continue;
          const value = mask.getBit(i, j);
          if (value === 0) {
            min = 0;
            break intLoop;
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
