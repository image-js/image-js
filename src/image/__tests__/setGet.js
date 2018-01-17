import { Image } from 'test/common';
import 'should';

describe('get and set ', function () {
    it('should test getPixel, getPixelXY and setPixel, setPixelXY', function () {
        let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        image.getPixelXY(0, 0).should.eql([1, 2, 3, 4]);
        image.getPixel(1).should.eql([5, 6, 7, 8]);
        image.getPixel(2).should.eql([9, 10, 11, 12]);
        image.getPixelXY(1, 1).should.eql([13, 14, 15, 16]);

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

    it('should test getValueXY', function () {
        let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        image.getValueXY(0, 0, 0).should.equal(1);
        image.getValueXY(0, 0, 1).should.equal(2);
        image.getValueXY(0, 0, 2).should.equal(3);
        image.getValueXY(0, 0, 3).should.equal(4);
        image.getValueXY(1, 0, 0).should.equal(5);
        image.getValueXY(0, 1, 0).should.equal(9);
    });

    it('should test setValueXY', function () {
        let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        image.setValueXY(0, 0, 0, 100);
        image.setValueXY(0, 0, 1, 200);
        image.setValueXY(0, 0, 2, 300);
        image.setValueXY(0, 0, 3, 400);
        image.setValueXY(1, 0, 0, 500);
        image.setValueXY(0, 1, 0, 600);
        image.data.should.eql([100, 200, 300, 400, 500, 6, 7, 8, 600, 10, 11, 12, 13, 14, 15, 16]);
    });

    it('should test getValue', function () {
        let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        image.getValue(0, 0).should.equal(1);
        image.getValue(0, 1).should.equal(2);
        image.getValue(0, 2).should.equal(3);
        image.getValue(0, 3).should.equal(4);
        image.getValue(1, 0).should.equal(5);
        image.getValue(2, 0).should.equal(9);
        image.getValue(3, 2).should.equal(15);
    });

    it('should test setValue', function () {
        let image = new Image(2, 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        image.setValue(0, 0, 100);
        image.setValue(0, 1, 200);
        image.setValue(0, 2, 300);
        image.setValue(0, 3, 400);
        image.setValue(1, 0, 500);
        image.setValue(2, 0, 600);
        image.data.should.eql([100, 200, 300, 400, 500, 6, 7, 8, 600, 10, 11, 12, 13, 14, 15, 16]);
    });
});

