import type { Stack } from '../../Stack.js';
import type { HistogramOptions } from '../../compute/index.js';
import { checkProcessable } from '../utils/checkProcessable.js';

/**
 * Get the sum of all the histograms of the stack's images. If no channel is specified in the options, the images must be GREY.
 * @param stack - Stack to process.
 * @param options - Histogram options.
 * @returns The histogram of the stack.
 */
export function histogram(
  stack: Stack,
  options: HistogramOptions,
): Uint32Array {
  checkProcessable(stack, { bitDepth: [8, 16] });
  const { slots = 2 ** stack.bitDepth, channel = 0 } = options;
  const result = new Uint32Array(slots);
  for (let i = 0; i < stack.size; i++) {
    const image = stack.getImage(i);
    const histogram = image.histogram({ channel, slots });
    for (const [index, value] of histogram.entries()) {
      result[index] += value;
    }
  }
  return result;
}
