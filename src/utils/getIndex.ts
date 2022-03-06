import { IJS, Mask } from '..';

/**
 * Compute the current data index based on the value coordinates.
 *
 * @param row - Row of the value.
 * @param column - Column of the value.
 * @param channel - Value channel.
 * @param image - The image that is being processed.
 * @returns The value index.
 */
export function getIndex(
  row: number,
  column: number,
  channel: number,
  image: IJS | Mask,
): number {
  return (row * image.width + column) * image.channels + channel;
}
