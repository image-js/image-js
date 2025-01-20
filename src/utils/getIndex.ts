import type { Image } from '../Image.js';
import type { Mask } from '../Mask.js';

export function getIndex(
  column: number,
  row: number,
  image: Image,
  channel: number,
): number;
export function getIndex(column: number, row: number, image: Mask): number;
/**
 * Compute the current pixel index based on the value coordinates.
 * @param column - Column of the value.
 * @param row - Row of the value.
 * @param image - The image that is being processed.
 * @param channel - Value channel.
 * @returns The value index.
 */
export function getIndex(
  column: number,
  row: number,
  image: Image | Mask,
  channel = 0,
): number {
  return (row * image.width + column) * image.channels + channel;
}
