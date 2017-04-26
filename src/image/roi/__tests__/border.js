import {load} from 'test/common';
import 'should';

/* Image to test:
0011
1111
1100
0000
 */
describe('we check that each Roi is surrounded by the expected border', function () {
    it('should yield the right contours size', function () {
        return load('BW11x11.png').then(function (img) {

            img.width.should.equal(11);
            img.height.should.equal(11);

            let roiManager = img.getRoiManager();
            let mask = img.grey().mask({invert: true});
            roiManager.fromMask(mask);

            let rois = roiManager.getRois();

            rois.sort((a, b) => a.border - b.border);

            rois.should.be.an.instanceof(Array).and.lengthOf(4);


            rois[0].should.containDeep({externalIDs: [-1], surface: 1, external: 1, box: 1, border: 1});
            rois[1].should.containDeep({externalIDs: [1], surface: 9, external: 8, box: 8, border: 8});
            rois[2].should.containDeep({externalIDs: [2], surface: 39, external: 39, box: 39, border: 39});
            rois[3].should.containDeep({externalIDs: [-1], surface: 72, external: 32, box: 32, border: 44});
        });
    });
});
