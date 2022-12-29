import { Image, ImageColorModel } from '../Image';

import { FastKeypoint } from './getFastKeypoints';

export interface DrawKeypointsOptions {
  /**
   * Circles diameter in pixels.
   */
  circleDiameter?: 10;
  /**
   * Annotations color.
   *
   * @default [255,0,0]
   */
  color?: number[];
}

/**
 * Draw keypoints on an image.
 *
 * @param image - The source image of the keypoints.
 * @param keypoints - The FAST keypoints.
 * @param options - Draw keypoints options.
 * @returns The image with the keypoints indicated by empty circles.
 */
export function drawKeypoints(
  image: Image,
  keypoints: FastKeypoint[],
  options: DrawKeypointsOptions = {},
): Image {
  const { circleDiameter = 10, color = [255, 0, 0] } = options;

  if (image.colorModel !== ImageColorModel.RGB) {
    image = image.convertColor(ImageColorModel.RGB);
  }
  for (let keypoint of keypoints) {
    image.drawCircle(keypoint.origin, circleDiameter / 2, {
      color,
      out: image,
    });
  }

  return image;
}
