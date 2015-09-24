import {Image, getHash} from '../../common';
import histogram from '../../../../src/stack/compute/histogram';

describe.skip('check stack histogram method', function () {
    it ('should return global histogram for GREY image', function() {

        let images=[];

        images.push(
            new Image(2, 2,
                [
                    4, 170,
                    6, 7
                ],
                {kind: 'GREY'}
            )
        );

        images.push(
            new Image(2, 2,
                [
                    2, 3,
                    4, 5
                ],
                {kind: 'GREY'}
            )
        );

        images.push(
            new Image(2, 2,
                [
                    1, 255,
                    6, 7
                ],
                {kind: 'GREY'}
            )
        );

        histogram(images, {maxSlots:4}).should.eql([10,0,1,1]);
    });


    it ('should return global histogram for RGBA image', function() {

        let images=[];

        images.push(
            new Image(2, 1,
                [
                    1, 2, 3, 4,
                    5, 6, 12, 8
                ]
            )
        );

        images.push(
            new Image(2, 1,
                [
                    2, 3, 1, 5,
                    10, 7, 8, 9
                ]
            )
        );

        images.push(
            new Image(2, 1,
                [
                    3, 1, 5, 6,
                    7, 8, 9, 10
                ]
            )
        );

        histogram(images, {maxSlots:4, channel:0}).should.eql([6, 0, 0, 0]);
    });

});

