import { Image, load } from 'test/common';
import { asc as sortAsc } from 'num-sort';

describe('we check mask', function () {
  it('should yield the right mask size and value', async () => {
    const img = await load('BW5x5.png');
    expect(img.width).toBe(5);
    expect(img.height).toBe(5);

    let roiManager = img.getRoiManager();

    let mask = img.mask({ invert: true });
    roiManager.fromMask(mask);

    let roiIDs = roiManager.getRoiIds().sort(sortAsc);
    expect(roiIDs).toStrictEqual([-1, 1, 2]);

    let rois = roiManager.getRois();

    expect(rois).toBeInstanceOf(Array);
    expect(rois).toHaveLength(3);

    rois.sort(function (a, b) {
      return a.mask.sizes[0] - b.mask.sizes[0];
    });

    expect(rois[0].mask.sizes).toStrictEqual([1, 1]);
    expect(rois[1].mask.sizes).toStrictEqual([3, 3]);
    expect(rois[2].mask.sizes).toStrictEqual([5, 5]);

    let roiMask = rois[0].mask;
    expect(Array.from(roiMask.data)).toStrictEqual([128]);

    let roiFilledMask = rois[0].filledMask;
    expect(Array.from(roiFilledMask.data)).toStrictEqual([128]);

    roiMask = rois[1].mask;
    expect(Array.from(roiMask.data)).toStrictEqual([247, 128]);

    roiFilledMask = rois[1].filledMask;
    expect(Array.from(roiFilledMask.data)).toStrictEqual([255, 128]);

    roiMask = rois[2].mask;
    expect(Array.from(roiMask.data)).toStrictEqual([252, 99, 31, 128]);

    roiFilledMask = rois[2].filledMask;
    expect(Array.from(roiFilledMask.data)).toStrictEqual([
      255,
      255,
      255,
      128
    ]);

    let centerMask = rois[0].centerMask;
    expect(centerMask.position).toStrictEqual([1, 1]);
    expect(Array.from(centerMask.data)).toStrictEqual([93, 0]);

    let contourMask = rois[1].contourMask;
    expect(contourMask.position).toStrictEqual([1, 1]);
    expect(Array.from(contourMask.data)).toStrictEqual([247, 128]);

    let masks = roiManager.getMasks();

    let painted = new Image(5, 5);
    painted.paintMasks(masks, { color: 'red' });

    expect(Array.from(painted.data).slice(0, 8)).toStrictEqual([
      255,
      0,
      0,
      255,
      255,
      0,
      0,
      255
    ]);
  });
});
