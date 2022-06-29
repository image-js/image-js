import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { angle } from '../../../utils/geometry/points';
import { getMbrCorners } from '../getMbrMask';

expect.extend({ toBeDeepCloseTo });

describe('getMbrMask', () => {
  it('should return the minimal bounding box', () => {
    let image = testUtils.createMask(`
      00000000
      00011000
      00011000
      00111111
      00111111
      00011000
      00011000
      00000000
    `);

    const result = getMbrCorners(image);
    expect(result).toHaveLength(4);

    for (let i = 0; i < 4; i++) {
      let currentAngle = angle(
        result[(i + 1) % 4],
        result[i],
        result[(i + 2) % 4],
      );
      expect(Math.abs(currentAngle)).toBeCloseTo(Math.PI / 2, 1e-6);
    }
  });

  it('should return the small bounding box', () => {
    let image = testUtils.createMask(`
      10000001
      00011000
      10011010
    `);

    const result = getMbrCorners(image);

    expect(result).toStrictEqual([
      [0, 3],
      [8, 3],
      [8, 0],
      [0, 0],
    ]);
  });

  it('should return the small bounding box 2', () => {
    let image = testUtils.createMask(`
      01000100
      00011000
      01011010
    `);

    const result = getMbrCorners(image);
    expect(result).toStrictEqual([
      [1, 3],
      [7, 3],
      [7, 0],
      [1, 0],
    ]);
  });

  it('should return the small bounding box diamond', () => {
    let image = testUtils.createMask(`
      00000100
      00001110
      00000100
      `);

    const result = getMbrCorners(image);
    expect(result).toBeDeepCloseTo(
      [
        [3.5, 1.5],
        [5.5, 3.5],
        [7.5, 1.5],
        [5.5, -0.5],
      ],
      6,
    );
  });

  it('should return the small bounding box rectangle', () => {
    let image = testUtils.createMask(`
        00000000
        00001000
        00011100
        00111110
        00011111
        00001110
        00000100
      `);
    const result = getMbrCorners(image);
    expect(result).toBeDeepCloseTo(
      [
        [8.5, 4.5],
        [4.5, 0.5],
        [1.5, 3.5],
        [5.5, 7.5],
      ],
      6,
    );
  });

  it('should return the small bounding box rectangle from points', () => {
    const result = minimalBoundingRectangle({
      originalPoints: [
        [0, 1],
        [1, 0],
        [3, 2],
        [2, 4],
        [1, 4],
        [0, 3],
      ],
    });
    expect(result).toBeDeepCloseTo(
      [
        [-1, 2],
        [1, 0],
        [3.5, 2.5],
        [1.5, 4.5],
      ],
      6,
    );
  });

  it('should return the small bouding rectangle for one point', () => {
    const result = minimalBoundingRectangle({
      originalPoints: [[2, 2]],
    });
    expect(result).toStrictEqual([
      [2, 2],
      [2, 2],
      [2, 2],
      [2, 2],
    ]);
  });

  it('should return the small bouding rectangle for nothing', () => {
    const result = minimalBoundingRectangle({
      originalPoints: [],
    });
    expect(result).toStrictEqual([]);
  });

  it('should return the small bouding rectangle for 2 points', () => {
    const result = minimalBoundingRectangle({
      originalPoints: [
        [2, 2],
        [3, 3],
      ],
    });
    expect(result).toBeDeepCloseTo(
      [
        [2, 2],
        [3, 3],
        [3, 3],
        [2, 2],
      ],
      6,
    );
  });
});
