import { Mask } from '../../Mask';
import {
  rotate,
  difference,
  normalize,
  Point,
} from '../../utils/geometry/points';
import { Roi } from '../Roi';
import { monotoneChainConvexHull } from '../utils/monotoneChainConvexHull';

export interface MbrMaskOptions {
  kind: 'mbr';
  /**
   * Specify wether the pixels inside the minimum bounding rectangle should be set to 1.
   *
   * @default true
   */
  filled?: boolean;
}

/**
 * Computes the minimum bounding rectangle of an ROI.
 * https://www.researchgate.net/profile/Lennert_Den_Boer2/publication/303783472_A_Fast_Algorithm_for_Generating_a_Minimal_Bounding_Rectangle/links/5751a14108ae6807fafb2aa5.pdf
 *
 * @param roi - The ROI to process.
 * @param options - Get MBR mask options.
 * @returns A mask with the minimum boundary rectangle of the ROI.
 */
export function getMbrMask(
  roi: Roi,
  options: MbrMaskOptions = { kind: 'mbr' },
): Mask {
  const { filled = true } = options;

  const corners = getMbrCorners(roi);
  const dimensions = getMbrMaskSize(corners);
  const mask = new Mask(dimensions.width, dimensions.height);
  return mask.drawPolygon(corners, { filled });
}

/**
 * Get the four corners of the minimun bounding rectangle of an ROI.
 *
 * @param roi - The ROI to process.
 * @returns The array of corners.
 */
export function getMbrCorners(roi: Roi): Point[] {
  const vertices = monotoneChainConvexHull(roi.getBorderPoints());

  if (vertices.length === 0) {
    return [];
  }

  if (vertices.length === 1) {
    return [vertices[0], vertices[0], vertices[0], vertices[0]];
  }

  let rotatedVertices: Point[] = [];
  let minSurface = Number.POSITIVE_INFINITY;
  let minSurfaceAngle = 0;
  let mbr: Point[] = [];

  for (let i = 0; i < vertices.length; i++) {
    let angle = getAngle(vertices[i], vertices[(i + 1) % vertices.length]);
    console.log({ angle });
    rotatedVertices = rotate(-angle, vertices);
    console.log({ rotatedVertices });

    // we rotate and translate so that this segment is at the bottom
    let aX = rotatedVertices[i].column;
    let aY = rotatedVertices[i].row;
    let bX = rotatedVertices[(i + 1) % rotatedVertices.length].column;
    let bY = rotatedVertices[(i + 1) % rotatedVertices.length].row;

    let tUndefined = true;
    let tMin = 0;
    let tMax = 0;
    let maxWidth = 0;
    for (let point of rotatedVertices) {
      let cX = point.column;
      let cY = point.row;
      let t = (cX - aX) / (bX - aX);
      if (tUndefined === true) {
        tUndefined = false;
        tMin = t;
        tMax = t;
      } else {
        if (t < tMin) tMin = t;
        if (t > tMax) tMax = t;
      }
      let width = (-(bX - aX) * cY + bX * aY - bY * aX) / (bX - aX);

      if (Math.abs(width) > Math.abs(maxWidth)) {
        maxWidth = width;
      }
    }
    let minPoint = { column: aX + tMin * (bX - aX), row: aY };
    let maxPoint = { column: aX + tMax * (bX - aX), row: aY };

    let currentSurface = Math.abs(maxWidth * (tMin - tMax) * (bX - aX));

    if (currentSurface < minSurface) {
      minSurfaceAngle = angle;
      minSurface = currentSurface;
      mbr = [
        minPoint,
        maxPoint,
        { column: maxPoint.column, row: maxPoint.row - maxWidth },
        { column: minPoint.column, row: minPoint.row - maxWidth },
      ];
    }
  }

  return rotate(minSurfaceAngle, mbr);
}

/**
 *  The angle that allows to make the line going through p1 and p2 horizontal.
 *  This is an optimized version because it assumes that one of the vectors is horizontal.
 *
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns Rotation angle to make the line horizontal.
 */
function getAngle(p1: Point, p2: Point): number {
  let diff = difference(p2, p1);
  let vector = normalize(diff);
  let angle = Math.acos(vector.column);
  if (vector.row < 0) return -angle;
  return angle;
}

/**
 * @param corners
 */
export function getMbrMaskSize(corners: Point[]): {
  width: number;
  height: number;
} {
  const sortedColumns = corners.sort((a, b) => {
    return a.column - b.column;
  });
  const width = sortedColumns[0].column - sortedColumns[3].column;

  const sortedRows = corners.sort((a, b) => {
    return a.row - b.row;
  });
  const height = sortedRows[0].row - sortedRows[3].row;

  return { width, height };
}
