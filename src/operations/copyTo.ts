import { IJS } from '..';
import { getOutputImage } from '../utils/getOutputImage';

export interface CopyToOptions {
  columnOffset?: number;
  rowOffset?: number;
  out?: IJS;
}

/**
 * Copy the image to another one by specifying the location in the target image.
 *
 * @param source - The source image
 * @param target - The target image
 * @param options - copyTo options
 * @returns The target with the source copied to it
 */
export default function copyTo(
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
          row - rowOffset,
          column - columnOffset,
          source.channels - 1,
        );
        let targetAlpha = target.getValue(row, column, source.channels - 1);

        let newAlpha =
          sourceAlpha + targetAlpha * (1 - sourceAlpha / source.maxValue);

        result.setValue(row, column, target.channels - 1, newAlpha);
        for (let component = 0; component < source.components; component++) {
          let sourceComponent = source.getValue(
            row - rowOffset,
            column - columnOffset,
            component,
          );
          let targetComponent = target.getValue(row, column, component);

          let newComponent =
            (sourceComponent * sourceAlpha +
              targetComponent *
                targetAlpha *
                (1 - sourceAlpha / source.maxValue)) /
            newAlpha;

          result.setValue(row, column, component, newComponent);
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
            row - rowOffset,
            column - columnOffset,
            component,
          );
          result.setValue(row, column, component, sourceComponent);
        }
      }
    }
  }
  return result;
}
