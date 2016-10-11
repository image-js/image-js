import {Image, Stack, getSquare, getImage} from 'test/common';

describe('Core methods of Stack objects', function () {

    let stack = new Stack([getSquare(), getSquare()]);

    it('Stack.load', function () {
        return Stack.load([getImage('BW2x2.png'), getImage('BW3x3.png')]).then(function (images) {
            images.should.have.lengthOf(2);
            images.should.be.instanceOf(Stack);
            images[0].should.be.instanceOf(Image);
            images[1].should.be.instanceOf(Image);
            images[0].width.should.equal(2);
            images[1].width.should.equal(3);
        });
    });

    it('Stack.load with error', function () {
        return Stack.load([getImage('BW2x2.png'), getImage('inexistant')]).catch(function (e) {
            e.code.should.equal('ENOENT');
            return 42;
        }).then(function (value) {
            value.should.equal(42);
        });
    });

    it('should be an Array', function () {
        stack.should.be.instanceOf(Stack);
        stack.should.be.instanceOf(Array);
        Array.isArray(stack).should.be.true();
    });

    it('should have Array methods on prototype', function () {
        stack.forEach(function (image) {
            image.should.be.instanceOf(Image);
        });
        stack.filter(() => false).should.have.lengthOf(0);
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
