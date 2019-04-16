import { Image, ImageKind } from '../Image';

/**
 * Inverse of split. Merges multiple single-channel images into one.
 * @param images An array of single-channel images
 */
export function merge(images: Image[]): Image {
  const channels = images.length;

  let kind: ImageKind;
  if (channels === 2) {
    kind = ImageKind.GREYA;
  } else if (channels === 3) {
    kind = ImageKind.RGB;
  } else if (channels === 4) {
    kind = ImageKind.RGBA;
  } else {
    throw new RangeError(
      `merge expects an array of two to four images. Got ${channels}`
    );
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

  const newImage = Image.createFrom(first, { kind });
  for (let c = 0; c < channels; c++) {
    const img = images[c];
    for (let i = 0; i < newImage.data.length; i += channels) {
      newImage.data[i + c] = img.data[i / channels];
    }
  }

  return newImage;
}
