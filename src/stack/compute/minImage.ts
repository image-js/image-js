import { Image } from '../../Image.js';
import type { Stack } from '../../Stack.js';
import { checkProcessable } from '../utils/checkProcessable.js';

/**
 *  Returns a new image with the minimum values of each pixel from the stack.
 * @param stack - Stack to process.
 * @returns The minimum image.
 */
export function minImage(stack: Stack): Image {
  checkProcessable(stack, { sameDimensions: true });
  const newImage = Image.createFrom(stack.getImage(0));
  newImage.fill(newImage.maxValue);

  const nbChannels = newImage.channels;

  for (let i = 0; i < stack.size; i++) {
    for (let j = 0; j < newImage.size; j++) {
      for (let channel = 0; channel < nbChannels; channel++) {
        newImage.setValueByIndex(
          j,
          channel,
          Math.min(
            newImage.getValueByIndex(j, channel),
            stack.getValueByIndex(i, j, channel),
          ),
        );
      }
    }
  }
  return newImage;
}
