'use strict';

var common = require('../common');
var IJ = common.IJ;
var getSha = require('ij-test').getHash;
var load = common.load;

common.refreshTmpDir();

describe('save to disk', function () {

    it('load then save', function () {
        return load('rgb8.png').then(function (img) {
            var sha = getSha(img);
            return img.save(common.tmpDir + '/img1.png').then(function () {
                // reload the new file to check that the image is identical
                return IJ.load(common.tmpDir + '/img1.png').then(function (img) {
                    getSha(img).should.equal(sha);
                });
            });
        });
    });

    it('load then save (jpg)', function () {
        return load('rgb8.png').then(function (img) {
            return img.save(common.tmpDir + '/img1.jpg', {format: 'jpeg'});
        });
    });

    it('new then save', function () {
        var img = common.getSquare();
        return img.save(common.tmpDir + '/img2.png');
    });

});
