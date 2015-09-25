import {getKind, getPixelArray, getPixelArraySize} from './kind';
import {RGBA} from './kindNames';
import {ImageData, Canvas} from './environment';
import extend from './extend';
import bitMethods from './bitMethods';
import {createWriteStream} from 'fs';
import {RGB} from './model/model';
import ROIManager from './roi/manager';
import {getType, canWrite} from './mediaTypes';
import extendObject from 'extend';
import {loadURL} from './load';
import Stack from '../stack/stack';

let computedPropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get: undefined
};

export default class Image {
    constructor(width, height, data, options) {
        if (width === undefined) width = 1;
        if (height === undefined) height = 1;

        if (data && !data.length) {
            options = data;
            data = null;
        }
        if (options === undefined) options = {};

        this.width=width;
        this.height=height;

        if (this.width <= 0) {
            throw new RangeError('width must be greater than 0');
        }
        if (this.height <= 0) {
            throw new RangeError('height must be greater than 0');
        }

        // We will set the parent image for relative position

        Object.defineProperty(this, 'parent', {
            enumerable: false,
            writable: true
        });
        this.parent = options.parent;
        this.position = options.position || [0, 0];

        let theKind;
        if (typeof options.kind === 'string') {
            theKind = getKind(options.kind);
            if (!theKind) throw new RangeError('invalid image kind: ' + options.kind);
        } else {
            theKind = getKind(RGBA);
        }

        let kindDefinition = extendObject({}, theKind, options);
        this.components = kindDefinition.components;
        this.alpha = kindDefinition.alpha+0;
        this.bitDepth = kindDefinition.bitDepth;
        this.colorModel = kindDefinition.colorModel;

        this.computed = null;

        this.initialize();

        if (!data)
            data = getPixelArray(kindDefinition, this.size);
        else {
            let theoreticalSize = getPixelArraySize(kindDefinition, this.size);
            if (theoreticalSize !== data.length) {
                throw new RangeError(`incorrect data size. Should be ${theoreticalSize} and found ${data.length}`);
            }
        }

        this.data = data;
    }

    initialize() {
        this.size = this.width * this.height;
        this.sizes = [this.width, this.height];
        this.channels = this.components + this.alpha;
        this.maxValue = (1 << this.bitDepth) - 1;

        this.multiplierX = this.channels;
        this.multiplierY = this.channels * this.width;
    }


    static load(url) {
        return loadURL(url);
    }

    static extendMethod(name, method, {inPlace = false, returnThis = true, partialArgs = [], stack = false} = {}) {
        if (inPlace) {
            Image.prototype[name] = function (...args) {
                // remove computed properties
                this.computed = null;
                let result = method.apply(this, [...partialArgs, ...args]);
                if (returnThis)
                    return this;
                return result;
            };
            if (stack) {
                const stackName = typeof stack === 'string' ? stack : name;
                if (returnThis) {
                    Stack.prototype[stackName] = function (...args) {
                        for (let image of this) {
                            image[name](...args);
                        }
                        return this;
                    };
                } else {
                    Stack.prototype[stackName] = function (...args) {
                        let result = new Stack(this.length);
                        for (let i = 0; i < this.length; i++) {
                            result[i] = this[i][name](...args);
                        }
                        return result;
                    };
                }
            }
        } else {
            Image.prototype[name] = function (...args) {
                return method.apply(this, [...partialArgs, ...args]);
            };
            if (stack) {
                const stackName = typeof stack === 'string' ? stack : name;
                Stack.prototype[stackName] = function (...args) {
                    let result = new Stack(this.length);
                    for (let i = 0; i < this.length; i++) {
                        result[i] = this[i][name](...args);
                    }
                    return result;
                };
            }
        }
        return Image;
    }

    static extendProperty(name, method, {partialArgs = []} = {}) {
        computedPropertyDescriptor.get = function () {
            if (this.computed === null) {
                this.computed = {};
            } else if (this.computed.hasOwnProperty(name)) {
                return this.computed[name];
            }
            let result = method.apply(this, partialArgs);
            this.computed[name] = result;
            return result;
        };
        Object.defineProperty(Image.prototype, name, computedPropertyDescriptor);
        return Image;
    }


    static createFrom(other, options) {
        let newOptions = {
            width: other.width,
            height: other.height,
            position: other.position,
            components: other.components,
            alpha: other.alpha,
            colorModel: other.colorModel,
            bitDepth: other.bitDepth,
            parent: other
        };
        extendObject(newOptions, options);
        return new Image(newOptions.width, newOptions.height, newOptions);
    }

    static isTypeSupported(type, operation = 'write') {
        if (typeof type !== 'string') {
            throw new TypeError('type argument must be a string');
        }
        type = getType(type);
        if (operation === 'write') {
            return canWrite(type);
        } else {
            throw new TypeError('unknown operation: ' + operation);
        }
    }

    getPixelIndex(indices) {
        let shift = 0;
        for (let i = 0; i < indices.length; i++) {
            shift += this.multipliers[i] * indices[i];
        }
        return shift;
    }

    setValueXY(x, y, channel, value) {
        this.data[(y * this.width + x) * this.channels + channel] = value;
        this.computed = null;
        return this;
    }

    getValueXY(x, y, channel) {
        return this.data[(y * this.width + x) * this.channels + channel];
    }

    setValue(pixel, channel, value) {
        this.data[pixel * this.channels + channel] = value;
        this.computed = null;
        return this;
    }

    getValue(pixel, channel) {
        return this.data[pixel * this.channels + channel];
    }

    setPixelXY(x, y, value) {
        return this.setPixel(y * this.width + x, value);
    }

    getPixelXY(x, y) {
        return this.getPixel(y * this.width + x);
    }

    setPixel(pixel, value) {
        let target = pixel * this.channels;
        for (let i = 0; i < value.length; i++) {
            this.data[target + i] = value[i];
        }
        this.computed = null;
        return this;
    }

    getPixel(pixel) {
        let value = new Array(this.channels);
        let target = pixel * this.channels;
        for (let i = 0; i < this.channels; i++) {
            value[i] = this.data[target + i];
        }
        return value;
    }

    toDataURL(type = 'image/png') {
        return this.getCanvas().toDataURL(getType(type));
    }

    getCanvas() {
        let data = new ImageData(this.getRGBAData(), this.width, this.height);
        let canvas = new Canvas(this.width, this.height);
        let ctx = canvas.getContext('2d');
        ctx.putImageData(data, 0, 0);
        return canvas;
    }

    getRGBAData() {
        this.checkProcessable('getRGBAData', {
            components: [1, 3],
            bitDepth: [1, 8, 16]
        });
        let size = this.size;
        let newData = new Uint8ClampedArray(this.width * this.height * 4);
        if (this.bitDepth === 1) {
            for (let i = 0; i < size; i++) {
                let value = this.getBit(i);
                newData[i * 4] = value * 255;
                newData[i * 4 + 1] = value * 255;
                newData[i * 4 + 2] = value * 255;
            }
        } else {
            if (this.components === 1) {
                for (let i = 0; i < size; i++) {
                    newData[i * 4] = this.data[i * this.channels] >>> (this.bitDepth - 8);
                    newData[i * 4 + 1] = this.data[i * this.channels] >>> (this.bitDepth - 8);
                    newData[i * 4 + 2] = this.data[i * this.channels] >>> (this.bitDepth - 8);
                }
            } else if (this.components === 3) {
                this.checkProcessable('getRGBAData', {colorModel: [RGB]});
                if (this.colorModel === RGB) {
                    for (let i = 0; i < size; i++) {
                        newData[i * 4] = this.data[i * this.channels] >>> (this.bitDepth - 8);
                        newData[i * 4 + 1] = this.data[i * this.channels + 1] >>> (this.bitDepth - 8);
                        newData[i * 4 + 2] = this.data[i * this.channels + 2] >>> (this.bitDepth - 8);
                    }
                }
            }
        }
        if (this.alpha) {
            this.checkProcessable('getRGBAData', {bitDepth: [8, 16]});
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

    getROIManager(mask, options) {
        return new ROIManager(this, options);
    }

    clone({copyData=true}={}) {
        let nemImage = Image.createFrom(this);
        if (copyData) {
            let data = this.data;
            let newData = nemImage.data;
            for (let i = 0; i < newData.length; i++) {
                newData[i] = data[i];
            }
        }
        return nemImage;
    }

    save(path, {format = 'png'} = {}) { // Node.JS only
        return new Promise((resolve, reject) => {
            let out = createWriteStream(path);
            let canvas = this.getCanvas();
            let stream;
            switch (format.toLowerCase()) {
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
    checkProcessable(processName, {bitDepth, alpha, colorModel, components} = {}) {
        if (typeof processName !== 'string') {
            throw new TypeError('checkProcessable requires as first parameter the processName (a string)');
        }
        if (bitDepth) {
            if (!Array.isArray(bitDepth)) bitDepth = [bitDepth];
            if (bitDepth.indexOf(this.bitDepth) === -1) {
                throw new TypeError('The process: ' + processName + ' can only be applied if bit depth is in: ' + bitDepth);
            }
        }
        if (alpha) {
            if (!Array.isArray(alpha)) alpha = [alpha];
            if (alpha.indexOf(this.alpha) === -1) {
                throw new TypeError('The process: ' + processName + ' can only be applied if alpha is in: ' + alpha);
            }
        }
        if (colorModel) {
            if (!Array.isArray(colorModel)) colorModel = [colorModel];
            if (colorModel.indexOf(this.colorModel) === -1) {
                throw new TypeError('The process: ' + processName + ' can only be applied if color model is in: ' + colorModel);
            }
        }
        if (components) {
            if (!Array.isArray(components)) components = [components];
            if (components.indexOf(this.components) === -1) {
                throw new TypeError('The process: ' + processName + ' can only be applied if the number of channels is in: ' + components);
            }
        }
    }

    apply(filter) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let index = (y * this.width + x) * this.channels;
                filter.call(this, index);

            }
        }
    }
}

extend(Image);
bitMethods(Image);
