import type { Mask } from '../Mask.js';
import { getConvexHull } from '../maskAnalysis/getConvexHull.js';
import { getFeret } from '../maskAnalysis/getFeret.js';
import { getMbr } from '../maskAnalysis/getMbr.js';
import type {
  Feret,
  GetBorderPointsOptions,
  Mbr,
} from '../maskAnalysis/index.js';
import type { Point } from '../utils/geometry/points.js';

import type { RoiMap } from './RoiMapManager.js';
import { getBorderPoints } from './getBorderPoints.js';
import type { GetMaskOptions } from './getMask.js';
import { getMask } from './getMask.js';
import { getEllipse } from './properties/getEllipse.js';
import type { Border, Ellipse } from './roi.types.js';

interface Computed {
  perimeter: number;
  borders: Border[]; // external and internal ids which are not equal to the current roi ID
  perimeterInfo: { one: number; two: number; three: number; four: number };
  externalLengths: number[];
  borderLengths: number[];
  box: number;
  relativePoints: Point[];
  absolutePoints: Point[];
  holesInfo: { number: number; surface: number };
  boxIDs: number[];
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
   * Cached values of properties to improve performance.
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
   * Return the value at the given coordinates in an ROI map.
   * @param column - Column of the value.
   * @param row - Row of the value.
   * @returns The value at the given coordinates.
   */
  public getMapValue(column: number, row: number) {
    return this.map.data[this.map.width * row + column];
  }

  /**
   * Returns the ratio between the width and the height of the bounding rectangle of the ROI.
   * @returns The width by height ratio.
   */
  public getRatio(): number {
    return this.width / this.height;
  }

  /**
   * Generates a mask of an ROI. You can specify the kind of mask you want using the `kind` option.
   * @param options - Get Mask options.
   * @returns The ROI mask.
   */
  public getMask(options?: GetMaskOptions): Mask {
    return getMask(this, options);
  }

  /**
   * Computes the diameter of a circle that has the same perimeter as the particle image.
   * @returns Ped value in pixels.
   */
  get ped() {
    return this.perimeter / Math.PI;
  }

  /**
   * Return an array with the coordinates of the pixels that are on the border of the ROI.
   * The points are defined as [column, row].
   * @param options - Get border points options.
   * @returns The array of border pixels.
   */
  public getBorderPoints(options?: GetBorderPointsOptions): Point[] {
    return getBorderPoints(this, options);
  }

  /**
   * Returns an array of ROIs IDs that are included in the current ROI.
   * This will be useful to know if there are some holes in the ROI.
   * @returns InternalIDs.
   */
  get internalIDs() {
    return this.#getComputed('internalIDs', () => {
      const internal = [this.id];
      const roiMap = this.map;
      const data = roiMap.data;

      if (this.height > 2) {
        for (let column = 0; column < this.width; column++) {
          const target = this.#computeIndex(0, column);
          if (internal.includes(data[target])) {
            const id = data[target + roiMap.width];
            if (!internal.includes(id) && !this.boxIDs.includes(id)) {
              internal.push(id);
            }
          }
        }
      }

      const array = new Array(4);
      for (let column = 1; column < this.width - 1; column++) {
        for (let row = 1; row < this.height - 1; row++) {
          const target = this.#computeIndex(row, column);
          if (internal.includes(data[target])) {
            // We check if one of the neighbor is not yet in.
            array[0] = data[target - 1];
            array[1] = data[target + 1];
            array[2] = data[target - roiMap.width];
            array[3] = data[target + roiMap.width];

            for (let i = 0; i < 4; i++) {
              const id = array[i];
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

  /**
   * Returns an array of ROIs IDs that touch the current ROI.
   * @returns The array of Borders.
   */
  get externalBorders(): Border[] {
    return this.#getComputed('externalBorders', () => {
      // Takes all the borders and removes the internal one ...
      const borders = this.borders;

      const externalBorders = [];
      const externalIDs = [];
      const internals = this.internalIDs;

      for (const border of borders) {
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
   * Calculates and caches the number of sides by which each pixel is touched externally.
   * @returns An object which tells how many pixels are exposed externally to how many sides.
   */
  get perimeterInfo() {
    return this.#getComputed('perimeterInfo', () => {
      const roiMap = this.map;
      const data = roiMap.data;
      let one = 0;
      let two = 0;
      let three = 0;
      let four = 0;

      const externalIDs = new Set(
        this.externalBorders.map((element) => element.connectedID),
      );

      for (let column = 0; column < this.width; column++) {
        for (let row = 0; row < this.height; row++) {
          const target = this.#computeIndex(row, column);
          if (data[target] === this.id) {
            let nbAround = 0;
            if (column === 0) {
              nbAround++;
            } else if (externalIDs.has(data[target - 1])) {
              nbAround++;
            }

            if (column === roiMap.width - 1) {
              nbAround++;
            } else if (externalIDs.has(data[target + 1])) {
              nbAround++;
            }

            if (row === 0) {
              nbAround++;
            } else if (externalIDs.has(data[target - roiMap.width])) {
              nbAround++;
            }

            if (row === roiMap.height - 1) {
              nbAround++;
            } else if (externalIDs.has(data[target + roiMap.width])) {
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
   * The perimeter is calculated using the sum of all the external borders of the ROI to which we subtract:
   * (2 - √2) * the number of pixels that have 2 external borders
   * 2 * (2 - √2) * the number of pixels that have 3 external borders
   * @returns Perimeter value in pixels.
   */

  get perimeter() {
    const info = this.perimeterInfo;
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
   * Computes ROI points relative to ROIs point of `origin`.
   * @returns Array of points with relative ROI coordinates.
   */
  get relativePoints() {
    return this.#getComputed(`relativePoints`, () => {
      const points = Array.from(this.points(false));
      return points;
    });
  }
  /**
   * Computes ROI points relative to Image's/Mask's point of `origin`.
   * @returns Array of points with absolute ROI coordinates.
   */
  get absolutePoints() {
    return this.#getComputed(`absolutePoints`, () => {
      const points = Array.from(this.points(true));
      return points;
    });
  }

  get boxIDs() {
    return this.#getComputed('boxIDs', () => {
      const surroundingIDs = new Set<number>(); // Allows to get a unique list without indexOf.

      const roiMap = this.map;
      const data = roiMap.data;

      // We check the first line and the last line.
      for (const row of [0, this.height - 1]) {
        for (let column = 0; column < this.width; column++) {
          const target = this.#computeIndex(row, column);
          if (
            column - this.origin.column > 0 &&
            data[target] === this.id &&
            data[target - 1] !== this.id
          ) {
            const value = data[target - 1];
            surroundingIDs.add(value);
          }
          if (
            roiMap.width - column - this.origin.column > 1 &&
            data[target] === this.id &&
            data[target + 1] !== this.id
          ) {
            const value = data[target + 1];
            surroundingIDs.add(value);
          }
        }
      }

      // We check the first column and the last column.
      for (const column of [0, this.width - 1]) {
        for (let row = 0; row < this.height; row++) {
          const target = this.#computeIndex(row, column);
          if (
            row - this.origin.row > 0 &&
            data[target] === this.id &&
            data[target - roiMap.width] !== this.id
          ) {
            const value = data[target - roiMap.width];
            surroundingIDs.add(value);
          }
          if (
            roiMap.height - row - this.origin.row > 1 &&
            data[target] === this.id &&
            data[target + roiMap.width] !== this.id
          ) {
            const value = data[target + roiMap.width];
            surroundingIDs.add(value);
          }
        }
      }

      return Array.from(surroundingIDs); // The selection takes the whole rectangle.
    });
  }

  /**
   * Computes the diameter of a circle of equal projection area (EQPC).
   * It is a diameter of a circle that has the same surface as the ROI.
   * @returns `eqpc` value in pixels.
   */
  get eqpc() {
    return 2 * Math.sqrt(this.surface / Math.PI);
  }
  /**
   * Computes ellipse of ROI. It is the smallest ellipse that fits the ROI.
   * @returns Ellipse
   */
  get ellipse(): Ellipse {
    return this.#getComputed('ellipse', () => {
      return getEllipse(this);
    });
  }

  /**
   * Number of holes in the ROI and their total surface.
   * Used to calculate fillRatio.
   * @returns The surface of holes in ROI in pixels.
   */
  get holesInfo() {
    return this.#getComputed('holesInfo', () => {
      let surface = 0;
      const data = this.map.data;
      for (let column = 1; column < this.width - 1; column++) {
        for (let row = 1; row < this.height - 1; row++) {
          const target = this.#computeIndex(row, column);
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
   * Calculates and caches border's length and their IDs.
   * @returns Borders' length and their IDs.
   */
  get borders() {
    return this.#getComputed('borders', () => {
      const roiMap = this.map;
      const data = roiMap.data;
      const surroudingIDs = new Set<number>();
      const surroundingBorders = new Map();
      const visitedData = new Set();
      const dx = [1, 0, -1, 0];
      const dy = [0, 1, 0, -1];

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
          const target = column + row * roiMap.width;
          if (data[target] === this.id) {
            for (let dir = 0; dir < 4; dir++) {
              const newX = column + dx[dir];
              const newY = row + dy[dir];
              if (
                newX >= 0 &&
                newY >= 0 &&
                newX < roiMap.width &&
                newY < roiMap.height
              ) {
                const neighbour = newX + newY * roiMap.width;

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
      const id: number[] = Array.from(surroudingIDs);
      return id.map((id) => {
        return {
          connectedID: id,
          length: surroundingBorders.get(id),
        };
      });
    });
  }
  /**
   * Computes fill ratio of the ROI. It is calculated by dividing ROI's actual surface over the surface combined with holes, to see how holes affect its surface.
   * @returns Fill ratio value.
   */
  get fillRatio() {
    return this.surface / (this.surface + this.holesInfo.surface);
  }
  /**
   * Computes sphericity of the ROI.
   * Sphericity is a measure of the degree to which a particle approximates the shape of a sphere, and is independent of its size. The value is always between 0 and 1. The less spheric the ROI is the smaller is the number.
   * @returns Sphericity value.
   */
  get sphericity() {
    return (2 * Math.sqrt(this.surface * Math.PI)) / this.perimeter;
  }
  /**
   * Computes the surface of the ROI, including the surface of the holes.
   * @returns Surface including holes measured in pixels.
   */
  get filledSurface() {
    return this.surface + this.holesInfo.surface;
  }

  /**
   * The solidity describes the extent to which a shape is convex or concave.
   * The solidity of a completely convex shape is 1, the farther the it deviates from 1, the greater the extent of concavity in the shape of the ROI.
   * @returns Solidity value.
   */
  get solidity() {
    return this.surface / this.convexHull.surface;
  }
  //TODO Should be refactored to not need creating a new Mask.

  /**
   *Computes convex hull. It is the smallest convex set that contains it.
   * @see https://en.wikipedia.org/wiki/Convex_hull
   * @returns Convex hull.
   */
  get convexHull() {
    return this.#getComputed('convexHull', () => {
      return getConvexHull(this.getMask());
    });
  }
  /**
   * Computes the minimum bounding rectangle.
   * In digital image processing, the bounding box is merely the coordinates of the rectangular border that fully encloses a digital image when it is placed over a page, a canvas, a screen or other similar bidimensional background.
   * @returns The minimum bounding rectangle.
   */
  get mbr() {
    return this.#getComputed('mbr', () => {
      return getMbr(this.getMask());
    });
  }

  /*
  * Computes roundness of ROI.
  * Roundness is the measure of how closely the shape of an object approaches that of a mathematically perfect circle.
 (See slide 24 https://static.horiba.com/fileadmin/Horiba/Products/Scientific/Particle_Characterization/Webinars/Slides/TE011.pdf) */
  get roundness() {
    return (4 * this.surface) / (Math.PI * this.feret.maxDiameter.length ** 2);
  }
  /**
   * This is not a diameter in its actual sense but the common basis of a group of diameters derived from the distance of two tangents to the contour of the particle in a well-defined orientation.
   * In simpler words, the method corresponds to the measurement by a slide gauge (slide gauge principle).
   * In general it is defined as the distance between two parallel tangents of the particle at an arbitrary angle. The minimum Feret diameter is often used as the diameter equivalent to a sieve analysis.
   * @returns The maximum and minimum Feret Diameters.
   */

  get feret(): Feret {
    return this.#getComputed('feret', () => {
      return getFeret(this.getMask());
    });
  }
  /**
   * A JSON object with all the data about ROI.
   * @returns All current ROI properties as one object.
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
  /**
   * Computes a center of mass of the current ROI.
   * @returns point
   */
  get centroid() {
    return this.#getComputed('centroid', () => {
      const roiMap = this.map;
      const data = roiMap.data;
      let sumColumn = 0;
      let sumRow = 0;
      for (let column = 0; column < this.width; column++) {
        for (let row = 0; row < this.height; row++) {
          const target = this.#computeIndex(row, column);
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

  //  A helper function to cache already calculated properties.
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
  //TODO Make this private.

  /**
   * Calculates the correct index on the map of ROI.
   * @param y - Map row
   * @param x - Map column
   * @returns Index within the ROI map.
   */
  #computeIndex(y: number, x: number): number {
    const roiMap = this.map;
    return (y + this.origin.row) * roiMap.width + x + this.origin.column;
  }

  /**
   * Generator function to calculate point's coordinates.
   * @param absolute - controls whether coordinates should be relative to ROI's point of `origin` (relative), or relative to ROI's position on the Image/Mask (absolute).
   * @yields Coordinates of each point of ROI.
   */
  *points(absolute: boolean) {
    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        const target =
          (row + this.origin.row) * this.map.width +
          column +
          this.origin.column;
        if (this.map.data[target] === this.id) {
          if (absolute) {
            yield {
              column: this.origin.column + column,
              row: this.origin.row + row,
            };
          } else {
            yield { column, row };
          }
        }
      }
    }
  }
}
