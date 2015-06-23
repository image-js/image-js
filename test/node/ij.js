'use strict';

var IJ = require('../..');

describe('load', function () {
    it('should load from URL', function () {
        return IJ.load(__dirname + '/../img/rgb8.png').then(function (a) {
            a.width.should.be.greaterThan(0);
            a.height.should.be.greaterThan(0);
        });
    });
});
