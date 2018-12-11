import { Image } from 'test/common';
import binary from 'test/binary';

import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { angle } from '../../../util/points';
import minimalBoundingRectangle from '../minimalBoundingRectangle';

expect.extend({ toBeDeepCloseTo });

describe('Minimal bounding rectangle', function () {
  it('should return the minimal bounding box', function () {
    let image = new Image(
      8,
      8,
      binary`
        00000000
        00011000
        00011000
        00111111
        00111111
        00011000
        00011000
        00000000
      `,
      { kind: 'BINARY' }
    );

    const result = minimalBoundingRectangle.call(image);
    expect(result).toHaveLength(4);

    for (let i = 0; i < 4; i++) {
      let currentAngle = angle(
        result[(i + 1) % 4],
        result[i],
        result[(i + 2) % 4]
      );
      expect(Math.abs(currentAngle)).toBeCloseTo(Math.PI / 2, 1e-6);
    }
  });

  it('should return the small bounding box', function () {
    let image = new Image(8, 3, binary`
      10000001
      00011000
      10011010
    `, {
      kind: 'BINARY'
    });

    const result = minimalBoundingRectangle.call(image);
    expect(result).toStrictEqual([[0, 2], [7, 2], [7, 0], [0, 0]]);
  });

  it('should return the small bounding box 2', function () {
    let image = new Image(8, 3, binary`
      01000100
      00011000
      01011010
    `, {
      kind: 'BINARY'
    });

    const result = minimalBoundingRectangle.call(image);
    expect(result).toStrictEqual([[1, 2], [6, 2], [6, 0], [1, 0]]);
  });

  it('should return the small bounding box diamond', function () {
    let image = new Image(8, 3, binary`
      00000100
      00001110
      00000100
    `, {
      kind: 'BINARY'
    });

    const result = minimalBoundingRectangle.call(image);
    expect(result).toBeDeepCloseTo([[6, 1], [5, 0], [4, 1], [5, 2]], 6);
  });

  it('should return the small bounding box rectangle', function () {
    let image = new Image(
      8,
      7,
      binary`
        00000000
        00001000
        00011100
        00111110
        00011111
        00001110
        00000100
      `,
      { kind: 'BINARY' }
    );

    const result = minimalBoundingRectangle.call(image);
    expect(result).toBeDeepCloseTo([[2, 3], [5, 6], [7, 4], [4, 1]], 6);
  });

  it('should return the small bounding box rectangle from points', function () {
    const result = minimalBoundingRectangle({
      originalPoints: [[0, 1], [1, 0], [3, 2], [2, 4], [1, 4], [0, 3]]
    });
    expect(result).toBeDeepCloseTo([[-1, 2], [1, 0], [3.5, 2.5], [1.5, 4.5]], 6);
  });

  it('should return the small bouding rectangle for one point', function () {
    const result = minimalBoundingRectangle({
      originalPoints: [[2, 2]]
    });
    expect(result).toStrictEqual([[2, 2], [2, 2], [2, 2], [2, 2]]);
  });

  it('should return the small bouding rectangle for nothing', function () {
    const result = minimalBoundingRectangle({
      originalPoints: []
    });
    expect(result).toStrictEqual([]);
  });

  it('should return the small bouding rectangle for 2 points', function () {
    const result = minimalBoundingRectangle({
      originalPoints: [[2, 2], [3, 3]]
    });
    expect(result).toBeDeepCloseTo([[2, 2], [3, 3], [3, 3], [2, 2]], 6);
  });
});
