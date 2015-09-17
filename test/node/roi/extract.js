import {Image, load} from '../common';


describe('we check that we can extract correctly a ROI', function () {
    it('should yield the right extract number of pixels', function () {
        return load('BW15x15.png').then(function (img) {

            img.width.should.equal(15);
            img.height.should.equal(15);

            let roiManager=img.getROIManager();
            let grey=img.grey();
            let mask=grey.mask();
            roiManager.putMask(mask);

            let rois=roiManager.getROI();

            rois.should.be.an.instanceof(Array).and.lengthOf(5);

            rois[0].internalMapIDs.should.eql([-2,3,2]);

            let extract=rois[0].extract(img);
            extract.countPixels({alpha: 0}).should.equal(27);
            extract.countPixels({alpha: 255}).should.equal(54);

            extract=rois[0].extract(img, {fill: true});
            extract.countPixels({alpha: 0}).should.equal(1);
            extract.countPixels({alpha: 255}).should.equal(80);
        });
    });
});
