import { Image, ImageColorModel } from '../../Image';
import { getOutputImage } from '../../utils/getOutputImage';
import { FastKeypoint } from '../keypoints/getFastKeypoints';
import { getKeypointColor } from '../utils/getKeypointColor';
import { getScoreColors, GetScoreColorsOptions } from '../utils/getScoreColors';

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
   * Should the score of the keypoints reflect in their color?
   *
   * @default false
   */
  showScore?: boolean;
  /**
   * Number of shades for the keypoints (the brighter the shade, the higher the score).
   *
   * @default 6
   */
  nbScoreShades?: number;
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Image;
  /**
   * Options for the coloring of the keypoints depending on their score (useful if showScore = true).
   */
  showScoreOptions?: GetScoreColorsOptions;
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
    showScoreOptions,
  } = options;
  let { color = [255, 0, 0] } = options;

  let newImage = getOutputImage(image, options, { clone: true });

  if (image.colorModel !== ImageColorModel.RGB) {
    newImage = newImage.convertColor(ImageColorModel.RGB);
  }

  const colors = getScoreColors(image, color, showScoreOptions);

  const radius = Math.ceil(markerSize / 2);
  for (let i = 0; i < keypoints.length; i++) {
    let keypointColor = color;
    if (showScore) {
      keypointColor = getKeypointColor(keypoints, i, colors);
    }
    let fillColor = fill ? keypointColor : undefined;

    newImage.drawCircle(keypoints[i].origin, radius, {
      fill: fillColor,
      color: keypointColor,
      out: newImage,
    });
  }

  return newImage;
}
