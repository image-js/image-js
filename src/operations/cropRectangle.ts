import type { Image } from '../Image.js';
import type { TransformOptions } from '../geometry/index.js';
import { transform } from '../geometry/index.js';
import { getAngle } from '../maskAnalysis/utils/getAngle.js';
import { rotatePoint } from '../point/operations.js';
import type { Point } from '../utils/geometry/points.js';

export type CropRectangleOptions = Omit<
  TransformOptions,
  'width' | 'height' | 'inverse' | 'fullImage'
>;

/**
 * Crop an oriented rectangle from an image.
 * If the rectangle's length or width are not an integers, its dimension is expanded in both directions such as the length and width are integers.
 * @param image - The input image
 * @param points - The points of the rectangle. Points must be circling around the rectangle (clockwise or anti-clockwise). The validity of the points passed is assumed and not checked.
 * @param options - Crop options, see {@link CropRectangleOptions}
 * @returns The cropped image. The orientation of the image is the one closest to the rectangle passed as input.
 */
export function cropRectangle(
  image: Image,
  points: Point[],
  options?: CropRectangleOptions,
): Image {
  if (points.length !== 4) {
    throw new Error('The points array must contain 4 points');
  }

  // get the smallest possible angle which puts the rectangle in an upright position
  const angle = getSmallestAngle(points);

  const center: Point = {
    row: (points[0].row + points[2].row) / 2,
    column: (points[0].column + points[2].column) / 2,
  };

  // Rotated points form an upright rectangle
  const rotatedPoints = points.map((p) => rotatePoint(p, center, angle));
  const [p1, p2, p3] = rotatedPoints;

  const originalWidth = Math.max(
    Math.abs(p1.column - p2.column),
    Math.abs(p2.column - p3.column),
  );
  const originalHeight = Math.max(
    Math.abs(p1.row - p2.row),
    Math.abs(p2.row - p3.row),
  );

  // Deal with numerical imprecision when the rectangle actually had a whole number width or height
  const width = Math.min(
    Math.ceil(originalWidth),
    Math.ceil(originalWidth - 1e-10),
  );
  const height = Math.min(
    Math.ceil(originalHeight),
    Math.ceil(originalHeight - 1e-10),
  );

  // Top left position of the upright rectangle after normalization of width and height
  const expandedTopLeft = {
    row:
      Math.min(...rotatedPoints.map((p) => p.row)) -
      (height - originalHeight) / 2,
    column:
      Math.min(...rotatedPoints.map((p) => p.column)) -
      (width - originalWidth) / 2,
  };

  const translation = rotatePoint(expandedTopLeft, center, -angle);

  const angleCos = Math.cos(-angle);
  const angleSin = Math.sin(-angle);
  const matrix = [
    [angleCos, -angleSin, translation.column],
    [angleSin, angleCos, translation.row],
  ];

  return transform(image, matrix, {
    inverse: true,
    width,
    height,
    ...options,
  });
}

/**
 * Get the smallest angle to put the rectangle in an upright position
 * @param points - 2 points forming a line
 * @returns The angle in radians
 */
function getSmallestAngle(points: Point[]): number {
  // Angle respective to horizontal, -π/2 and π/2
  let angleHorizontal = -getAngle(points[1], points[0]);

  if (angleHorizontal > Math.PI / 2) {
    angleHorizontal -= Math.PI;
  } else if (angleHorizontal < -Math.PI / 2) {
    angleHorizontal += Math.PI;
  }

  // angle is between -π/4 and π/4
  let angle = angleHorizontal;
  if (Math.abs(angleHorizontal) > Math.PI / 4) {
    angle =
      angleHorizontal > 0
        ? -Math.PI / 2 + angleHorizontal
        : Math.PI / 2 + angleHorizontal;
  }
  return angle;
}
