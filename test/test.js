'use strict';

var path = require('path');
var SHA256 = require('sha.js').sha256;

exports.imageList = require('./imgList.json');

exports.getImage = function getImage(name) {
    return path.resolve(__dirname, 'img', name);
};

exports.getHash = function getHash(img) {
    if (!img.length) {
        img = img.data;
    }
    var sha = new SHA256();
    sha.update(img);
    return sha.digest('hex');
};
