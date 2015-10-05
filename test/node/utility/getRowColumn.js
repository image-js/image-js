import {Image} from '../common';


describe('check getRow and getColumn class', function () {
    it ('should yield the third row and third column for GREY image', function () {
        let image = new Image(5,4,
            [
                0, 0, 0, 0, 0,
                0, 1, 1, 1, 1,
                0, 1, 2, 2, 2,
                0, 1, 3, 3, 3
            ],
            {kind: 'GREY'}
        );

        image.getRow(2).should.eql([0,1,2,2,2]);
        image.getColumn(2).should.eql([0,1,2,3]);
    });

    it ('should yield the first second and second column for GREY A image', function () {
        let image = new Image(3, 3,
            [
                 0,  1,  2,  3,  4,  5,
                 6,  7,  8,  9, 10, 11,
                12, 13, 14, 15, 16, 17
            ],
            {kind: 'GREYA'}
        );

        image.getRow(1,0).should.eql([6,8,10]);
        image.getRow(1,1).should.eql([7,9,11]);
        image.getColumn(1,0).should.eql([2,8,14]);
        image.getColumn(1,1).should.eql([3,9,15]);
        
        (function () {
            image.getRow(5);
        }).should.throw(/row should be included between 0 and 2/);

        (function () {
            image.getRow(1,2);
        }).should.throw(/channel should be included between 0 and 1/);

        (function () {
            image.getColumn(5);
        }).should.throw(/column should be included between 0 and 2/);

        (function () {
            image.getColumn(1,2);
        }).should.throw(/channel should be included between 0 and 1/);

    });

});

