import mcch from 'monotone-chain-convex-hull';
import robustPointInPolygon from 'robust-point-in-polygon';

import Shape from '../../util/Shape';
import {
  round,
  minMax as minMaxFct,
  moveToZeroZero,
  perimeter,
  surface,
} from '../../util/points';
import Image from '../Image';
import minimalBoundingRectangle from '../compute/minimalBoundingRectangle';
import * as KindNames from '../core/kindNames';

import feretDiameters from './feretDiameters';

// Many measurements:
// https://www.sympatec.com/en/particle-measurement/glossary/particle-shape/#

/**
 * Class to manage Region Of Interests
 * @class Roi
 */
export default class Roi {
  constructor(map, id) {
    this.map = map;
    this.id = id;
    this.minX = Number.POSITIVE_INFINITY;
    this.maxX = Number.NEGATIVE_INFINITY;
    this.minY = Number.POSITIVE_INFINITY;
    this.maxY = Number.NEGATIVE_INFINITY;
    this.meanX = 0;
    this.meanY = 0;
    this.surface = 0;
    this.computed = {};
  }

  /**
   * Returns a binary image (mask) for the corresponding ROI
   * @param {object} [options]
   * @param {number} [options.scale=1] - Scaling factor to apply to the mask
   * @param {string} [options.kind='normal'] - 'contour', 'box', 'filled', 'center', 'hull' or 'normal'
   * @return {Image} - Returns a mask (1 bit Image)
   */
  getMask(options = {}) {
    const { scale = 1, kind = '' } = options;
    let mask;
    switch (kind) {
      case 'contour':
        mask = this.contourMask;
        break;
      case 'box':
        mask = this.boxMask;
        break;
      case 'filled':
        mask = this.filledMask;
        break;
      case 'center':
        mask = this.centerMask;
        break;
      case 'mbr':
        mask = this.mbrFilledMask;
        break;
      case 'hull':
        mask = this.convexHullFilledMask;
        break;
      case 'hullContour':
        mask = this.convexHullMask;
        break;
      case 'mbrContour':
        mask = this.mbrMask;
        break;
      case 'feret':
        mask = this.feretMask;
        break;
      default:
        mask = this.mask;
    }

    if (scale < 1) {
      // by reassigning the mask we loose the parent and therefore the position
      // we will have to force it back
      mask = mask.resize({ factor: scale });
      mask.parent = this.mask.parent;
      mask.position[0] += this.minX;
      mask.position[1] += this.minY;
    }

    return mask;
  }

  get mean() {
    throw new Error('Roi mean not implemented yet');
    // return [this.meanX,this.meanY];
  }

  get center() {
    if (!this.computed.center) {
      this.computed.center = [(this.width / 2) >> 0, (this.height / 2) >> 0];
    }
    return this.computed.center;
  }

  get ratio() {
    return this.width / this.height;
  }

  get width() {
    return this.maxX - this.minX + 1;
  }

  get height() {
    return this.maxY - this.minY + 1;
  }

  _computExternalIDs() {
    // take all the borders and remove the internal one ...
    let borders = this.borderIDs;
    let lengths = this.borderLengths;

    this.computed.externalIDs = [];
    this.computed.externalLengths = [];

    let internals = this.internalIDs;

    for (let i = 0; i < borders.length; i++) {
      if (!internals.includes(borders[i])) {
        this.computed.externalIDs.push(borders[i]);
        this.computed.externalLengths.push(lengths[i]);
      }
    }
  }

  get externalIDs() {
    if (this.computed.externalIDs) {
      return this.computed.externalIDs;
    }
    this._computExternalIDs();
    return this.computed.externalIDs;
  }

  get externalLengths() {
    if (this.computed.externalLengths) {
      return this.computed.externalLengths;
    }
    this._computExternalIDs();
    return this.computed.externalLengths;
  }

  _computeBorderIDs() {
    let borders = getBorders(this);
    this.computed.borderIDs = borders.ids;
    this.computed.borderLengths = borders.lengths;
  }

  /**
     Retrieve all the IDs (array of number) of the regions that are in contact with this
     specific region. It may be external or internal
     */
  get borderIDs() {
    if (this.computed.borderIDs) {
      return this.computed.borderIDs;
    }
    this._computeBorderIDs();
    return this.computed.borderIDs;
  }

  /**
     Retrieve all the length (array of number) of the contacts with this
     specific region. It may be external or internal
     */
  get borderLengths() {
    if (this.computed.borderLengths) {
      return this.computed.borderLengths;
    }
    this._computeBorderIDs();
    return this.computed.borderLengths;
  }

  /**
     Retrieve all the IDs or the Roi touching the box surrouding the region

     It should really be an array to solve complex cases related to border effect

     Like the image
     <pre>
     0000
     1111
     0000
     1111
     </pre>

     The first row of 1 will be surrouned by 2 differents zones

     Or even worse
     <pre>
     010
     111
     010
     </pre>
     The cross will be surrouned by 4 differents zones

     However in most of the cases it will be an array of one element
     */
  get boxIDs() {
    if (!this.computed.boxIDs) {
      this.computed.boxIDs = getBoxIDs(this);
    }
    return this.computed.boxIDs;
  }

  get internalIDs() {
    if (!this.computed.internalIDs) {
      this.computed.internalIDs = getInternalIDs(this);
    }
    return this.computed.internalIDs;
  }

  /**
     Number of pixels of the Roi that touch the rectangle
     This is useful for the calculation of the border
     because we will ignore those special pixels of the rectangle
     border that don't have neighbours all around them.
     */
  get box() {
    // points of the Roi that touch the rectangular shape
    if (!this.computed.box) {
      this.computed.box = getBox(this);
    }
    return this.computed.box;
  }

  /**
     Calculates the number of pixels that are in the external border of the Roi
     Contour are all the pixels that touch an external "zone".
     All the pixels that touch the box are part of the border and
     are calculated in the getBoxPixels procedure
     */
  get external() {
    if (!this.computed.external) {
      this.computed.external = getExternal(this);
    }
    return this.computed.external;
  }

  /**
     Calculates information about holes
     */
  get holesInfo() {
    if (!this.computed.holesInfo) {
      this.computed.holesInfo = getHolesInfo(this);
    }
    return this.computed.holesInfo;
  }

  /**
     Calculates the number of pixels that are involved in border
     Border are all the pixels that touch another "zone". It could be external
     or internal. If there is a hole in the zone it will be counted as a border.
     All the pixels that touch the box are part of the border and
     are calculated in the getBoxPixels procedure
     */
  get border() {
    if (!this.computed.border) {
      this.computed.border = getBorder(this);
    }
    return this.computed.border;
  }

  /**
    Returns a binary image (mask) containing only the border of the mask
  */
  get contourMask() {
    if (!this.computed.contourMask) {
      let img = new Image(this.width, this.height, {
        kind: KindNames.BINARY,
        position: [this.minX, this.minY],
        parent: this.map.parent,
      });

      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          if (
            this.map.data[x + this.minX + (y + this.minY) * this.map.width] ===
            this.id
          ) {
            // it also has to be on a border ...
            if (x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1) {
              if (
                this.map.data[
                  x - 1 + this.minX + (y + this.minY) * this.map.width
                ] !== this.id ||
                this.map.data[
                  x + 1 + this.minX + (y + this.minY) * this.map.width
                ] !== this.id ||
                this.map.data[
                  x + this.minX + (y - 1 + this.minY) * this.map.width
                ] !== this.id ||
                this.map.data[
                  x + this.minX + (y + 1 + this.minY) * this.map.width
                ] !== this.id
              ) {
                img.setBitXY(x, y);
              }
            } else {
              img.setBitXY(x, y);
            }
          }
        }
      }
      this.computed.contourMask = img;
    }
    return this.computed.contourMask;
  }

  get boxMask() {
    if (!this.computed.boxMask) {
      let img = new Image(this.width, this.height, {
        kind: KindNames.BINARY,
        position: [this.minX, this.minY],
        parent: this.map.parent,
      });

      for (let x = 0; x < this.width; x++) {
        img.setBitXY(x, 0);
        img.setBitXY(x, this.height - 1);
      }
      for (let y = 0; y < this.height; y++) {
        img.setBitXY(0, y);
        img.setBitXY(this.width - 1, y);
      }
      this.computed.boxMask = img;
    }
    return this.computed.boxMask;
  }

  /**
     Returns a binary image containing the mask
     */
  get mask() {
    if (!this.computed.mask) {
      let img = new Image(this.width, this.height, {
        kind: KindNames.BINARY,
        position: [this.minX, this.minY],
        parent: this.map.parent,
      });

      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          if (
            this.map.data[x + this.minX + (y + this.minY) * this.map.width] ===
            this.id
          ) {
            img.setBitXY(x, y);
          }
        }
      }
      this.computed.mask = img;
    }
    return this.computed.mask;
  }

  get filledMask() {
    if (!this.computed.filledMask) {
      let img = new Image(this.width, this.height, {
        kind: KindNames.BINARY,
        position: [this.minX, this.minY],
        parent: this.map.parent,
      });

      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          let target = x + this.minX + (y + this.minY) * this.map.width;
          if (this.internalIDs.includes(this.map.data[target])) {
            img.setBitXY(x, y);
          } // by default a pixel is to 0 so no problems, it will be transparent
        }
      }
      this.computed.filledMask = img;
    }
    return this.computed.filledMask;
  }

  get centerMask() {
    if (!this.computed.centerMask) {
      let img = new Shape({ kind: 'smallCross' }).getMask();

      img.parent = this.map.parent;
      img.position = [
        this.minX + this.center[0] - 1,
        this.minY + this.center[1] - 1,
      ];

      this.computed.centerMask = img;
    }
    return this.computed.centerMask;
  }

  get convexHull() {
    if (!this.computed.convexHull) {
      const calculationPoints = [];
      // slow approach, we check all the points
      // for each point we take the 4 corners !!!!

      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          if (
            this.map.data[x + this.minX + (y + this.minY) * this.map.width] ===
            this.id
          ) {
            // it also has to be on a border ...
            if (x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1) {
              if (
                this.map.data[
                  x - 1 + this.minX + (y + this.minY) * this.map.width
                ] !== this.id ||
                this.map.data[
                  x + 1 + this.minX + (y + this.minY) * this.map.width
                ] !== this.id ||
                this.map.data[
                  x + this.minX + (y - 1 + this.minY) * this.map.width
                ] !== this.id ||
                this.map.data[
                  x + this.minX + (y + 1 + this.minY) * this.map.width
                ] !== this.id
              ) {
                calculationPoints.push([x, y]);
                calculationPoints.push([x + 1, y]);
                calculationPoints.push([x, y + 1]);
                calculationPoints.push([x + 1, y + 1]);
              }
            } else {
              calculationPoints.push([x, y]);
              calculationPoints.push([x + 1, y]);
              calculationPoints.push([x, y + 1]);
              calculationPoints.push([x + 1, y + 1]);
            }
          }
        }
      }

      const convexHull = mcch(calculationPoints);

      this.computed.convexHull = {
        polyline: convexHull,
        surface: surface(convexHull),
        perimeter: perimeter(convexHull),
      };
    }
    return this.computed.convexHull;
  }

  get convexHullMask() {
    if (!this.computed.convexHullMask) {
      const convexHull = this.convexHull;
      const img = new Image(this.width + 1, this.height + 1, {
        kind: KindNames.BINARY,
        position: [this.minX, this.minY],
        parent: this.map.parent,
      });
      img.paintPolyline(convexHull.polyline, { closed: true });
      this.computed.convexHullMask = img;
    }
    return this.computed.convexHullMask;
  }

  get convexHullFilledMask() {
    if (!this.computed.convexHullFilledMask) {
      const convexHull = this.convexHull;
      const img = new Image(this.width, this.height, {
        kind: KindNames.BINARY,
        position: [this.minX, this.minY],
        parent: this.map.parent,
      });

      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          if (robustPointInPolygon(convexHull.polyline, [x, y]) !== 1) {
            img.setBitXY(x, y);
          }
        }
      }

      this.computed.convexHullFilledMask = img;
    }
    return this.computed.convexHullFilledMask;
  }

  get mbr() {
    if (!this.computed.mbr) {
      let mbr = minimalBoundingRectangle({
        originalPoints: this.convexHull.polyline,
      });
      if (mbr.length === 0) {
        this.computed.mbr = {
          width: 0,
          height: 0,
          surface: 0,
          perimeter: 0,
          rectangle: mbr,
        };
      } else {
        let first = mbr[0];
        let second = mbr[1];
        let third = mbr[2];
        let width = Math.sqrt(
          (first[0] - second[0]) ** 2 + (first[1] - second[1]) ** 2,
        );
        let height = Math.sqrt(
          (third[0] - second[0]) ** 2 + (third[1] - second[1]) ** 2,
        );
        this.computed.mbr = {
          width,
          height,
          elongation: 1 - width / height,
          aspectRatio: width / height,
          surface: width * height,
          perimeter: (width + height) * 2,
          rectangle: mbr,
        };
      }
    }
    return this.computed.mbr;
  }

  get filledSurface() {
    return this.surface + this.holesInfo.surface;
  }

  get fillRatio() {
    return this.surface / (this.surface + this.holesInfo.surface);
  }

  get feretDiameters() {
    if (!this.computed.feretDiameters) {
      this.computed.feretDiameters = feretDiameters({
        originalPoints: this.convexHull.polyline,
      });
    }
    return this.computed.feretDiameters;
  }

  /**
   * Diameter of a circle of equal projection area
   */
  get eqpc() {
    if (!this.computed.eqpc) {
      this.computed.eqpc = 2 * Math.sqrt(this.surface / Math.PI);
    }
    return this.computed.eqpc;
  }

  /**
   * Get the category in which each external pixel belongs
   */
  get perimeterInfo() {
    if (!this.computed.perimeterInfo) {
      this.computed.perimeterInfo = getPerimeterInfo(this);
    }
    return this.computed.perimeterInfo;
  }

  /**
   * Return the perimeter of the ROI
   */
  get perimeter() {
    let info = this.perimeterInfo;
    let delta = 2 - Math.sqrt(2);
    return (
      info.one +
      info.two * 2 +
      info.three * 3 +
      info.four * 4 -
      delta * (info.two + info.three * 2 + info.four)
    );
  }

  /**
   * Diameter of a circle of equal perimeter
   */
  get ped() {
    if (!this.computed.ped) {
      this.computed.ped = this.perimeter / Math.PI;
    }
    return this.computed.ped;
  }

  get feretMask() {
    if (!this.computed.feretMask) {
      const image = new Image(this.width + 1, this.height + 1, {
        kind: KindNames.BINARY,
        position: [this.minX, this.minY],
        parent: this.map.parent,
      });

      image.paintPolyline(this.feretDiameters.minLine);
      image.paintPolyline(this.feretDiameters.maxLine);
      this.computed.feretMask = image;
    }
    return this.computed.feretMask;
  }

  get mbrMask() {
    if (!this.computed.mbrMask) {
      let rectangle = round(this.mbr.rectangle);
      if (rectangle.length > 0) {
        // the problem is that the rectangle may be outside the roi
        const minMax = minMaxFct(rectangle);

        const img = new Image(
          minMax[1][0] - minMax[0][0] + 1,
          minMax[1][1] - minMax[0][1] + 1,
          {
            kind: KindNames.BINARY,
            position: [this.minX + minMax[0][0], this.minY + minMax[0][1]],
            parent: this.map.parent,
          },
        );

        rectangle = moveToZeroZero(rectangle);

        img.paintPolyline(rectangle, { closed: true });
        this.computed.mbrMask = img;
      } else {
        this.computed.mbrMask = new Image(1, 1, {
          kind: KindNames.BINARY,
          position: [this.minX, this.minY],
          parent: this.map.parent,
        });
      }
    }
    return this.computed.mbrMask;
  }

  get mbrFilledMask() {
    if (!this.computed.mbrFilledMask) {
      const img = new Image(this.width, this.height, {
        kind: KindNames.BINARY,
        position: [this.minX, this.minY],
        parent: this.map.parent,
      });

      const mbr = this.mask.minimalBoundingRectangle();
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          if (robustPointInPolygon(mbr, [x, y]) !== 1) {
            img.setBitXY(x, y);
          }
        }
      }

      this.computed.mbrFilledMask = img;
    }
    return this.computed.mbrFilledMask;
  }

  get points() {
    if (!this.computed.points) {
      let points = [];
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          let target = (y + this.minY) * this.map.width + x + this.minX;
          if (this.map.data[target] === this.id) {
            points.push([x, y]);
          }
        }
      }
      this.computed.points = points;
    }
    return this.computed.points;
  }

  get maxLengthPoints() {
    if (!this.computed.maxLengthPoints) {
      let maxLength = 0;
      let maxLengthPoints;
      const points = this.points;

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          let currentML =
            Math.pow(points[i][0] - points[j][0], 2) +
            Math.pow(points[i][1] - points[j][1], 2);
          if (currentML >= maxLength) {
            maxLength = currentML;
            maxLengthPoints = [points[i], points[j]];
          }
        }
      }
      this.computed.maxLengthPoints = maxLengthPoints;
    }
    return this.computed.maxLengthPoints;
  }

  /**
        Calculates the maximum length between two pixels of the Roi.
     */
  get maxLength() {
    if (!this.computed.maxLength) {
      let maxLength = Math.sqrt(
        Math.pow(this.maxLengthPoints[0][0] - this.maxLengthPoints[1][0], 2) +
          Math.pow(this.maxLengthPoints[0][1] - this.maxLengthPoints[1][1], 2),
      );
      this.computed.maxLength = maxLength;
    }
    return this.computed.maxLength;
  }

  get roundness() {
    /*Slide 24 https://static.horiba.com/fileadmin/Horiba/Products/Scientific/Particle_Characterization/Webinars/Slides/TE011.pdf */
    return (4 * this.surface) / (Math.PI * this.feretDiameters.max ** 2);
  }

  get sphericity() {
    return (2 * Math.sqrt(this.surface * Math.PI)) / this.perimeter;
  }

  get solidity() {
    return this.surface / this.convexHull.surface;
  }

  get angle() {
    if (!this.computed.angle) {
      let points = this.maxLengthPoints;
      let angle =
        (-Math.atan2(points[0][1] - points[1][1], points[0][0] - points[1][0]) *
          180) /
        Math.PI;

      this.computed.angle = angle;
    }
    return this.computed.angle;
  }

  toJSON() {
    return {
      id: this.id,
      minX: this.minX,
      maxX: this.maxX,
      minY: this.minY,
      maxY: this.maxY,
      meanX: this.meanX,
      meanY: this.meanY,
      height: this.height,
      width: this.width,
      filledSurface: this.filledSurface,
      surface: this.surface,
      hullSurface: this.convexHull.surface,
      hullPerimeter: this.convexHull.perimeter,
      mbrWidth: this.mbr.width,
      mbrHeight: this.mbr.height,
      mbrSurface: this.mbr.surface,
      eqpc: this.eqpc,
      ped: this.ped,
      feretDiameterMin: this.feretDiameters.min,
      feretDiameterMax: this.feretDiameters.max,
      aspectRatio: this.feretDiameters.aspectRatio,
      fillRatio: this.fillRatio,
      sphericity: this.sphericity,
      roundness: this.roundness,
      solidity: this.solidity,
      perimeter: this.perimeter,
    };
  }
}

// TODO we should follow the region in order to increase the speed

function getBorders(roi) {
  let roiMap = roi.map;
  let data = roiMap.data;
  let surroudingIDs = new Set(); // allows to get a unique list without indexOf
  let surroundingBorders = new Map();
  let visitedData = new Set();
  let dx = [+1, 0, -1, 0];
  let dy = [0, +1, 0, -1];

  for (let x = roi.minX; x <= roi.maxX; x++) {
    for (let y = roi.minY; y <= roi.maxY; y++) {
      let target = x + y * roiMap.width;
      if (data[target] === roi.id) {
        for (let dir = 0; dir < 4; dir++) {
          let newX = x + dx[dir];
          let newY = y + dy[dir];
          if (
            newX >= 0 &&
            newY >= 0 &&
            newX < roiMap.width &&
            newY < roiMap.height
          ) {
            let neighbour = newX + newY * roiMap.width;

            if (data[neighbour] !== roi.id && !visitedData.has(neighbour)) {
              visitedData.add(neighbour);
              surroudingIDs.add(data[neighbour]);
              let surroundingBorder = surroundingBorders.get(data[neighbour]);
              if (!surroundingBorder) {
                surroundingBorders.set(data[neighbour], 1);
              } else {
                surroundingBorders.set(data[neighbour], ++surroundingBorder);
              }
            }
          }
        }
      }
    }
  }
  let ids = Array.from(surroudingIDs);
  let borderLengths = ids.map(function (id) {
    return surroundingBorders.get(id);
  });
  return {
    ids: ids,
    lengths: borderLengths,
  };
}

function getBoxIDs(roi) {
  let surroundingIDs = new Set(); // allows to get a unique list without indexOf

  let roiMap = roi.map;
  let data = roiMap.data;

  // we check the first line and the last line
  for (let y of [0, roi.height - 1]) {
    for (let x = 0; x < roi.width; x++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (
        x - roi.minX > 0 &&
        data[target] === roi.id &&
        data[target - 1] !== roi.id
      ) {
        let value = data[target - 1];
        surroundingIDs.add(value);
      }
      if (
        roiMap.width - x - roi.minX > 1 &&
        data[target] === roi.id &&
        data[target + 1] !== roi.id
      ) {
        let value = data[target + 1];
        surroundingIDs.add(value);
      }
    }
  }

  // we check the first column and the last column
  for (let x of [0, roi.width - 1]) {
    for (let y = 0; y < roi.height; y++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (
        y - roi.minY > 0 &&
        data[target] === roi.id &&
        data[target - roiMap.width] !== roi.id
      ) {
        let value = data[target - roiMap.width];
        surroundingIDs.add(value);
      }
      if (
        roiMap.height - y - roi.minY > 1 &&
        data[target] === roi.id &&
        data[target + roiMap.width] !== roi.id
      ) {
        let value = data[target + roiMap.width];
        surroundingIDs.add(value);
      }
    }
  }

  return Array.from(surroundingIDs); // the selection takes the whole rectangle
}

function getBox(roi) {
  let total = 0;
  let roiMap = roi.map;
  let data = roiMap.data;

  let topBottom = [0];
  if (roi.height > 1) {
    topBottom[1] = roi.height - 1;
  }
  for (let y of topBottom) {
    for (let x = 1; x < roi.width - 1; x++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (data[target] === roi.id) {
        total++;
      }
    }
  }

  let leftRight = [0];
  if (roi.width > 1) {
    leftRight[1] = roi.width - 1;
  }
  for (let x of leftRight) {
    for (let y = 0; y < roi.height; y++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (data[target] === roi.id) {
        total++;
      }
    }
  }
  return total;
}

function getBorder(roi) {
  let total = 0;
  let roiMap = roi.map;
  let data = roiMap.data;

  for (let x = 1; x < roi.width - 1; x++) {
    for (let y = 1; y < roi.height - 1; y++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (data[target] === roi.id) {
        // if a point around is not roi.id it is a border
        if (
          data[target - 1] !== roi.id ||
          data[target + 1] !== roi.id ||
          data[target - roiMap.width] !== roi.id ||
          data[target + roiMap.width] !== roi.id
        ) {
          total++;
        }
      }
    }
  }
  return total + roi.box;
}

function getPerimeterInfo(roi) {
  let roiMap = roi.map;
  let data = roiMap.data;
  let one = 0;
  let two = 0;
  let three = 0;
  let four = 0;

  for (let x = 0; x < roi.width; x++) {
    for (let y = 0; y < roi.height; y++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (data[target] === roi.id) {
        let nbAround = 0;
        if (x === 0) {
          nbAround++;
        } else if (roi.externalIDs.includes(data[target - 1])) {
          nbAround++;
        }

        if (x === roi.width - 1) {
          nbAround++;
        } else if (roi.externalIDs.includes(data[target + 1])) {
          nbAround++;
        }

        if (y === 0) {
          nbAround++;
        } else if (roi.externalIDs.includes(data[target - roiMap.width])) {
          nbAround++;
        }

        if (y === roi.height - 1) {
          nbAround++;
        } else if (roi.externalIDs.includes(data[target + roiMap.width])) {
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
}

function getExternal(roi) {
  let total = 0;
  let roiMap = roi.map;
  let data = roiMap.data;

  for (let x = 1; x < roi.width - 1; x++) {
    for (let y = 1; y < roi.height - 1; y++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (data[target] === roi.id) {
        // if a point around is not roi.id it is a border
        if (
          roi.externalIDs.includes(data[target - 1]) ||
          roi.externalIDs.includes(data[target + 1]) ||
          roi.externalIDs.includes(data[target - roiMap.width]) ||
          roi.externalIDs.includes(data[target + roiMap.width])
        ) {
          total++;
        }
      }
    }
  }
  return total + roi.box;
}

function getHolesInfo(roi) {
  let surface = 0;
  let width = roi.map.width;
  let data = roi.map.data;
  for (let x = 1; x < roi.width - 1; x++) {
    for (let y = 1; y < roi.height - 1; y++) {
      let target = (y + roi.minY) * width + x + roi.minX;
      if (roi.internalIDs.includes(data[target]) && data[target] !== roi.id) {
        surface++;
      }
    }
  }
  return {
    number: roi.internalIDs.length - 1,
    surface,
  };
}

/*
We will calculate all the ids of the map that are "internal"
This will allow to extract the 'plain' image
 */
function getInternalIDs(roi) {
  let internal = [roi.id];
  let roiMap = roi.map;
  let data = roiMap.data;

  if (roi.height > 2) {
    for (let x = 0; x < roi.width; x++) {
      let target = roi.minY * roiMap.width + x + roi.minX;
      if (internal.includes(data[target])) {
        let id = data[target + roiMap.width];
        if (!internal.includes(id) && !roi.boxIDs.includes(id)) {
          internal.push(id);
        }
      }
    }
  }

  let array = new Array(4);
  for (let x = 1; x < roi.width - 1; x++) {
    for (let y = 1; y < roi.height - 1; y++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (internal.includes(data[target])) {
        // we check if one of the neighbour is not yet in

        array[0] = data[target - 1];
        array[1] = data[target + 1];
        array[2] = data[target - roiMap.width];
        array[3] = data[target + roiMap.width];

        for (let i = 0; i < 4; i++) {
          let id = array[i];
          if (!internal.includes(id) && !roi.boxIDs.includes(id)) {
            internal.push(id);
          }
        }
      }
    }
  }

  return internal;
}
