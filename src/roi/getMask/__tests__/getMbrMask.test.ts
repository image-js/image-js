import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { angle } from '../../../utils/geometry/points';
import { getMbrCorners } from '../getMbrMask';

expect.extend({ toBeDeepCloseTo });

describe('getMbrCorners', () => {
  it('should return the minimal bounding box', () => {
    let roi = testUtils.createRoi(`
      0 0 0 0 0 0 0 0
      0 0 0 1 1 0 0 0
      0 0 0 1 1 0 0 0
      0 0 1 1 1 1 1 1
      0 0 1 1 1 1 1 1
      0 0 0 1 1 0 0 0
      0 0 0 1 1 0 0 0
      0 0 0 0 0 0 0 0
    `);

    const result = getMbrCorners(roi);
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

  it.only('should return the small bounding box', () => {
    let roi = testUtils.createRoi(
      `
      1 0 0 0 0 0 0 1
      0 1 1 1 1 1 1 0
      1 0 0 1 1 0 1 0
    `,
      { allowCorners: true },
    );

    const result = getMbrCorners(roi);

    expect(result).toStrictEqual([
      [0, 3],
      [8, 3],
      [8, 0],
      [0, 0],
    ]);
  });

  it('should return the small bounding box 2', () => {
    let roi = testUtils.createRoi(`
      0 1 0 0 0 1 0 0
      0 0 0 1 1 0 0 0
      0 1 0 1 1 0 1 0
    `);

    const result = getMbrCorners(roi);
    expect(result).toStrictEqual([
      [1, 3],
      [7, 3],
      [7, 0],
      [1, 0],
    ]);
  });

  it('should return the small bounding box diamond', () => {
    let roi = testUtils.createRoi(`
      0 0 0 0 0 1 0 0
      0 0 0 0 1 1 1 0
      0 0 0 0 0 1 0 0
      `);

    const result = getMbrCorners(roi);
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
    let roi = testUtils.createRoi(`
        0 0 0 0 0 0 0 0
        0 0 0 0 1 0 0 0
        0 0 0 1 1 1 0 0
        0 0 1 1 1 1 1 0
        0 0 0 1 1 1 1 1
        0 0 0 0 1 1 1 0
        0 0 0 0 0 1 0 0
      `);
    const result = getMbrCorners(roi);
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
});
