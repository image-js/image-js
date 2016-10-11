import {Image} from 'test/common';

describe('get and set ', function () {
    it('should test getPixel, getPixelXY and setPixel, setPixelXY', function () {

        let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

        image.setPixel(0, [101, 102, 103, 104]);
        image.setPixelXY(1, 0, [201, 202, 203, 204]);
        image.setPixelXY(0, 1, [301, 302, 303, 304]);
        image.setPixel(3, [401, 402, 403, 404]);
        image.data.should.eql([101, 102, 103, 104, 201, 202, 203, 204, 301, 302, 303, 304, 401, 402, 403, 404]);

        image.getPixelXY(0, 0).should.eql([101, 102, 103, 104]);
        image.getPixel(1).should.eql([201, 202, 203, 204]);
        image.getPixel(2).should.eql([301, 302, 303, 304]);
        image.getPixelXY(1, 1).should.eql([401, 402, 403, 404]);
    });
});

