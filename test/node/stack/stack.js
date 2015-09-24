import {Image, Stack, getSquare} from '../common';

describe('Core methods of Stack objects', function () {

    let stack = new Stack([getSquare(), getSquare()]);

    it('map', function () {
        let result = stack.map(function (image) {
            return image.grey();
        });

        result.length.should.equal(2);
        result[0].components.should.equal(1);

        (function () {
            stack.map();
        }).should.throw(TypeError);
    });

});
