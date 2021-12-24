import { ColorDepth, Mask } from '..';
import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';

export interface ErodeOptions {
  /**
   * 3x3 matrix. The kernel can only have ones and zeros.
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
    outer: for (const row of kernel) {
      for (const value of row) {
        if (value !== 1) {
          onlyOnes = false;
          break outer;
        }
      }
    }
  }
  console.log({ onlyOnes });

  let result = image;
  for (let i = 0; i < iterations; i++) {
    if (result instanceof Mask) {
      if (onlyOnes) {
        const newImage = result.clone();
        result = erodeOnceBinaryOnlyOnes(
          result,
          newImage,
          kernel.length,
          kernel[0].length,
        );
      } else {
        const newImage = Mask.createFrom(image);
        result = erodeMask(result, newImage, kernel);
      }
    } else if (onlyOnes) {
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

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let min = img.maxValue;
      for (
        let h = Math.max(0, y - radiusY);
        h < Math.min(img.height, y + radiusY + 1);
        h++
      ) {
        const value = img.getValue(x, h, 0);
        if (value < min) {
          min = value;
        }
      }
      minList[x] = min;
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
      newImage.setValue(x, y, 0, min);
    }
  }
  return newImage;
}

function erodeMask(mask: Mask, newMask: Mask, kernel: number[][]): Mask {
  const kernelWidth = kernel.length;
  const kernelHeight = kernel[0].length;
  let radiusX = (kernelWidth - 1) / 2;
  let radiusY = (kernelHeight - 1) / 2;
  for (let y = 0; y < mask.height; y++) {
    for (let x = 0; x < mask.width; x++) {
      let min = 1;
      intLoop: for (let jj = 0; jj < kernelHeight; jj++) {
        for (let ii = 0; ii < kernelWidth; ii++) {
          if (kernel[ii][jj] !== 1) continue;
          let i = ii - radiusX + x;
          let j = jj - radiusY + y;
          if (j < 0 || i < 0 || i >= mask.width || j >= mask.height) continue;
          const value = mask.getBit(i, j);
          if (value === 0) {
            min = 0;
            break intLoop;
          }
        }
      }
      if (min === 1) {
        newMask.setBit(x, y, 1);
      }
    }
  }
  return newMask;
}

function erodeOnceBinaryOnlyOnes(
  mask: Mask,
  newMask: Mask,
  kernelWidth: number,
  kernelHeight: number,
): Mask {
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;

  const minList = [];
  for (let x = 0; x < mask.width; x++) {
    minList.push(0);
  }

  for (let y = 0; y < mask.height; y++) {
    for (let x = 0; x < mask.width; x++) {
      minList[x] = 1;
      for (
        let h = Math.max(0, y - radiusY);
        h < Math.min(mask.height, y + radiusY + 1);
        h++
      ) {
        if (mask.getBit(x, h) === 0) {
          minList[x] = 0;
          break;
        }
      }
    }

    for (let x = 0; x < mask.width; x++) {
      if (newMask.getBit(x, y) === 0) continue;
      for (
        let i = Math.max(0, x - radiusX);
        i < Math.min(mask.width, x + radiusX + 1);
        i++
      ) {
        if (minList[i] === 0) {
          newMask.setBit(x, y, 0);
          break;
        }
      }
    }
  }
  return newMask;
}
