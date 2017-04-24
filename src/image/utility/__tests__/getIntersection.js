/**
 *
 */
import {Image} from 'test/common';

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
            {kind: 'GREY'}
        );

        let roiManager1 = img1.getRoiManager();
        let mask1 = img1.mask();
        roiManager1.fromMask(mask1);
        let rois = roiManager1.getRois();
        let mask2 = rois[0].getMask();
        let mask3 = rois[1].getMask();

        //no intersection
        let intersectNull = mask2.getIntersection(mask3);
        intersectNull.commonWhitePixels.length.should.eql(0);
        intersectNull.whitePixelsMask1.length.should.eql(4);
        intersectNull.whitePixelsMask2.length.should.eql(4);

        //scale second roi s.t. one pixel intersects
        let mask4 = mask3.scale({factor: 2});
        let intersectOnePx = mask2.getIntersection(mask4);
        intersectOnePx.commonWhitePixels.length.should.eql(1);
        intersectOnePx.whitePixelsMask1.length.should.eql(4);
        intersectOnePx.whitePixelsMask2.length.should.eql(16);

        //scale first roi s.t. one pixel intersects
        let mask5 = mask2.scale({factor: 2});
        let intersectOnePxInverse = mask3.getIntersection(mask5);
        intersectOnePxInverse.commonWhitePixels.length.should.eql(1);
        intersectOnePxInverse.whitePixelsMask1.length.should.eql(4);
        intersectOnePxInverse.whitePixelsMask2.length.should.eql(16);

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
            {kind: 'GREY'}
        );
        let img2 = new Image(5, 5,
            [
                0, 0,   0,   0, 0,
                0, 255, 255, 0, 0,
                0, 255, 255, 0, 0,
                0, 0,   0,   0, 0,
                0, 0,   0,   0, 0
            ],
            {kind: 'GREY'}
        );

        //TODO find how to force parent

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
        intersectNull.commonWhitePixels.length.should.eql(4);
        intersectNull.whitePixelsMask1.length.should.eql(9);
        intersectNull.whitePixelsMask2.length.should.eql(4);


    });
});
