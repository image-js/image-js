import { Image, ImageColorModel } from '../../Image';

/**
 * Create a new image containing the input images side by side.
 *
 * @param image1 - First image.
 * @param image2 - Second image.
 * @returns The basic montage.
 */
export function getBasicMontage(image1: Image, image2: Image): Image {
  if (image1.colorModel !== ImageColorModel.RGB) {
    image1 = image1.convertColor(ImageColorModel.RGB);
  }
  if (image2.colorModel !== ImageColorModel.RGB) {
    image2 = image2.convertColor(ImageColorModel.RGB);
  }

  const result = new Image(
    image1.width + image2.width,
    Math.max(image1.height, image2.height),
  );

  image1.copyTo(result, { out: result });
  image2.copyTo(result, {
    out: result,
    origin: { column: image1.width, row: 0 },
  });

  return result;
}
