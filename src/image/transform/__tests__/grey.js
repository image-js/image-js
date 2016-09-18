import {Image} from 'test/common';

describe('Grey transform', function () {
    it('From RGBA image give a grey image', function () {
        let image = new Image(2, 1,
            [
                100, 150, 200, 255,
                100, 150, 200, 0
            ]
        );

        Array.from(image.grey().data).should.eql([142, 0]);
        Array.from(image.grey({algorithm: 'min'}).data).should.eql([100, 0]);
        Array.from(image.grey({algorithm: 'minimum'}).data).should.eql([100, 0]);
        Array.from(image.grey({algorithm: 'max'}).data).should.eql([200, 0]);
        Array.from(image.grey({algorithm: 'maximum'}).data).should.eql([200, 0]);
        Array.from(image.grey({algorithm: 'brightness'}).data).should.eql([200, 0]);
        Array.from(image.grey({algorithm: 'red'}).data).should.eql([100, 0]);
        Array.from(image.grey({algorithm: 'green'}).data).should.eql([150, 0]);
        Array.from(image.grey({algorithm: 'blue'}).data).should.eql([200, 0]);
        Array.from(image.grey({algorithm: 'magenta'}).data).should.eql([63, 0]);
        Array.from(image.grey({algorithm: 'cyan'}).data).should.eql([127, 0]);
        Array.from(image.grey({algorithm: 'yellow'}).data).should.eql([0, 0]);
        Array.from(image.grey({algorithm: 'black'}).data).should.eql([55, 0]);
        Array.from(image.grey({algorithm: 'hue'}).data).should.eql([148, 0]);
        Array.from(image.grey({algorithm: 'saturation'}).data).should.eql([128, 0]);
        Array.from(image.grey({algorithm: 'lightness'}).data).should.eql([150, 0]);
        Array.from(image.grey({algorithm: 'luminosity'}).data).should.eql([150, 0]);
        Array.from(image.grey({algorithm: 'luminance'}).data).should.eql([150, 0]);

        Array.from(image.grey({keepAlpha: true}).data).should.eql(
            [
                142, 255,
                142, 0
            ]
        );

        Array.from(image.grey({mergeAlpha: true}).data).should.eql(
            [
                142,
                0
            ]
        );



        Array.from(image.grey({algorithm: 'average', keepAlpha: true}).data).should.eql(
            [
                150, 255,
                150, 0
            ]
        );

        Array.from(image.grey({algorithm: 'maximum', keepAlpha: true}).data).should.eql(
            [
                200, 255,
                200, 0
            ]
        );

        Array.from(image.grey({algorithm: 'minmax', keepAlpha: true}).data).should.eql(
            [
                150, 255,
                150, 0
            ]
        );

        Array.from(image.grey({algorithm: 'luma601', keepAlpha: true}).data).should.eql(
            [
                140, 255,
                140, 0
            ]
        );

        Array.from(image.grey({algorithm: 'luma709', keepAlpha: true}).data).should.eql(
            [
                142, 255,
                142, 0
            ]
        );

        (function () {
            image.grey({algorithm: 'XXX'}).should.throw(/Unsupported grey algorithm/);
        });

    });


    it('From GreyA image throw an error except if allowed', function () {
        let image = new Image(2, 1,
            [
                100, 255,
                150, 0
            ],
            {kind: 'GREYA'}
        );
        (function () {
            image.grey().should.throw(/only be applied/);
        });

        Array.from(image.grey({allowGrey: true}).data).should.eql([100, 0]);
        Array.from(image.grey({allowGrey: true, mergeAlpha: false}).data).should.eql([100, 150]);

        Array.from(image.grey({allowGrey: true, keepAlpha: true}).data).should.eql(
            [
                100, 255,
                150, 0
            ]
        );


    });


});
