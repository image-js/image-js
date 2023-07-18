import { Image } from '../Image';
import { ImageColorModel } from '../utils/constants/colorModels';
import checkProcessable from '../utils/validators/checkProcessable';

export interface AutoLevelOptions {
  /**
   * Image to which to output.
   */
  out?: Image;
}

/**
 * Enhance the contrast of an image by spanning each channel on the range [0, image.maxValue].
 * @param image - The image to enhance.
 * @param options - Enhance contrast options.
 * @returns The enhanced image.
 */
export function autoLevel(image: Image, options: AutoLevelOptions = {}): Image {
  checkProcessable(image, {
    bitDepth: [8, 16],
  });
  const minMax = image.minMax();

  let channels: number[] = new Array(image.components)
    .fill(0)
    .map((value, index) => index);

  if (image.colorModel === ImageColorModel.GREYA) {
    channels = [0];
  } else if (image.colorModel === ImageColorModel.RGBA) {
    channels = [0, 1, 2];
  }

  return image.level({
    inputMin: minMax.min,
    inputMax: minMax.max,
    outputMin: 0,
    outputMax: image.maxValue,
    channels,
    ...options,
  });
}
