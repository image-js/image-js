import { IJS, Mask } from '..';

export function copyData(target: IJS, source: IJS): void;
export function copyData(target: Mask, source: Mask): void;
/**
 * Copy the data of an source to the target image.
 *
 * @param target - Image to which the data must be copied.
 * @param source - Image which data is copied.
 */
export function copyData(target: IJS | Mask, source: IJS | Mask): void {
  if (
    target.width !== source.width ||
    target.height !== source.height ||
    target.colorModel !== source.colorModel
  ) {
    throw new Error(
      'copyData: images width, height or color model is different',
    );
  }
  // @ts-expect-error Accessing data, which is private
  target.data = source.data.slice();
}
