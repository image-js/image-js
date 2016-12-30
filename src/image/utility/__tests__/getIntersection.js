/**
 *
 */
import {Image} from 'test/common';
import getIntersection from '../getIntersection';

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

        //console.log('mask2: ' + mask2);
        //console.log('mask3: ' + mask3);

        //no intersection
        let intersectNull = getIntersection(mask2, mask3);
        intersectNull.commonWhitePixels.length.should.eql(0);
        intersectNull.whitePixelsMask1.length.should.eql(4);
        intersectNull.whitePixelsMask2.length.should.eql(4);

        //scale second roi s.t. one pixel intersects
        let mask4 = mask3.scale({factor: 2});
        let intersectOnePx = getIntersection(mask2, mask4);
        intersectOnePx.commonWhitePixels.length.should.eql(1);
        intersectOnePx.whitePixelsMask1.length.should.eql(4);
        intersectOnePx.whitePixelsMask2.length.should.eql(16);

        //scale first roi s.t. one pixel intersects
        let mask5 = mask2.scale({factor: 2});
        let intersectOnePxInverse = getIntersection(mask3, mask5);
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

        //let roiMap2 = roiManager2.getMap();
        //let related = roiManager1.findCorrespondingRoi(roiMap2);

       // let mask2 = rois[0].getMask();
        //let mask3 = rois[0].contourMask();
        let mask3 = rois1[0].getMask();
        let mask4 = rois2[0].getMask();


        //no intersection
        //console.log(getIntersection(mask3, mask4));
        let intersectNull = getIntersection(mask3, mask4);
        intersectNull.commonWhitePixels.length.should.eql(4);
        intersectNull.whitePixelsMask1.length.should.eql(9);
        intersectNull.whitePixelsMask2.length.should.eql(4);


    });
});
