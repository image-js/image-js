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

    expect(result.width).toBe(5);
    expect(result.height).toBe(6);
    expect(result).toMatchMaskData([
      [0, 0, 1, 1, 0],
      [0, 1, 1, 1, 1],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
    ]);
  });
  // MBR mask is weird with some small ROIs
  it.skip('small tilted rectangle', () => {
    const roi = testUtils.createRoi(`
     0 1 0
     1 1 1
     0 1 0
      `);

    const result = roi.getMask({ kind: 'mbr' });
    expect(result).toMatchMaskData([
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]);
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

    const result = roi.getMask({ kind: 'mbr' });

    expect(result).toMatchMaskData([
      [0, 0, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 0],
    ]);
  });

  it('one point ROI', () => {
    const roi = testUtils.createRoi([[1]]);
    const result = roi.getMask();
    expect(result).toMatchMaskData([[1]]);
  });

  it.skip('2 points ROI', () => {
    const roi = testUtils.createRoi(
      [
        [1, 0],
        [0, 1],
      ],
      { allowCorners: true },
    );
    const result = roi.getMask({ kind: 'mbr' });

    expect(result).toMatchMaskData([
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ]);
  });

  it('small triangular ROI', () => {
    const roi = testUtils.createRoi(
      [
        [1, 1],
        [1, 0],
      ],
      { allowCorners: true },
    );

    const result = roi.getMask({ kind: 'mbr' });

    expect(result).toMatchMaskData([
      [1, 1],
      [1, 1],
    ]);
  });
});
