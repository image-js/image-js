import { Mask } from '..';

import { RoiMapManager } from './RoiMapManager';

export interface FromMaskOptions {
  /**
   * Consider pixels connected by corners as same ROI?
   *
   * @default false
   */
  allowCorners?: boolean;
}

/**
 * Extract the ROIs of an image.
 *
 * @param mask - Mask to extract the ROIs from
 * @param options - fromMask options
 * @returns The corresponding ROI manager.
 */
export function fromMask(
  mask: Mask,
  options: FromMaskOptions = {},
): RoiMapManager {
  const { allowCorners = false } = options;

  const MAX_ARRAY = 0x00ffff; // 65535 should be enough for most of the cases

  // based on a binary image we will create plenty of small images
  let data = new Int16Array(mask.size); // maxValue: 32767, minValue: -32768

  // split will always return an array of images
  let positiveID = 0;
  let negativeID = 0;

  let columnToProcess = new Uint16Array(MAX_ARRAY + 1); // assign dynamically ????
  let rowToProcess = new Uint16Array(MAX_ARRAY + 1); // mask +1 is of course mandatory !!!

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
    let targetState = mask.getBit(row, column);
    let id = targetState ? ++positiveID : --negativeID;
    if (positiveID > 32767 || negativeID < -32768) {
      throw new Error('Too many regions of interest');
    }
    columnToProcess[0] = column;
    rowToProcess[0] = row;
    while (from <= to) {
      let currentColumn = columnToProcess[from & MAX_ARRAY];
      let currentRow = rowToProcess[from & MAX_ARRAY];
      data[currentRow * mask.width + currentColumn] = id;
      // need to check all around mask pixel
      if (
        currentColumn > 0 &&
        data[currentRow * mask.width + currentColumn - 1] === 0 &&
        mask.getBit(currentRow, currentColumn - 1) === targetState
      ) {
        // LEFT
        to++;
        columnToProcess[to & MAX_ARRAY] = currentColumn - 1;
        rowToProcess[to & MAX_ARRAY] = currentRow;
        data[currentRow * mask.width + currentColumn - 1] = -32768;
      }
      if (
        currentRow > 0 &&
        data[(currentRow - 1) * mask.width + currentColumn] === 0 &&
        mask.getBit(currentRow - 1, currentColumn) === targetState
      ) {
        // TOP
        to++;
        columnToProcess[to & MAX_ARRAY] = currentColumn;
        rowToProcess[to & MAX_ARRAY] = currentRow - 1;
        data[(currentRow - 1) * mask.width + currentColumn] = -32768;
      }
      if (
        currentColumn < mask.width - 1 &&
        data[currentRow * mask.width + currentColumn + 1] === 0 &&
        mask.getBit(currentRow, currentColumn + 1) === targetState
      ) {
        // RIGHT
        to++;
        columnToProcess[to & MAX_ARRAY] = currentColumn + 1;
        rowToProcess[to & MAX_ARRAY] = currentRow;
        data[currentRow * mask.width + currentColumn + 1] = -32768;
      }
      if (
        currentRow < mask.height - 1 &&
        data[(currentRow + 1) * mask.width + currentColumn] === 0 &&
        mask.getBit(currentRow + 1, currentColumn) === targetState
      ) {
        // BOTTOM
        to++;
        columnToProcess[to & MAX_ARRAY] = currentColumn;
        rowToProcess[to & MAX_ARRAY] = currentRow + 1;
        data[(currentRow + 1) * mask.width + currentColumn] = -32768;
      }
      if (allowCorners) {
        if (
          currentColumn > 0 &&
          currentRow > 0 &&
          data[(currentRow - 1) * mask.width + currentColumn - 1] === 0 &&
          mask.getBit(currentRow - 1, currentColumn - 1) === targetState
        ) {
          // TOP LEFT
          to++;
          columnToProcess[to & MAX_ARRAY] = currentColumn - 1;
          rowToProcess[to & MAX_ARRAY] = currentRow - 1;
          data[(currentRow - 1) * mask.width + currentColumn - 1] = -32768;
        }
        if (
          currentColumn < mask.width - 1 &&
          currentRow > 0 &&
          data[(currentRow - 1) * mask.width + currentColumn + 1] === 0 &&
          mask.getBit(currentRow - 1, currentColumn + 1) === targetState
        ) {
          // TOP RIGHT
          to++;
          columnToProcess[to & MAX_ARRAY] = currentColumn + 1;
          rowToProcess[to & MAX_ARRAY] = currentRow - 1;
          data[(currentRow - 1) * mask.width + currentColumn + 1] = -32768;
        }
        if (
          currentColumn > 0 &&
          currentRow < mask.height - 1 &&
          data[(currentRow + 1) * mask.width + currentColumn - 1] === 0 &&
          mask.getBit(currentRow + 1, currentColumn - 1) === targetState
        ) {
          // BOTTOM LEFT
          to++;
          columnToProcess[to & MAX_ARRAY] = currentColumn - 1;
          rowToProcess[to & MAX_ARRAY] = currentRow + 1;
          data[(currentRow + 1) * mask.width + currentColumn - 1] = -32768;
        }
        if (
          currentColumn < mask.width - 1 &&
          currentRow < mask.height - 1 &&
          data[(currentRow + 1) * mask.width + currentColumn + 1] === 0 &&
          mask.getBit(currentRow + 1, currentColumn + 1) === targetState
        ) {
          // BOTTOM RIGHT
          to++;
          columnToProcess[to & MAX_ARRAY] = currentColumn + 1;
          rowToProcess[to & MAX_ARRAY] = currentRow + 1;
          data[(currentRow + 1) * mask.width + currentColumn + 1] = -32768;
        }
      }

      from++;

      if (to - from > MAX_ARRAY) {
        throw new Error(
          'analyseMask can not finish, the array to manage internal data is not big enough.' +
            'You could improve mask by changing MAX_ARRAY',
        );
      }
    }
  }
  return new RoiMapManager({
    width: mask.width,
    height: mask.height,
    data,
  });
}
