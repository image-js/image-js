import { Image } from '../Image.js';
import type { Mask } from '../Mask.js';

import { getDefaultColor } from './getDefaultColor.js';
import { assert } from './validators/assert.js';

/**
 * Blend the given pixel with the pixel at the specified location in the image.
 * @param image - The image with which to blend.
 * @param column - Column of the target pixel.
 * @param row - Row of the target pixel.
 * @param color - Color with which to blend the image pixel. @default `'Opaque black'`.
 */

export function setBlendedPixel(
  image: Image | Mask,
  column: number,
  row: number,
  color?: number[],
) {
  color = color ?? getDefaultColor(image);

  if (!image.alpha) {
    image.setPixel(column, row, color);
  } else {
    assert(image instanceof Image);

    const sourceAlpha = color.at(-1) as number;

    if (sourceAlpha === image.maxValue) {
      image.setPixel(column, row, color);
      return;
    }

    const targetAlpha = image.getValue(column, row, image.channels - 1);

    const newAlpha =
      sourceAlpha + targetAlpha * (1 - sourceAlpha / image.maxValue);

    image.setValue(column, row, image.channels - 1, newAlpha);

    for (let component = 0; component < image.components; component++) {
      const sourceComponent = color[component];
      const targetComponent = image.getValue(column, row, component);

      const newComponent =
        (sourceComponent * sourceAlpha +
          targetComponent * targetAlpha * (1 - sourceAlpha / image.maxValue)) /
        newAlpha;

      image.setValue(column, row, component, newComponent);
    }
  }
}
