import type { Image } from '../../Image.js';
import type { Point } from '../../geometry/index.js';
import { sum } from '../../utils/geometry/points.js';
import { getOutputImage } from '../../utils/getOutputImage.js';
import type { GetColorsOptions } from '../featureMatching.types.js';
import type { FastKeypoint } from '../keypoints/getFastKeypoints.js';
import type { OrientedFastKeypoint } from '../keypoints/getOrientedFastKeypoints.js';
import { getColors } from '../utils/getColors.js';
import { getKeypointColor } from '../utils/getKeypointColor.js';

export interface DrawKeypointsOptions {
  /**
   * Origin of the keypoints in the image.
   * @default `{row: 0, column: 0}`
   */
  origin?: Point;
  /**
   * Markers size in pixels.
   * @default `10`
   */
  markerSize?: number;
  /**
   * Keypoint's color - An array of numerical values, one for each channel of the image. If less values are defined than there are channels in the image, the remaining channels will be set to 0.
   * @default `[255,0,0]`
   */
  strokeColor?: number[];
  /**
   * Whether to fill the markers.
   * @default `false`
   */
  fill?: boolean;
  /**
   * Whether the score of the keypoints should be reflected in their color.
   * @default `false`
   */
  showScore?: boolean;
  /**
   * Maximal number of matches with smallest distance to draw.
   * @default `keypoints.length`
   */

  maxNbKeypoints?: number;
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Image;
  /**
   * Options for the coloring of the keypoints depending on their score (useful if showScore = true).
   */
  showScoreOptions?: GetColorsOptions;
}

export interface DrawOrientedKeypointsOptions extends DrawKeypointsOptions {
  /**
   * Show the orientation of the keypoints.
   * @default `false`
   */
  showOrientation?: boolean;
}

export function drawKeypoints(
  image: Image,
  keypoints: FastKeypoint[],
  options?: DrawKeypointsOptions,
): Image;
export function drawKeypoints(
  image: Image,
  keypoints: OrientedFastKeypoint[],
  options?: DrawOrientedKeypointsOptions,
): Image;
/**
 * Draw keypoints on an image.
 * @param image - The source image of the keypoints.
 * @param keypoints - The FAST keypoints.
 * @param options - Draw keypoints options.
 * @returns The image with the keypoints indicated by empty circles.
 */
export function drawKeypoints(
  image: Image,
  keypoints: FastKeypoint[] | OrientedFastKeypoint[],
  options: DrawKeypointsOptions | DrawOrientedKeypointsOptions = {},
): Image {
  const {
    markerSize = 10,
    fill = false,
    showScore = false,
    origin = { row: 0, column: 0 },
    showScoreOptions,
  } = options;
  let { maxNbKeypoints = keypoints.length } = options;
  const { strokeColor = [255, 0, 0] } = options;

  if (maxNbKeypoints > keypoints.length) {
    maxNbKeypoints = keypoints.length;
  }

  let newImage = getOutputImage(image, options, { clone: true });

  if (image.colorModel !== 'RGB') {
    newImage = newImage.convertColor('RGB');
  }

  const colors = getColors(image, strokeColor, showScoreOptions);

  const radius = Math.ceil(markerSize / 2);
  for (let i = 0; i < maxNbKeypoints; i++) {
    const keypoint = keypoints[i];
    let keypointColor = strokeColor;
    if (showScore) {
      keypointColor = getKeypointColor(keypoints, i, colors);
    }
    const fillColor = fill ? keypointColor : undefined;

    const absoluteOrigin = sum(keypoint.origin, origin);

    newImage.drawCircle(absoluteOrigin, radius, {
      fillColor,
      strokeColor: keypointColor,
      out: newImage,
    });
    if (
      isOrientedFastKeypoint(keypoint) &&
      (options as DrawOrientedKeypointsOptions).showOrientation
    ) {
      const angle = keypoint.angle;
      const from = absoluteOrigin;
      const radAngle = (angle * Math.PI) / 180;
      const to: Point = {
        column: from.column + Math.round(radius * Math.cos(radAngle)),
        row: from.row - Math.round(radius * Math.sin(radAngle)),
      };
      newImage.drawLine(from, to, {
        strokeColor: keypointColor,
        out: newImage,
      });
    }
  }

  return newImage;
}

function isOrientedFastKeypoint(
  kpt: FastKeypoint,
): kpt is OrientedFastKeypoint {
  return 'angle' in kpt && typeof kpt.angle === 'number';
}
