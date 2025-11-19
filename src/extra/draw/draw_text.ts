import type { Image } from '../../Image.ts';

import type { DrawLabelsLabel } from './draw_labels.ts';
import { drawLabels } from './draw_labels.ts';

/**
 * Draws text on an image.
 * @param image - Image to write text on.
 * @param text - Text to write on the image.
 * @returns Image with drawn text.
 */
export function drawText(image: Image, text: DrawLabelsLabel) {
  return drawLabels(image, [text]);
}
