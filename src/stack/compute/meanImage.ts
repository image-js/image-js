import { Image } from '../../Image.js';
import type { Stack } from '../../Stack.js';
import { checkProcessable } from '../utils/checkProcessable.js';

/**
 *  Returns a new image with the average values of each pixel of the images of the stack.
 * @param stack - Stack to process.
 * @returns The mean image.
 */
export function meanImage(stack: Stack): Image {
  checkProcessable(stack, { sameDimensions: true, bitDepth: [8, 16] });

  const image = stack.getImage(0);
  const dataSize = image.size * stack.channels;
  const sum = new Uint32Array(dataSize).fill(0);

  for (let i = 0; i < stack.size; i++) {
    for (let j = 0; j < image.size; j++) {
      for (let channel = 0; channel < stack.channels; channel++) {
        sum[j * stack.channels + channel] += stack.getValueByIndex(
          i,
          j,
          channel,
        );
      }
    }
  }
  const meanImage = Image.createFrom(image);
  for (let i = 0; i < image.size; i++) {
    for (let channel = 0; channel < stack.channels; channel++) {
      const index = i * stack.channels + channel;
      meanImage.setValueByIndex(i, channel, sum[index] / stack.size);
    }
  }

  return meanImage;
}
