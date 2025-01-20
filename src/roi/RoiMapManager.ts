import { Matrix } from 'ml-matrix';

import type { Mask } from '../Mask.js';

import type { Roi } from './Roi.js';
import type { FromMaskOptions } from './fromMask.js';
import { fromMask } from './fromMask.js';
import type { GetRoisOptions } from './getRois.js';
import { getRois } from './getRois.js';

export interface RoiManager {
  getRois(options: GetRoisOptions): Roi[];
}

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
  data: Int32Array;
  /**
   * Number of distinct positive values in the ROI map.
   *
   */
  nbPositive: number;
  /**
   * Number of distinct negative values in the ROI map.
   *
   */
  nbNegative: number;
}
export class RoiMapManager implements RoiManager {
  private map: RoiMap;
  public whiteRois: Roi[];
  public blackRois: Roi[];

  public constructor(map: RoiMap) {
    this.map = map;
    this.whiteRois = [];
    this.blackRois = [];
  }

  /**
   * Return the ROI map of the RoiMapManager.
   * @returns - The ROI map.
   */
  public getMap(): RoiMap {
    return this.map;
  }

  /**
   * Return the value at the given coordinates in an ROI map.
   * @param column - Column of the value.
   * @param row - Row of the value.
   * @returns The value at the given coordinates.
   */
  public getMapValue(column: number, row: number) {
    return this.map.data[this.map.width * row + column];
  }

  /**
   * Returns the ROI map as a correct width and height matrix.
   * @returns The ROI map matrix.
   */
  public getMapMatrix(): number[][] {
    return Matrix.from1DArray(
      this.map.height,
      this.map.width,
      this.map.data,
    ).to2DArray();
  }

  public getRois(options: GetRoisOptions = {}): Roi[] {
    return getRois(this, options);
  }

  public getRoiById(roiID: number): Roi {
    const rois = this.getRois({ kind: 'bw' });
    const foundRoi = rois.find((roi) => roi.id === roiID);
    if (!foundRoi) {
      throw new Error(`invalid ID: ${roiID}`);
    }
    return foundRoi;
  }

  public static fromMask(mask: Mask, options: FromMaskOptions = {}) {
    return fromMask(mask, options);
  }
}
