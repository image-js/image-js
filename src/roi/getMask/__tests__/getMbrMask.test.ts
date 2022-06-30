import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { angle } from '../../../utils/geometry/points';
import { getMbrCorners } from '../getMbrMask';

expect.extend({ toBeDeepCloseTo });

describe('getMbrCorners', () => {
  it('verify angle is correct', () => {
    const roi = testUtils.createRoi(`
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

  it('small rectangular ROI', () => {
    const roi = testUtils.createRoi(
      [
        [0, 0, 1],
        [0, 1, 1],
        [1, 1, 0],
        [1, 0, 0],
      ],
      { allowCorners: true },
    );

    const result = getMbrCorners(roi);

    expect(result).toBeDeepCloseTo(
      [
        { column: 0.5, row: 4.5 },
        { column: 4, row: 1 },
        { column: 2.5, row: -0.5 },
        { column: -1, row: 3 },
      ],
      6,
    );
  });

  it('horizontal MBR', () => {
    const roi = testUtils.createRoi(
      `
      1 0 0 0 0 0 0 1
      0 1 1 1 1 1 1 0
      1 0 0 1 1 0 1 0
    `,
      { allowCorners: true },
    );

    const result = getMbrCorners(roi);

    expect(result).toStrictEqual([
      { column: 0, row: 3 },
      { column: 8, row: 3 },
      { column: 8, row: 0 },
      { column: 0, row: 0 },
    ]);
  });

  it('other horizontal MBR', () => {
    const roi = testUtils.createRoi(
      `
      1 0 0 0 1 0 
      0 1 1 1 1 0 
      1 0 1 1 0 1 
    `,
      { allowCorners: true },
    );

    const result = getMbrCorners(roi);
    expect(result).toStrictEqual([
      { column: 0, row: 3 },
      { column: 6, row: 3 },
      { column: 6, row: 0 },
      { column: 0, row: 0 },
    ]);
  });

  it('small tilted rectangle', () => {
    const roi = testUtils.createRoi(`
     0 1 0
     1 1 1
     0 1 0
      `);

    const result = getMbrCorners(roi);

    expect(result).toBeDeepCloseTo(
      [
        { column: -0.5, row: 1.5 },
        { column: 1.5, row: 3.5 },
        { column: 3.5, row: 1.5 },
        { column: 1.5, row: -0.5 },
      ],
      6,
    );
  });

  it('large tilted rectangle', () => {
    const roi = testUtils.createRoi(` 
        0 0 1 0 0 0
        0 1 1 1 0 0
        1 1 1 1 1 0
        0 1 1 1 1 1
        0 0 1 1 1 0
        0 0 0 1 0 0
      `);
    const result = getMbrCorners(roi);
    expect(result).toBeDeepCloseTo(
      [
        { column: 6.5, row: 3.5 },
        { column: 2.5, row: -0.5 },
        { column: -0.5, row: 2.5 },
        { column: 3.5, row: 6.5 },
      ],
      6,
    );
  });

  it('one point ROI', () => {
    const roi = testUtils.createRoi([[1]]);
    const result = getMbrCorners(roi);
    expect(result).toStrictEqual([
      { column: 0, row: 0 },
      { column: 0, row: 0 },
      { column: 0, row: 0 },
      { column: 0, row: 0 },
    ]);
  });

  it('2 points ROI', () => {
    const roi = testUtils.createRoi(
      [
        [1, 0],
        [0, 1],
      ],
      { allowCorners: true },
    );
    const result = getMbrCorners(roi);

    expect(result).toBeDeepCloseTo(
      [
        { column: 2.5, row: 1.5 },
        { column: 0.5, row: -0.5 },
        { column: -0.5, row: 0.5 },
        { column: 1.5, row: 2.5 },
      ],
      6,
    );
  });

  it('small triangular ROI', () => {
    const roi = testUtils.createRoi(
      [
        [1, 1],
        [1, 0],
      ],
      { allowCorners: true },
    );

    const result = getMbrCorners(roi);

    expect(result).toBeDeepCloseTo(
      [
        { column: 0, row: 0 },
        { column: 0, row: 2 },
        { column: 2, row: 2 },
        { column: 2, row: 0 },
      ],
      6,
    );
  });
});
