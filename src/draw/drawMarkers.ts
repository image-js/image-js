import { Image } from '../Image';
import { Point } from '../geometry';
import { getOutputImage } from '../utils/getOutputImage';

import { DrawMarkerOptions, drawMarker } from './drawMarker';

/**
 * Draw markers on the image.
 *
 * @param image - Image to process.
 * @param points - Markers center points.
 * @param options - Draw marker options.
 * @returns The image with the markers drawing.
 */
export function drawMarkers(
  image: Image,
  points: Point[],
  options: DrawMarkerOptions = {},
): Image {
  const newImage = getOutputImage(image, options, { clone: true });
  for (const point of points) {
    drawMarker(newImage, point, { ...options, out: newImage });
  }
  return newImage;
}
