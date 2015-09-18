import {Image, load} from '../common';


describe('we check mask', function () {
    it('should yield the right mask size and value', function () {
        return load('BW5x5.png').then(function (img) {

            img.width.should.equal(5);
            img.height.should.equal(5);

            let roiManager=img.getROIManager();
            let mask=img.grey().mask();
            roiManager.putMask(mask);

            let rois=roiManager.getROI();

            rois.should.be.an.instanceof(Array).and.lengthOf(3);

/*
            console.log( rois[0].mask.sizes);
            console.log( rois[1].mask.sizes);
            console.log( rois[2].mask.sizes);
*/

            rois[2].mask.sizes.should.eql([3,3]);
            rois[1].mask.sizes.should.eql([5,5]);
            rois[0].mask.sizes.should.eql([1,1]);



            let roiMask=rois[0].mask;
            Array.from(roiMask.data).should.eql([128]);

            let roiFilledMask=rois[0].filledMask;
            Array.from(roiFilledMask.data).should.eql([128]);

            roiMask=rois[1].mask;
            Array.from(roiMask.data).should.eql([252, 99, 31, 128]);

            roiFilledMask=rois[1].filledMask;
            Array.from(roiFilledMask.data).should.eql([255, 255, 255, 128]);

            roiMask=rois[2].mask;
            Array.from(roiMask.data).should.eql([247, 128]);

            roiFilledMask=rois[2].filledMask;
            Array.from(roiFilledMask.data).should.eql([255, 128]);

        });
    });
});
