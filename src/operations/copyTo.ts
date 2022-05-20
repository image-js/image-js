import { IJS } from '..';
import { getOutputImage } from '../utils/getOutputImage';
import { setBlendedPixel } from '../utils/setBlendedPixel';

export interface CopyToOptions {
  /**
   * X offset for the copy, the top left corner of the target image is the reference.
   *
   * @default 0
   */
  columnOffset?: number;
  /**
   * Y offset for the copy, the top left corner of the target image is the reference.
   *
   * @default 0
   */
  rowOffset?: number;
  /**
   * Image to which to output.
   */
  out?: IJS;
}

/**
 * Copy the image to another one by specifying the location in the target image.
 *
 * @param source - The source image.
 * @param target - The target image.
 * @param options - copyTo options.
 * @returns The target with the source copied to it.
 */
export function copyTo(
  source: IJS,
  target: IJS,
  options: CopyToOptions = {},
): IJS {
  const { columnOffset = 0, rowOffset = 0 } = options;

  if (source.colorModel !== target.colorModel) {
    throw new Error('Source and target should have the same color model.');
  }

  const result = getOutputImage(target, options, { clone: true });

  for (
    let row = Math.max(rowOffset, 0);
    row < Math.min(source.height + rowOffset, target.height);
    row++
  ) {
    for (
      let column = Math.max(columnOffset, 0);
      column < Math.min(source.width + columnOffset, target.width);
      column++
    ) {
      let sourcePixel = source.getPixel(column - columnOffset, row - rowOffset);
      setBlendedPixel(result, column, row, { color: sourcePixel });
    }
  }

  return result;
}
