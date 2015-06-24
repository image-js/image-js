'use strict';

var IJ = require('../..');

describe('IJ core', function () {
    it('should load from URL', function () {
        return IJ.load(__dirname + '/../img/rgb8.png').then(function (img) {
            img.width.should.be.greaterThan(0);
            img.height.should.be.greaterThan(0);
        });
    });

    it('should clone', function () {
        return IJ.load(__dirname + '/../img/rgb8.png').then(function (img) {
            var clone = img.clone();
            clone.should.be.an.instanceOf(IJ);
            clone.should.not.be.equal(img);
            clone.toDataURL().should.equal(img.toDataURL());
        })
    });
});
