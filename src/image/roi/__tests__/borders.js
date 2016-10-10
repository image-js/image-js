import {Image} from 'test/common';

/* Image to test:
0011
1111
1100
0000
 */



describe('we check that each Roi is surrounded by the expected zones', function () {
    let data = new Uint8Array(2);
    data[0] = 0b00111111;
    data[1] = 0b11000000;

    /*
         . . x x  -1 -1 +1 +1
         x x x x  +1 +1 +1 +1
         x x . .  +1 +1 -2 -2
         . . . .  -2 -2 -2 -2
     */

    let mask = new Image(4,4, data, {
        kind: 'BINARY'
    });

    let roiManager = mask.getRoiManager();
    roiManager.fromMask(mask);

    it('should yield the right boxIDs', function () {
        let result = roiManager.getROI();
        result.should.have.lengthOf(3);

        result.sort(function (a,b) {
            return b.boxIDs[0] - a.boxIDs[0];
        });

        result[0].boxIDs.should.eql([1]);
        result[1].boxIDs.should.eql([1]);
        result[2].boxIDs.should.eql([-1,-2]);
    });

    it('should yield the right borderIDs', function () {
        let result = roiManager.getROI();

        result.sort(function (a,b) {
            return b.borderIDs[0] - a.borderIDs[0];
        });

        result[0].borderIDs.should.eql([1]); // -1
        result[1].borderIDs.should.eql([1]); // -2
        result[2].borderIDs.should.eql([-1,-2]); // +1

        result[0].borderLengths.should.eql([3]);
        result[1].borderLengths.should.eql([4]);
        result[2].borderLengths.should.eql([2,4]);
    });

    it('should yield the right borderIDs', function () {
        let result = roiManager.getROI();

        result.sort(function (a,b) {
            return b.borderIDs[0] - a.borderIDs[0];
        });

        result[0].externalIDs.should.eql([1]); // -1
        result[1].externalIDs.should.eql([1]); // -2
        result[2].externalIDs.should.eql([-1,-2]); // +1

        result[0].externalLengths.should.eql([3]);
        result[1].externalLengths.should.eql([4]);
        result[2].externalLengths.should.eql([2,4]);
    });


});
