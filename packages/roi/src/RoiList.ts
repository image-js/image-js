/**
 * @private
 */
interface IRoiBuild {
  id: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  surface: number;
}

export interface IRoi {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  surface: number;
}

export interface IRoiFilterOptions {
  positive?: boolean;
  negative?: boolean;
  minSurface?: number;
  maxSurface?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

export class RoiList {
  // private readonly _roiMap: Int16Array;
  // private readonly _width: number;
  // private readonly _height: number;

  public readonly rois: IRoi[];

  public constructor(map: Int16Array, width: number, height: number) {
    // this._roiMap = map;
    // this._width = width;
    // this._height = height;
    this.rois = computeRois(map, width, height);
  }

  public getRois(options: IRoiFilterOptions = {}): IRoi[] {
    const {
      positive = true,
      negative = true,
      minSurface = 0,
      maxSurface = Number.POSITIVE_INFINITY,
      minWidth = 0,
      maxWidth = Number.POSITIVE_INFINITY,
      minHeight = 0,
      maxHeight = Number.POSITIVE_INFINITY
    } = options;

    return this.rois.filter(
      (roi) =>
        ((roi.id < 0 && negative) || (roi.id > 0 && positive)) &&
        roi.surface >= minSurface &&
        roi.surface <= maxSurface &&
        roi.width >= minWidth &&
        roi.width <= maxWidth &&
        roi.height >= minHeight &&
        roi.height <= maxHeight
    );
  }
}

function computeRois(map: Int16Array, width: number, height: number): IRoi[] {
  const roiMap = new Map<number, IRoiBuild>();
  for (const value of map) {
    if (value !== 0 && !roiMap.has(value)) {
      roiMap.set(value, {
        id: value,
        minX: Number.POSITIVE_INFINITY,
        maxX: Number.NEGATIVE_INFINITY,
        minY: Number.POSITIVE_INFINITY,
        maxY: Number.NEGATIVE_INFINITY,
        surface: 0
      });
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const roi = roiMap.get(y * width + x);
      if (roi !== undefined) {
        if (x < roi.minX) {
          roi.minX = x;
        }
        if (x > roi.maxX) {
          roi.maxX = x;
        }
        if (y < roi.minY) {
          roi.minY = y;
        }
        if (y > roi.maxY) {
          roi.maxY = y;
        }
        roi.surface++;
      }
    }
  }

  const roiArray: IRoi[] = [];

  for (const roi of roiMap.values()) {
    roiArray.push({
      id: roi.id,
      x: roi.minX,
      y: roi.minY,
      width: roi.maxX - roi.minX + 1,
      height: roi.maxY - roi.minY + 1,
      surface: roi.surface
    });
  }

  return roiArray;
}
