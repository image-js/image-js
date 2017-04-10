import {Image} from 'test/common';

describe.only('check moment', function () {
    it('should yield the correct moment', function () {

        const image = new Image(8, 2, [
            0b10000011,
            0b10000000,
        ], {kind: 'BINARY'});

        image.getMoment().should.equal(4);
        image.getMoment(0,0).should.equal(4);
        image.getMoment(1,0).should.equal(16);
        image.getMoment(0,1).should.equal(3);
        image.getMoment(1,1).should.equal(3);
    });
});

