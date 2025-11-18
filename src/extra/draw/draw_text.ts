import type { Image } from '../../Image.ts';
import type { Point } from '../../index_full.ts';

import type { DrawLabelsOptions } from './draw_labels.ts';
import { drawLabels } from './draw_labels.ts';

/**
 * Draws text on an image.
 * @param image - Image to write text on.
 * @param text - Text to write on the image.
 * @param coordinate - Coordinate on the image where text should be written.
 * @param options - Drawing text options.
 * @returns Image with drawn text.
 */
export function drawText(
  image: Image,
  text: string,
  coordinate: Point,
  options: DrawLabelsOptions,
) {
  const label = { text, position: coordinate };
  return drawLabels(image, [label], options);
}
