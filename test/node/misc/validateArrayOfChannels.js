import {Image} from '../common';
import validateArrayOfChannels from '../../../src/misc/validateArrayOfChannels';

describe('we check the validateArrayOfChannels method', function () {
    it('check for a RGB image', function () {
        let image=new Image(2,2,{
            kind: 'RGB'
        });

        validateArrayOfChannels(image, ['r','g','b']).should.eql([0,1,2]);
        validateArrayOfChannels(image, 'r').should.eql([0]);
        validateArrayOfChannels(image, 'b').should.eql([2]);
        validateArrayOfChannels(image, 1).should.eql([1]);
        validateArrayOfChannels(image, [0,1,2]).should.eql([0,1,2]);
        validateArrayOfChannels(image).should.eql([0,1,2]);
        validateArrayOfChannels(image, true).should.eql([0,1,2]);
        validateArrayOfChannels(image, false).should.eql([0,1,2]);
        validateArrayOfChannels(image, undefined, true).should.eql([0,1,2]);
        (function() {
            validateArrayOfChannels(image, 'a');
        }).should.throw(/does not contain alpha/);
        (function() {
            validateArrayOfChannels(image, ['r','a']);
        }).should.throw(/does not contain alpha/);
    });

    it('check for a RGBA image', function () {
        let image=new Image(2,2,{
            kind: 'RGBA'
        });

        validateArrayOfChannels(image, ['r','g','b']).should.eql([0,1,2]);
        validateArrayOfChannels(image, 'r').should.eql([0]);
        validateArrayOfChannels(image, 'b').should.eql([2]);
        validateArrayOfChannels(image, 1).should.eql([1]);
        validateArrayOfChannels(image, [0,1,2]).should.eql([0,1,2]);
        validateArrayOfChannels(image).should.eql([0,1,2,3]);
        validateArrayOfChannels(image, true).should.eql([0,1,2,3]);
        validateArrayOfChannels(image, false).should.eql([0,1,2]);
        validateArrayOfChannels(image, undefined, true).should.eql([0,1,2,3]);
        validateArrayOfChannels(image, 'a').should.eql([3]);
        validateArrayOfChannels(image, ['r','a']).should.eql([0,3]);
    });

    it('check for a GreyA image', function () {
        let image=new Image(2,2,{
            kind: 'GREYA'
        });

        validateArrayOfChannels(image, 'a').should.eql([1]);
        validateArrayOfChannels(image, 1).should.eql([1]);
        validateArrayOfChannels(image).should.eql([0,1]);
        validateArrayOfChannels(image, true).should.eql([0,1]);
        validateArrayOfChannels(image, false).should.eql([0]);
        validateArrayOfChannels(image, undefined, true).should.eql([0,1]);
        (function() {
            validateArrayOfChannels(image, ['r']);
        }).should.throw(/not a RGB/);
    });

});



