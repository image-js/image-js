import {Image, load} from '../common';

describe('Image core', function () {
    it('constructor defaults', function () {
        let img = new Image();
        img.width.should.equal(1);
        img.height.should.equal(1);
        img.data.length.should.equal(4);
    });

    it('invalid constructor use', function () {
        (function () {
            new Image(0, 0);
        }).should.throw(RangeError);
    });

    it('should load from URL', function () {
        return load('rgb32bits.png').then(function (img) {
            img.width.should.be.greaterThan(0);
            img.height.should.be.greaterThan(0);
            img.maxValue.should.equal(255);
        });
    });

    it('should clone', function () {
        return load('rgb32bits.png').then(function (img) {
            let clone = img.clone();
            clone.should.be.an.instanceOf(Image);
            clone.should.not.be.equal(img);
            clone.toDataURL().should.equal(img.toDataURL());
        })
    });
});
