'use strict';

import {getKind, getPixelArray} from './kind';
import {COLOR8} from './kindNames';
import {Image, getImageData, Canvas} from './canvas';
import extend from './extend';
import {createWriteStream} from 'fs';

let computedPropertyDescriptor = {
    configurable: true,
    enumerable: true,
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

        let kind = options.kind || COLOR8;

        // TODO do something with colorModel
        let colorModel = options.colorModel || 'RGB';
        this.colorModel = colorModel;

        if (!(width > 0))
            throw new RangeError('width must be greater than 0');
        if (!(height > 0))
            throw new RangeError('height must be greater than 0');

        let map = getKind(kind);
        if (!map)
            throw new RangeError('invalid image kind: ' + kind);

        this.kind = kind;
        this.info = map;
        this.computed = {};

        this.width = width;
        this.height = height;
        var size = width * height;

        let length = size * (map.components + map.alpha);

        if (!data)
            data = getPixelArray(map, length);
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

    static extendMethod(name, method, inplace = false) {
        if (IJ.prototype.hasOwnProperty(name)) {
            console.warn(`Method '${name}' already exists and will be overwritten`);
        }
        if (inplace) {
            IJ.prototype[name] = function (...args) {
                method.apply(this, args);
                // reset computed properties
                this.computed = {};
                return this;
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
        return new IJ(width, height, {kind});
    }

    toDataURL() {
        return this.getCanvas().toDataURL();
    }

    getCanvas() {
        /*
            TODO
            clone data if needed
            ensure color model is RGB
            ensure kind is COLOR32
         */

        let data = getImageData(this.data, this.width, this.height);
        let canvas = new Canvas(this.width, this.height);
        let ctx = canvas.getContext('2d');
        ctx.putImageData(data, 0, 0);
        return canvas;
    }

    clone() {
        let nemImage = new IJ(this.width, this.height, {kind: this.kind, colorModel: this.colorModel});
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
            bitDepth, alpha, model, components
        } = {}) {
        if (bitDepth) {
            if (! Array.isArray(bitDepth)) bitDepth=[bitDepth];
            if (bitDepth.indexOf(this.bitDepth)==-1) {
                throw new Error ('The process: '+processName+' can only be apply if bit depth is in: '+bitDepth);
            }
        }
        if (alpha) {
            if (! Array.isArray(alpha)) alpha=[alpha];
            if (alpha.indexOf(this.alpha)==-1) {
                throw new Error ('The process: '+processName+' can only be apply if alpha is in: '+alpha);
            }
        }
        if (model) {
            if (! Array.isArray(model)) model=[model];
            if (model.indexOf(this.model)==-1) {
                throw new Error ('The process: '+processName+' can only be apply if color model is in: '+model);
            }
        }
        if (components) {
            if (! Array.isArray(components)) components=[components];
            if (components.indexOf(this.components)==-1) {
                throw new Error ('The process: '+processName+' can only be apply if the number of channels is in: '+components);
            }
        }
    }
    
    // Dynamic accessors
    get components() {
        return this.info.components;
    }
    get alpha() {
        return this.info.alpha;
    }
    get channels() {
        return this.info.components + this.info.alpha;
    }
    get bitDepth() {
        return this.info.bitDepth;
    }
    get maxValue() {
        return (1 << this.info.bitDepth) - 1;
    }
    get size() {
        return this.width * this.height;
    }
}

extend(IJ);
