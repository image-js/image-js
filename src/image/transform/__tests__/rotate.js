import { Image } from 'test/common';
import 'should';

describe('check the rotate transform', function () {
    it('90 degrees clockwise grey', function () {
        const image = new Image(3, 2,
            [
                1, 2, 3,
                4, 5, 6
            ],
            { kind: 'GREY' });

        const result = image.rotateRight();
        result.width.should.equal(2);
        result.height.should.equal(3);
        Array.from(result.data).should.eql([
            4, 1,
            5, 2,
            6, 3
        ]);
    });

    it('90 degrees counter-clockwise grey', function () {
        const image = new Image(3, 2,
            [
                1, 2, 3,
                4, 5, 6
            ],
            { kind: 'GREY' });

        const result = image.rotateLeft();
        result.width.should.equal(2);
        result.height.should.equal(3);
        Array.from(result.data).should.eql([
            3, 6,
            2, 5,
            1, 4
        ]);
    });


    it('180 degrees grey', function () {
        const image = new Image(3, 2,
            [
                1, 2, 3,
                4, 5, 6
            ],
            { kind: 'GREY' });

        const result = image.rotate(180);
        Array.from(result.data).should.eql([
            6, 5, 4,
            3, 2, 1
        ]);
    });

    it('negative angle grey', function () {
        const image = new Image(3, 2,
            [
                1, 2, 3,
                4, 5, 6
            ],
            { kind: 'GREY' });
        const rotate90 = image.rotate(90);
        const rotateMin270 = image.rotate(-270);
        Array.from(rotate90.data).should.eql(Array.from(rotateMin270.data));
    });
});
