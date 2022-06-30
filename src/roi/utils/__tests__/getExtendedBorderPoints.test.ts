import { Mask } from '../../../Mask';
import { getExtendedBorderPoints } from '../getExtendedBorderPoints';

describe('getExtendedBorderPoints', () => {
  it('one pixel', () => {
    const roi = testUtils.createRoi([[1]]);

    let points = getExtendedBorderPoints(roi);

    let bordersMask = Mask.fromPoints(roi.width + 1, roi.height + 1, points);

    expect(bordersMask).toMatchMaskData([
      [1, 1],
      [1, 1],
    ]);
  });
  it('2x2 mask, L', () => {
    const roi = testUtils.createRoi([
      [1, 0],
      [1, 1],
    ]);

    let points = getExtendedBorderPoints(roi);

    let bordersMask = Mask.fromPoints(roi.width + 1, roi.height + 1, points);

    expect(bordersMask).toMatchMaskData([
      [1, 1, 0],
      [1, 1, 1],
      [1, 1, 1],
    ]);
  });
  it('3x3 mask, cross', () => {
    const roi = testUtils.createRoi([
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]);

    let points = getExtendedBorderPoints(roi);

    let extendedBorders = Mask.fromPoints(
      roi.width + 1,
      roi.height + 1,
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
