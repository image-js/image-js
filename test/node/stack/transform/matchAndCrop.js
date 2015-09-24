import {Image, getHash} from '../../common';
import matchAndCrop from '../../../../src/stack/transform/matchAndCrop';

describe('check matchAndCrop method', function () {
    it ('should return an array of 3 images cropped and moved', function() {

        let images=[];

        images.push(
            new Image(5, 5,
                [
                    0, 0, 0, 0, 0,
                    0, 1, 1, 1, 1,
                    0, 1, 2, 2, 2,
                    0, 1, 2, 4, 3,
                    0, 1, 2, 3, 3
                ],
                {kind: 'GREY'}
            )
        );

        images.push(
            new Image(5, 5,
                [
                    0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0,
                    0, 0, 4, 0, 0,
                    0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0
                ],
                {kind: 'GREY'}
            )
        );

        images.push(
            new Image(5, 5,
                [
                    0, 0, 0, 0, 0,
                    0, 0, 4, 0, 0,
                    0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0
                ],
                {kind: 'GREY'}
            )
        );

        let results=matchAndCrop(images);
        results.should.be.instanceOf(Array).and.have.lengthOf(3);
        getHash(results[1]).should.equal(getHash(results[2]));

        let result=results[0];
        result.width.should.equal(4);
        result.height.should.equal(3);
        Array.from(result.data).should.eql(
            [
                1, 2, 2, 2,
                1, 2, 4, 3,
                1, 2, 3, 3
            ]
        );
    });


});

