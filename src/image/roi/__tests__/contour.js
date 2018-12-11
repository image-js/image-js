import { Image } from 'test/common';

describe('we check contourMask', function () {
  it('should yield the right contourMask size and value', function () {
    let img = new Image(5, 5,
      [
        0, 0,   0,   0,   0,
        0, 255, 255, 255, 0,
        0, 255, 255, 255, 0,
        0, 255, 255, 255, 0,
        0, 0,   0,   0,   0
      ],
      { kind: 'GREY' }
    );

    expect(img.width).toBe(5);
    expect(img.height).toBe(5);

    let roiManager = img.getRoiManager();
    let mask = img.mask({ invert: true });
    roiManager.fromMask(mask);

    let rois = roiManager.getRois();
    expect(rois).toBeInstanceOf(Array);
    expect(rois).toHaveLength(2);

    rois.sort(function (a, b) {
      return a.surface - b.surface;
    });

    expect(rois[0].surface).toBe(9);
    expect(rois[1].surface).toBe(16);


    let roiMask = rois[0].mask;
    expect(Array.from(roiMask.data)).toStrictEqual([255, 128]);

    let roiFilledMask = rois[0].filledMask;
    expect(Array.from(roiFilledMask.data)).toStrictEqual([255, 128]);

    let roiContour = rois[0].contourMask;
    expect(Array.from(roiContour.data)).toStrictEqual([247, 128]);

    roiMask = rois[1].mask;
    expect(Array.from(roiMask.data)).toStrictEqual([252, 99, 31, 128]);

    roiFilledMask = rois[1].filledMask;
    expect(Array.from(roiFilledMask.data)).toStrictEqual([255, 255, 255, 128]);

    roiContour = rois[1].contourMask;
    expect(Array.from(roiContour.data)).toStrictEqual([252, 99, 31, 128]);
  });
});
