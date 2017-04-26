import {Image} from 'test/common';
import 'should';

describe('check sum', function () {
    it('should yield the correct array', function () {

        let image = new Image(1, 2, [230, 84, 121, 255, 100, 140, 13, 255]);
        image.mean.should.eql([165, 112, 67]);
        image.getMean().should.eql([165, 112, 67]);

        image = new Image(1, 2, [230, 84, 121, 255, 100, 140, 13, 0]);
        image.mean.should.eql([230, 84, 121]);
        image.getMean().should.eql([230, 84, 121]);
    });
});

