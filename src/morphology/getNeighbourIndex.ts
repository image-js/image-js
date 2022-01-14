import { IJS, Mask } from '..';

/**
 * Return index of a neighbouring pixel.
 * @param image - Image that is being processed
 * @param index - Index of the pixel currently processed
 * @param columnOffset - Column offset compared to the current pixel.
 * @param rowOffset - Row offset compared to the current pixel.
 */
export function getNeighbourIndex(
  image: Mask | IJS,
  index: number,

  columnOffset: number,
  rowOffset: number,
): number {
  let coordinates = indexToRowColumn(image, index);
  let neighbourColumn = coordinates.column + columnOffset;
  let neighbourRow = coordinates.row + rowOffset;

  // handling pixels on border
  if (
    neighbourColumn < 0 ||
    neighbourColumn >= image.height ||
    neighbourRow < 0 ||
    neighbourRow >= image.height
  ) {
    // neighbour is out of the image
    return NaN;
  } else {
    return rowColumnToIndex(image, neighbourRow, neighbourColumn);
  }
}

/**
 * @param image
 * @param index
 */
export function indexToRowColumn(
  image: Mask | IJS,
  index: number,
): { row: number; column: number } {
  if (index > image.size) {
    throw new Error('Index is out of range.');
  }
  let column = index % image.width;
  let row = (index - column) / image.width;

  return { row, column };
}

/**
 * @param image
 * @param row
 * @param column
 */
export function rowColumnToIndex(
  image: IJS | Mask,
  row: number,
  column: number,
): number {
  if (row > image.height - 1 || column > image.width - 1) {
    throw new Error('Pixel row and/or column are out of range.');
  }
  return row * image.width + column;
}
