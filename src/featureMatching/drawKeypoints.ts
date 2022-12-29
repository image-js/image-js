import { Image, ImageColorModel } from '../Image';
import { getOutputImage } from '../utils/getOutputImage';

import { FastKeypoint } from './getFastKeypoints';

export interface DrawKeypointsOptions {
  /**
   * Markers size in pixels.
   *
   * @default 10
   */
  markerSize?: number;
  /**
   * Annotations color.
   *
   * @default [255,0,0]
   */
  color?: number[];
  /**
   * Should the markers be filled?
   *
   * @default false
   */
  fill?: boolean;
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Image;
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
  const { markerSize = 10, color = [255, 0, 0], fill = false } = options;
  let fillColor = fill ? color : undefined;

  const newImage = getOutputImage(image, options, { clone: true });

  if (image.colorModel !== ImageColorModel.RGB) {
    newImage.convertColor(ImageColorModel.RGB, { out: newImage });
  }

  const radius = Math.ceil(markerSize / 2);
  for (let keypoint of keypoints) {
    newImage.drawCircle(keypoint.origin, radius, {
      fill: fillColor,
      color,
      out: newImage,
    });
  }

  return newImage;
}
