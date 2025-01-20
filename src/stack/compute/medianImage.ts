// @ts-expect-error: median-quisckselect has no types
import quickMedian from 'median-quickselect';

import { Image } from '../../Image.js';
import type { Stack } from '../../Stack.js';
import { checkProcessable } from '../utils/checkProcessable.js';

/**
 *  Returns a new image with the median values of each pixel of the images of the stack.
 * @param stack - Stack to process.
 * @returns The median image.
 */
export function medianImage(stack: Stack): Image {
  checkProcessable(stack, { sameDimensions: true, bitDepth: [8, 16] });

  const image = stack.getImage(0);
  const result = Image.createFrom(image);

  for (let j = 0; j < image.size; j++) {
    for (let channel = 0; channel < stack.channels; channel++) {
      const currentValues = new Array(stack.size);
      for (let i = 0; i < stack.size; i++) {
        currentValues[i] = stack.getValueByIndex(i, j, channel);
      }
      result.setValueByIndex(j, channel, quickMedian(currentValues));
    }
  }

  return result;
}
