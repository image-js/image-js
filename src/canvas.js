'use strict';

if (typeof self !== 'undefined') { // Browser
    exports.Image = self.Image;
    exports.Canvas = function Canvas(width, height) {
        var canvas = self.document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };
} else if (typeof module !== 'undefined' && module.exports){ // Node.js
    var canvas = require('canvas');
    exports.Image = canvas.Image;
    exports.Canvas = canvas;
}
