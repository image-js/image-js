'use strict';

var IJ = require('../..');
var getImage = require('ij-test').getImage;

function load(name) {
    return IJ.load(getImage(name));
}

describe('IJ core', function () {
    it('constructor defaults', function () {
        var img = new IJ();
        img.width.should.equal(1);
        img.width.should.equal(1);
        img.data.length.should.equal(4);
    });

    it('invalid constructor use', function () {
        (function () {
            new IJ(0, 0);
        }).should.throw(RangeError);
    });

    it('should load from URL', function () {
        return load('rgb8.png').then(function (img) {
            img.width.should.be.greaterThan(0);
            img.height.should.be.greaterThan(0);
        });
    });

    it('should clone', function () {
        return load('rgb8.png').then(function (img) {
            var clone = img.clone();
            clone.should.be.an.instanceOf(IJ);
            clone.should.not.be.equal(img);
            clone.toDataURL().should.equal(img.toDataURL());
        })
    });
});
