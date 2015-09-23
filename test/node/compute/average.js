import {Image} from '../common';

describe('check sum', function () {
    it('should yield the correct array', function () {

        let image = new Image(1,2,[230, 84, 121, 255, 100, 140, 13, 1]);

        image.average.should.eql([165,112,67,128]);
        image.getAverage().should.eql([165,112,67,128]);
    });
});

