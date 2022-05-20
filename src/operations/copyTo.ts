import { IJS } from '..';
import { getOutputImage } from '../utils/getOutputImage';

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
  if (source.alpha) {
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
        let sourceAlpha = source.getValue(
          column - columnOffset,
          row - rowOffset,
          source.channels - 1,
        );
        let targetAlpha = target.getValue(column, row, source.channels - 1);

        let newAlpha =
          sourceAlpha + targetAlpha * (1 - sourceAlpha / source.maxValue);

        result.setValue(column, row, target.channels - 1, newAlpha);
        for (let component = 0; component < source.components; component++) {
          let sourceComponent = source.getValue(
            column - columnOffset,
            row - rowOffset,
            component,
          );
          let targetComponent = target.getValue(column, row, component);

          let newComponent =
            (sourceComponent * sourceAlpha +
              targetComponent *
                targetAlpha *
                (1 - sourceAlpha / source.maxValue)) /
            newAlpha;

          result.setValue(column, row, component, newComponent);
        }
      }
    }
  } else {
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
        for (let component = 0; component < target.components; component++) {
          let sourceComponent = source.getValue(
            column - columnOffset,
            row - rowOffset,
            component,
          );
          result.setValue(column, row, component, sourceComponent);
        }
      }
    }
  }
  return result;
}
