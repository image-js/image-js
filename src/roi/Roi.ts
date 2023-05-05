import { Mask } from '../Mask';
import {
  GetBorderPointsOptions,
  getFeret,
  Feret,
  getConvexHull,
  getMbr,
  Mbr,
} from '../maskAnalysis';
import { Point } from '../utils/geometry/points';

import { RoiMap } from './RoiMapManager';
import { getBorderPoints } from './getBorderPoints';
import { getMask, GetMaskOptions } from './getMask';
import { Ellipse, getEllipse } from './properties/getEllipse';

interface Border {
  connectedID: number; // refers to the roiID of the contiguous ROI
  length: number;
}
interface Computed {
  perimeter: number;
  borders: Border[]; // external and internal ids which are not equal to the current roi ID
  perimeterInfo: { one: number; two: number; three: number; four: number };
  externalLengths: number[];
  borderLengths: number[];
  box: number;
  points: number[][];
  holesInfo: { number: number; surface: number };
  boxIDs: number[];
  eqpc: number;
  ped: number;
  externalBorders: Border[];
  roundness: number;
  convexHull: { points: Point[]; surface: number; perimeter: number };
  mbr: Mbr;
  fillRatio: number;
  internalIDs: number[];
  feret: Feret;
  ellipse: Ellipse;
  centroid: Point;
}
export class Roi {
  /**
   * Original map with all the ROI IDs.
   */
  private readonly map: RoiMap;
  /**
   * ID of the ROI. Positive for white ROIs and negative for black ones.
   */
  public readonly id: number;
  /**
   * Origin of the ROI. The top-left corner of the rectangle around
   * the ROI relative to the original image.
   */
  public readonly origin: Point;
  /**
   * Width of the ROI.
   */
  public readonly width: number;
  /**
   * Height of the ROI.
   */
  public readonly height: number;
  /**
   * Surface of the ROI.
   */
  public readonly surface: number;
  /**
   * Cached values of properties to improve performance
   */
  #computed: Partial<Computed>;

  public constructor(
    map: RoiMap,
    id: number,
    width: number,
    height: number,
    origin: Point,
    surface: number,
  ) {
    this.map = map;
    this.id = id;
    this.origin = origin;
    this.width = width;
    this.height = height;
    this.surface = surface;
    this.#computed = {};
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
   * Returns the value at the given coordinates in an ROI map.
   *
   * @param column - Column of the value.
   * @param row - Row of the value.
   * @returns The value at the given coordinates.
   */
  public getMapValue(column: number, row: number) {
    return this.map.data[this.map.width * row + column];
  }

  /**
   * Returns the ratio between the width and the height of the bounding rectangle of the ROI.
   *
   * @returns The width by height ratio.
   */
  public getRatio(): number {
    return this.width / this.height;
  }

  /**
   * Generates a mask of an ROI. You can specify the kind of mask you want using the `kind` option.
   *
   * @param options - Get Mask options
   * @returns The ROI mask.
   */
  public getMask(options?: GetMaskOptions): Mask {
    return getMask(this, options);
  }

  /**
   * Diameter of a circle of equal perimeter
   */
  get ped() {
    return this.#getComputed('ped', () => {
      return this.perimeter / Math.PI;
    });
  }

  /**
   * Return an array with the coordinates of the pixels that are on the border of the ROI.
   * The points are defined as [column, row].
   *
   * @param options - Get border points options.
   * @returns The array of border pixels.
   */
  public getBorderPoints(options?: GetBorderPointsOptions): Array<Point> {
    return getBorderPoints(this, options);
  }

  /**
   * Return an array of ROIs IDs that are included in the current ROI.
   * This will be useful to know if there are some holes in the ROI.
   *
   * @returns internalIDs
   */
  get internalIDs() {
    return this.#getComputed('internalIDs', () => {
      let internal = [this.id];
      let roiMap = this.map;
      let data = roiMap.data;

      if (this.height > 2) {
        for (let column = 0; column < this.width; column++) {
          let target = this.computeIndex(0, column);
          if (internal.includes(data[target])) {
            let id = data[target + roiMap.width];
            if (!internal.includes(id) && !this.boxIDs.includes(id)) {
              internal.push(id);
            }
          }
        }
      }

      let array = new Array(4);
      for (let column = 1; column < this.width - 1; column++) {
        for (let row = 1; row < this.height - 1; row++) {
          let target = this.computeIndex(row, column);
          if (internal.includes(data[target])) {
            // we check if one of the neighbour is not yet in

            array[0] = data[target - 1];
            array[1] = data[target + 1];
            array[2] = data[target - roiMap.width];
            array[3] = data[target + roiMap.width];

            for (let i = 0; i < 4; i++) {
              let id = array[i];
              if (!internal.includes(id) && !this.boxIDs.includes(id)) {
                internal.push(id);
              }
            }
          }
        }
      }

      return internal;
    });
  }
  //TODO externalIds should be an array of {id: number, length: number}

  /**
   * Return an array of ROIs IDs that touch the current ROI.
   */
  get externalBorders(): Border[] {
    return this.#getComputed('externalBorders', () => {
      // take all the borders and remove the internal one ...
      let borders = this.borders;

      let externalBorders = [];
      let externalIDs = [];
      let internals = this.internalIDs;

      for (let border of borders) {
        if (!internals.includes(border.connectedID)) {
          const element: Border = {
            connectedID: border.connectedID,
            length: border.length,
          };
          externalIDs.push(element.connectedID);
          externalBorders.push(element);
        }
      }

      return externalBorders;
    });
  }
  /**
   * Calculates and caches the number of sides by which each pixel is touched externally
   *
   * @param roi -ROI
   * @returns object which tells how many pixels are exposed externally to how many sides
   */
  get perimeterInfo() {
    return this.#getComputed('perimeterInfo', () => {
      const roiMap = this.map;
      const data = roiMap.data;
      let one = 0;
      let two = 0;
      let three = 0;
      let four = 0;
      let externalIDs = this.externalBorders.map(
        (element) => element.connectedID,
      );
      for (let column = 0; column < this.width; column++) {
        for (let row = 0; row < this.height; row++) {
          let target = this.computeIndex(row, column);
          if (data[target] === this.id) {
            let nbAround = 0;
            if (column === 0) {
              nbAround++;
            } else if (externalIDs.includes(data[target - 1])) {
              nbAround++;
            }

            if (column === roiMap.width - 1) {
              nbAround++;
            } else if (externalIDs.includes(data[target + 1])) {
              nbAround++;
            }

            if (row === 0) {
              nbAround++;
            } else if (externalIDs.includes(data[target - roiMap.width])) {
              nbAround++;
            }

            if (row === roiMap.height - 1) {
              nbAround++;
            } else if (externalIDs.includes(data[target + roiMap.width])) {
              nbAround++;
            }
            switch (nbAround) {
              case 1:
                one++;
                break;
              case 2:
                two++;
                break;
              case 3:
                three++;
                break;
              case 4:
                four++;
                break;
              default:
            }
          }
        }
      }
      return { one, two, three, four };
    });
  }

  /**
   * Perimeter of the ROI.
   * The perimeter is calculated using the sum of all the external borders of the ROI to which we subtract
   * (2 - √2) * the number of pixels that have 2 external borders
   * 2 * (2 - √2) * the number of pixels that have 3 external borders
   */
  get perimeter() {
    let info = this.perimeterInfo;
    const delta = 2 - Math.sqrt(2);
    return (
      info.one +
      info.two * 2 +
      info.three * 3 +
      info.four * 4 -
      delta * (info.two + info.three * 2 + info.four)
    );
  }
  /**
   * An array of tuples, each tuple being the x and y coordinates of the ROI point.
   * the current ROI points
   */
  get points() {
    return this.#getComputed('points', () => {
      let points = [];
      for (let row = 0; row < this.height; row++) {
        for (let column = 0; column < this.width; column++) {
          let target =
            (row + this.origin.row) * this.map.width +
            column +
            this.origin.column;
          if (this.map.data[target] === this.id) {
            points.push([column, row]);
          }
        }
      }
      return points;
    });
  }
  get boxIDs() {
    return this.#getComputed('boxIDs', () => {
      let surroundingIDs = new Set<number>(); // allows to get a unique list without indexOf

      const roiMap = this.map;
      const data = roiMap.data;

      // we check the first line and the last line
      for (let row of [0, this.height - 1]) {
        for (let column = 0; column < this.width; column++) {
          let target = this.computeIndex(row, column);
          if (
            column - this.origin.column > 0 &&
            data[target] === this.id &&
            data[target - 1] !== this.id
          ) {
            let value = data[target - 1];
            surroundingIDs.add(value);
          }
          if (
            roiMap.width - column - this.origin.column > 1 &&
            data[target] === this.id &&
            data[target + 1] !== this.id
          ) {
            let value = data[target + 1];
            surroundingIDs.add(value);
          }
        }
      }

      // we check the first column and the last column
      for (let column of [0, this.width - 1]) {
        for (let row = 0; row < this.height; row++) {
          let target = this.computeIndex(row, column);
          if (
            row - this.origin.row > 0 &&
            data[target] === this.id &&
            data[target - roiMap.width] !== this.id
          ) {
            let value = data[target - roiMap.width];
            surroundingIDs.add(value);
          }
          if (
            roiMap.height - row - this.origin.row > 1 &&
            data[target] === this.id &&
            data[target + roiMap.width] !== this.id
          ) {
            let value = data[target + roiMap.width];
            surroundingIDs.add(value);
          }
        }
      }

      return Array.from(surroundingIDs); // the selection takes the whole rectangle
    });
  }

  /**
   * Returns the diameter of a circle of equal projection area
   */
  get eqpc() {
    return this.#getComputed('eqpc', () => {
      return 2 * Math.sqrt(this.surface / Math.PI);
    });
  }

  get ellipse(): Ellipse {
    return this.#getComputed('ellipse', () => {
      const ellipse = getEllipse(this);
      return ellipse;
    });
  }

  /**
   * Number of holes in the ROI and their total surface.
   * Used to calculate fillRatio.
   *
   * @returns the surface of holes in ROI
   */
  get holesInfo() {
    return this.#getComputed('holesInfo', () => {
      let surface = 0;
      const data = this.map.data;
      for (let column = 1; column < this.width - 1; column++) {
        for (let row = 1; row < this.height - 1; row++) {
          let target = this.computeIndex(row, column);
          if (
            this.internalIDs.includes(data[target]) &&
            data[target] !== this.id
          ) {
            surface++;
          }
        }
      }
      return {
        number: this.internalIDs.length - 1,
        surface,
      };
    });
  }

  /**
   *Calculates and caches border's length and their IDs
   *
   * @returns borders' length and their IDs
   */
  get borders() {
    return this.#getComputed('borders', () => {
      const roiMap = this.map;
      const data = roiMap.data;
      let surroudingIDs = new Set<number>(); // allows to get a unique list without indexOf
      let surroundingBorders = new Map();
      let visitedData = new Set();
      let dx = [+1, 0, -1, 0];
      let dy = [0, +1, 0, -1];

      for (
        let column = this.origin.column;
        column <= this.origin.column + this.width;
        column++
      ) {
        for (
          let row = this.origin.row;
          row <= this.origin.row + this.height;
          row++
        ) {
          let target = column + row * roiMap.width;
          if (data[target] === this.id) {
            for (let dir = 0; dir < 4; dir++) {
              let newX = column + dx[dir];
              let newY = row + dy[dir];
              if (
                newX >= 0 &&
                newY >= 0 &&
                newX < roiMap.width &&
                newY < roiMap.height
              ) {
                let neighbour = newX + newY * roiMap.width;

                if (
                  data[neighbour] !== this.id &&
                  !visitedData.has(neighbour)
                ) {
                  visitedData.add(neighbour);
                  surroudingIDs.add(data[neighbour]);
                  let surroundingBorder = surroundingBorders.get(
                    data[neighbour],
                  );
                  if (!surroundingBorder) {
                    surroundingBorders.set(data[neighbour], 1);
                  } else {
                    surroundingBorders.set(
                      data[neighbour],
                      ++surroundingBorder,
                    );
                  }
                }
              }
            }
          }
        }
      }
      let id: number[] = Array.from(surroudingIDs);
      return id.map((id) => {
        return {
          connectedID: id,
          length: surroundingBorders.get(id),
        };
      });
    });
  }
  /**
   * Calculates fill ratio of the ROI
   */
  get fillRatio() {
    return this.surface / (this.surface + this.holesInfo.surface);
  }
  /**
   * Calculates sphericity of the ROI
   */
  get sphericity() {
    return (2 * Math.sqrt(this.surface * Math.PI)) / this.perimeter;
  }

  get filledSurface() {
    return this.surface + this.holesInfo.surface;
  }

  /**
   * Calculates solidity of the ROI
   */
  get solidity() {
    return this.surface / getConvexHull(this.getMask()).surface;
  }
  //TODO Should be refactored to not need creating a new Mask
  get convexHull() {
    return this.#getComputed('convexHull', () => {
      return getConvexHull(this.getMask());
    });
  }
  /**
   * Calculates minimum bounding rectangle
   */
  get mbr() {
    return this.#getComputed('mbr', () => {
      return getMbr(this.getMask());
    });
  }

  get roundness() {
    /*Slide 24 https://static.horiba.com/fileadmin/Horiba/Products/Scientific/Particle_Characterization/Webinars/Slides/TE011.pdf */
    return (4 * this.surface) / (Math.PI * this.feret.maxDiameter.length ** 2);
  }

  get feret(): Feret {
    return this.#getComputed('feret', () => {
      return getFeret(this.getMask());
    });
  }
  /**
   *
   * @returns calculated properties as one object
   */
  toJSON() {
    return {
      id: this.id,
      origin: this.origin,
      height: this.height,
      width: this.width,
      surface: this.surface,
      eqpc: this.eqpc,
      ped: this.ped,
      feret: this.feret,
      fillRatio: this.fillRatio,
      sphericity: this.sphericity,
      roundness: this.roundness,
      solidity: this.solidity,
      perimeter: this.perimeter,
      convexHull: this.convexHull,
      mbr: this.mbr,
      filledSurface: this.filledSurface,
      centroid: this.centroid,
    };
  }

  get centroid() {
    return this.#getComputed('centroid', () => {
      const roiMap = this.map;
      const data = roiMap.data;
      let sumColumn = 0;
      let sumRow = 0;
      for (let column = 0; column < this.width; column++) {
        for (let row = 0; row < this.height; row++) {
          let target = this.computeIndex(row, column);
          if (data[target] === this.id) {
            sumColumn += column;
            sumRow += row;
          }
        }
      }

      return {
        column: sumColumn / this.surface + this.origin.column,
        row: sumRow / this.surface + this.origin.row,
      };
    });
  }

  //  A helper function to cache already calculated properties
  #getComputed<T extends keyof Computed>(
    property: T,
    callback: () => Computed[T],
  ): Computed[T] {
    if (this.#computed[property] === undefined) {
      const result = callback();
      this.#computed[property] = result;
      return result;
    }
    return this.#computed[property] as Computed[T];
  }
  //TODO Make this private

  /**
   * Calculates the correct index on the map of ROI
   *
   * @param y
   * @param x
   */
  computeIndex(y: number, x: number): number {
    const roiMap = this.map;
    return (y + this.origin.row) * roiMap.width + x + this.origin.column;
  }
}
