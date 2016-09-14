import {Image} from 'test/common';

describe('Grey transform', function () {
    it('From RGBA image give a grey image', function () {
        let image = new Image(2, 1,
            [
                100, 150, 200, 255,
                100, 150, 200, 0
            ]
        );

        Array.from(image.grey().data).should.eql(
            [
                143, 255,
                143, 0
            ]
        );

        Array.from(image.grey({algorithm: 'average'}).data).should.eql(
            [
                150, 255,
                150, 0
            ]
        );

        Array.from(image.grey({algorithm: 'maximum'}).data).should.eql(
            [
                200, 255,
                200, 0
            ]
        );

        Array.from(image.grey({algorithm: 'minmax'}).data).should.eql(
            [
                150, 255,
                150, 0
            ]
        );

        Array.from(image.grey({algorithm: 'luma601'}).data).should.eql(
            [
                141, 255,
                141, 0
            ]
        );

        Array.from(image.grey({algorithm: 'luma709'}).data).should.eql(
            [
                143, 255,
                143, 0
            ]
        );

        (function () {
            image.grey({algorithm: 'XXX'}).should.throw(/Unsupported grey algorithm/);
        });

    });


    it('From GreyA image give a copy image', function () {
        let image = new Image(2, 1,
            [
                100, 255,
                100, 0
            ],
            {kind: 'GREYA'}
        );

        Array.from(image.grey().data).should.eql(
            [
                100, 255,
                100, 0
            ]
        );
    });


});
