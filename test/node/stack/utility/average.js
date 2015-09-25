import {Image, Stack} from '../../common';

describe('check stack average method', function () {
    it ('should return a correct new RGBA image', function () {
        let images = new Stack();

        images.push(
            new Image(2, 1,
                [
                    1, 2, 3, 4,
                    5, 6, 7, 8
                ]
            )
        );

        images.push(
            new Image(2, 1,
                [
                    2, 3, 4, 5,
                    6, 7, 8, 9
                ]
            )
        );

        images.push(
            new Image(2, 1,
                [
                    3, 4, 5, 6,
                    7, 8, 9, 10
                ]
            )
        );

        Array.from(images.getAverage().data).should.eql(
            [
                2, 3, 4, 5,
                6, 7, 8, 9
            ]);
    });

});

