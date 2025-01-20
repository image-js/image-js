import { xMedian } from 'ml-spectra-processing';

import type { Image } from '../Image.js';
import type { Point } from '../utils/geometry/points.js';
import { getOutputImage } from '../utils/getOutputImage.js';
import { assertUnreachable } from '../utils/validators/assert.js';

export interface PixelateOptions {
  /**
   *  Range of pixelated area.
   */
  cellSize: number;
  /**
   * algorithm to use.
   * @default `'center'`
   */
  algorithm?: 'center' | 'median' | 'mean';
  /**
   * Image to which to output.
   */
  out?: Image;
}

interface GetValueOptions {
  /*
   * width of a region to look for center
   */
  width: number;
  /*
   * height of a region to look for center
   */
  height: number;
  /*
   * top left point of a region which serves as point of origin
   */
  origin: Point;
}

/**
 * Function to pixelate an image.
 * @param image - Image to be pixelated.
 * @param options - PixelateOptions.
 * @returns Pixelated Image.
 */
export function pixelate(image: Image, options: PixelateOptions): Image {
  const { cellSize, algorithm = 'center' } = options;
  if (!Number.isInteger(cellSize)) {
    throw new TypeError('cellSize must be an integer');
  }
  if (cellSize < 2) {
    throw new RangeError('cellSize must be greater than 1');
  }
  const newImage = getOutputImage(image, options);

  const getCellValue = getCellValueFunction(algorithm);

  for (let channel = 0; channel < image.channels; channel++) {
    for (let column = 0; column < image.width; column += cellSize) {
      for (let row = 0; row < image.height; row += cellSize) {
        const currentCellWidth = Math.min(cellSize, image.width - column);
        const currentCellHeight = Math.min(cellSize, image.height - row);
        const value = getCellValue(image, channel, {
          width: currentCellWidth,
          height: currentCellHeight,
          origin: { column, row },
        });

        for (
          let newColumn = column;
          newColumn < column + currentCellWidth;
          newColumn++
        ) {
          for (let newRow = row; newRow < row + currentCellHeight; newRow++) {
            newImage.setValue(newColumn, newRow, channel, value);
          }
        }
      }
    }
  }

  return newImage;
}

/**
 * Computes the center value for the current sector
 * @param image - image used for the algorithm
 * @param channel - image channel toto find center value of
 * @param options - GetValueOptions
 * @returns center value
 */
function getCellCenter(
  image: Image,
  channel: number,
  options: GetValueOptions,
): number {
  const center = {
    column: Math.floor(
      (options.origin.column + options.origin.column + options.width - 1) / 2,
    ),
    row: Math.floor(
      (options.origin.row + options.origin.row + options.height - 1) / 2,
    ),
  };
  const value = image.getValue(center.column, center.row, channel);
  return value;
}
/**
 * Computes mean value for the current sector
 * @param image - image used for algorithm
 * @param channel - current channel of an image
 * @param options - GetValueOptions
 * @returns mean value
 */
function getCellMean(image: Image, channel: number, options: GetValueOptions) {
  let sum = 0;

  for (
    let column = options.origin.column;
    column < options.origin.column + options.width;
    column++
  ) {
    for (
      let row = options.origin.row;
      row < options.origin.row + options.height;
      row++
    ) {
      sum += image.getValue(column, row, channel);
    }
  }
  return Math.round(sum / (options.width * options.height));
}
/**
 * Computes a median value for the current sector
 * @param image - image used algorithm
 * @param channel - current channel of an image
 * @param options - GetValueOptions
 * @returns median value
 */
function getCellMedian(
  image: Image,
  channel: number,
  options: GetValueOptions,
) {
  const array = [];
  for (
    let column = options.origin.column;
    column < options.origin.column + options.width;
    column++
  ) {
    for (
      let row = options.origin.row;
      row < options.origin.row + options.height;
      row++
    ) {
      array.push(image.getValue(column, row, channel));
    }
  }

  return xMedian(array);
}
/**
 *  Chooses which algorithm to use for pixelization and returns a function to use for computation
 * @param algorithm - string with the name of an algorithm
 * @returns function
 */
function getCellValueFunction(algorithm: 'center' | 'mean' | 'median') {
  switch (algorithm) {
    case 'mean':
      return getCellMean;
    case 'median':
      return getCellMedian;
    case 'center':
      return getCellCenter;
    default:
      assertUnreachable(algorithm);
      break;
  }
}
