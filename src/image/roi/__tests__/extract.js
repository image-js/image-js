import { load } from 'test/common';

describe('we check that we can extract correctly a Roi', function () {
  it('should yield the right extract number of pixels', async () => {
    const img = await load('BW15x15.png');
    expect(img.width).toBe(15);
    expect(img.height).toBe(15);

    let roiManager = img.getRoiManager();
    let grey = img.grey();
    let mask = grey.mask({ invert: true });
    roiManager.fromMask(mask);

    let rois = roiManager.getRois();

    expect(rois).toBeInstanceOf(Array);
    expect(rois).toHaveLength(5);

    rois.sort(function (a, b) {
      return a.meanX - b.meanX;
    });

    expect(rois[0].internalIDs).toStrictEqual([-2, 3, 2]);

    let roiMask = rois[0].getMask();
    let extract = img.extract(roiMask);
    expect(extract.countAlphaPixels({ alpha: 0 })).toBe(27);
    expect(extract.countAlphaPixels({ alpha: 255 })).toBe(54);

    roiMask = rois[0].getMask({ kind: 'filled' });
    extract = img.extract(roiMask);
    expect(extract.countAlphaPixels({ alpha: 0 })).toBe(1);
    expect(extract.countAlphaPixels({ alpha: 255 })).toBe(80);
  });
});
