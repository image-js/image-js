import type { Image } from '../Image.js';
import type { Point } from '../geometry/index.js';
import { getOutputImage } from '../utils/getOutputImage.js';

import type { DrawMarkerOptions } from './drawMarker.js';
import { drawMarker } from './drawMarker.js';

/**
 * Draw markers on the image.
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
