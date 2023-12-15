import { Image } from '../../Image';
import { Stack } from '../../Stack';
import { checkProcessable } from '../utils/checkProcessable';

/**
 *  Returns a new image with the maximum values of each pixel from the stack.
 * @param stack - Stack to process.
 * @returns The maximum image.
 */
export function maxImage(stack: Stack): Image {
  checkProcessable(stack, { sameDimensions: true });
  const newImage = Image.createFrom(stack.getImage(0));

  const nbChannels = newImage.channels;

  for (let i = 0; i < stack.size; i++) {
    for (let j = 0; j < newImage.size; j++) {
      for (let channel = 0; channel < nbChannels; channel++) {
        newImage.setValueByIndex(
          j,
          channel,
          Math.max(
            newImage.getValueByIndex(j, channel),
            stack.getValueByIndex(i, j, channel),
          ),
        );
      }
    }
  }
  return newImage;
}
