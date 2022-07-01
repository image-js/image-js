import { Mask } from '../../../Mask';
import { getExtendedBorderPoints } from '../getExtendedBorderPoints';

describe('getExtendedBorderPoints', () => {
  it('one pixel', () => {
    const mask = testUtils.createMask([[1]]);

    let points = getExtendedBorderPoints(mask);

    let bordersMask = Mask.fromPoints(mask.width + 1, mask.height + 1, points);

    expect(bordersMask).toMatchMaskData([
      [1, 1],
      [1, 1],
    ]);
  });
  it('2x2 mask, L', () => {
    const mask = testUtils.createMask([
      [1, 0],
      [1, 1],
    ]);

    let points = getExtendedBorderPoints(mask);

    let bordersMask = Mask.fromPoints(mask.width + 1, mask.height + 1, points);

    expect(bordersMask).toMatchMaskData([
      [1, 1, 0],
      [1, 1, 1],
      [1, 1, 1],
    ]);
  });
  it('3x3 mask, cross', () => {
    const mask = testUtils.createMask([
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]);

    let points = getExtendedBorderPoints(mask);

    let extendedBorders = Mask.fromPoints(
      mask.width + 1,
      mask.height + 1,
      points,
    );

    expect(extendedBorders).toMatchMaskData([
      [0, 1, 1, 0],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
    ]);
  });
});
