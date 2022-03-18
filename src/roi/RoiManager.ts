export enum RoiKind {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  BW = 'BW',
}

export interface GetRoisOptions {
  /**
   * Minimal surface of the ROIs to keep
   *
   * @default 0
   */
  minSurface?: number;
  /**
   * Maximal surface of the ROIs to keep
   *
   * @default Number.POSITIVE_INFINITY
   */
  maxSurface?: number;
  /**
   * Kind of ROIs to keep
   *
   * @default 'BW'
   */
  kind?: RoiKind;
}

export interface Roi {
  getSurface(): number;
}

export interface RoiManager {
  getRois(options: GetRoisOptions): Roi[];
}
