'use strict';

var Types = require('./types');
var canvas = require('./canvas');
var Image = canvas.Image;
var Canvas = canvas.Canvas;

function IJ(width, height, data) {
    this.width = width;
    this.height = height;
    this.data = data;
}

IJ.load = function load(url) {
    return new Promise(function (resolve, reject) {
        var image = new Image();

        // see https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
        image.crossOrigin = 'Anonymous';

        image.onload = function () {
            var w = image.width, h = image.height;
            var canvas = new Canvas(w, h);
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, w, h);
            var data = ctx.getImageData(0, 0, w, h).data;
            resolve(new IJ(w, h, data));
        };
        image.onerror = reject;
        image.src = url;
    });
};

module.exports = IJ;
