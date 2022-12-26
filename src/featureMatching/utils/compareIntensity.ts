import { Image } from '../../Image';
import { Point } from '../../geometry';

/**
 * Compare the intensity of two pixels of a GREY image.
 *
 * @param image - Source image of the pixels.
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns Wether p1 is darker that p2.
 */
export function compareIntensity(image: Image, p1: Point, p2: Point): boolean {
  const intensity1 = image.getValueByPoint(p1, 0);
  const intensity2 = image.getValueByPoint(p2, 0);

  return intensity1 < intensity2;
}
