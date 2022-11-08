/**
 * Coordinates of the surrounding pixels relative to the current pixel.
 * First pixel is the one on the right, then they are in clockwise order.
 */
export const surroundingPixels = [
  { row: 0, column: 1 },
  { row: 1, column: 1 },
  { row: 1, column: 0 },
  { row: 1, column: -1 },
  { row: 0, column: -1 },
  { row: -1, column: -1 },
  { row: -1, column: 0 },
  { row: -1, column: 1 },
];
