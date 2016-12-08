import {Image, getHash} from '../../common';

describe.only('check the rotate transform', function () {
    it('check the right extract for GREY image', function () {

        let image = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 1, 1, 1, 1,
                0, 1, 2, 2, 2,
                0, 1, 2, 4, 3,
                0, 1, 2, 3, 3
            ],
            {kind: 'GREY'}
        );

        let result = image.rotate(0);

        getHash(result).should.equal(getHash(image));

        result = image.rotate(45);
        Array.from(result.data).should.eql([
            255, 255, 255, 0, 255, 255, 255,
            255, 255,  0,  1,  0,  255, 255,
            255,  0,   1,  1,  1,   0,  255,
            0,   1,   1,  2,  1,   1,   0,
            0,   1,   2,  4,  2,   1,   0,
            255,  0,   3,  4,  3,   0,  255,
            255, 255,  0,  3,  0,  255, 255
        ]);

        result = image.rotate(90);
        Array.from(result.data).should.eql([0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 2, 2, 2, 1, 0, 3, 4, 2, 1, 0, 3, 3, 2, 1, 0]);


        result = image.rotate(180);
        Array.from(result.data).should.eql([0, 1, 2, 3, 3, 0, 1, 2, 4, 3, 0, 1, 2, 2, 2, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0]);


    });


});