import {Image, load, getHash} from '../common';

describe('level', function() {
    describe('extend the image to cover all levels', function () {
        it('should reach the borders and not touch alpha', function () {

            let image = new Image(1,3,[0, 10, 255, 100, 0, 20, 255, 255, 0, 30, 255, 255]);

            let leveled = [0, -0, 255, 100, 0, 128, 255, 255, 0, 255, 255, 255];

            image.level();
            image.data.should.eql(leveled);

        });

        it('should not change if it used the full range', function () {

            let image = new Image(1,3,[0, 0, 0, 255, 100, 110, 120, 255, 255, 255, 255, 255]);

            let leveled = [-0, -0, -0, 255, 100, 110, 120, 255, 255, 255, 255, 255];

            image.level();
            image.data.should.eql(leveled);

        });

        it('should not change at all an image that has the extreme colors', function() {
            return load('rgb24bits.png').then(
                function(image) {
                    let hash=getHash(image);
                    image.level();
                    let hash2=getHash(image);
                    hash.should.equal(hash2);
                }
            );
        });

        it('should change for a normal picture', function() {
            return load('cat.jpg').then(
                function(image) {
                    let hash=getHash(image);
                    image.level();
                    let hash2=getHash(image);
                    hash.should.not.equal(hash2);
                }
            );
        })


    });

    describe('testing various file format', function() {
        const tests = ['grey8','greya16','greya32','rgb24','rgb48','rgba32','rgba64'];
        tests.forEach(function(test) {
            it('should not change: format/'+test, function() {
                return load('format/' + test + '.png').then(function(image) {
                    let hash=getHash(image);
                    image.level();
                    let hash2=getHash(image);
                    hash.should.equal(hash2);
                });
            });
        });
    });

});

