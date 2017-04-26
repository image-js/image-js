import {Image} from 'test/common';
import 'should';

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
        it('up - 2 factor', function () {
            let binary = new Image(2, 2, [144], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({factor: 2});
            newImage.width.should.equal(4);
            newImage.height.should.equal(4);
            Array.from(newImage.data).should.eql([204, 51]);
        });
        it('up - 1.5 factor', function () {
            let binary = new Image(2, 2, [144], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({factor: 1.5});
            newImage.width.should.equal(3);
            newImage.height.should.equal(3);
            Array.from(newImage.data).should.eql([141, 128]);
        });
        it('down - 0.5 factor', function () {
            let binary = new Image(4, 4, [204, 51], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({factor: 0.5});
            newImage.width.should.equal(2);
            newImage.height.should.equal(2);
            Array.from(newImage.data).should.eql([144]);
            newImage.position.should.eql([1, 1]);
        });

        it('down - 0.01 factor', function () {
            let binary = new Image(4, 4, [204, 51], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({factor: 0.01});
            newImage.width.should.equal(1);
            newImage.height.should.equal(1);
            Array.from(newImage.data).should.eql([128]);
            newImage.position.should.eql([2, 2]);
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
    describe('binary images with preserveAspectRatio', function () {
        it('up - auto width', function () {
            let binary = new Image(2, 2, [144], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({height: 4});
            newImage.width.should.equal(4);
            newImage.height.should.equal(4);
            Array.from(newImage.data).should.eql([204, 51]);
        });
        it('up - auto height', function () {
            let binary = new Image(2, 2, [144], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({width: 3});
            newImage.width.should.equal(3);
            newImage.height.should.equal(3);
            Array.from(newImage.data).should.eql([141, 128]);
        });
        it('down - auto width', function () {
            let binary = new Image(4, 4, [204, 51], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({height: 2});
            newImage.width.should.equal(2);
            newImage.height.should.equal(2);
            Array.from(newImage.data).should.eql([144]);
        });

        it('down - auto height', function () {
            let binary = new Image(4, 4, [204, 51], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({width: 1});
            newImage.width.should.equal(1);
            newImage.height.should.equal(1);
            Array.from(newImage.data).should.eql([128]);
        });
    });

    describe('without preserveAspectRatio', function () {
        it('up - with width', function () {
            const image = new Image(10, 12);
            const result = image.scale({width: 20, preserveAspectRatio: false});
            result.width.should.equal(20);
            result.height.should.equal(12);
        });

        it('up - with height', function () {
            const image = new Image(10, 12);
            const result = image.scale({height: 20, preserveAspectRatio: false});
            result.width.should.equal(10);
            result.height.should.equal(20);
        });

        it('down - with width', function () {
            const image = new Image(10, 12);
            const result = image.scale({width: 5, preserveAspectRatio: false});
            result.width.should.equal(5);
            result.height.should.equal(12);
        });

        it('down - with height', function () {
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

    describe('binary images without preserveAspectRatio', function () {
        it('up - with height', function () {
            let binary = new Image(2, 2, [144], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({height: 4, preserveAspectRatio: false});
            newImage.width.should.equal(2);
            newImage.height.should.equal(4);
        });
        it('up - with width', function () {
            let binary = new Image(2, 2, [144], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({width: 3, preserveAspectRatio: false});
            newImage.width.should.equal(3);
            newImage.height.should.equal(2);
        });
        it('down - with height', function () {
            let binary = new Image(4, 4, [204, 51], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({height: 2, preserveAspectRatio: false});
            newImage.width.should.equal(4);
            newImage.height.should.equal(2);
        });
        it('down - with width', function () {
            let binary = new Image(4, 4, [204, 51], {
                kind: 'BINARY'
            });
            let newImage = binary.scale({width: 1, preserveAspectRatio: false});
            newImage.width.should.equal(1);
            newImage.height.should.equal(4);
        });
    });

});
