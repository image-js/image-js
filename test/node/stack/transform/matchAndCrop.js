import {Image, Stack, getHash} from '../../common';
import matchAndCrop from '../../../../src/stack/transform/matchAndCrop';

describe('check matchAndCrop method', function () {
    it('should return an array of 3 images cropped and moved using matchToPrevious', function () {

        let images = new Stack();

        images.push(
            new Image(5, 5,
                [
                    0, 0, 0, 0, 0,
                    0, 3, 1, 1, 1,
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

        let results = images.matchAndCrop();
        results.should.be.instanceOf(Stack).and.have.lengthOf(5);
        getHash(results[1]).should.equal(getHash(results[2]));

        let result = results[0];
        result.width.should.equal(4);
        result.height.should.equal(3);
        Array.from(result.data).should.eql(
            [
                1, 2, 2, 2,
                1, 2, 4, 3,
                1, 2, 3, 3
            ]
        );


        result = results[1];
        result.width.should.equal(4);
        result.height.should.equal(3);
        Array.from(result.data).should.eql(
            [
                0, 0, 0, 0,
                0, 0, 4, 0,
                0, 0, 0, 0
            ]
        );

        result = results[2];
        result.width.should.equal(4);
        result.height.should.equal(3);
        Array.from(result.data).should.eql(
            [
                0, 0, 0, 0,
                0, 0, 4, 0,
                0, 0, 0, 0
            ]
        );

        result = results[3];
        result.width.should.equal(4);
        result.height.should.equal(3);
        Array.from(result.data).should.eql(
            [
                0, 0, 0, 0,
                0, 0, 4, 0,
                0, 0, 0, 0
            ]
        );

        result = results[4];
        result.width.should.equal(4);
        result.height.should.equal(3);
        Array.from(result.data).should.eql(
            [
                0, 0, 0, 0,
                0, 0, 4, 0,
                0, 0, 0, 0
            ]
        );

    });


    it('should return an array of 3 images cropped and moved unsng matchToFirst', function () {

        let images = new Stack();

        images.push(
            new Image(5, 5,
                [
                    0, 0, 0, 0, 0,
                    0, 3, 1, 1, 1,
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

        let results = images.matchAndCrop({algorithm:'matchToFirst'});
        results.should.be.instanceOf(Stack).and.have.lengthOf(3);

        let result = results[0];
        result.width.should.equal(3);
        result.height.should.equal(4);
        Array.from(result.data).should.eql(
            [
                3, 1, 1,
                1, 2, 2,
                1, 2, 4,
                1, 2, 3
            ]
        );

        result = results[1];
        result.width.should.equal(3);
        result.height.should.equal(4);
        Array.from(result.data).should.eql(
            [
                0, 0, 0,
                0, 0, 0,
                0, 0, 4,
                0, 0, 0
            ]
        );

        result = results[2];
        result.width.should.equal(3);
        result.height.should.equal(4);
        Array.from(result.data).should.eql(
            [
                4, 0, 0,
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            ]
        );
    });

    it('should return an array of 3 images cropped and moved unsng matchToFirst simple', function () {

        let images = new Stack();

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

        let results = images.matchAndCrop({algorithm:'matchToFirst'});
        results.should.be.instanceOf(Stack).and.have.lengthOf(3);

        console.log(results[1].data);
        console.log(results[2].data);

        getHash(results[1]).should.equal(getHash(results[2]));

        let result = results[0];
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

