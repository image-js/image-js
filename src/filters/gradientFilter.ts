import type { BitDepth } from '../Image.js';
import { Image } from '../Image.js';
import type { BorderType } from '../utils/interpolateBorder.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

export interface GradientFilterBaseOptions {
  /**
   * Specify how the borders should be handled.
   * @default `'replicate'`
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is 'constant'.
   * @default `0`
   */
  borderValue?: number;
  /**
   * Specify the bit depth of the resulting image.
   * @default `image.bitDepth`
   */
  bitDepth?: BitDepth;
}

export interface GradientFilterXOptions extends GradientFilterBaseOptions {
  /**
   * Kernel along x axis.
   */
  kernelX: number[][];
}
export interface GradientFilterYOptions extends GradientFilterBaseOptions {
  /**
   * Kernel along y axis.
   */
  kernelY: number[][];
}

export interface GradientFilterXYOptions extends GradientFilterBaseOptions {
  /**
   * Kernel along x axis.
   */
  kernelX: number[][];
  /**
   * Kernel along y axis.
   */
  kernelY: number[][];
}

export type GradientFilterOptions =
  | GradientFilterXOptions
  | GradientFilterYOptions
  | GradientFilterXYOptions;

/**
 * Apply a gradient filter to an image.
 * @param image - The image to process.
 * @param options - Gradient filter options.
 * @returns The gradient image.
 */
export function gradientFilter(
  image: Image,
  options: GradientFilterOptions,
): Image {
  const { borderType = 'replicate', borderValue = 0 } = options;

  checkProcessable(image, {
    bitDepth: [8, 16],
    colorModel: 'GREY',
  });

  if ('kernelX' in options && 'kernelY' in options) {
    const { kernelX, kernelY } = options;
    const gradientX = image.rawDirectConvolution(kernelX, {
      borderType,
      borderValue,
    });

    const gradientY = image.rawDirectConvolution(kernelY, {
      borderType,
      borderValue,
    });

    const gradient = new Image(image.width, image.height, {
      colorModel: 'GREY',
    });

    for (let i = 0; i < image.size; i++) {
      gradient.setValueByIndex(i, 0, Math.hypot(gradientX[i], gradientY[i]));
    }
    return gradient;
  } else if ('kernelX' in options) {
    return image.directConvolution(options.kernelX, {
      borderType,
      borderValue,
    });
  } else if ('kernelY' in options) {
    return image.directConvolution(options.kernelY, {
      borderType,
      borderValue,
    });
  } else {
    throw new TypeError(`kernelX and KernelY are not defined`);
  }
}
