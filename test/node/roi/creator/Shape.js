import Shape from '../../../../src/image/roi/creator/Shape';

describe('we check Shape', function () {
    it('should yield the right smallCross', function () {
        let shape = new Shape({kind: 'smallCross'});

        shape.matrix.should.eql(
            [
                [0,1,0],
                [1,1,1],
                [0,1,0]
            ]
        );
    });

    it('should yield the right cross', function () {
        let shape = new Shape({kind: 'cross'});

        shape.matrix.should.eql(
            [
                [0,0,1,0,0],
                [0,0,1,0,0],
                [1,1,1,1,1],
                [0,0,1,0,0],
                [0,0,1,0,0]
            ]
        );
    });

    it.skip('should yield the right square', function () {
        let shape = new Shape({shape:'square', size:5});
        shape.matrix.should.eql(
            [
                [1,1,1,1,1],
                [1,1,1,1,1],
                [1,1,1,1,1],
                [1,1,1,1,1],
                [1,1,1,1,1]
            ]
        );

        let shape2 = new Shape({shape:'square', width:5, height:3});
        shape2.matrix.should.eql(
            [
                [1,1,1,1,1],
                [1,1,1,1,1],
                [1,1,1,1,1]
            ]
        );

    });


});


