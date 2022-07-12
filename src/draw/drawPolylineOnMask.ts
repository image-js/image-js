import { Mask } from '../Mask';
import { Point } from '../utils/geometry/points';
import { maskToOutputMask } from '../utils/getOutputImage';

export interface DrawPolylineOnMaskOptions {
  /**
   * Mask to which the resulting image has to be put.
   */
  out?: Mask;
}

/**
 * Draw a polyline defined by an array of points on an image.
 *
 * @param mask - Mask to process.
 * @param points - Polyline array of points.
 * @param options - Draw polyline options.
 * @returns The mask with the polyline drawing.
 */
export function drawPolylineOnMask(
  mask: Mask,
  points: Point[],
  options: DrawPolylineOnMaskOptions = {},
): Mask {
  let newImage = maskToOutputMask(mask, options, { clone: true });
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];

    newImage.drawLine(from, to, { out: newImage });
  }
  return newImage;
}
