'use strict';

var common = require('../common');
var load = common.load;

common.refreshTmpDir();

describe('save to disk', function () {

    it('load then save', function () {
        return load('rgb8.png').then(function (img) {
            return img.save(common.tmpDir + '/img1.png');
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
