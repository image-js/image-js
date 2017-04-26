import {Image} from 'test/common';
import 'should';

describe('check min / max', function () {
    it('should yield the correct arrays', function () {

        let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 1]);

        image.min.should.eql([100, 83, 13, 1]);
        image.max.should.eql([230, 140, 120, 255]);
        image.getMin().should.eql([100, 83, 13, 1]);
        image.getMax().should.eql([230, 140, 120, 255]);
    });
});

