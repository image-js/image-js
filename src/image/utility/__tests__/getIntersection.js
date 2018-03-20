import { Image } from 'test/common';

describe('getIntersection', function () {
  it('correct intersection for two 2x2 Roi not intersecting (before transformation) in 5x5 image', function () {
    let img1 = new Image(5, 5,
      [
        255, 255, 0,   0,   0,
        255, 255, 0,   0,   0,
        0,   0,   255, 255, 0,
        0,   0,   255, 255, 0,
        0,   0,   0,   0,   0
      ],
      { kind: 'GREY' }
    );

    let roiManager1 = img1.getRoiManager();
    let mask1 = img1.mask();
    roiManager1.fromMask(mask1);
    let rois = roiManager1.getRois();
    let mask2 = rois[0].getMask();
    let mask3 = rois[1].getMask();

    // no intersection
    let intersectNull = mask2.getIntersection(mask3);
    expect(intersectNull.commonWhitePixels).toHaveLength(0);
    expect(intersectNull.whitePixelsMask1).toHaveLength(4);
    expect(intersectNull.whitePixelsMask2).toHaveLength(4);

    // scale second roi s.t. one pixel intersects
    let mask4 = mask3.resize({ factor: 2 });
    let intersectOnePx = mask2.getIntersection(mask4);
    expect(intersectOnePx.commonWhitePixels).toHaveLength(1);
    expect(intersectOnePx.whitePixelsMask1).toHaveLength(4);
    expect(intersectOnePx.whitePixelsMask2).toHaveLength(16);

    // scale first roi s.t. one pixel intersects
    let mask5 = mask2.resize({ factor: 2 });
    let intersectOnePxInverse = mask3.getIntersection(mask5);
    expect(intersectOnePxInverse.commonWhitePixels).toHaveLength(1);
    expect(intersectOnePxInverse.whitePixelsMask1).toHaveLength(4);
    expect(intersectOnePxInverse.whitePixelsMask2).toHaveLength(16);
  });

  it('correct intersection for 2 Roi in 2 5x5 images', function () {
    let img1 = new Image(5, 5,
      [
        255, 255, 255, 0, 0,
        255, 255, 255, 0, 0,
        255, 255, 255, 0, 0,
        0,   0,   0,   0, 0,
        0,   0,   0,   0, 0
      ],
      { kind: 'GREY' }
    );
    let img2 = new Image(5, 5,
      [
        0, 0,   0,   0, 0,
        0, 255, 255, 0, 0,
        0, 255, 255, 0, 0,
        0, 0,   0,   0, 0,
        0, 0,   0,   0, 0
      ],
      { kind: 'GREY' }
    );

    // TODO find how to force parent

    let roiManager1 = img1.getRoiManager();
    let mask1 = img1.mask();
    roiManager1.fromMask(mask1);
    let rois1 = roiManager1.getRois();

    let roiManager2 = img2.getRoiManager();
    let mask2 = img2.mask();
    roiManager2.fromMask(mask2);
    let rois2 = roiManager2.getRois();

    let mask3 = rois1[0].getMask();
    let mask4 = rois2[0].getMask();


    let intersectNull = mask3.getIntersection(mask4);
    expect(intersectNull.commonWhitePixels).toHaveLength(4);
    expect(intersectNull.whitePixelsMask1).toHaveLength(9);
    expect(intersectNull.whitePixelsMask2).toHaveLength(4);
  });
});
