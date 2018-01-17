import { Image, getHash } from 'test/common';
import 'should';

describe('check the crop transform', function () {
    let image;
    beforeEach(function () {
        image = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 1, 1, 1, 1,
                0, 1, 2, 2, 2,
                0, 1, 2, 4, 3,
                0, 1, 2, 3, 3
            ],
            { kind: 'GREY' }
        );
    });

    it('check the right extract for GREY image', function () {
        let result = image.crop({
            x: 0,
            y: 0
        });

        getHash(result).should.equal(getHash(image));

        result = image.crop({
            x: 2,
            y: 2
        });
        Array.from(result.data).should.eql([2, 2, 2, 2, 4, 3, 2, 3, 3]);

        result = image.crop({
            x: 0,
            y: 0,
            height: 2,
            width: 2
        });
        Array.from(result.data).should.eql([0, 0, 0, 1]);


        result = image.crop({
            x: 2,
            y: 2,
            height: 2,
            width: 2
        });
        Array.from(result.data).should.eql([2, 2, 2, 4]);

        result = image.crop({
            x: 1,
            y: 3,
            height: 1,
            width: 4
        });
        Array.from(result.data).should.eql([1, 2, 4, 3]);
    });

    it('check crop + grey parenting', function () {
        let original = image;
        image = image.rgba8();
        image.parent.should.equal(original);
        let result = image.crop({
            x: 2,
            y: 3
        });
        let grey = result.grey();
        grey.parent.should.equal(result);
        grey.position.should.eql([0, 0]);
        grey.parent.parent.should.equal(image);
        grey.parent.position.should.eql([2, 3]);
    });

    it('non-integer arguments', function () {
        let result = image.crop({
            x: 1.2,
            y: 2.8,
            height: 1.1,
            width: 3.7
        });
        Array.from(result.data).should.eql([1, 2, 4, 3]);
    });

    it('invalid argument ranges', function () {
        (function () {
            image.crop({
                x: -2,
                y: 2,
                height: 2,
                width: 2
            });
        }).should.throw(/x and y .* must be positive numbers/);

        (function () {
            image.crop({
                x: 2,
                y: 2,
                height: -2,
                width: 2
            });
        }).should.throw(/width and height .* must be positive numbers/);

        (function () {
            image.crop({
                x: 100,
                y: 2,
                height: 2,
                width: 2
            });
        }).should.throw(/origin .* out of range/);

        (function () {
            image.crop({
                x: 2,
                y: 2,
                height: 2,
                width: 100
            });
        }).should.throw(/size is out of range/);
    });
});

