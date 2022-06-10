import { Mask } from '../Mask';
import { ArrayPoint } from '../utils/types';

import { RoiMap } from './RoiMapManager';
import { GetBorderPointOptions, getBorderPoints } from './getBorderPoints';
import { getMask, GetMaskOptions } from './getMask';

export class Roi {
  private map: RoiMap;
  public id: number;
  public row: number;
  public column: number;
  public width: number;
  public height: number;
  public surface: number;

  public constructor(map: RoiMap, id: number) {
    this.map = map;
    this.id = id;
    this.row = map.height;
    this.column = map.width;
    this.width = 0;
    this.height = 0;
    this.surface = 0;
  }

  /**
   * Get the ROI map of the original image.
   *
   * @returns The ROI map.
   */
  public getMap(): RoiMap {
    return this.map;
  }

  /**
   * Return the value at the given coordinates in an ROI map.
   *
   * @param column - Column of the value.
   * @param row - Row of the value.
   * @returns The value at the given coordinates.
   */
  public getMapValue(column: number, row: number) {
    return this.map.data[this.map.width * row + column];
  }

  /**
   * Return the ratio between the width and the height of the bounding rectangle of the ROI.
   *
   * @returns The width by height ratio.
   */
  public getRatio(): number {
    return this.width / this.height;
  }

  /**
   * Generate a mask of an ROI. You can specify the kind of mask you want using the `kind` option.
   *
   * @param options - Get Mask options
   * @returns The ROI mask.
   */
  public getMask(options: GetMaskOptions = { kind: 'contour' }): Mask {
    return getMask(this, options);
  }

  /**
   * Return an array with the coordinates of the pixels that are on the border of the ROI.
   * The points are defined as [column, row].
   *
   * @param options - Get border points options.
   * @returns The array of border pixels.
   */
  public getBorderPoints(options?: GetBorderPointOptions): Array<ArrayPoint> {
    return getBorderPoints(this, options);
  }
}
