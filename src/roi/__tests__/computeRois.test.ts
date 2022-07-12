import { fromMask } from '..';
import { Roi } from '../Roi';
import { computeRois } from '../computeRois';

describe('computeRois', () => {
  it('1x2 mask', () => {
    const mask = testUtils.createMask([[1, 0]]);
    const roiMapManager = fromMask(mask);
    computeRois(roiMapManager);

    const whiteRoi = new Roi(roiMapManager.getMap(), 1);
    whiteRoi.origin = { row: 0, column: 0 };
    whiteRoi.height = 1;
    whiteRoi.width = 1;
    whiteRoi.surface = 1;

    expect(roiMapManager.whiteRois).toHaveLength(1);
    expect(roiMapManager.whiteRois).toStrictEqual([whiteRoi]);

    const blackRoi = new Roi(roiMapManager.getMap(), -1);
    blackRoi.origin = { row: 0, column: 1 };
    blackRoi.height = 1;
    blackRoi.width = 1;
    blackRoi.surface = 1;

    expect(roiMapManager.blackRois).toHaveLength(1);
    expect(roiMapManager.blackRois).toStrictEqual([blackRoi]);
  });
  it('3x3 mask', () => {
    const mask = testUtils.createMask([
      [1, 1, 1],
      [1, 0, 0],
      [0, 0, 1],
    ]);
    const roiMapManager = fromMask(mask);
    computeRois(roiMapManager);
    expect(roiMapManager.whiteRois).toHaveLength(2);
    expect(roiMapManager.blackRois).toHaveLength(1);

    expect(roiMapManager.whiteRois).toMatchSnapshot();
    expect(roiMapManager.blackRois).toMatchSnapshot();
  });
});
