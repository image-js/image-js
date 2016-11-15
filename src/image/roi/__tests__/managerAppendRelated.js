/**
 * Created by zoebaraschi on 10.11.16.
 */
import {Image} from 'test/common';

describe('appendRelated', function () {
    it('should yield the correct object containing corresponding roi ids and pixels', function () {
        let img1 = new Image(5, 5,
            [
                0, 0,   0,   0,   0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 0,   0,   0,   0
            ],
            {kind: 'GREY'}
        );


        let img2 = new Image(5, 5,
            [
                0, 0,   0,   0,   0,
                0, 255, 0,   255, 0,
                0, 255, 0,   255, 0,
                0,  0,  0,   255, 0,
                0,  0,  0,   0,   0
            ],
            {kind: 'GREY'}
        );


        img1.width.should.equal(5);
        img1.height.should.equal(5);
        img2.width.should.equal(5);
        img2.height.should.equal(5);

        let roiManager1 = img1.getRoiManager();
        let mask1 = img1.mask();
        roiManager1.fromMask(mask1);

        let roiManager2 = img2.getRoiManager();
        let mask2 = img2.mask();
        roiManager2.fromMask(mask2);

        let roiMap2 = roiManager2.getMap();

        let related = roiManager1.appendRelated(roiMap2);
        Array.from(related.related[0].id).should.eql([1, -1, 2]);
        Array.from(related.related[0].pixels).should.eql([2, 4, 3]);
        Array.from(related.related[1].id).should.eql([-1]);
        Array.from(related.related[1].pixels).should.eql([16]);

    });

    it('should yield the correct object containing 2 elements with same roi ids and different number of pixels (covering entire image)', function () {
        let img1 = new Image(5, 5,
            [
                0, 0,   0,   0,   0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 0,   0,   0,   0
            ],
            {kind: 'GREY'}
        );


        let img2 = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0
            ],
            {kind: 'GREY'}
        );


        img1.width.should.equal(5);
        img1.height.should.equal(5);
        img2.width.should.equal(5);
        img2.height.should.equal(5);

        let roiManager1 = img1.getRoiManager();
        let mask1 = img1.mask();
        roiManager1.fromMask(mask1);

        let roiManager2 = img2.getRoiManager();
        let mask2 = img2.mask();
        roiManager2.fromMask(mask2);

        let roiMap2 = roiManager2.getMap();

        let related = roiManager1.appendRelated(roiMap2);
        Array.from(related.related[0].id).should.eql([-1]);
        Array.from(related.related[0].pixels).should.eql([9]);
        Array.from(related.related[1].id).should.eql([-1]);
        Array.from(related.related[1].pixels).should.eql([16]);

    });

    it('should yield the correct object containing 1 element with one roi id and al of pixels (covering entire image)', function () {
        let img1 = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0
            ],
            {kind: 'GREY'}
        );


        let img2 = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0
            ],
            {kind: 'GREY'}
        );


        img1.width.should.equal(5);
        img1.height.should.equal(5);
        img2.width.should.equal(5);
        img2.height.should.equal(5);

        let roiManager1 = img1.getRoiManager();
        let mask1 = img1.mask();
        roiManager1.fromMask(mask1);

        let roiManager2 = img2.getRoiManager();
        let mask2 = img2.mask();
        roiManager2.fromMask(mask2);

        let roiMap2 = roiManager2.getMap();

        let related = roiManager1.appendRelated(roiMap2);
        Array.from(related.related[0].id).should.eql([-1]);
        Array.from(related.related[0].pixels).should.eql([25]);
    });
});
