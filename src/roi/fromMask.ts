import type { Mask } from '../Mask.js';
import { assert } from '../utils/validators/assert.js';

import { RoiMapManager } from './RoiMapManager.js';

export interface FromMaskOptions {
  /**
   * Consider pixels connected by corners as same ROI?
   * @default `false`
   */
  allowCorners?: boolean;
}

/**
 * Extract the ROIs of an image.
 * @param mask - Mask to extract the ROIs from.
 * @param options - From mask options.
 * @returns The corresponding ROI manager.
 */
export function fromMask(
  mask: Mask,
  options: FromMaskOptions = {},
): RoiMapManager {
  const { allowCorners = false } = options;

  const MAX_TODO_ARRAY_FILTER = 65535; // 65535 should be enough for most of the cases

  const MAX_POSITIVE_ID = 2 ** 31 - 1;
  const MAX_NEGATIVE_ID = -(2 ** 31 - 1);

  // based on a binary image we will create plenty of small images
  const data = new Int32Array(mask.size); // maxValue: maxPositiveId, minValue: maxNegativeId

  // split will always return an array of images
  let positiveId = 0;
  let negativeId = 0;

  const columnToProcess = new Uint16Array(MAX_TODO_ARRAY_FILTER + 1);
  const rowToProcess = new Uint16Array(MAX_TODO_ARRAY_FILTER + 1);

  for (let column = 0; column < mask.width; column++) {
    for (let row = 0; row < mask.height; row++) {
      if (data[row * mask.width + column] === 0) {
        // need to process the whole surface
        analyseSurface(column, row);
      }
    }
  }
  // x column
  // y row
  function analyseSurface(column: number, row: number) {
    let from = 0;
    let to = 0;
    const targetState = mask.getBit(column, row);
    const id = targetState ? ++positiveId : --negativeId;
    assert(
      positiveId <= MAX_POSITIVE_ID && negativeId >= MAX_NEGATIVE_ID,
      'too many regions of interest',
    );
    columnToProcess[0] = column;
    rowToProcess[0] = row;
    while (from <= to) {
      const currentColumn = columnToProcess[from & MAX_TODO_ARRAY_FILTER];
      const currentRow = rowToProcess[from & MAX_TODO_ARRAY_FILTER];
      data[currentRow * mask.width + currentColumn] = id;
      // need to check all around mask pixel
      if (
        currentColumn > 0 &&
        data[currentRow * mask.width + currentColumn - 1] === 0 &&
        mask.getBit(currentColumn - 1, currentRow) === targetState
      ) {
        // LEFT
        to++;
        columnToProcess[to & MAX_TODO_ARRAY_FILTER] = currentColumn - 1;
        rowToProcess[to & MAX_TODO_ARRAY_FILTER] = currentRow;
        data[currentRow * mask.width + currentColumn - 1] = MAX_NEGATIVE_ID;
      }
      if (
        currentRow > 0 &&
        data[(currentRow - 1) * mask.width + currentColumn] === 0 &&
        mask.getBit(currentColumn, currentRow - 1) === targetState
      ) {
        // TOP
        to++;
        columnToProcess[to & MAX_TODO_ARRAY_FILTER] = currentColumn;
        rowToProcess[to & MAX_TODO_ARRAY_FILTER] = currentRow - 1;
        data[(currentRow - 1) * mask.width + currentColumn] = MAX_NEGATIVE_ID;
      }
      if (
        currentColumn < mask.width - 1 &&
        data[currentRow * mask.width + currentColumn + 1] === 0 &&
        mask.getBit(currentColumn + 1, currentRow) === targetState
      ) {
        // RIGHT
        to++;
        columnToProcess[to & MAX_TODO_ARRAY_FILTER] = currentColumn + 1;
        rowToProcess[to & MAX_TODO_ARRAY_FILTER] = currentRow;
        data[currentRow * mask.width + currentColumn + 1] = MAX_NEGATIVE_ID;
      }
      if (
        currentRow < mask.height - 1 &&
        data[(currentRow + 1) * mask.width + currentColumn] === 0 &&
        mask.getBit(currentColumn, currentRow + 1) === targetState
      ) {
        // BOTTOM
        to++;
        columnToProcess[to & MAX_TODO_ARRAY_FILTER] = currentColumn;
        rowToProcess[to & MAX_TODO_ARRAY_FILTER] = currentRow + 1;
        data[(currentRow + 1) * mask.width + currentColumn] = MAX_NEGATIVE_ID;
      }
      if (allowCorners) {
        if (
          currentColumn > 0 &&
          currentRow > 0 &&
          data[(currentRow - 1) * mask.width + currentColumn - 1] === 0 &&
          mask.getBit(currentColumn - 1, currentRow - 1) === targetState
        ) {
          // TOP LEFT
          to++;
          columnToProcess[to & MAX_TODO_ARRAY_FILTER] = currentColumn - 1;
          rowToProcess[to & MAX_TODO_ARRAY_FILTER] = currentRow - 1;
          data[(currentRow - 1) * mask.width + currentColumn - 1] =
            MAX_NEGATIVE_ID;
        }
        if (
          currentColumn < mask.width - 1 &&
          currentRow > 0 &&
          data[(currentRow - 1) * mask.width + currentColumn + 1] === 0 &&
          mask.getBit(currentColumn + 1, currentRow - 1) === targetState
        ) {
          // TOP RIGHT
          to++;
          columnToProcess[to & MAX_TODO_ARRAY_FILTER] = currentColumn + 1;
          rowToProcess[to & MAX_TODO_ARRAY_FILTER] = currentRow - 1;
          data[(currentRow - 1) * mask.width + currentColumn + 1] =
            MAX_NEGATIVE_ID;
        }
        if (
          currentColumn > 0 &&
          currentRow < mask.height - 1 &&
          data[(currentRow + 1) * mask.width + currentColumn - 1] === 0 &&
          mask.getBit(currentColumn - 1, currentRow + 1) === targetState
        ) {
          // BOTTOM LEFT
          to++;
          columnToProcess[to & MAX_TODO_ARRAY_FILTER] = currentColumn - 1;
          rowToProcess[to & MAX_TODO_ARRAY_FILTER] = currentRow + 1;
          data[(currentRow + 1) * mask.width + currentColumn - 1] =
            MAX_NEGATIVE_ID;
        }
        if (
          currentColumn < mask.width - 1 &&
          currentRow < mask.height - 1 &&
          data[(currentRow + 1) * mask.width + currentColumn + 1] === 0 &&
          mask.getBit(currentColumn + 1, currentRow + 1) === targetState
        ) {
          // BOTTOM RIGHT
          to++;
          columnToProcess[to & MAX_TODO_ARRAY_FILTER] = currentColumn + 1;
          rowToProcess[to & MAX_TODO_ARRAY_FILTER] = currentRow + 1;
          data[(currentRow + 1) * mask.width + currentColumn + 1] =
            MAX_NEGATIVE_ID;
        }
      }

      from++;

      assert(
        to - from <= MAX_TODO_ARRAY_FILTER,
        'fromMask can not finish, the array to manage internal data is not big enough.' +
          'You could improve mask by changing MAX_ARRAY',
      );
    }
  }
  return new RoiMapManager({
    width: mask.width,
    height: mask.height,
    data,
    nbNegative: Math.abs(negativeId),
    nbPositive: positiveId,
  });
}
