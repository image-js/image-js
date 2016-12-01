import {Image} from 'test/common';

describe('Image core - Binary images of 16 points', function () {

    let img = new Image(8, 2, {
        kind: 'BINARY'
    });

    it('check the size', function () {
        img.width.should.equal(8);
        img.height.should.equal(2);
        img.size.should.equal(16);
        img.data.length.should.equal(2);
    });

    it('check bit access', function () {
        img.getBit(0).should.equal(0);
        img.getBit(15).should.equal(0);
    });

    it('check bit access XY', function () {
        img.getBitXY(0, 0).should.equal(0);
        img.getBitXY(7, 1).should.equal(0);
    });

    it('set / clear bit', function () {
        img.setBit(0);
        img.setBit(15);
        img.getBit(0).should.equal(1);
        img.getBit(15).should.equal(1);
        img.clearBit(0);
        img.clearBit(15);
        img.getBit(0).should.equal(0);
        img.getBit(15).should.equal(0);
    });

    it('set XY / clear XY bit', function () {
        img.setBitXY(0, 0);
        img.setBitXY(7, 1);
        img.getBitXY(0, 0).should.equal(1);
        img.getBitXY(7, 1).should.equal(1);
        img.clearBitXY(0, 0);
        img.clearBitXY(7, 1);
        img.getBitXY(0, 0).should.equal(0);
        img.getBitXY(7, 1).should.equal(0);
    });

    it('toggle bit', function () {
        img.toggleBit(0);
        img.toggleBit(1);
        img.getBit(0).should.equal(1);
        img.getBit(1).should.equal(1);
        img.getBit(7).should.equal(0);
        img.toggleBit(0);
        img.toggleBit(1);
        img.getBit(0).should.equal(0);
        img.getBit(1).should.equal(0);
        img.getBit(7).should.equal(0);
    });

    it('toggle XY bit', function () {
        img.toggleBit(0, 0);
        img.toggleBit(4, 1);
        img.getBit(0, 0).should.equal(1);
        img.getBit(4, 1).should.equal(1);
        img.getBit(7, 1).should.equal(0);
        img.toggleBit(0, 0);
        img.toggleBit(4, 1);
        img.getBit(0, 0).should.equal(0);
        img.getBit(4, 1).should.equal(0);
        img.getBit(7, 1).should.equal(0);
    });

});
