import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

expect.extend({ toBeDeepCloseTo });

describe('getMbrMask', () => {
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

    const result = roi.getMask({ kind: 'mbr' });
    console.log(result);

    expect(result.width).toBe(5);
    expect(result.height).toBe(6);
    expect(result).toMatchMaskData([
      [0, 0, 0, 0, 1],
      [0, 0, 0, 1, 1],
      [0, 0, 1, 1, 0],
      [0, 1, 1, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ]);
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

    const result = roi.getMask();

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

    const result = roi.getMask();
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

    const result = roi.getMask();

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

    const result = roi.getMask();

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
    const result = roi.getMask();
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
    const result = roi.getMask();

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

    const result = roi.getMask();

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
