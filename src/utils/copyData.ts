import type { Image } from '../Image.js';
import type { Mask } from '../Mask.js';

export function copyData(source: Image, target: Image): void;
export function copyData(source: Mask, target: Mask): void;
/**
 * Copy the data of an source to the target image.
 * @param source - Image which data is copied.
 * @param target - Image to which the data must be copied.
 */
export function copyData(source: Image | Mask, target: Image | Mask): void {
  if (
    target.width !== source.width ||
    target.height !== source.height ||
    target.colorModel !== source.colorModel
  ) {
    throw new RangeError('images width, height or color model is different');
  }
  // @ts-expect-error Accessing data, which is private
  target.data = source.data.slice();
}
