import {Image} from 'test/common';
import {validateChannel} from '../channel';
import 'should';

describe('we check the validateChannel method', function () {
    it('check for a RGB image', function () {
        let image = new Image(2, 2, {
            kind: 'RGB'
        });

        validateChannel(image, 'r').should.equal(0);
        validateChannel(image, 'g').should.equal(1);
        validateChannel(image, 'b').should.equal(2);
        (function () {
            validateChannel(image, 'a');
        }).should.throw(/does not contain alpha/);
        (function () {
            validateChannel(image);
        }).should.throw(/the channel has to be/);
        (function () {
            validateChannel(image, 3, false);
        }).should.throw(/the channel has to be/);
    });

    it('check for a RGBA image', function () {
        let image = new Image(2, 2, {
            kind: 'RGBA'
        });

        validateChannel(image, 'r').should.equal(0);
        validateChannel(image, 'g').should.equal(1);
        validateChannel(image, 'b').should.equal(2);
        validateChannel(image, 'a').should.equal(3);
        (function () {
            validateChannel(image);
        }).should.throw(/the channel has to be/);
        (function () {
            validateChannel(image, 3, false);
        }).should.throw(/alpha channel may not be/);
    });

    it('check for a GreyA image', function () {
        let image = new Image(2, 2, {
            kind: 'GREYA'
        });

        validateChannel(image, 0).should.equal(0);
        validateChannel(image, 1).should.equal(1);
        validateChannel(image, 'a').should.equal(1);
        validateChannel(image, 'a', true).should.equal(1);
        (function () {
            validateChannel(image, 'r');
        }).should.throw(/undefined channel/);
        (function () {
            validateChannel(image, 1, false);
        }).should.throw(/alpha channel may not/);
        (function () {
            validateChannel(image, 'a', false);
        }).should.throw(/alpha channel may not/);
    });

});

