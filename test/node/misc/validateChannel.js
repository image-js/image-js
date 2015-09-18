import {Image} from '../common';
import validateChannel from '../../../src/misc/validateChannel';

describe('we check the validateChannel method', function () {
    it('check for a RGB image', function () {
        let image=new Image(2,2,{
            kind: 'RGB'
        });

        validateChannel(image, 'r').should.equal(0);
        validateChannel(image, 'g').should.equal(1);
        validateChannel(image, 'b').should.equal(2);
        (function() {
            validateChannel(image, 'a');
        }).should.throw(/does not contain alpha/);
        (function() {
            validateChannel(image);
        }).should.throw(/the channel has to be/);
    });
    it('check for a GreyA image', function () {
        let image=new Image(2,2,{
            kind: 'GREYA'
        });

        validateChannel(image, 0).should.equal(0);
        validateChannel(image, 1).should.equal(1);

        (function() {
            validateChannel(image, 'r');
        }).should.throw(/not a RGB image/);
    });
});



