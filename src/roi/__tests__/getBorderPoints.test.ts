import { Mask } from '../../Mask';

describe('getBorderPoints', () => {
  it('6x5 mask with hole, no inner borders', () => {
    const roi = testUtils.createRoi([
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ]);

    let points = roi.getBorderPoints();

    let bordersMask = Mask.fromPoints(roi.width, roi.height, points);

    expect(bordersMask).toMatchMaskData([
      [1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 1],
    ]);
  });
});
