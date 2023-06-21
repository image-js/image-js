import { EigenvalueDecomposition } from 'ml-matrix';
import { xVariance, xyCovariance } from 'ml-spectra-processing';

import { Point } from '../..';
import { getAngle } from '../../maskAnalysis/utils/getAngle';
import { assert } from '../../utils/validators/assert';
import { toDegrees } from '../../utils/geometry/angles';
import { Roi } from '../Roi';

export interface Ellipse {
  center: {
    column: number;
    row: number;
  };
  majorAxis: { points: [Point, Point]; length: number; angle: number };

  minorAxis: { points: [Point, Point]; length: number; angle: number };
  surface: number;
}
/**
 * Calculates ellipse on around ROI.
 * @param roi - Region of interest.
 * @returns Ellipse.
 */
export function getEllipse(roi: Roi): Ellipse {
  let xCenter = roi.centroid.column;
  let yCenter = roi.centroid.row;

  let xCentered = roi.points.map((point: number[]) => point[0] - xCenter);
  let yCentered = roi.points.map((point: number[]) => point[1] - yCenter);

  let centeredXVariance = xVariance(xCentered, { unbiased: false });
  let centeredYVariance = xVariance(yCentered, { unbiased: false });

  let centeredCovariance = xyCovariance(
    {
      x: xCentered,
      y: yCentered,
    },
    { unbiased: false },
  );

  //spectral decomposition of the sample covariance matrix
  let sampleCovarianceMatrix = [
    [centeredXVariance, centeredCovariance],
    [centeredCovariance, centeredYVariance],
  ];
  let e = new EigenvalueDecomposition(sampleCovarianceMatrix);
  let eigenvalues = e.realEigenvalues;
  let vectors = e.eigenvectorMatrix;

  let radiusMajor: number;
  let radiusMinor: number;
  let vectorMajor: number[];
  let vectorMinor: number[];

  assert(eigenvalues[0] <= eigenvalues[1]);
  radiusMajor = Math.sqrt(eigenvalues[1]);
  radiusMinor = Math.sqrt(eigenvalues[0]);
  vectorMajor = vectors.getColumn(1);
  vectorMinor = vectors.getColumn(0);

  let majorAxisPoint1 = {
    column: xCenter + radiusMajor * vectorMajor[0],
    row: yCenter + radiusMajor * vectorMajor[1],
  };
  let majorAxisPoint2 = {
    column: xCenter - radiusMajor * vectorMajor[0],
    row: yCenter - radiusMajor * vectorMajor[1],
  };
  let minorAxisPoint1 = {
    column: xCenter + radiusMinor * vectorMinor[0],
    row: yCenter + radiusMinor * vectorMinor[1],
  };
  let minorAxisPoint2 = {
    column: xCenter - radiusMinor * vectorMinor[0],
    row: yCenter - radiusMinor * vectorMinor[1],
  };

  let majorLength = Math.sqrt(
    (majorAxisPoint1.column - majorAxisPoint2.column) ** 2 +
      (majorAxisPoint1.row - majorAxisPoint2.row) ** 2,
  );
  let minorLength = Math.sqrt(
    (minorAxisPoint1.column - majorAxisPoint2.column) ** 2 +
      (minorAxisPoint1.row - minorAxisPoint2.row) ** 2,
  );

  let ellipseSurface = (((minorLength / 2) * majorLength) / 2) * Math.PI;
  if (ellipseSurface !== roi.surface) {
    const scaleFactor = Math.sqrt(roi.surface / ellipseSurface);
    radiusMajor *= scaleFactor;
    radiusMinor *= scaleFactor;
    majorAxisPoint1 = {
      column: xCenter + radiusMajor * vectorMajor[0],
      row: yCenter + radiusMajor * vectorMajor[1],
    };
    majorAxisPoint2 = {
      column: xCenter - radiusMajor * vectorMajor[0],
      row: yCenter - radiusMajor * vectorMajor[1],
    };
    minorAxisPoint1 = {
      column: xCenter + radiusMinor * vectorMinor[0],
      row: yCenter + radiusMinor * vectorMinor[1],
    };
    minorAxisPoint2 = {
      column: xCenter - radiusMinor * vectorMinor[0],
      row: yCenter - radiusMinor * vectorMinor[1],
    };

    majorLength *= scaleFactor;

    minorLength *= scaleFactor;
    ellipseSurface *= scaleFactor ** 2;
  }

  return {
    center: {
      column: xCenter,
      row: yCenter,
    },
    majorAxis: {
      points: [majorAxisPoint1, majorAxisPoint2],
      length: majorLength,
      angle: toDegrees(getAngle(majorAxisPoint1, majorAxisPoint2)),
    },
    minorAxis: {
      points: [minorAxisPoint1, minorAxisPoint2],
      length: minorLength,
      angle: toDegrees(getAngle(minorAxisPoint1, minorAxisPoint2)),
    },
    surface: ellipseSurface,
  };
}
