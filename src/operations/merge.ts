import { Image } from '../Image.js';
import type { ImageColorModel } from '../utils/constants/colorModels.js';

/**
 * Inverse of split. Merges multiple single-channel images into one.
 * @param images - An array of single-channel images.
 * @returns The merged image.
 */
export function merge(images: Image[]): Image {
  const channels = images.length;

  let colorModel: ImageColorModel;
  switch (channels) {
    case 2: {
      colorModel = 'GREYA';
      break;
    }
    case 3: {
      colorModel = 'RGB';
      break;
    }
    case 4: {
      colorModel = 'RGBA';
      break;
    }
    default: {
      throw new RangeError(
        `merge expects an array of two to four images. Received ${channels}`,
      );
    }
  }

  const first = images[0];
  if (first.channels !== 1) {
    throw new RangeError(
      `each image must have one channel. Received ${first.channels}`,
    );
  }
  for (let i = 1; i < channels; i++) {
    const img = images[i];
    if (img.channels !== 1) {
      throw new RangeError(
        `each image must have one channel. Received ${img.channels}`,
      );
    }
    if (
      img.width !== first.width ||
      img.height !== first.height ||
      img.bitDepth !== first.bitDepth
    ) {
      throw new RangeError(
        'all images must have the same width, height and bitDepth',
      );
    }
  }

  const newImage = Image.createFrom(first, { colorModel });
  for (let c = 0; c < channels; c++) {
    const img = images[c];
    for (let i = 0; i < newImage.size; i++) {
      newImage.setValueByIndex(i, c, img.getValueByIndex(i, 0));
    }
  }

  return newImage;
}
