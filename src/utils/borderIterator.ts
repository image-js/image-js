import type { Image } from '../Image.js';
import type { Mask } from '../Mask.js';

/**
 * Create function that allows to iterate on the pixels of the border of an image.
 * @param image - Image for which to create the border iterator.
 * @yields - Index of the border pixel.
 */
export function* borderIterator(image: Image | Mask) {
  for (let col = 0; col < image.width; col++) {
    yield col;
  }
  for (let row = 2; row < image.height; row++) {
    yield row * image.width - 1;
  }
  for (let col = 0; col < image.width; col++) {
    yield image.width * image.height - col - 1;
  }
  for (let row = image.height - 2; row >= 1; row--) {
    yield row * image.width;
  }
}
