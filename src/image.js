import {getKind, getPixelArray, getPixelArraySize} from './kind';
import {RGBA} from './kindNames';
import {ImageData, Canvas} from './environment';
import extend from './extend';
import {createWriteStream} from 'fs';
import {RGB} from './model/model';
import ROIManager from './roi/manager';
import {getType, canWrite} from './mediaTypes';
import extendObject from 'extend';
import {loadURL} from './load';



let computedPropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get: undefined
};

export default
class Image {
        constructor(width, height, data, options) { // or (sizes, data, options)
        if (Array.isArray(width)) { // we need to give an array with ALL the dimensions
            options=data;
            data=height;
            this.sizes=width;
        } else {
            if (width === undefined) width = 1;
            if (height === undefined) height = 1;
            this.sizes=[width, height];
        }
        if (data && !data.length) {
            options = data;
            data = null;
        }
        if (options === undefined) options = {};

        if (!(this.sizes[0] > 0)) {
            throw new RangeError('width must be greater than 0');
        }
        if (!(this.sizes[1] > 0)) {
            throw new RangeError('height must be greater than 0');
        }

        // We will set the parent image for relative position

        Object.defineProperty(this, 'parent', {enumerable:false, writable: true});
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
        this.alpha = kindDefinition.alpha;
        this.bitDepth = kindDefinition.bitDepth;
        this.colorModel = kindDefinition.colorModel;

        this.computed = {};

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
        this.dimension=this.sizes.length;
        this.width=this.sizes[0];
        this.height=this.sizes[1];

        let size=1;
        for (let i=0; i<this.sizes.length; i++) {
            size*=this.sizes[i];
        }
        this.size=size; // the number of pixels

        this.channels=this.components + this.alpha;
        this.maxValue=(1 << this.bitDepth) - 1;

        let multipliers=[this.dimension];
        multipliers[0]=this.channels;
        for (let i=1; i<this.dimension; i++) {
            multipliers[i]=multipliers[i-1]*this.sizes[i-1];
        }
        this.multipliers=multipliers;
    }



    static load(url) {
        return loadURL(url);
    }

    static extendMethod(name, method, {inPlace = false, returnThis = true, partialArgs = []} = {}) {
        if (inPlace) {
            Image.prototype[name] = function (...args) {
                // reset computed properties
                this.computed = {};
                let result = method.apply(this, [...partialArgs, ...args]);
                if (returnThis)
                    return this;
                return result;
            };
        } else {
            Image.prototype[name] = function (...args) {
                return method.apply(this, [...partialArgs, ...args]);
            };
        }
        return Image;
    }

    static extendProperty(name, method, {partialArgs = []} = {}) {
        computedPropertyDescriptor.get = function () {
            if (this.computed.hasOwnProperty(name)) {
                return this.computed[name];
            } else {
                let result = method.apply(this, partialArgs);
                this.computed[name] = result;
                return result;
            }
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
        let shift=0;
        for (let i=0; i<indices.length; i++) {
            shift+=this.multipliers[i]*indices[i];
        }
        return shift;
    }

    setValueXY(x, y, channel, value) {
        this.data[(y * this.width + x) * this.channels + channel] = value;
    }

    getValueXY(x, y, channel) {
        return this.data[(y * this.width + x) * this.channels + channel];
    }

    setValue(pixel, channel, value) {
        this.data[pixel * this.channels + channel] = value;
    }

    getValue(pixel, channel) {
        return this.data[pixel * this.channels + channel];
    }

    setPixelXY(x, y, value) {
        this.setPixel(y * this.width + x, value);
    }

    getPixelXY(x, y) {
        return this.getPixel(y * this.width + x);
    }

    setPixel(pixel, value) {
        let target = pixel * this.channels;
        for (let i = 0; i < value.length; i++) {
            this.data[target + i] = value[i];
        }
    }

    getPixel(pixel) {
        let value = new Array(this.channels);
        let target = pixel * this.channels;
        for (let i = 0; i < this.channels; i++) {
            value[i] = this.data[target + i];
        }
        return value;
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
                    newData[i * 4] = this.data[i * (1 + this.alpha)] >> (this.bitDepth - 8);
                    newData[i * 4 + 1] = this.data[i * (1 + this.alpha)] >> (this.bitDepth - 8);
                    newData[i * 4 + 2] = this.data[i * (1 + this.alpha)] >> (this.bitDepth - 8);
                }
            } else if (this.components === 3) {
                this.checkProcessable('getRGBAData', {colorModel: [RGB]});
                if (this.colorModel === RGB) {
                    for (let i = 0; i < size; i++) {
                        newData[i * 4] = this.data[i * 4] >> (this.bitDepth - 8);
                        newData[i * 4 + 1] = this.data[i * 4 + 1] >> (this.bitDepth - 8);
                        newData[i * 4 + 2] = this.data[i * 4 + 2] >> (this.bitDepth - 8);
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

    // those methods can only apply on binary images ... but we will not loose time to check !
    setBitXY(x, y) {
        let target = y * this.width + x;
        let shift = 7 - (target & 0b00000111);
        let slot = target >> 3;
        this.data[slot] |= 1 << shift;
    }

    clearBitXY(x, y) {
        let target = y * this.width + x;
        let shift = 7 - (target & 0b00000111);
        let slot = target >> 3;
        this.data[slot] &= ~(1 << shift);
    }

    toggleBitXY(x, y) {
        let target = y * this.width + x;
        let shift = 7 - (target & 0b00000111);
        let slot = target >> 3;
        this.data[slot] ^= 1 << shift;
    }

    getBitXY(x, y) {
        let target = y * this.width + x;
        let shift = 7 - (target & 0b00000111);
        let slot = target >> 3;
        return (this.data[slot] & 1 << shift) ? 1 : 0;
    }

    setBit(pixel) {
        let shift = 7 - (pixel & 0b00000111);
        let slot = pixel >> 3;
        this.data[slot] |= 1 << shift;
    }

    clearBit(pixel) {
        let shift = 7 - (pixel & 0b00000111);
        let slot = pixel >> 3;
        this.data[slot] &= ~(1 << shift);
    }

    toggleBit(pixel) {
        let shift = 7 - (pixel & 0b00000111);
        let slot = pixel >> 3;
        this.data[slot] ^= 1 << shift;
    }

    getBit(pixel) {
        let shift = 7 - (pixel & 0b00000111);
        let slot = pixel >> 3;
        return (this.data[slot] & 1 << shift) ? 1 : 0;
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
    checkProcessable(processName, {
        bitDepth, alpha, colorModel, components, dimension
        } = {}) {
        if (typeof processName !== 'string') {
            throw new TypeError('checkProcessable requires as first parameter the processName (a string)');
        }
        if (bitDepth) {
            if (!Array.isArray(bitDepth)) bitDepth = [bitDepth];
            if (bitDepth.indexOf(this.bitDepth) === -1) {
                throw new TypeError('The process: ' + processName + ' can only be applied if bit depth is in: ' + bitDepth);
            }
        }
        if (dimension) {
            if (!Array.isArray(dimension)) dimension = [dimension];
            if (dimension.indexOf(this.dimension) === -1) {
                throw new TypeError('The process: ' + processName + ' can only be applied if the image has as dimension: ' + dimension);
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

    applyAll(filter) {
        let maxValue=new Array(this.sizes.length);
        for (let i=0; i<this.sizes.length; i++) {
            maxValue[i]=this.sizes[i]-1;
        }
        let currents=new Uint16Array(this.dimension);
        let position=0;
        while (true) {
            // TODO this may be quite the limiting step and inline does not help
            // we could optimize it by keeping track of previously partical
            // calculated indices
            let index=this.getPixelIndex(currents);
            filter.call(this, index);
            if (currents[position]===maxValue[position]) {
                while (position<currents.length && currents[position]===maxValue[position]) {
                    currents[position]=0;
                    position++;
                }
                if (position===currents.length) {
                    break;
                }
                currents[position]++;
                position=0;
            } else {
                currents[position]++;
            }
        }
    }



    // This approach is SOOOO slow .... for now just forget about it !
    /**pixels() {
        let toYield = {x: 0, y: 0, index: 0, pixel: new Array(this.channels)};
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                toYield.x = x;
                toYield.y = y;
                toYield.index = y * this.width + x;
                for (let c = 0; c < this.channels; c++) {
                    toYield.pixel[c] = this.data[toYield.index * this.channels + c];
                }
                yield toYield;
            }
        }
    }*/
}

extend(Image);
