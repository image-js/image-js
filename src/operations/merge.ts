import { Image, ImageColorModel } from '../Image';

/**
 * Inverse of split. Merges multiple single-channel images into one.
 *
 * @param images - An array of single-channel images.
 * @returns The merged image.
 */
export function merge(images: Image[]): Image {
  const channels = images.length;

  let colorModel: ImageColorModel;
  switch (channels) {
    case 2: {
      colorModel = ImageColorModel.GREYA;
      break;
    }
    case 3: {
      colorModel = ImageColorModel.RGB;
      break;
    }
    case 4: {
      colorModel = ImageColorModel.RGBA;
      break;
    }
    default: {
      throw new RangeError(
        `merge expects an array of two to four images. Got ${channels}`,
      );
    }
  }

  const first = images[0];
  if (first.channels !== 1) {
    throw new Error(`each image must have one channel. Got ${first.channels}`);
  }
  for (let i = 1; i < channels; i++) {
    const img = images[i];
    if (img.channels !== 1) {
      throw new Error(`each image must have one channel. Got ${img.channels}`);
    }
    if (
      img.width !== first.width ||
      img.height !== first.height ||
      img.depth !== first.depth
    ) {
      throw new Error('all images must have the same width, height and depth');
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
