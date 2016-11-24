import {Image} from 'test/common';

describe('scale', function () {
    describe('using a factor', function () {
        it('up - even dimensions', function () {
            const image = new Image(10, 12);
            const result = image.scale({factor: 2});
            result.width.should.equal(20);
            result.height.should.equal(24);
        });

        it('down - even dimensions', function () {
            const image = new Image(10, 12);
            const result = image.scale({factor: 0.5});
            result.width.should.equal(5);
            result.height.should.equal(6);
        });

        it('up - decimal factor', function () {
            const image = new Image(9, 13);
            const result = image.scale({factor: 1.5});
            result.width.should.equal(14);
            result.height.should.equal(20);
        });

        it('down - odd dimensions', function () {
            const image = new Image(9, 13);
            const result = image.scale({factor: 1 / 3});
            result.width.should.equal(3);
            result.height.should.equal(4);
        });
    });
    describe('binary images using a factor', function () {
        it('check the result', function () {
            let binary = new Image(4, 4, [204, 51], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({factor: 0.5});
            newImage.width.should.equal(2);
            newImage.height.should.equal(2);
            Array.from(newImage.data).should.eql([144]);
        });

        it('check the result fi size should be 0', function () {
            let binary = new Image(4, 4, [204, 51], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({factor: 0.01});
            newImage.width.should.equal(1);
            newImage.height.should.equal(1);
            Array.from(newImage.data).should.eql([128]);
        });
    });

    describe('with preserveAspectRatio', function () {
        it('up - auto height', function () {
            const image = new Image(10, 12);
            const result = image.scale({width: 20});
            result.width.should.equal(20);
            result.height.should.equal(24);
        });

        it('up - auto width', function () {
            const image = new Image(10, 12);
            const result = image.scale({height: 20});
            result.width.should.equal(17);
            result.height.should.equal(20);
        });

        it('down - auto height', function () {
            const image = new Image(10, 12);
            const result = image.scale({width: 5});
            result.width.should.equal(5);
            result.height.should.equal(6);
        });

        it('down - auto width', function () {
            const image = new Image(10, 12);
            const result = image.scale({height: 5});
            result.width.should.equal(4);
            result.height.should.equal(5);
        });
    });


    describe('without preserveAspectRatio', function () {
        it('up - auto height', function () {
            const image = new Image(10, 12);
            const result = image.scale({width: 20, preserveAspectRatio: false});
            result.width.should.equal(20);
            result.height.should.equal(12);
        });

        it('up - auto width', function () {
            const image = new Image(10, 12);
            const result = image.scale({height: 20, preserveAspectRatio: false});
            result.width.should.equal(10);
            result.height.should.equal(20);
        });

        it('down - auto height', function () {
            const image = new Image(10, 12);
            const result = image.scale({width: 5, preserveAspectRatio: false});
            result.width.should.equal(5);
            result.height.should.equal(12);
        });

        it('down - auto width', function () {
            const image = new Image(10, 12);
            const result = image.scale({height: 5, preserveAspectRatio: false});
            result.width.should.equal(10);
            result.height.should.equal(5);
        });

        it('with up factor', function () {
            const image = new Image(10, 12);
            const result = image.scale({factor: 2, height: 5, preserveAspectRatio: false});
            result.width.should.equal(20);
            result.height.should.equal(10);
        });

        it('with down factor', function () {
            const image = new Image(10, 12);
            const result = image.scale({factor: 0.5, height: 5, preserveAspectRatio: false});
            result.width.should.equal(5);
            result.height.should.equal(3);
        });
    });


});
