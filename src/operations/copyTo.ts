import { IJS, Mask } from '..';
import { getOutputImage, maskToOutputMask } from '../utils/getOutputImage';
import { setBlendedPixel } from '../utils/setBlendedPixel';

export interface CopyToOptions<OutType> {
  /**
   * X offset for the copy, the top left corner of the target image is the reference.
   *
   * @default 0
   */
  column?: number;
  /**
   * Y offset for the copy, the top left corner of the target image is the reference.
   *
   * @default 0
   */
  row?: number;
  /**
   * Image to which to output.
   */
  out?: OutType;
}

export function copyTo(
  source: IJS,
  target: IJS,
  options: CopyToOptions<IJS>,
): IJS;
export function copyTo(
  source: Mask,
  target: Mask,
  options: CopyToOptions<Mask>,
): Mask;
/**
 * Copy the image to another one by specifying the location in the target image.
 *
 * @param source - The source image.
 * @param target - The target image.
 * @param options - copyTo options.
 * @returns The target with the source copied to it.
 */
export function copyTo(
  source: IJS | Mask,
  target: IJS | Mask,
  options: CopyToOptions<IJS | Mask> = {},
): IJS | Mask {
  const { column = 0, row = 0 } = options;

  if (source.colorModel !== target.colorModel) {
    throw new Error('Source and target should have the same color model.');
  }

  let result: IJS | Mask;
  if (target instanceof IJS) {
    result = getOutputImage(target, options, { clone: true });
  } else {
    result = maskToOutputMask(target, options, { clone: true });
  }

  for (
    let currentRow = Math.max(row, 0);
    currentRow < Math.min(source.height + row, target.height);
    currentRow++
  ) {
    for (
      let currentColumn = Math.max(column, 0);
      currentColumn < Math.min(source.width + column, target.width);
      currentColumn++
    ) {
      let sourcePixel = source.getPixel(
        currentColumn - column,
        currentRow - row,
      );
      setBlendedPixel(result, currentColumn, currentRow, {
        color: sourcePixel,
      });
    }
  }

  return result;
}
