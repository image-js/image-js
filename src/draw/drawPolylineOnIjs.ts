import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';

import { Point } from './drawLineOnMask';

export interface DrawPolylineOnIjsOptions {
  /**
   * Lines color - array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default 'black'
   */
  color?: number[];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: IJS;
}
/**
 * Draw a polyline defined by an array of points on an image.
 *
 * @param image - Image to process.
 * @param points - Polyline array of points.
 * @param options - Draw polyline options.
 * @returns The image with the polyline drawing.
 */
export function drawPolylineOnIjs(
  image: IJS,
  points: Point[],
  options: DrawPolylineOnIjsOptions = {},
) {
  let newImage = getOutputImage(image, options, { clone: true });

  const { color = getDefaultColor(image) } = options;
  checkProcessable(newImage, 'drawPolyline', {
    bitDepth: [8, 16],
  });

  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];

    newImage.drawLine(from, to, { out: newImage, color });
  }
  return newImage;
}
