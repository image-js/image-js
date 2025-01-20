import type { Mask } from '../Mask.js';
import type { Point } from '../geometry/index.js';
import { toDegrees } from '../utils/geometry/angles.js';
import { rotate } from '../utils/geometry/points.js';

import type { Feret, FeretDiameter } from './maskAnalysis.types.js';
import { getAngle } from './utils/getAngle.js';

/**
 * Computes the Feret diameters.
 * @see {@link https://www.sympatec.com/en/particle-measurement/glossary/particle-shape/#}
 * @see {@link http://portal.s2nano.org:8282/files/TEM_protocol_NANoREG.pdf}
 * @param mask - The mask of the ROI.
 * @returns The Feret diameters.
 */
export function getFeret(mask: Mask): Feret {
  const hull = mask.getConvexHull();
  const hullPoints = hull.points;
  if (hull.surface === 0) {
    return {
      minDiameter: {
        length: 0,
        points: [
          { column: 0, row: 0 },
          { column: 0, row: 0 },
        ],
        angle: 0,
        calliperLines: [
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
        ],
      },
      maxDiameter: {
        length: 0,
        points: [
          { column: 0, row: 0 },
          { column: 0, row: 0 },
        ],
        angle: 0,
        calliperLines: [
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
        ],
      },
      aspectRatio: 1,
    };
  }

  // Compute minimum diameter
  let minWidth = Number.POSITIVE_INFINITY;
  let minWidthAngle = 0;
  let minLinePoints: Point[] = [];
  let minLines: [[Point, Point], [Point, Point]] | undefined;
  for (let i = 0; i < hullPoints.length; i++) {
    const angle = getAngle(
      hullPoints[i],
      hullPoints[(i + 1) % hullPoints.length],
    );

    // We rotate so that it is parallel to X axis.
    const rotatedPoints = rotate(-angle, hullPoints);
    let currentWidth = 0;
    let currentMinLinePoints: Point[] = [];

    for (let j = 0; j < hullPoints.length; j++) {
      const absWidth = Math.abs(rotatedPoints[i].row - rotatedPoints[j].row);
      if (absWidth > currentWidth) {
        currentWidth = absWidth;
        currentMinLinePoints = [rotatedPoints[i], rotatedPoints[j]];
      }
    }
    if (currentWidth < minWidth) {
      minWidth = currentWidth;
      minWidthAngle = angle;
      minLinePoints = currentMinLinePoints;
      const { minIndex: currentMin, maxIndex: currentMax } =
        findPointIndexesOfExtremeColumns(rotatedPoints);
      minLines = getMinLines(
        minWidthAngle,
        currentMin,
        currentMax,
        rotatedPoints,
        minLinePoints,
      );
    }
  }

  const minDiameter: FeretDiameter = {
    points: rotate(minWidthAngle, minLinePoints),
    length: minWidth,
    angle: toDegrees(minWidthAngle),
    calliperLines: minLines as [[Point, Point], [Point, Point]],
  };

  // Compute maximum diameter
  let maxLinePoints: Point[] = [];
  let maxSquaredWidth = 0;
  let maxLineIndex: number[] = [];
  for (let i = 0; i < hullPoints.length - 1; i++) {
    for (let j = i + 1; j < hullPoints.length; j++) {
      const currentSquaredWidth =
        (hullPoints[i].column - hullPoints[j].column) ** 2 +
        (hullPoints[i].row - hullPoints[j].row) ** 2;
      if (currentSquaredWidth > maxSquaredWidth) {
        maxSquaredWidth = currentSquaredWidth;
        maxLinePoints = [hullPoints[i], hullPoints[j]];
        maxLineIndex = [i, j];
      }
    }
  }
  const maxAngle = getAngle(maxLinePoints[0], maxLinePoints[1]);
  const rotatedMaxPoints = rotate(-maxAngle, hullPoints);

  const { minIndex: currentMin, maxIndex: currentMax } =
    findPointsIndexesOfExtremeRows(rotatedMaxPoints);
  const maxLines = getMaxLines(
    maxAngle,
    currentMin,
    currentMax,
    rotatedMaxPoints,
    maxLineIndex,
  );
  const maxDiameter = {
    length: Math.sqrt(maxSquaredWidth),
    angle: toDegrees(getAngle(maxLinePoints[0], maxLinePoints[1])),
    points: maxLinePoints,
    calliperLines: maxLines,
  };

  return {
    minDiameter,
    maxDiameter,
    aspectRatio: minDiameter.length / maxDiameter.length,
  };
}

function findPointIndexesOfExtremeColumns(points: Point[]): {
  minIndex: number;
  maxIndex: number;
} {
  let maxIndex = 0;
  let minIndex = 0;

  for (let i = 0; i < points.length; i++) {
    if (points[i].column > points[maxIndex].column) {
      maxIndex = i;
    }
    if (points[i].column < points[minIndex].column) {
      minIndex = i;
    }
  }
  return { minIndex, maxIndex };
}
function findPointsIndexesOfExtremeRows(points: Point[]): {
  minIndex: number;
  maxIndex: number;
} {
  let maxIndex = 0;
  let minIndex = 0;
  for (let i = 0; i < points.length; i++) {
    if (points[i].row > points[maxIndex].row) {
      maxIndex = i;
    }
    if (points[i].row < points[minIndex].row) {
      minIndex = i;
    }
  }
  return { minIndex, maxIndex };
}

function getMinLines(
  angle: number,
  min: number,
  max: number,
  rotatedPoints: Point[],
  feretPoints: Point[],
): [[Point, Point], [Point, Point]] {
  const minLine1: [Point, Point] = [
    { column: rotatedPoints[min].column, row: feretPoints[0].row },
    {
      column: rotatedPoints[max].column,
      row: feretPoints[0].row,
    },
  ];
  const minLine2: [Point, Point] = [
    {
      column: rotatedPoints[min].column,
      row: feretPoints[1].row,
    },
    {
      column: rotatedPoints[max].column,
      row: feretPoints[1].row,
    },
  ];

  return [rotate(angle, minLine1), rotate(angle, minLine2)] as [
    [Point, Point],
    [Point, Point],
  ];
}
function getMaxLines(
  angle: number,
  min: number,
  max: number,
  rotatedPoints: Point[],
  index: number[],
): [[Point, Point], [Point, Point]] {
  const maxLine1: [Point, Point] = [
    { column: rotatedPoints[index[0]].column, row: rotatedPoints[min].row },
    {
      column: rotatedPoints[index[0]].column,
      row: rotatedPoints[max].row,
    },
  ];
  const maxLine2: [Point, Point] = [
    { column: rotatedPoints[index[1]].column, row: rotatedPoints[min].row },
    {
      column: rotatedPoints[index[1]].column,
      row: rotatedPoints[max].row,
    },
  ];

  return [rotate(angle, maxLine1), rotate(angle, maxLine2)] as [
    [Point, Point],
    [Point, Point],
  ];
}
