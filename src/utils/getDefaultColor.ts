import { match } from 'ts-pattern';

import type { Image } from '../Image.js';
import type { Mask } from '../Mask.js';

/**
 * Get the default color for a given color model.
 * The color is black for images and 1 for masks.
 * @param image - The used image.
 * @returns Default color.
 */
export function getDefaultColor(image: Image | Mask): number[] {
  return match(image.colorModel)
    .with('GREY', () => [0])
    .with('GREYA', () => [0, image.maxValue])
    .with('RGB', () => [0, 0, 0])
    .with('RGBA', () => [0, 0, 0, image.maxValue])
    .with('BINARY', () => [1])
    .exhaustive();
}
