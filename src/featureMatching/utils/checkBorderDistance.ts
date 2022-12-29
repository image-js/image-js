import { Image } from '../../Image';
import { Point } from '../../geometry';

/**
 * Check that a point is not too close to the border of the image.
 *
 * @param image - Image to process.
 * @param point - The interest point.
 * @param distance - The minimum distance to the border required.
 * @returns Whether the point is far enough from the border.
 */
export function checkBorderDistance(
  image: Image,
  point: Point,
  distance: number,
) {
  return (
    point.column > distance &&
    point.row > distance &&
    image.width - point.column > distance &&
    image.height - point.row > distance
  );
}
