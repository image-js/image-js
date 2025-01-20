import type { Stack } from '../../Stack.js';
import { format } from '../../utils/validators/checkProcessable.js';

interface CheckStackOptions {
  /**
   * All images should have the same dimensions.
   * @default `false`
   */
  sameDimensions?: boolean;
  /**
   * Verify that the images have or don't have an alpha channel.
   */
  alpha?: boolean;
  /**
   *
   */
  bitDepth?: number | number[];
}

/**
 * This method checks if a process can be applied on the stack.
 * @param stack - Stack to verify.
 * @param options - Check processable options.
 */
export function checkProcessable(
  stack: Stack,
  options: CheckStackOptions = {},
) {
  const { sameDimensions = false, alpha } = options;
  let { bitDepth } = options;
  if (sameDimensions) {
    const width = stack.getImage(0).width;
    const height = stack.getImage(0).height;

    for (let i = 1; i < stack.size; i++) {
      const currentImage = stack.getImage(i);
      if (currentImage.width !== width || currentImage.height !== height) {
        throw new RangeError(
          `images must all have same dimensions to apply this algorithm`,
        );
      }
    }
  }
  if (alpha !== undefined && alpha !== stack.alpha) {
    throw new RangeError(
      `stack images ${
        alpha ? 'should' : 'should not'
      } have an alpha channel to apply this algorithm`,
    );
  }
  if (bitDepth) {
    if (!Array.isArray(bitDepth)) {
      bitDepth = [bitDepth];
    }
    if (!bitDepth.includes(stack.bitDepth)) {
      throw new RangeError(
        `image bitDepth must be ${format(bitDepth)} to apply this algorithm`,
      );
    }
  }
}
