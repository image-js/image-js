'use strict';

var rimraf = require('rimraf');
var fs = require('fs');

var IJ = require('..');
var getImage = require('ij-test').getImage;

exports.IJ = IJ;
exports.load = function load(name) {
    return IJ.load(getImage(name));
};

exports.getSquare = function () {
    return new IJ(3,3,[
        0,  0,  255,255, // red
        0,  255,0,  255, // green
        255,0,  0,  255, // blue
        255,255,0,  255, // yellow
        255,0,  255,255, // magenta
        0,  255,255,255, // cyan
        0,  0,  0,  255, // black
        255,255,255,255, // white
        127,127,127,255  // grey
    ]);
};

var tmpDir = exports.tmpDir = __dirname + '/TMP';
exports.refreshTmpDir = function () {
    rimraf.sync(tmpDir);
    fs.mkdirSync(tmpDir);
};
