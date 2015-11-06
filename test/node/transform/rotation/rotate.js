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
        let image2 = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 1, 1, 1, 1,
                0, 1, 2, 2, 2,
                0, 1, 2, 4, 3,
                0, 1, 2, 3, 3
            ],
            {kind: 'GREY'}
        );
        Array.from(result.data).should.eql(image2);

        result = image.rotate(90);
        let image3 = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                1, 1, 1, 1, 0,
                2, 2, 2, 1, 0,
                3, 4, 2, 1, 0,
                3, 3, 2, 1, 0
            ],
            {kind: 'GREY'}
        );
        Array.from(result.data).should.eql(image3);


        result = image.rotate(180);
        let image4 = new Image(5, 5,
            [
                0, 1, 2, 3, 3,
                0, 1, 2, 4, 3,
                0, 1, 2, 2, 2,
                0, 1, 1, 1, 1,
                0, 0, 0, 0, 0
            ],
            {kind: 'GREY'}
        );
        Array.from(result.data).should.eql(image4);


    });


});