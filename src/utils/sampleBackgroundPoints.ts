import type { Image } from '../Image.js';
import type { Mask } from '../Mask.js';
import type { Point } from '../geometry/index.js';

interface SampleBackgroundPointsOptions {
  /**
   * Mask to sample points from. If mask is undefined, all the points
   * of the grid are taken as background.
   */
  mask?: Mask;
  /**
   * Number of rows in the grid.
   * @default `10`
   */
  gridHeight?: number;
  /**
   * Number of columns in the grid.
   * @default `10`
   */
  gridWidth?: number;
  /**
   * The kind of background to sample.
   * @default `'black'`
   */
  kind?: 'black' | 'white';
}
/**
 * Applies the grid that samples points that belong to background.
 * @param image - Image to sample points from.
 * @param options - SampleBackgroundPointsOptions.
 * @returns Array of points.
 */
export function sampleBackgroundPoints(
  image: Image,
  options: SampleBackgroundPointsOptions = {},
) {
  const { mask, kind = 'black', gridHeight = 10, gridWidth = 10 } = options;
  const background: Point[] = [];
  const verticalSpread = Math.floor(image.height / gridHeight);
  const horizontalSpread = Math.floor(image.width / gridWidth);
  if (verticalSpread <= 0) {
    throw new RangeError(
      `The grid has bigger height than the image. Grid's height:${gridHeight}`,
    );
  }
  if (horizontalSpread <= 0) {
    throw new RangeError(
      `The grid has bigger width than the image. Grid's width: ${gridWidth}`,
    );
  }
  if (mask) {
    const backgroundValue = kind === 'black' ? 0 : 1;
    for (
      let row = Math.floor(verticalSpread / 2);
      row < image.height - Math.floor(verticalSpread / 2);
      row += verticalSpread
    ) {
      for (
        let column = Math.floor(horizontalSpread / 2);
        column < image.width - Math.floor(horizontalSpread / 2);
        column += horizontalSpread
      ) {
        if (mask.getBit(column, row) === backgroundValue) {
          background.push({ column, row });
        }
      }
    }
  } else {
    for (
      let row = Math.floor(verticalSpread / 2);
      row < image.height - Math.floor(verticalSpread / 2);
      row += verticalSpread
    ) {
      for (
        let column = Math.floor(horizontalSpread / 2);
        column < image.width - Math.floor(horizontalSpread / 2);
        column += horizontalSpread
      ) {
        background.push({ column, row });
      }
    }
  }
  return background;
}
