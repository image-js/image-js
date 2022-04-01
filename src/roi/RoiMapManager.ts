import { Matrix } from 'ml-matrix';

import { Roi, RoiManager } from './RoiManager';

export interface RoiMap {
  /**
   * Width of the map.
   */
  width: number;
  /**
   * Height of the map.
   */
  height: number;
  /**
   * Data of the ROIs. Each ROI is associated with a negative or a positive value,
   * depending if it derives from a zone made of zeros or ones in the original mask.
   */
  data: Int16Array;
  /**
   * Number of distinct positive values in the ROI map
   *
   */
  nbPositive: number;
  /**
   * Number of distinct negative values in the ROI map
   *
   */
  nbNegative: number;
}
export class RoiMapManager implements RoiManager {
  public map: RoiMap;

  public constructor(map: RoiMap) {
    this.map = map;
  }

  public getRois(): Roi[] {
    return [];
  }

  public getMapMatrix(): number[][] {
    return Matrix.from1DArray(
      this.map.height,
      this.map.width,
      this.map.data,
    ).to2DArray();
  }
}
