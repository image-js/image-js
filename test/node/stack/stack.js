import {Image, Stack, getSquare} from '../common';

describe('Core methods of Stack objects', function () {

    let stack = new Stack([getSquare(), getSquare()]);

    it('should be an Array', function () {
        stack.should.be.instanceOf(Stack);
        stack.should.be.instanceOf(Array);
        Array.isArray(stack).should.be.true();
    });

    it('should have Array methods on prototype', function () {
        stack.forEach(function (image) {
            image.should.be.instanceOf(Image);
        });
        stack.filter(function (image) {
            return false;
        }).should.have.lengthOf(0);
    });

    it('map should return a Stack', function () {
        let result = stack.map(function (image) {
            return image.grey();
        });

        result.should.be.instanceOf(Stack);
        result.length.should.equal(2);
        result[0].components.should.equal(1);

        (function () {
            stack.map();
        }).should.throw(TypeError);
    });

});
