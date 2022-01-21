import { IJS } from '..';

/**
 * Copy the data of an source to the target image.
 *
 * @param target - Image to which the data must be copied.
 * @param source - Image which data is copied.
 */
export function copyData(target: IJS, source: IJS): void {
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
