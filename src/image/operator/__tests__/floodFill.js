import {Image} from 'test/common';
import 'should';

describe('floodFill', function () {
    it('should fill the binary image', function () {
        const image = new Image(8, 5, [
            0b00100000,
            0b00110000,
            0b00010000,
            0b00111000,
            0b11110000
        ], {kind: 'BINARY'});

        image.floodFill();

        const filled = new Image(8, 5, [
            0b11100000,
            0b11110000,
            0b11110000,
            0b11111000,
            0b11110000
        ], {kind: 'BINARY'});

        image.data.should.eql(filled.data);
    });

    it('should fill the binary image (not in place)', function () {
        const image = new Image(8, 5, [
            0b00100000,
            0b00110000,
            0b00010000,
            0b00111000,
            0b11110000
        ], {kind: 'BINARY'});

        const result = image.floodFill({inPlace: false});

        const filled = new Image(8, 5, [
            0b11000000,
            0b11000000,
            0b11100000,
            0b11000000,
            0b00000000
        ], {kind: 'BINARY'});

        Array.from(result.data).should.eql(Array.from(filled.data));
        Array.from(image.data).should.eql([
            0b00100000,
            0b00110000,
            0b00010000,
            0b00111000,
            0b11110000
        ]);
    });
});
