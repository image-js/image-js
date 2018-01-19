import { Image } from 'test/common';

describe('we check getPixelsGrid', function () {
    it('should yield the right array of pixels', function () {

        let size = 6;
        let data = new Array(size * size);
        for (let i = 0; i < data.length; i++) {
            data[i] = i;
        }
        let image = new Image(size, size, data, { kind: 'GREY' });

        image.getPixelsGrid({
            sampling: [2, 2],
            painted: true
        });

    });

    it('should yield the right array of pixels in presence of a mask', function () {

        let size = 6;
        let data = new Array(size * size);
        for (let i = 0; i < data.length; i++) {
            data[i] = i;
        }
        let image = new Image(size, size, data, { kind: 'GREY' });
        let maskData = [
            0b00000001,
            0b00100000,
            0b00000000,
            0b00000000,
            0b00000000
        ];

        let mask = new Image(size, size, maskData, { kind: 'BINARY' });
        let pixels = image.getPixelsGrid({
            sampling: [2, 2],
            painted: false,
            mask: mask
        });

        expect(pixels.xyS).toEqual([[1, 1], [4, 1]]);
        expect(pixels.zS).toEqual([[7], [10]]);
        expect(typeof pixels.painted).toBe('undefined');


    });
});

