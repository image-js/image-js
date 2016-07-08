import {Image} from '../common';


describe('check getMatrix class', function () {
    it ('should yield a Matrix object', function () {
        let image = new Image(5,4,
            [
                0, 0, 0, 0, 0,
                0, 1, 1, 1, 1,
                0, 1, 2, 2, 2,
                0, 1, 3, 3, 3
            ],
            {kind: 'GREY'}
        );

        let matrix = image.getMatrix();

        matrix.columns.should.equal(5);
        matrix.rows.should.equal(4);
        matrix[2].should.eql([0,1,2,2,2]);

        let image2 = new Image(5,4, {kind:'GREY'});
        image2.setMatrix(matrix);
        
        image.data.should.eql(Array.from(image2.data));
    });
});

