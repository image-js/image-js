import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { ImageColorModel } from '../../../IJS';
import { fromMask } from '../../fromMask';
import { RoiKind } from '../../getRois';

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
    console.log({ result });
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

  it('large tilted rectangle, filled = false', () => {
    const roi = testUtils.createRoi(` 
        0 0 1 0 0 0
        0 1 1 1 0 0
        1 1 1 1 1 0
        0 1 1 1 1 1
        0 0 1 1 1 0
        0 0 0 1 0 0
      `);

    const result = roi.getMask({ kind: 'mbr', filled: false });

    console.log({ result });
    expect(result).toMatchMaskData([
      [0, 0, 1, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 1],
      [0, 0, 0, 1, 0, 1, 0],
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
  it('larger image', () => {
    const image = testUtils.load('various/grayscale_by_zimmyrose.png');
    const rgbaImage = image.convertColor(ImageColorModel.RGBA);
    const mask = image.threshold({ threshold: 200 });
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });

    const roi = rois.sort((a, b) => b.surface - a.surface)[0];
    let mbr = roi.getMask({
      kind: 'mbr',
      filled: false,
    });
    let roiMask = roi.getMask({
      kind: 'contour',
      filled: true,
      innerBorders: false,
    });

    let result = rgbaImage.paintMask(roiMask, {
      origin: roi.origin,
      color: [0, 0, 255, 255],
    });

    result = result.paintMask(mbr, {
      origin: roi.origin,
      color: [0, 255, 0, 255],
    });

    expect(result).toMatchIJSSnapshot();
  });
  it('larger image no masks', () => {
    const image = testUtils.load('various/grayscale_by_zimmyrose.png');
    const rgbaImage = image.convertColor(ImageColorModel.RGBA);
    const mask = image.threshold({ threshold: 200 });
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });

    const roi = rois.sort((a, b) => b.surface - a.surface)[0];

    const roiMask = roi.getMask();
    let mbr = roiMask.getMbr();

    let result = rgbaImage.paintMask(roiMask, {
      origin: roi.origin,
      color: [0, 0, 255, 255],
    });

    result = result.drawPolygon(mbr.corners, {
      origin: roi.origin,
      strokeColor: [0, 255, 0, 255],
    });

    expect(result).toMatchIJSSnapshot();
  });
});
