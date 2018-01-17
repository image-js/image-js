import { Image } from 'test/common';
import 'should';

describe('combine specific channels from an image', function () {

    it('should check channels from a RGBA image', function () {
        let image = new Image(1, 2, [10, 20, 30, 255, 100, 110, 120, 0]);

        let combined = image.combineChannels(function (pixel) {
            return (pixel[0] + pixel[1] + pixel[2]) / 3;
        });

        combined.components.should.equal(1);
        combined.channels.should.equal(1);
        combined.bitDepth.should.equal(8);
        Array.from(combined.data).should.eql([20, 110]);

    });

    it('should check channels from a RGBA image with join alpha', function () {
        let image = new Image(1, 2, [10, 20, 30, 255, 100, 110, 120, 0]);

        let combined = image.combineChannels(function (pixel) {
            return (pixel[0] + pixel[1] + pixel[2]) / 3;
        }, {
            mergeAlpha: true
        });

        combined.components.should.equal(1);
        combined.alpha.should.be.equal(0);
        combined.channels.should.equal(1);
        combined.bitDepth.should.equal(8);
        Array.from(combined.data).should.eql([20, 0]);
    });

    it('should check channels from a RGBA image with keep alpha', function () {
        let image = new Image(1, 2, [10, 20, 30, 255, 100, 110, 120, 0]);

        let combined = image.combineChannels(function (pixel) {
            return (pixel[0] + pixel[1] + pixel[2]) / 3;
        }, {
            keepAlpha: true
        });

        combined.channels.should.equal(2);
        combined.alpha.should.be.equal(1);
        combined.components.should.equal(1);
        combined.bitDepth.should.equal(8);
        Array.from(combined.data).should.eql([20, 255, 110, 0]);
    });

});
