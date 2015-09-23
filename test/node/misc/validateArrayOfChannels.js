import {Image} from '../common';
import validateArrayOfChannels from '../../../src/image/misc/validateArrayOfChannels';

describe('we check the validateArrayOfChannels method', function () {
    it('check for a RGB image', function () {
        let image=new Image(2,2,{
            kind: 'RGB'
        });

        validateArrayOfChannels(image, {
            channels: ['r','g','b']}).should.eql([0,1,2]);
        validateArrayOfChannels(image, {channels: 'r'}).should.eql([0]);
        validateArrayOfChannels(image, {channels: 'b'}).should.eql([2]);
        validateArrayOfChannels(image, {channels: 1}).should.eql([1]);
        validateArrayOfChannels(image, {channels: [0,1,2]}).should.eql([0,1,2]);
        validateArrayOfChannels(image).should.eql([0,1,2]);
        validateArrayOfChannels(image, {allowAlpha: true}).should.eql([0,1,2]);
        validateArrayOfChannels(image, {allowAlpha: false}).should.eql([0,1,2]);
        validateArrayOfChannels(image, {defaultAlpha: true}).should.eql([0,1,2]);
        (function() {
            validateArrayOfChannels(image, {channels: 'a'});
        }).should.throw(/does not contain alpha/);
        (function() {
            validateArrayOfChannels(image, {channels: ['r','a']});
        }).should.throw(/does not contain alpha/);
    });

    it('check for a RGBA image', function () {
        let image=new Image(2,2,{
            kind: 'RGBA'
        });

        validateArrayOfChannels(image, {channels: ['r','g','b']}).should.eql([0,1,2]);
        validateArrayOfChannels(image, {channels: 'r'}).should.eql([0]);
        validateArrayOfChannels(image, {channels: 'b'}).should.eql([2]);
        validateArrayOfChannels(image, {channels: 1}).should.eql([1]);
        validateArrayOfChannels(image, {channels: [0,1,2]}).should.eql([0,1,2]);
        validateArrayOfChannels(image).should.eql([0,1,2]);
        validateArrayOfChannels(image, {defaultAlpha: true}).should.eql([0,1,2,3]);
        validateArrayOfChannels(image, {defaultAlpha: false}).should.eql([0,1,2]);
        validateArrayOfChannels(image, {allowAlpha: true, defaultAlpha: false}).should.eql([0,1,2]);
        validateArrayOfChannels(image, {allowAlpha: true, defaultAlpha: true}).should.eql([0,1,2,3]);
        validateArrayOfChannels(image, {channels: 'a'}).should.eql([3]);
        validateArrayOfChannels(image, {channels: ['r','a']}).should.eql([0,3]);
        (function() {
            validateArrayOfChannels(image, {channels: 'a', allowAlpha: false});
        }).should.throw(/alpha channel may not be selected/);
    });

    it('check for a GreyA image', function () {
        let image=new Image(2,2,{
            kind: 'GREYA'
        });

        validateArrayOfChannels(image, {channels: 'a'}).should.eql([1]);
        validateArrayOfChannels(image, {channels: 1}).should.eql([1]);
        validateArrayOfChannels(image).should.eql([0]);
        validateArrayOfChannels(image, {defaultAlpha: true}).should.eql([0,1]);
        validateArrayOfChannels(image, {defaultAlpha:  false}).should.eql([0]);
        (function() {
            validateArrayOfChannels(image, {channels: ['r']});
        }).should.throw(/not a RGB/);
        (function() {
            validateArrayOfChannels(image, {allowAlpha: false, channels: ['a']});
        }).should.throw(/alpha channel may not be selected/);
    });

});



