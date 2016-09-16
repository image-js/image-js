import {Image} from 'test/common';


describe('we check contour', function () {
    it('should yield the right contour size and value', function () {

        let img = new Image(5,5,
            [
                0, 0,   0,   0,   0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 0,   0,   0,   0
            ],
            {kind: 'GREY'}
        );

        img.width.should.equal(5);
        img.height.should.equal(5);

        let roiManager = img.getROIManager();
        let mask = img.mask({invert:true});
        roiManager.fromMask(mask);

        let rois = roiManager.getROI();
        rois.should.be.an.instanceof(Array).and.lengthOf(2);

        rois.sort(function (a,b) {
            return a.surface - b.surface;
        });

        rois[0].surface.should.equal(9);
        rois[1].surface.should.equal(16);


        let roiMask = rois[0].mask;
        Array.from(roiMask.data).should.eql([255,128]);

        let roiFilledMask = rois[0].filledMask;
        Array.from(roiFilledMask.data).should.eql([255,128]);

        let roiContour = rois[0].contour;
        Array.from(roiContour.data).should.eql([247,128]);

        roiMask = rois[1].mask;
        Array.from(roiMask.data).should.eql([ 252, 99, 31, 128 ]);

        roiFilledMask = rois[1].filledMask;
        Array.from(roiFilledMask.data).should.eql([255, 255, 255, 128]);

        roiContour = rois[1].contour;
        Array.from(roiContour.data).should.eql([ 252, 99, 31, 128 ]);
    });
});
