import { xMedian } from 'ml-spectra-processing';

import { Image } from '../Image.js';
import type { BorderType } from '../utils/interpolateBorder.js';
import { getBorderInterpolation } from '../utils/interpolateBorder.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

export interface MedianFilterOptions {
  /**
   * Type of border algorithm to interpolate from.
   * @default `'reflect101'`
   */
  borderType: BorderType;
  /**
   * Value of border.
   */
  borderValue?: number;
  /**
   * The radius of the cell to extract median value from. Must be odd.
   *  @default `1`
   */
  cellSize: number;
}
/**
 * Calculate a new image that replaces all pixel values by the median of neighbouring pixels.
 * @param image - Image to be filtered.
 * @param options - MedianFilterOptions
 * @returns Image after median filter.
 */
export function medianFilter(image: Image, options: MedianFilterOptions) {
  const { cellSize = 3, borderType = 'reflect101', borderValue } = options;

  checkProcessable(image, {
    bitDepth: [8, 16],
  });

  if (cellSize < 1) {
    throw new RangeError(
      `Invalid property "cellSize". Must be greater than 0. Received ${cellSize}.`,
    );
  }

  if (cellSize % 2 === 0) {
    throw new RangeError(
      `Invalid property "cellSize". Must be an odd number. Received ${cellSize}.`,
    );
  }

  const interpolateBorder = getBorderInterpolation(
    borderType,
    borderValue as number,
  );

  const newImage = Image.createFrom(image);
  const size = cellSize ** 2;
  const cellValues = new Uint16Array(size);

  const halfCellSize = (cellSize - 1) / 2;

  for (let channel = 0; channel < image.channels; channel++) {
    for (let row = 0; row < image.height; row++) {
      for (let column = 0; column < image.width; column++) {
        let n = 0;
        for (let cellRow = -halfCellSize; cellRow <= halfCellSize; cellRow++) {
          for (
            let cellColumn = -halfCellSize;
            cellColumn <= halfCellSize;
            cellColumn++
          ) {
            cellValues[n++] = interpolateBorder(
              column + cellColumn,
              row + cellRow,
              channel,
              image,
            );
          }
        }
        newImage.setValue(column, row, channel, xMedian(cellValues));
      }
    }
  }
  return newImage;
}
