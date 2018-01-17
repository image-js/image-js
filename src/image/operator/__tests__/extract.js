import { Image, load, getHash } from 'test/common';
import 'should';

describe('we check we can extract a part of B/W image', function () {
    it('check the extract without specify position', function () {
        let mask = new Image(2, 2, {
            kind: 'BINARY'
        });
        mask.setBitXY(0, 0);
        mask.setBitXY(1, 1);

        return load('BW4x4.png').then(function (image) {
            (function () {
                image.extract(mask);
            }).should.throw(/can not extract an image/);

        });
    });

    it('check a binary image extract', function () {

        let image = new Image(8, 8,
            [
                0b00011000,
                0b00011000,
                0b00011000,
                0b11111111,
                0b11111111,
                0b00011000,
                0b00011000,
                0b00011000
            ],
            { kind: 'BINARY' }
        );

        let mask = new Image(4, 4,
            [
                0b11110000,
                0b11110000
            ], {
                kind: 'BINARY',
                parent: image,
                position: [2, 2]
            });

        let extract = image.extract(mask);
        extract.bitDepth.should.equal(1);
        extract.height.should.equal(4);
        extract.width.should.equal(4);
        Array.from(extract.data).should.eql(
            [
                0b01100000,
                0b11110000
            ]
        );
    });


    it('check a rectangular binary image extract', function () {

        let image = new Image(8, 4,
            [
                0b00011000,
                0b00011000,
                0b00011000,
                0b11111111
            ],
            { kind: 'BINARY' }
        );

        let mask = new Image(4, 2,
            [
                0b11110000
            ], {
                kind: 'BINARY',
                parent: image,
                position: [3, 2]
            });

        let extract = image.extract(mask);
        extract.bitDepth.should.equal(1);
        extract.height.should.equal(2);
        extract.width.should.equal(4);
        Array.from(extract.data).should.eql(
            [
                0b11000000
            ]
        );
    });

    it('check by specify 1,1 position with parent', function () {

        return load('BW4x4.png').then(function (image) {

            let mask = new Image(2, 2, {
                kind: 'BINARY',
                position: [1, 1],
                parent: image
            });

            mask.setBitXY(0, 0);
            mask.setBitXY(1, 0);

            let extract = image.extract(mask);
            getHash(image).should.equal(getHash(extract.parent));
            extract.width.should.equal(2);
            extract.height.should.equal(2);

            Array.from(extract.data).should.eql([
                0, 255,
                255, 255,
                255, 0,
                0, 0
            ]);

            /* This corresponds to an extract if it was RGBA image */
            /*
            Array.from(extract.data).should.eql([
                0, 0, 0, 255,
                255, 255, 255, 255,
                255, 255, 255, 0,
                255, 255, 255, 0
            ]);
            */
        });
    });
});
