import { Image } from '../../Image.js';
import type { Stack } from '../../Stack.js';
import { checkProcessable } from '../utils/checkProcessable.js';

/**
 *  Returns a new 16 bits depth image with the sum of each pixel of the images of the stack.
 * @param stack - Stack to process.
 * @returns The sum image.
 */
export function sum(stack: Stack): Image {
  checkProcessable(stack, { sameDimensions: true, bitDepth: 8 });
  // Because 255*257 = 2**16 - 1
  if (stack.size > 257) {
    throw new Error('Maximal valid stack size is 257');
  }
  const image = stack.getImage(0);
  const dataSize = image.size * stack.channels;
  const sum = new Uint16Array(dataSize).fill(0);

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

  return new Image(image.width, image.height, {
    data: sum,
    colorModel: stack.colorModel,
    bitDepth: 16,
  });
}
