import { ransac } from 'ml-ransac';

import { writeSync } from '../../..';
import { affineFitFunction } from '../affineFitFunction';
import { applyAffineTransfom } from '../applyAffineTransform';
import { createAffineTransformModel } from '../createAffineTransformModel';
import { drawResult } from '../drawResult';
import { getEuclidianDistance } from '../getEuclidianDistance';

describe('2D data (points)', () => {
  it('6 points perfectly aligned', () => {
    const source = [
      { row: 2, column: 2 },
      { row: 3, column: 2 },
      { row: 4, column: 2 },
      { row: 5, column: 2 },
      { row: 6, column: 2 },
      { row: 7, column: 2 },
    ];
    const destination = [
      { row: 2, column: -2 },
      { row: 1, column: -2 },
      { row: 0, column: -2 },
      { row: -1, column: -2 },
      { row: -2, column: -2 },
      { row: -3, column: -2 },
    ];

    const result = ransac(source, destination, {
      distanceFunction: getEuclidianDistance,
      modelFunction: createAffineTransformModel,
      fitFunction: affineFitFunction,
      sampleSize: 3,
    });

    expect(result.modelParameters).toBeDeepCloseTo([180, 0, 4, 1]);
  });
  it('6 points with outliers', () => {
    const source = [
      { row: 2, column: 2 },
      { row: 3, column: 2 },
      { row: 4, column: 2 },
      { row: 5, column: 2 },
      { row: 6, column: 2 },
      { row: 7, column: 2 },
    ];
    const destination = [
      { row: 2, column: -10 }, // outlier
      { row: 1, column: -2 },
      { row: 0, column: 20 }, // outlier
      { row: -1, column: -2 },
      { row: -2, column: -2 },
      { row: -3, column: -2 },
    ];

    const result = ransac(source, destination, {
      distanceFunction: getEuclidianDistance,
      modelFunction: createAffineTransformModel,
      fitFunction: affineFitFunction,
      sampleSize: 3,
    });

    expect(result.modelParameters).toBeDeepCloseTo([180, 0, 4, 1]);
    expect(result.inliers).toStrictEqual([1, 3, 4, 5]);
  });

  test('polygon rotated 180 degrees', () => {
    const source = [
      { column: 4, row: 3 },
      { column: 2, row: 5 },
      { column: 5, row: 6 },
      { column: 7, row: 5 },
      { column: 6, row: 3 },
      { column: 5, row: 4 },
    ];
    const destination = [
      { column: 5, row: -1 },
      { column: 7, row: -3 },
      { column: 4, row: -4 },
      { column: 2, row: -3 },
      { column: 3, row: -1 },
      { column: 4, row: -2 },
    ];
    const result = ransac(source, destination, {
      distanceFunction: getEuclidianDistance,
      modelFunction: createAffineTransformModel,
      fitFunction: affineFitFunction,
      sampleSize: 3,
    });

    expect(result.modelParameters).toBeDeepCloseTo([180, 9, 2, 1]);

    const model = createAffineTransformModel(result.modelParameters);
    const resultPoints = applyAffineTransfom(source, model);

    expect(resultPoints).toBeDeepCloseTo(destination);

    const image = drawResult(source, destination, resultPoints);

    writeSync(`${__dirname}/polygon1.png`, image);
  });
  test('polygon rotated 90 degrees', () => {
    const source = [
      { column: -6, row: -1 },
      { column: -4, row: -2 },
      { column: -3, row: 1 },
      { column: -3, row: 3 },
      { column: -5, row: 5 },
      { column: -7, row: 3 },
      { column: -5, row: 3 },
      { column: -5, row: 1 },
    ];
    const destination = [
      { column: -1, row: 6 },
      { column: -2, row: 4 },
      { column: 1, row: 3 },
      { column: 3, row: 3 },
      { column: 5, row: 5 },
      { column: 3, row: 7 },
      { column: 3, row: 5 },
      { column: 1, row: 5 },
    ];
    const result = ransac(source, destination, {
      distanceFunction: getEuclidianDistance,
      modelFunction: createAffineTransformModel,
      fitFunction: affineFitFunction,
      sampleSize: 3,
    });

    expect(result.modelParameters).toBeDeepCloseTo([-90, 0, 0, 1]);

    const model = createAffineTransformModel(result.modelParameters);
    const resultPoints = applyAffineTransfom(source, model);

    expect(resultPoints).toBeDeepCloseTo(destination);

    const image = drawResult(source, destination, resultPoints);

    writeSync(`${__dirname}/polygon2.png`, image);
  });
});
