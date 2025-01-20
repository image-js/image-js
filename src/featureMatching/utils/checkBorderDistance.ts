import type { Image } from '../../Image.js';
import type { Point } from '../../geometry/index.js';

/**
 * Check that a point is not too close to the border of the image.
 * @param image - Image to process.
 * @param point - The interest point.
 * @param distance - The minimum distance to the border required.
 * @returns Whether the point is far enough from the border.
 */
export function checkBorderDistance(
  image: Image,
  point: Point,
  distance: number,
): boolean {
  return (
    point.column >= distance &&
    point.row >= distance &&
    image.width - point.column > distance &&
    image.height - point.row > distance
  );
}
