import { Mask } from '..';
import { assert } from '../utils/validators/assert';

import { RoiMapManager } from './RoiMapManager';
import { maxNumberRois, maxRoiId } from './utils/constants';

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

  const MAX_ARRAY = maxNumberRois - 1; // 65535 should be enough for most of the cases

  const maxPositiveId = maxRoiId - 1;
  const maxNegativeId = -maxRoiId;

  // based on a binary image we will create plenty of small images
  const data = new Int32Array(mask.size); // maxValue: maxPositiveId, minValue: maxNegativeId

  // split will always return an array of images
  let positiveId = 0;
  let negativeId = 0;

  const columnToProcess = new Uint16Array(maxNumberRois);
  const rowToProcess = new Uint16Array(maxNumberRois);

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
      positiveId <= maxPositiveId && negativeId >= maxNegativeId,
      'too many regions of interest',
    );
    columnToProcess[0] = column;
    rowToProcess[0] = row;
    while (from <= to) {
      const currentColumn = columnToProcess[from & MAX_ARRAY];
      const currentRow = rowToProcess[from & MAX_ARRAY];
      data[currentRow * mask.width + currentColumn] = id;
      // need to check all around mask pixel
      if (
        currentColumn > 0 &&
        data[currentRow * mask.width + currentColumn - 1] === 0 &&
        mask.getBit(currentColumn - 1, currentRow) === targetState
      ) {
        // LEFT
        to++;
        columnToProcess[to & MAX_ARRAY] = currentColumn - 1;
        rowToProcess[to & MAX_ARRAY] = currentRow;
        data[currentRow * mask.width + currentColumn - 1] = maxNegativeId;
      }
      if (
        currentRow > 0 &&
        data[(currentRow - 1) * mask.width + currentColumn] === 0 &&
        mask.getBit(currentColumn, currentRow - 1) === targetState
      ) {
        // TOP
        to++;
        columnToProcess[to & MAX_ARRAY] = currentColumn;
        rowToProcess[to & MAX_ARRAY] = currentRow - 1;
        data[(currentRow - 1) * mask.width + currentColumn] = maxNegativeId;
      }
      if (
        currentColumn < mask.width - 1 &&
        data[currentRow * mask.width + currentColumn + 1] === 0 &&
        mask.getBit(currentColumn + 1, currentRow) === targetState
      ) {
        // RIGHT
        to++;
        columnToProcess[to & MAX_ARRAY] = currentColumn + 1;
        rowToProcess[to & MAX_ARRAY] = currentRow;
        data[currentRow * mask.width + currentColumn + 1] = maxNegativeId;
      }
      if (
        currentRow < mask.height - 1 &&
        data[(currentRow + 1) * mask.width + currentColumn] === 0 &&
        mask.getBit(currentColumn, currentRow + 1) === targetState
      ) {
        // BOTTOM
        to++;
        columnToProcess[to & MAX_ARRAY] = currentColumn;
        rowToProcess[to & MAX_ARRAY] = currentRow + 1;
        data[(currentRow + 1) * mask.width + currentColumn] = maxNegativeId;
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
          columnToProcess[to & MAX_ARRAY] = currentColumn - 1;
          rowToProcess[to & MAX_ARRAY] = currentRow - 1;
          data[(currentRow - 1) * mask.width + currentColumn - 1] =
            maxNegativeId;
        }
        if (
          currentColumn < mask.width - 1 &&
          currentRow > 0 &&
          data[(currentRow - 1) * mask.width + currentColumn + 1] === 0 &&
          mask.getBit(currentColumn + 1, currentRow - 1) === targetState
        ) {
          // TOP RIGHT
          to++;
          columnToProcess[to & MAX_ARRAY] = currentColumn + 1;
          rowToProcess[to & MAX_ARRAY] = currentRow - 1;
          data[(currentRow - 1) * mask.width + currentColumn + 1] =
            maxNegativeId;
        }
        if (
          currentColumn > 0 &&
          currentRow < mask.height - 1 &&
          data[(currentRow + 1) * mask.width + currentColumn - 1] === 0 &&
          mask.getBit(currentColumn - 1, currentRow + 1) === targetState
        ) {
          // BOTTOM LEFT
          to++;
          columnToProcess[to & MAX_ARRAY] = currentColumn - 1;
          rowToProcess[to & MAX_ARRAY] = currentRow + 1;
          data[(currentRow + 1) * mask.width + currentColumn - 1] =
            maxNegativeId;
        }
        if (
          currentColumn < mask.width - 1 &&
          currentRow < mask.height - 1 &&
          data[(currentRow + 1) * mask.width + currentColumn + 1] === 0 &&
          mask.getBit(currentColumn + 1, currentRow + 1) === targetState
        ) {
          // BOTTOM RIGHT
          to++;
          columnToProcess[to & MAX_ARRAY] = currentColumn + 1;
          rowToProcess[to & MAX_ARRAY] = currentRow + 1;
          data[(currentRow + 1) * mask.width + currentColumn + 1] =
            maxNegativeId;
        }
      }

      from++;

      assert(
        to - from <= MAX_ARRAY,
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
