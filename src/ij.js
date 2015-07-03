'use strict';

import {getKind, getPixelArray} from './kind';
import {RGBA} from './kindNames';
import {Image, getImageData, Canvas, getCanvasArray} from './canvas';
import extend from './extend';
import {createWriteStream} from 'fs';
import * as ColorModels from './model/models';

let computedPropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get: undefined
};

export default class IJ {
    constructor(width, height, data, options) {
        if (width === undefined) width = 1;
        if (height === undefined) height = 1;
        if (data && !data.length) {
            options = data;
            data = null;
        }
        if (options === undefined) options = {};

        if (!(width > 0))
            throw new RangeError('width must be greater than 0');
        if (!(height > 0))
            throw new RangeError('height must be greater than 0');

        this.width = width;
        this.height = height;

        let kind = options.kind || RGBA;
        if (typeof kind === 'string') kind = getKind(kind);
        if (!kind) throw new RangeError('invalid image kind: ' + kind);

        this.components = kind.components;
        this.alpha = kind.alpha;
        this.bitDepth = kind.bitDepth;
        this.colorModel = kind.colorModel;

        this.channels = this.components + this.alpha;
        this.maxValue = (1 << this.bitDepth) - 1;
        this.size = this.width * this.height;

        this.computed = {};


        let length = this.size * this.channels;
        if (!data)
            data = getPixelArray(kind, length);
        else if (data.length !== length)
            throw new RangeError(`incorrect data size. Expected ${length} but got ${data.length}`);

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

    static extendMethod(name, method, inplace = false, returnThis = true) {
        if (IJ.prototype.hasOwnProperty(name)) {
            console.warn(`Method '${name}' already exists and will be overwritten`);
        }
        if (inplace) {
            IJ.prototype[name] = function (...args) {
                // reset computed properties
                this.computed = {};
                let result = method.apply(this, args);
                if (returnThis)
                    return this;
                return result;
            };
        } else {
            IJ.prototype[name] = function (...args) {
                return method.apply(this, args);
            };
        }
        return IJ;
    }

    static extendProperty(name, method) {
        if (IJ.prototype.hasOwnProperty(name)) {
            console.warn(`Property getter '${name}' already exists and will be overwritten`);
        }
        computedPropertyDescriptor.get = function () {
            if (this.computed.hasOwnProperty(name)) {
                return this.computed[name];
            } else {
                let result = method.call(this);
                this.computed[name] = result;
                return result;
            }
        };
        Object.defineProperty(IJ.prototype, name, computedPropertyDescriptor);
        return IJ;
    }

    static createFrom(other, {
        width = other.width,
        height = other.height,
        kind = other.kind
        } = {}) {
        // TODO if kind is incomplete, take values from this
        return new IJ(width, height, {kind});
    }

    setValue(value, row, column, channel) {
        this.data[(row * this.width + column) * this.channels + channel] = value;
    }

    getValue(row, column, channel) {
        return this.data[(row * this.width + column) * this.channels + channel];
    }

    setMatrix(matrix, channel) {
        // the user is expected to know what he is doing !
        // we blinding put the matrix result
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                for (let k = 0; k < this.channels; k++) {
                    if (channel) {
                        this.data[(j * this.width + i) * this.channels + channel] = matrix[i][j];
                    } else {
                        this.data[(j * this.width + i) * this.channels + k] = matrix[i][j][k];
                    }
                }
            }
        }
    }

    getMatrix(channel) {
        let matrix = new Array(this.width);
        for (let i = 0; i < this.width; i++) {
            matrix[i] = new Array(this.height);
            for (let j = 0; j < this.height; j++) {
                if (channel) {
                    matrix[i][j] = this.data[(j * this.width + i) * this.channels + channel]
                } else {
                    matrix[i][j] = new Array(this.channels);
                    for (let k = 0; k < this.channels; k++) {
                        matrix[i][j][k] = this.data[(j * this.width + i) * this.channels + k]
                    }
                }
            }
        }
        return matrix;
    }

    toDataURL() {
        return this.getCanvas().toDataURL();
    }

    getCanvas() {
        let data = getImageData(this.getRGBAData(), this.width, this.height);
        let canvas = new Canvas(this.width, this.height);
        let ctx = canvas.getContext('2d');
        ctx.putImageData(data, 0, 0);
        return canvas;
    }

    getRGBAData() {
        this.checkProcessable("getRGBAData", {components: [1, 3]});
        let size = this.size;
        let newData = getCanvasArray(this.width, this.height);
        if (this.components === 1) {
            for (let i = 0; i < size; i++) {
                newData[i * 4] = this.data[i * (1 + this.alpha)] >> (this.bitDepth - 8);
                newData[i * 4 + 1] = this.data[i * (1 + this.alpha)] >> (this.bitDepth - 8);
                newData[i * 4 + 2] = this.data[i * (1 + this.alpha)] >> (this.bitDepth - 8);
            }
        } else if (this.components === 3) {
            this.checkProcessable("getRGBAData", {colorModel: [ColorModels.RGB]});
            if (this.colorModel === ColorModels.RGB) {
                for (let i = 0; i < size; i++) {
                    newData[i * 4] = this.data[i * 4] >> (this.bitDepth - 8);
                    newData[i * 4 + 1] = this.data[i * 4 + 1] >> (this.bitDepth - 8);
                    newData[i * 4 + 2] = this.data[i * 4 + 2] >> (this.bitDepth - 8);
                }
            }
        }
        if (this.alpha) {
            this.checkProcessable("getRGBAData", {bitDepth: [8, 16]});
            for (let i = 0; i < size; i++) {
                newData[i * 4 + 3] = this.data[i * this.channels + this.components] >> (this.bitDepth - 8);
            }
        } else {
            for (let i = 0; i < size; i++) {
                newData[i * 4 + 3] = 255;
            }
        }
        return newData;
    }

    clone() {
        let nemImage = IJ.createFrom(this);
        let data = this.data;
        let newData = nemImage.data;
        for (let i = 0; i < newData.length; i++) {
            newData[i] = data[i];
        }
        return nemImage;
    }

    save(path, {format = 'png'} = {}) { // Node.JS only
        return new Promise((resolve, reject) => {
            let out = createWriteStream(path);
            let canvas = this.getCanvas();
            let stream;
            switch (format) {
                case 'png':
                    stream = canvas.pngStream();
                    break;
                case 'jpg':
                case 'jpeg':
                    stream = canvas.jpegStream();
                    break;
                default:
                    return reject(new RangeError('invalid output format: ' + format));
            }
            out.on('finish', resolve);
            out.on('error', reject);
            stream.pipe(out);
        });
    }

    // this method check if a process can be applied on the current image
    checkProcessable(processName, {
        bitDepth, alpha, colorModel, components
        } = {}) {
        if (bitDepth) {
            if (!Array.isArray(bitDepth)) bitDepth = [bitDepth];
            if (bitDepth.indexOf(this.bitDepth) == -1) {
                throw new TypeError('The process: ' + processName + ' can only be applied if bit depth is in: ' + bitDepth);
            }
        }
        if (alpha) {
            if (!Array.isArray(alpha)) alpha = [alpha];
            if (alpha.indexOf(this.alpha) == -1) {
                throw new TypeError('The process: ' + processName + ' can only be applied if alpha is in: ' + alpha);
            }
        }
        if (colorModel) {
            if (!Array.isArray(colorModel)) colorModel = [colorModel];
            if (colorModel.indexOf(this.colorModel) == -1) {
                throw new TypeError('The process: ' + processName + ' can only be applied if color model is in: ' + colorModel);
            }
        }
        if (components) {
            if (!Array.isArray(components)) components = [components];
            if (components.indexOf(this.components) == -1) {
                throw new TypeError('The process: ' + processName + ' can only be applied if the number of channels is in: ' + components);
            }
        }
    }
}

extend(IJ);
