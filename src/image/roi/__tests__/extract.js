import {Image, load} from 'test/common';


describe('we check that we can extract correctly a ROI', function () {
    it('should yield the right extract number of pixels', function () {
        return load('BW15x15.png').then(function (img) {

            img.width.should.equal(15);
            img.height.should.equal(15);

            let roiManager = img.getROIManager();
            let grey = img.grey();
            let mask = grey.mask({invert: true});
            roiManager.fromMask(mask);

            let rois = roiManager.getROI();

            rois.should.be.an.instanceof(Array).and.lengthOf(5);

            rois.sort(function (a,b) {
                return a.meanX - b.meanX;
            });

            rois[0].internalIDs.should.eql([-2,3,2]);

            let roiMask = rois[0].getMask();
            let extract = img.extract(roiMask);
            extract.countAlphaPixels({alpha: 0}).should.equal(27);
            extract.countAlphaPixels({alpha: 255}).should.equal(54);

            roiMask = rois[0].getMask({fill: true});
            extract = img.extract(roiMask);
            extract.countAlphaPixels({alpha: 0}).should.equal(1);
            extract.countAlphaPixels({alpha: 255}).should.equal(80);
        });
    });
});
