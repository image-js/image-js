import { EigenvalueDecomposition } from 'ml-matrix';
import { xVariance, xyCovariance } from 'ml-spectra-processing';

import type { Point } from '../../geometry/index.js';
import { getAngle } from '../../maskAnalysis/utils/getAngle.js';
import { toDegrees } from '../../utils/geometry/angles.js';
import { assert } from '../../utils/validators/assert.js';
import type { Roi } from '../Roi.js';
import type { Ellipse } from '../roi.types.js';
/**
 * Calculates ellipse on around ROI.
 * @param roi - Region of interest.
 * @returns Ellipse.
 */
export function getEllipse(roi: Roi): Ellipse {
  const xCenter = roi.centroid.column;
  const yCenter = roi.centroid.row;

  const xCentered = roi.relativePoints.map(
    (point: Point) => point.column - xCenter,
  );
  const yCentered = roi.relativePoints.map(
    (point: Point) => point.row - yCenter,
  );

  const centeredXVariance = xVariance(xCentered, { unbiased: false });
  const centeredYVariance = xVariance(yCentered, { unbiased: false });

  const centeredCovariance = xyCovariance(
    {
      x: xCentered,
      y: yCentered,
    },
    { unbiased: false },
  );

  //spectral decomposition of the sample covariance matrix
  const sampleCovarianceMatrix = [
    [centeredXVariance, centeredCovariance],
    [centeredCovariance, centeredYVariance],
  ];
  const e = new EigenvalueDecomposition(sampleCovarianceMatrix);
  const eigenvalues = e.realEigenvalues;
  const vectors = e.eigenvectorMatrix;

  assert(eigenvalues[0] <= eigenvalues[1]);

  let radiusMajor = Math.sqrt(eigenvalues[1]);
  let radiusMinor = Math.sqrt(eigenvalues[0]);
  const vectorMajor = vectors.getColumn(1);
  const vectorMinor = vectors.getColumn(0);

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

  let majorLength = Math.hypot(
    majorAxisPoint1.column - majorAxisPoint2.column,
    majorAxisPoint1.row - majorAxisPoint2.row,
  );
  let minorLength = Math.hypot(
    minorAxisPoint1.column - majorAxisPoint2.column,
    minorAxisPoint1.row - minorAxisPoint2.row,
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
