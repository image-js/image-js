import { Image } from 'test/common';

describe('floodFill', function () {
    it('should fill the binary image', function () {
        const image = new Image(8, 5, [
            0b00100000,
            0b00110000,
            0b00010000,
            0b00111000,
            0b11110000
        ], { kind: 'BINARY' });

        image.floodFill();

        const filled = new Image(8, 5, [
            0b11100000,
            0b11110000,
            0b11110000,
            0b11111000,
            0b11110000
        ], { kind: 'BINARY' });

        expect(image.data).toEqual(filled.data);
    });

    it('should fill the binary image (not in place)', function () {
        const image = new Image(8, 5, [
            0b00100000,
            0b00110000,
            0b00010000,
            0b00111000,
            0b11110000
        ], { kind: 'BINARY' });

        const result = image.floodFill({ inPlace: false });

        const filled = new Image(8, 5, [
            0b11000000,
            0b11000000,
            0b11100000,
            0b11000000,
            0b00000000
        ], { kind: 'BINARY' });

        expect(Array.from(result.data)).toEqual(Array.from(filled.data));
        expect(Array.from(image.data)).toEqual([
            0b00100000,
            0b00110000,
            0b00010000,
            0b00111000,
            0b11110000
        ]);
    });
});
