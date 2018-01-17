import { Image } from 'test/common';
import 'should';

describe('findCorrespondingRoi', function () {
    it('should yield the correct object containing corresponding roi ids and pixels', function () {
        let img1 = new Image(5, 5,
            [
                0, 0,   0,   0,   0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 0,   0,   0,   0
            ],
            { kind: 'GREY' }
        );


        let img2 = new Image(5, 5,
            [
                0, 0,   0,   0,   0,
                0, 255, 0,   255, 0,
                0, 255, 0,   255, 0,
                0,  0,  0,   255, 0,
                0,  0,  0,   0,   0
            ],
            { kind: 'GREY' }
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

        let related = roiManager1.findCorrespondingRoi(roiMap2);
        Array.from(related[0].id).should.eql([1, -1, 2]);
        Array.from(related[0].surface).should.eql([2, 4, 3]);
        Array.from(related[0].roiSurfaceCovered).should.eql([(2 / 9), (4 / 9), (3 / 9)]);
        related[0].same.should.eql(5);
        related[0].opposite.should.eql(4);
        related[0].total.should.eql(9);
        Array.from(related[1].id).should.eql([-1]);
        Array.from(related[1].surface).should.eql([16]);
        Array.from(related[1].roiSurfaceCovered).should.eql([1]);
        related[1].same.should.eql(16);
        related[1].opposite.should.eql(0);
        related[1].total.should.eql(16);


    });
    it('should yield the correct object containing corresponding roi ids and pixels (switch imgs from prev test)', function () {
        let img1 = new Image(5, 5,
            [
                0, 0,   0,   0,   0,
                0, 255, 0,   255, 0,
                0, 255, 0,   255, 0,
                0,  0,  0,   255, 0,
                0,  0,  0,   0,   0
            ],
            { kind: 'GREY' }
        );

        let img2 = new Image(5, 5,
            [
                0, 0,   0,   0,   0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 0,   0,   0,   0
            ],
            { kind: 'GREY' }
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

        let related = roiManager1.findCorrespondingRoi(roiMap2);
        Array.from(related[0].id).should.eql([1]);
        Array.from(related[0].surface).should.eql([2]);
        Array.from(related[0].roiSurfaceCovered).should.eql([1]);
        related[0].same.should.eql(2);
        related[0].opposite.should.eql(0);
        related[0].total.should.eql(2);
        Array.from(related[1].id).should.eql([1]);
        Array.from(related[1].surface).should.eql([3]);
        Array.from(related[1].roiSurfaceCovered).should.eql([1]);
        related[1].same.should.eql(3);
        related[1].opposite.should.eql(0);
        related[1].total.should.eql(3);
        Array.from(related[2].id).should.eql([-1, 1]);
        Array.from(related[2].surface).should.eql([16, 4]);
        Array.from(related[2].roiSurfaceCovered).should.eql([(16 / 20), (4 / 20)]);
        related[2].same.should.eql(16);
        related[2].opposite.should.eql(4);
        related[2].total.should.eql(20);

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
            { kind: 'GREY' }
        );


        let img2 = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0
            ],
            { kind: 'GREY' }
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

        let related = roiManager1.findCorrespondingRoi(roiMap2);
        Array.from(related[0].id).should.eql([-1]);
        Array.from(related[0].surface).should.eql([9]);
        Array.from(related[0].roiSurfaceCovered).should.eql([1]);
        related[0].same.should.eql(0);
        related[0].opposite.should.eql(9);
        related[0].total.should.eql(9);
        Array.from(related[1].id).should.eql([-1]);
        Array.from(related[1].surface).should.eql([16]);
        Array.from(related[1].roiSurfaceCovered).should.eql([1]);
        related[1].same.should.eql(16);
        related[1].opposite.should.eql(0);
        related[1].total.should.eql(16);

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
            { kind: 'GREY' }
        );


        let img2 = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0
            ],
            { kind: 'GREY' }
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

        let related = roiManager1.findCorrespondingRoi(roiMap2);
        Array.from(related[0].id).should.eql([-1]);
        Array.from(related[0].surface).should.eql([25]);
        Array.from(related[0].roiSurfaceCovered).should.eql([1]);

    });
});
