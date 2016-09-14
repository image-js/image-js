import {getType, canWrite} from '../mediaTypes';
import {Image} from 'test/common';

describe('Media Type support checks', function () {

    it('getType', function () {
        getType('png').should.equal('image/png');
        getType('image/png').should.equal('image/png');
    });

    it('direct calls', function () {
        canWrite('image/png').should.be.true();
        canWrite('image/jpeg').should.be.false();
        canWrite('image/abc').should.be.false();
    });

    it('static method', function () {
        Image.isTypeSupported('png').should.be.true();
        Image.isTypeSupported('image/png').should.be.true();
        Image.isTypeSupported('image/jpeg').should.be.false();
        Image.isTypeSupported('abc').should.be.false();
    });

    it('static method - bad arguments', function () {
        (function () {
            Image.isTypeSupported('', 'other');
        }).should.throw(/unknown operation/);
        (function () {
            Image.isTypeSupported(123);
        }).should.throw(TypeError);
    });

});
