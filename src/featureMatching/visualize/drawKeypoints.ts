import { Image } from '../../Image';
import { Point } from '../../geometry';
import { sum } from '../../utils/geometry/points';
import { getOutputImage } from '../../utils/getOutputImage';
import { FastKeypoint } from '../keypoints/getFastKeypoints';
import { OrientedFastKeypoint } from '../keypoints/getOrientedFastKeypoints';
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
   * Maximal number of matches with smallest distance to draw.
   *
   * @default keypoints.length
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

interface DrawOrientedKeypointsOptions extends DrawKeypointsOptions {
  /**
   * Show the orientation of the keypoints.
   *
   * @default false
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
 *
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
  let { color = [255, 0, 0], maxNbKeypoints = keypoints.length } = options;

  if (maxNbKeypoints > keypoints.length) {
    maxNbKeypoints = keypoints.length;
  }

  let newImage = getOutputImage(image, options, { clone: true });

  if (image.colorModel !== 'RGB') {
    newImage = newImage.convertColor('RGB');
  }

  const colors = getColors(image, color, showScoreOptions);

  const radius = Math.ceil(markerSize / 2);
  for (let i = 0; i < maxNbKeypoints; i++) {
    let keypoint = keypoints[i];
    let keypointColor = color;
    if (showScore) {
      keypointColor = getKeypointColor(keypoints, i, colors);
    }
    let fillColor = fill ? keypointColor : undefined;

    const absoluteOrigin = sum(keypoint.origin, origin);

    newImage.drawCircle(absoluteOrigin, radius, {
      fill: fillColor,
      color: keypointColor,
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
