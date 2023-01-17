import { Image, ImageColorModel } from '../../Image';
import { Point } from '../../geometry';
import { sum } from '../../utils/geometry/points';
import { getOutputImage } from '../../utils/getOutputImage';
import { FastKeypoint } from '../keypoints/getFastKeypoints';
import { getColors, GetColorsOptions } from '../utils/getColors';
import { getKeypointColor } from '../utils/getKeypointColor';

export interface DrawKeypointsOptions {
  /**
   * Origin of the keypoints in the image.
   *
   * @default {row: 0, column: 0}
   */
  origin?: Point;
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
   * Should the score of the keypoints reflect in their color?
   *
   * @default false
   */
  showScore?: boolean;
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Image;
  /**
   * Options for the coloring of the keypoints depending on their score (useful if showScore = true).
   */
  showScoreOptions?: GetColorsOptions;
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
  const {
    markerSize = 10,
    fill = false,
    showScore = false,
    origin = { row: 0, column: 0 },
    showScoreOptions,
  } = options;
  let { color = [255, 0, 0] } = options;

  let newImage = getOutputImage(image, options, { clone: true });

  if (image.colorModel !== ImageColorModel.RGB) {
    newImage = newImage.convertColor(ImageColorModel.RGB);
  }

  const colors = getColors(image, color, showScoreOptions);

  const radius = Math.ceil(markerSize / 2);
  for (let i = 0; i < keypoints.length; i++) {
    let keypointColor = color;
    if (showScore) {
      keypointColor = getKeypointColor(keypoints, i, colors);
    }
    let fillColor = fill ? keypointColor : undefined;

    const absoluteKeypoint = sum(keypoints[i].origin, origin);

    newImage.drawCircle(absoluteKeypoint, radius, {
      fill: fillColor,
      color: keypointColor,
      out: newImage,
    });
  }

  return newImage;
}
