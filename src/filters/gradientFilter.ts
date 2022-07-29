import { ColorDepth, Image, ImageColorModel } from '..';
import checkProcessable from '../utils/checkProcessable';
import { BorderType } from '../utils/interpolateBorder';

export interface GradientFilterBaseOptions {
  /**
   * Specify how the borders should be handled.
   *
   * @default BorderType.REPLICATE
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is CONSTANT.
   *
   * @default 0
   */
  borderValue?: number;
  /**
   * Specify the bitDepth of the resulting image.
   *
   * @default image.bitDepth
   */
  bitDepth?: ColorDepth;
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
 *
 * @param image - The image to process.
 * @param options - Gradient filter options.
 * @returns The gradient image.
 */
export function gradientFilter(
  image: Image,
  options: GradientFilterOptions,
): Image {
  const { borderType = BorderType.REPLICATE, borderValue = 0 } = options;

  checkProcessable(image, 'gradientFilter', {
    bitDepth: [8, 16],
    colorModel: ImageColorModel.GREY,
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

    let gradient = new Image(image.width, image.height, {
      colorModel: ImageColorModel.GREY,
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
    throw new Error(`kernelX and KernelY are not defined`);
  }
}
