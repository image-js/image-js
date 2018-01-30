import { canvasToBlob } from 'blob-util';
import extendObject from 'extend';
import { encode as encodeBmp } from 'fast-bmp';
import { encode as encodePng } from 'fast-png';
import hasOwn from 'has-own';

import { getKind, createPixelArray, getTheoreticalPixelArraySize } from './kind';
import { RGBA } from './kindNames';
import { ImageData, createCanvas, createWriteStream, writeFile } from './environment';
import extend from './extend';
import bitMethods from './bitMethods';
import { RGB } from './model/model';
import RoiManager from './roi/manager';
import { getType, canWrite } from './mediaTypes';
import { loadImage } from './load';
import Stack from '../stack/Stack';
import { toBase64URL } from '../util/base64';

let computedPropertyDescriptor = {
  configurable: true,
  enumerable: false,
  get: undefined
};

const toString = Object.prototype.toString;
const imageStringTag = 'IJSImage';

/**
 * Class representing an image.
 * This class allows to manipulate easily images directly in the browser or in node.
 *
 * This library is designed to deal with scientific images (8 or 16 bit depth) and will be able to open
 * and process jpeg, png and uncompressed tiff images. It is designed to work in the browser
 * as on the server side in node.
 *
 * An image is characterized by:
 * * width and height
 * * colorModel (RGB, HSL, CMYK, GREY, ...)
 * * components: number of components, Grey scale images will have 1 component while RGB will have 3 and CMYK 4.
 * * alpha: 0 or 1 depending if there is an alpha channel. The
 *      alpha channel define the opacity of each pixel
 * * channels: number of channels (components + alpha)
 * * bitDepth : number of bits to define the intensity of a point.
 *      The values may be 1 for a binary image (mask), 8 for a normal image (each
 *      channel contains values between 0 and 255) and 16 for scientific images
 *      (each channel contains values between 0 and 65535).
 *      The png library and tiff library included in image-js allow to deal correctly with
 *      8 and 16 bit depth images.
 * * position : an array of 2 elements that allows to define a relative position
 *      to a parent image. This will be used in a crop or in the management
 *      of Region Of Interests (Roi) for exmaple
 * * data : an array that contains all the points of the image.
 *      Depending the bitDepth Uint8Array (1 bit), Uint8ClampedArray (8 bits),
 *      Uint16Array (16 bits), Float32Array (32 bits)
 *
 * In an image we have pixels and points:
 * * A pixel is an array that has as size the number of channels
 * and that contains all the values that define a particular pixel of the image.
 * * A point is an array of 2 elements that contains the x / y coordinate
 * of a specific pixel of the image
 *
 *
 * @class Image
 * @param {number} [width=1]
 * @param {number} [height=1]
 * @param {Array} [data] - Image data to load
 * @param {object} options
 *
 * @example
 *
 * In order to run the next examples you will have to install node and
 * create a new project
 *
 * To install node you could use nvm that can be installed from
 * https://github.com/creationix/nvm
 *
 * Once nvm is install:
 * nvm install stable
 * nvm alias default stable
 *
 * You may then create a folder, go in this folder and install image-js
 * mkdir test-image-js
 * cd test-image-js
 * npm install image-js
 *
 * In the test-image-js folder please also store please a test.jpg image like
 * wget https://raw.githubusercontent.com/image-js/core/c44bb2a0a45d95f43f3c1f8ecb58ee7afa752bb9/test/img/cat.jpg


 * @example

 // javascript code using node to get some info about the image

 // we load the library that was install using 'npm install image-js'
 const {Image} = require('image-js');

 // loading an image is asynchronous and will return a promise.
 // once the promise has been resolved the function in the 'then' method will
 // be executed
 Image.load('cat.jpg').then(function(image) {
        console.log('Width',image.width);
        console.log('Height',image.height);
        console.log('colorModel', image.colorModel);
        console.log('components', image.components);
        console.log('alpha', image.alpha);
        console.log('channels', image.channels);
        console.log('bitDepth', image.bitDepth);
});

 @example
// Convert an image to grey scale
const {Image} =require('image-js');

Image.load('cat.jpg').then(function(image) {
    var grey=image.grey();
    grey.save('cat-grey.jpg');
});

 @example
 // Split a RGB image in it's components
 const {Image} = require('image-js');

 Image.load('cat.jpg').then(function(image) {
    var components=image.split();
    components[0].save('cat-red.jpg');
    components[1].save('cat-green.jpg');
    components[2].save('cat-blur.jpg');
});


 @example
 // for this example you will need the picture of an ecstasy pill that is available on
 // wget https://raw.githubusercontent.com/image-js/core/854e70f50d63cc73d2dde1d2020fe61ba1b5ec05/test/img/xtc.png // the goal is to isolate the picture and to get a RGB histogram of the pill.
 // Practically this allows to classify pills based on the histogram similarity
 // This work was published at: http://dx.doi.org/10.1016/j.forsciint.2012.10.004

 const {Image} = require('image-js');

 Image.load('xtc.png').then(function(image) {


    var grey=image.grey({
        algorithm:'lightness'
    });
    // we create a mask, which is basically a binary image
    // a mask has as source a grey image and we will decide how to determine
    // the threshold to define what is white and what is black
    var mask=grey.mask({
        algorithm: 'li'
    });

    // it is possible to create an array of Region Of Interest (Roi) using
    // the RoiManager. A RoiManager will be applied on the original image
    // in order to be able to extract from the original image the regions

    // the result of this console.log result can diretly be pasted
    // in the browser
    // console.log(mask.toDataURL());


    var manager = image.getRoiManager();
    manager.fromMask(mask);
    var rois=manager.getRoi({
        positive: true,
        negative: false,
        minSurface: 100
    });

    // console.log(rois);

    // we can sort teh rois by surface
    // for demonstration we use an arrow function
    rois.sort((a, b) => b.surface-a.surface);

    // the first Roi (the biggest is expected to be the pill)

    var pillMask=rois[0].getMask({
        scale: 0.7   // we will scale down the mask to take just the center of the pill and avoid border effects
    });

    // image-js remembers the parent of the image and the relative
    // position of a derived image. This is the case for a crop as
    // well as for Roi

    var pill=image.extract(pillMask);
    pill.save('pill.jpg');

    var histogram=pill.getHistograms({maxSlots: 16});

    console.log(histogram);
});

 @example
 // Example of use of IJS in the browser

 <sript>
    var canvas = document.getElementById('myCanvasID');
    var image = IJS.fromCanvas(canvas);
 </script>
*/
export default class Image {
  constructor(width = 1, height = 1, data, options) {
    // copy another image
    if (typeof width === 'object') {
      const otherImage = width;
      const cloneData = height === true;
      width = otherImage.width;
      height = otherImage.height;
      data = cloneData ? otherImage.data.slice() : otherImage.data;
      options = {
        position: otherImage.position,
        components: otherImage.components,
        alpha: otherImage.alpha,
        bitDepth: otherImage.bitDepth,
        colorModel: otherImage.colorModel,
        parent: otherImage,
        meta: otherImage.meta
      };
    }

    if (data && !data.length) {
      options = data;
      data = null;
    }
    if (options === undefined) {
      options = {};
    }

    if (width <= 0) {
      throw new RangeError('width must be greater than 0');
    }
    if (height <= 0) {
      throw new RangeError('height must be greater than 0');
    }

    this.width = width;
    this.height = height;

    Object.defineProperty(this, 'parent', {
      enumerable: false,
      writable: true,
      value: options.parent || null
    });
    this.position = options.position || [0, 0];

    let theKind;
    if (typeof options.kind === 'string') {
      theKind = getKind(options.kind);
      if (!theKind) {
        throw new RangeError(`invalid image kind: ${options.kind}`);
      }
    } else {
      theKind = getKind(RGBA);
    }

    let kindDefinition = extendObject({}, theKind, options);
    this.components = kindDefinition.components;
    this.alpha = kindDefinition.alpha + 0;
    this.bitDepth = kindDefinition.bitDepth;
    this.colorModel = kindDefinition.colorModel;
    this.meta = options.meta || {};

    this.computed = null;

    this.initialize();

    if (!data) data = createPixelArray(this);
    this.setData(data);
  }

  get [Symbol.toStringTag]() {
    return imageStringTag;
  }

  static isImage(img) {
    return toString.call(img) === `[object ${imageStringTag}]`;
  }

  initialize() {
    this.size = this.width * this.height;
    this.sizes = [this.width, this.height];
    this.channels = this.components + this.alpha;
    if (this.bitDepth === 32) {
      this.maxValue = Number.MAX_VALUE;
    } else {
      this.maxValue = 2 ** this.bitDepth - 1;
    }

    this.multiplierX = this.channels;
    this.multiplierY = this.channels * this.width;
    this.isClamped = this.bitDepth < 32;
    this.borderSizes = [0, 0]; // when a filter creates a border, it may have impact on future processing like Roi
  }

  setData(data) {
    let length = getTheoreticalPixelArraySize(this);
    if (length !== data.length) {
      throw new RangeError(`incorrect data size. Should be ${length} and found ${data.length}`);
    }
    this.data = data;
  }

  /**
     * Load an image
     * @param {string|ArrayBuffer|Buffer|Uint8Array} url - URL of the image (browser, can be a dataURL) or path (Node.js)
     * or buffer containing the binary data
     * @param {object} [options]
     * @return {Promise<Image>}
     * @example
     *  Image.load('http://xxxx').then(
     *      function(image) {
     *          console.log(image);
     *          // we can display the histogram of the first channel
     *          console.log(image.histograms[0]);
     *      }
     *  )
     */
  static load(url, options) {
    return loadImage(url, options);
  }

  /**
     * Creates an image from an HTML Canvas object
     * @param {Canvas} canvas
     * @return {Image}
     */
  static fromCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return new Image(imageData.width, imageData.height, imageData.data);
  }

  static extendMethod(name, method, options = {}) {
    let {
      inPlace = false,
      returnThis = true,
      partialArgs = [],
      stack = false
    } = options;

    if (inPlace) {
      Image.prototype[name] = function (...args) {
        // remove computed properties
        this.computed = null;
        let result = method.apply(this, [...partialArgs, ...args]);
        if (returnThis) {
          return this;
        }
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

  static extendProperty(name, method, options = {}) {
    let {
      partialArgs = []
    } = options;

    computedPropertyDescriptor.get = function () {
      if (this.computed === null) {
        this.computed = {};
      } else if (hasOwn(name, this.computed)) {
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
      position: [0, 0],
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
      throw new TypeError(`unknown operation: ${operation}`);
    }
  }

  getPixelIndex(indices) {
    let shift = 0;
    for (let i = 0; i < indices.length; i++) {
      shift += this.multipliers[i] * indices[i];
    }
    return shift;
  }

  /**
     * Set the value of specific pixel channel
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     * @param {number} channel
     * @param {number} value - the new value of this pixel channel
     * @return {this}
     */
  setValueXY(x, y, channel, value) {
    this.data[(y * this.width + x) * this.channels + channel] = value;
    this.computed = null;
    return this;
  }

  /**
     * Get the value of specific pixel channel
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     * @param {number} channel
     * @return {number} - the value of this pixel channel
     */
  getValueXY(x, y, channel) {
    return this.data[(y * this.width + x) * this.channels + channel];
  }

  /**
     * Set the value of specific pixel channel
     * @param {number} index - 1D index of the pixel
     * @param {number} channel
     * @param {number} value - the new value of this pixel channel
     * @return {this}
     */
  setValue(index, channel, value) {
    this.data[index * this.channels + channel] = value;
    this.computed = null;
    return this;
  }

  /**
     * Get the value of specific pixel channel
     * @param {number} index - 1D index of the pixel
     * @param {number} channel
     * @return {number} - the value of this pixel channel
     */
  getValue(index, channel) {
    return this.data[index * this.channels + channel];
  }

  /**
     * Set the value of an entire pixel
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     * @param {number[]} value - the new value of this pixel
     * @return {this}
     */
  setPixelXY(x, y, value) {
    return this.setPixel(y * this.width + x, value);
  }

  /**
     * Get the value of an entire pixel
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     * @return {number[]} the value of this pixel
     */
  getPixelXY(x, y) {
    return this.getPixel(y * this.width + x);
  }

  /**
     * Set the value of an entire pixel
     * @param {number} index - 1D index of the pixel
     * @param {number[]} value - the new value of this pixel
     * @return {this}
     */
  setPixel(index, value) {
    let target = index * this.channels;
    for (let i = 0; i < value.length; i++) {
      this.data[target + i] = value[i];
    }
    this.computed = null;
    return this;
  }

  /**
     * Get the value of an entire pixel
     * @param {number} index - 1D index of the pixel
     * @return {number[]} the value of this pixel
     */
  getPixel(index) {
    let value = new Array(this.channels);
    let target = index * this.channels;
    for (let i = 0; i < this.channels; i++) {
      value[i] = this.data[target + i];
    }
    return value;
  }

  /**
     * Creates a dataURL string from the image.
     * @param {string} [type='image/png']
     * @param {object} [options]
     * @param {boolean} [options.async=false] - Set to true to asynchronously generate the dataURL. This is required on Node.js for jpeg compression.
     * @param {boolean} [options.useCanvas=false] - Force use of the canvas API to save the image instead of JavaScript implementation.
     * @param {object} [options.encoder] - Specify options for the encoder if applicable.
     * @return {string|Promise<string>}
     */
  toDataURL(type = 'image/png', options = {}) {
    if (typeof type === 'object') {
      options = type;
      type = 'image/png';
    }
    const {
      async = false,
      useCanvas = false,
      encoder: encoderOptions = undefined
    } = options;
    type = getType(type);
    function dataUrl(encoder, ctx) {
      const u8 = encoder(ctx, encoderOptions);
      return toBase64URL(u8, type);
    }
    if (async) {
      return new Promise((resolve, reject) => {
        if (type === 'image/bmp') {
          resolve(dataUrl(encodeBmp, this));
        } else if (type === 'image/png' && canJSEncodePng(this) && !useCanvas) {
          resolve(dataUrl(encodePng, this));
        } else {
          this.getCanvas().toDataURL(type, function (err, text) {
            if (err) reject(err);
            else resolve(text);
          });
        }

      });
    } else {
      if (type === 'image/bmp') {
        return dataUrl(encodeBmp, this);
      } else if (type === 'image/png' && canJSEncodePng(this) && !useCanvas) {
        return dataUrl(encodePng, this);
      } else {
        return this.getCanvas().toDataURL(type);
      }
    }
  }

  /**
     * Creates a base64 string from the image.
     * @param {string} [type='image/png']
     * @param {object} [options] - Same options as toDataURL
     * @return {string|Promise<string>}
     */
  toBase64(type = 'image/png', options = {}) {
    if (options.async) {
      return this.toDataURL(type, options).then(function (dataURL) {
        return dataURL.substring(dataURL.indexOf(',') + 1);
      });
    } else {
      const dataURL = this.toDataURL(type, options);
      return dataURL.substring(dataURL.indexOf(',') + 1);
    }
  }

  /**
     * Creates a blob from the image and return a Promise.
     * @param {string} [type='image/png'] A String indicating the image format. The default type is image/png.
     * @param {string} [quality=0.8] A Number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp. If this argument is anything else, the default value for image quality is used. Other arguments are ignored.
     * @return {Promise}
     */
  toBlob(type = 'image/png', quality = 0.8) {
    return canvasToBlob(this.getCanvas({ originalData: true }), type, quality);
  }

  /**
     * Creates a new canvas element and draw the image inside it
     * @param {object} [options]
     * @param {boolean} [options.originalData=false]
     * @return {Canvas}
     */
  getCanvas(options = {}) {
    let { originalData = false } = options;
    let data;
    if (!originalData) {
      data = new ImageData(this.getRGBAData(), this.width, this.height);
    } else {
      this.checkProcessable('getInPlaceCanvas', {
        channels: [4],
        bitDepth: [8]
      });
      data = new ImageData(this.data, this.width, this.height);
    }
    let canvas = createCanvas(this.width, this.height);
    let ctx = canvas.getContext('2d');
    ctx.putImageData(data, 0, 0);
    return canvas;
  }

  /**
     * Retrieve the data of the current image as RGBA 8 bits
     * The source image may be:
     * * a mask (binary image)
     * * a grey image (8 or 16 bits) with or without alpha channel
     * * a color image (8 or 16 bits) with or without alpha channel in with RGB model
     * @instance
     * @return {Uint8ClampedArray} - Array with the data
     * @example
     * var imageData = image.getRGBAData();
     */
  getRGBAData() {
    this.checkProcessable('getRGBAData', {
      components: [1, 3],
      bitDepth: [1, 8, 16, 32]
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
    } else if (this.bitDepth === 32) {
      this.checkProcessable('getRGBAData', { alpha: 0 });
      // map minimum to 0 and maximum to 255
      const min = this.min;
      const max = this.max;
      const range = max - min;
      if (this.components === 1) {
        for (let i = 0; i < size; i++) {
          const val = (255 * (this.data[i * this.channels] - min) / range) >> 0;
          newData[i * 4] = val;
          newData[i * 4 + 1] = val;
          newData[i * 4 + 2] = val;
        }
      } else if (this.components === 3) {
        this.checkProcessable('getRGBAData', { colorModel: [RGB] });
        for (let i = 0; i < size; i++) {
          const val1 = (255 * (this.data[i * this.channels] - min) / range) >> 0;
          const val2 = (255 * (this.data[i * this.channels + 1] - min) / range) >> 0;
          const val3 = (255 * (this.data[i * this.channels + 2] - min) / range) >> 0;
          newData[i * 4] = val1;
          newData[i * 4 + 1] = val2;
          newData[i * 4 + 2] = val3;
        }
      }
    } else {
      if (this.components === 1) {
        for (let i = 0; i < size; i++) {
          newData[i * 4] = this.data[i * this.channels] >>> (this.bitDepth - 8);
          newData[i * 4 + 1] = this.data[i * this.channels] >>> (this.bitDepth - 8);
          newData[i * 4 + 2] = this.data[i * this.channels] >>> (this.bitDepth - 8);
        }
      } else if (this.components === 3) {
        this.checkProcessable('getRGBAData', { colorModel: [RGB] });
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
      this.checkProcessable('getRGBAData', { bitDepth: [8, 16] });
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

  /**
     * Create a new manager for regions of interest based on the current image.
     * @param {object} [options]
     * @return {RoiManager}
     */
  getRoiManager(options) {
    return new RoiManager(this, options);
  }

  /**
     * Create a new image based on the current image.
     * By default the method will copy the data
     * @instance
     * @param {object} options
     * @param {boolean} [options.copyData=true] - Specify if we want also to clone
     *          the data or only the image parameters (size, colorModel, ...)
     * @return {Image} - The source image clone
     * @example
     * var emptyImage = image.clone({copyData:false});
     */
  clone(options = {}) {
    const { copyData = true } = options;
    return new Image(this, copyData);
  }

  /**
     * Save the image to disk (Node.js only)
     * @param {string} path
     * @param {object} [options]
     * @param {string} [options.format] - One of: png, jpg, bmp (limited support for bmp). If not specified will try to infer from filename
     * @param {boolean} [options.useCanvas=false] - Force use of the canvas API to save the image instead of JavaScript implementation
     * @param {object} [options.encoder] - Specify options for the encoder if applicable.
     * @return {Promise} - Resolves when the file is fully written
     */
  save(path, options = {}) {
    const {
      useCanvas = false,
      encoder: encoderOptions = undefined
    } = options;

    let { format } = options;
    if (!format) {
      // try to infer format from filename
      const m = /\.([a-zA-Z]+)$/.exec(path);
      if (m) {
        format = m[1].toLowerCase();
      }
    }
    if (!format) {
      throw new Error('file format not provided');
    }
    return new Promise((resolve, reject) => {
      let stream, buffer;
      switch (format.toLowerCase()) {
        case 'png': {
          if (!canJSEncodePng(this) || useCanvas) {
            stream = this.getCanvas().pngStream();
          } else {
            buffer = encodePng(this, encoderOptions);
          }
          break;
        }
        case 'jpg':
        case 'jpeg':
          stream = this.getCanvas().jpegStream();
          break;
        case 'bmp':
          buffer = encodeBmp(this, encoderOptions);
          break;
        default:
          throw new RangeError(`invalid output format: ${format}`);
      }
      if (stream) {
        let out = createWriteStream(path);
        out.on('finish', resolve);
        out.on('error', reject);
        stream.pipe(out);
      } else if (buffer) {
        writeFile(path, Buffer.from(buffer), (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      }

    });
  }

  // this method check if a process can be applied on the current image
  checkProcessable(processName, options = {}) {
    let { bitDepth, alpha, colorModel, components, channels } = options;
    if (typeof processName !== 'string') {
      throw new TypeError('checkProcessable requires as first parameter the processName (a string)');
    }
    if (bitDepth) {
      if (!Array.isArray(bitDepth)) {
        bitDepth = [bitDepth];
      }
      if (!bitDepth.includes(this.bitDepth)) {
        throw new TypeError(`The process: ${processName} can only be applied if bit depth is in: ${bitDepth}`);
      }
    }
    if (alpha) {
      if (!Array.isArray(alpha)) {
        alpha = [alpha];
      }
      if (!alpha.includes(this.alpha)) {
        throw new TypeError(`The process: ${processName} can only be applied if alpha is in: ${alpha}`);
      }
    }
    if (colorModel) {
      if (!Array.isArray(colorModel)) {
        colorModel = [colorModel];
      }
      if (!colorModel.includes(this.colorModel)) {
        throw new TypeError(`The process: ${processName} can only be applied if color model is in: ${colorModel}`);
      }
    }
    if (components) {
      if (!Array.isArray(components)) {
        components = [components];
      }
      if (!components.includes(this.components)) {
        let errorMessage = `The process: ${processName} can only be applied if the number of components is in: ${components}`;
        if (components.length === 1 && components[0] === 1) {
          throw new TypeError(`${errorMessage}.\rYou should transform your image using "image.grey()" before applying the algorithm.`);
        } else {
          throw new TypeError(errorMessage);
        }
      }
    }
    if (channels) {
      if (!Array.isArray(channels)) {
        channels = [channels];
      }
      if (!channels.includes(this.channels)) {
        throw new TypeError(`The process: ${processName} can only be applied if the number of channels is in: ${channels}`);
      }
    }
  }

  checkColumn(column) {
    if ((column < 0) || (column >= this.width)) {
      throw new RangeError(`checkColumn: column should be included between 0 and ${this.width - 1}. Current value: ${column}`);
    }
  }

  checkRow(row) {
    if ((row < 0) || (row >= this.height)) {
      throw new RangeError(`checkRow: row should be included between 0 and ${this.height - 1}. Current value: ${row}`);
    }
  }

  checkChannel(channel) {
    if ((channel < 0) || (channel >= this.channels)) {
      throw new RangeError(`checkChannel: channel should be included between 0 and ${this.channels - 1}. Current value: ${channel}`);
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

function canJSEncodePng(img) {
  return (img.bitDepth === 8 || img.bitDepth === 16);
}

extend(Image);
bitMethods(Image);
