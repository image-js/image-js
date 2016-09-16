import {Image, load} from 'test/common';

/* Image to test:
11111
10001
10101
10001
11111
 */


describe('we check the internalMapID', function () {
    it('should yield the right internalMapIDe', function () {
        return load('BW5x5.png').then(function (img) {

            let roiManager = img.getROIManager();
            let mask = img.grey().mask(0.5, {invert:true});
            roiManager.fromMask(mask);

            let rois = roiManager.getROI();

            rois.sort(function (a,b) {
                return a.mask.sizes[0] - b.mask.sizes[0];
            });

            rois.should.be.an.instanceof(Array).and.lengthOf(3);
            rois[0].mask.sizes.should.eql([1, 1]);
            rois[1].mask.sizes.should.eql([3, 3]);
            rois[2].mask.sizes.should.eql([5, 5]);

            rois[0].internalIDs.should.eql([-2]);
            rois[1].internalIDs.should.eql([1, -2]);
            rois[2].internalIDs.should.eql([-1, 1, -2]);

        });
    });
});


describe('we check the internalMapID with complex image', function () {
    it('should yield the right internapMapIDs', function () {
        return load('BW15x15transparent.png').then(function (img) {

            let roiManager = img.getROIManager();
            let mask = img.grey().mask(0.5, {invert: true});
            roiManager.fromMask(mask);

            let rois = roiManager.getROI();

            rois.sort(function (a,b) {
                return a.internalIDs[0] - b.internalIDs[0];
            });

            rois.should.be.an.instanceof(Array).and.lengthOf(4);

            rois[0].mask.sizes.should.eql([13, 6]);
            rois[1].mask.sizes.should.eql([13, 6]);
            rois[2].mask.sizes.should.eql([15, 15]);
            rois[3].mask.sizes.should.eql([9, 2]);

            rois[0].internalIDs.should.eql([-2, 2]);
            rois[1].internalIDs.should.eql([-1]);
            rois[2].internalIDs.should.eql([1, -1, -2, 2]);
            rois[3].internalIDs.should.eql([2]);

        });
    });
});



