/**
 * Coordinates of a point in an image with the top-left corner being the reference point.
 */
export type ArrayPoint = [column: number, row: number];

export interface Point {
  /**
   * Point row.
   *
   */
  row: number;
  /**
   * Point column.
   *
   */
  column: number;
}
