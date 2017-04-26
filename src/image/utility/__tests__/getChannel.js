import {Image} from 'test/common';
import 'should';

describe('get a specific channel from an image', function () {

    it('should check channels from a RGBA image', function () {
        let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);

        let red = image.getChannel('r');
        let green = image.getChannel(1);
        let blue = image.getChannel(2);
        let alpha = image.getChannel('a');


        red.components.should.equal(1);
        red.channels.should.equal(1);
        red.bitDepth.should.equal(8);
        Array.from(red.data).should.eql([230, 100]);

        green.components.should.equal(1);
        green.channels.should.equal(1);
        green.bitDepth.should.equal(8);
        Array.from(green.data).should.eql([83, 140]);

        blue.components.should.equal(1);
        blue.channels.should.equal(1);
        blue.bitDepth.should.equal(8);
        Array.from(blue.data).should.eql([120, 13]);

        alpha.components.should.equal(1);
        alpha.channels.should.equal(1);
        alpha.bitDepth.should.equal(8);
        Array.from(alpha.data).should.eql([255, 240]);

    });

    it('should check channels from a RGBA image with join alpha', function () {
        let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 0]);

        let red = image.getChannel('r', {
            mergeAlpha: true
        });

        red.components.should.equal(1);
        red.alpha.should.be.equal(0);
        red.channels.should.equal(1);
        red.bitDepth.should.equal(8);
        Array.from(red.data).should.eql([230, 0]);
    });

    it('should check channels from a RGBA image with keep alpha', function () {
        let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 0]);

        let red = image.getChannel('r', {
            keepAlpha: true
        });

        red.channels.should.equal(2);
        red.alpha.should.be.equal(1);
        red.components.should.equal(1);
        red.bitDepth.should.equal(8);
        Array.from(red.data).should.eql([230, 255, 100, 0]);
    });

});

