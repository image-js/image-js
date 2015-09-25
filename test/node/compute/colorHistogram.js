import {Image} from '../common';

describe('calculate the colorHistogram', function () {
    it('check getColorHistogram method', function () {

        let image = new Image(1,2,[0, 0, 0, 255, 255, 255, 255, 255]);

        let histogram = image.getColorHistogram({useAlpha: false, nbSlots: 8});
        Array.from(histogram).should.eql([1,0,0,0,0,0,0,1]);

        histogram = image.getColorHistogram({useAlpha: true, nbSlots: 8});
        Array.from(histogram).should.eql([1,0,0,0,0,0,0,1]);
    });

    it('check getColorHistogram method with transparency', function () {

        let image = new Image(1,2,[0, 0, 0, 255, 255, 255, 255, 0]);

        let histogram = image.getColorHistogram({useAlpha: false, nbSlots: 8});
        Array.from(histogram).should.eql([1,0,0,0,0,0,0,1]);

        histogram = image.getColorHistogram({useAlpha: true, nbSlots: 8});
        Array.from(histogram).should.eql([1,0,0,0,0,0,0,0]);
    });

    it('check getColorHistogram property with transparency', function () {

        let image = new Image(1,4,[0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 255, 255, 255, 255, 255]);

        let histogram = image.colorHistogram;
        Array.from(histogram).length.should.equal(512);
        Array.from(histogram)[0].should.equal(2);
        Array.from(histogram)[511].should.equal(1);

    });

});

