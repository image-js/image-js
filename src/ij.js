'use strict';

import Types from './types';
import {Image, ImageData, Canvas, PixelArray} from './canvas';
import extend from './extend';

export default class IJ {
    constructor(width, height, data) {
        this.width = width;
        this.height = height;

        this.components = 3;
        this.alpha = false;
        this.bitDepth = 8;

        this.data = data;
    }

    static load(url) {
        return new Promise(function (resolve, reject) {
            let image = new Image();

            // see https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
            image.crossOrigin = 'Anonymous';

            image.onload = function () {
                let w = image.width, h = image.height;
                let canvas = new Canvas(w, h);
                let ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, w, h);
                let data = ctx.getImageData(0, 0, w, h).data;
                resolve(new IJ(w, h, data));
            };
            image.onerror = reject;
            image.src = url;
        });
    }

    toDataURL() {
        let imgData = new ImageData(this.data, this.width, this.height);
        let canvas = new Canvas(this.width, this.height);
        let ctx = canvas.getContext('2d');
        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL();
    }

    clone() {
        let data = this.data;
        let newData = PixelArray(this.width, this.height);
        for (let i = 0; i < newData.length; i++) {
            newData[i] = data[i];
        }
        return new IJ(this.width, this.height, newData);
    }

    static extend(name, method, inplace = false) {
        if (inplace) {
            IJ.prototype[name] = function (...args) {
                method(this, ...args);
                return this;
            };
        } else {
            IJ.prototype[name] = function (...args) {
                return method(this, ...args);
            };
        }
    }
}

extend(IJ);
