import { IJS, Mask } from '..';

export function getIndex(
  row: number,
  column: number,
  image: IJS,
  channel: number,
): number;
export function getIndex(row: number, column: number, image: Mask): number;
/**
 * Compute the current data index based on the value coordinates.
 *
 * @param row - Row of the value.
 * @param column - Column of the value.
 * @param image - The image that is being processed.
 * @param channel - Value channel.
 * @returns The value index.
 */
export function getIndex(
  row: number,
  column: number,
  image: IJS | Mask,
  channel = 0,
): number {
  return (row * image.width + column) * image.channels + channel;
}
