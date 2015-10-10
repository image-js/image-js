import Shape from '../../../src/image/roi/creator/Shape';

describe('we check Shape class', function () {
    it('should yield a cross', function () {
        let shape = new Shape();

        shape.on.should.eql([
            [ 0, 0, -2, -1, 0, 1, 2, 0, 0 ],
            [ -2, -1, 0, 0, 0, 0, 0, 1, 2 ]
        ]);
    });
});
