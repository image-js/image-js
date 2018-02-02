import extendObject from 'extend';

import bitMethods from './core/bitMethods';
import checkProcessable from './core/checkProcessable';
import exportMethods from './core/export';
import { extendMethod, extendProperty } from './core/extend';
import getRGBAData from './core/getRGBAData';
import {
  getKind,
  createPixelArray,
  getTheoreticalPixelArraySize
} from './core/kind';
import { RGBA } from './core/kindNames';
import load from './core/load';
import { getType, canWrite } from './core/mediaTypes';
import valueMethods from './core/valueMethods';
import extend from './extend';
import RoiManager from './roi/manager';

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
 * In an image there are pixels and points:
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
 * @param {object} [options]
 *
 *
 * @example
 * // JavaScript code using Node.js to get some info about the image.
 * // We load the library that was installed using 'npm install image-js'
 * const { Image } = require('image-js');
 *
 * // Loading an image is asynchronous and will return a Promise.
 * Image.load('cat.jpg').then(function (image) {
 *   console.log('Width', image.width);
 *   console.log('Height', image.height);
 *   console.log('colorModel', image.colorModel);
 *   console.log('components', image.components);
 *   console.log('alpha', image.alpha);
 *   console.log('channels', image.channels);
 *   console.log('bitDepth', image.bitDepth);
 * });
 *
 * @example
 * // Convert an image to greyscale
 * const { Image } = require('image-js');
 *
 * Image.load('cat.jpg').then(function (image) {
 *   var grey = image.grey();
 *   grey.save('cat-grey.jpg');
 * });
 *
 * @example
 * // Split an RGB image in its components
 * const { Image } = require('image-js');
 *
 * Image.load('cat.jpg').then(function (image) {
 *   var components = image.split();
 *   components[0].save('cat-red.jpg');
 *   components[1].save('cat-green.jpg');
 *   components[2].save('cat-blur.jpg');
 * });
 *
 *
 * @example
 * // For this example you will need the picture of an ecstasy pill that is available on
 * // wget https://raw.githubusercontent.com/image-js/core/854e70f50d63cc73d2dde1d2020fe61ba1b5ec05/test/img/xtc.png // the goal is to isolate the picture and to get a RGB histogram of the pill.
 * // Practically this allows to classify pills based on the histogram similarity
 * // This work was published at: http://dx.doi.org/10.1016/j.forsciint.2012.10.004
 *
 * const { Image } = require('image-js');
 *
 * const image = await Image.load('xtc.png');
 *
 * const grey = image.grey({
 *   algorithm:'lightness'
 * });
 * // we create a mask, which is basically a binary image
 * // a mask has as source a grey image and we will decide how to determine
 * // the threshold to define what is white and what is black
 * var mask = grey.mask({
 *   algorithm: 'li'
 * });
 *
 * // it is possible to create an array of Region Of Interest (Roi) using
 * // the RoiManager. A RoiManager will be applied on the original image
 * // in order to be able to extract from the original image the regions
 *
 * // the result of this console.log result can diretly be pasted
 * // in the browser
 * // console.log(mask.toDataURL());
 *
 *
 * var manager = image.getRoiManager();
 * manager.fromMask(mask);
 * var rois = manager.getRoi({
 *   positive: true,
 *   negative: false,
 *   minSurface: 100
 * });
 *
 * // console.log(rois);
 *
 * // we can sort teh rois by surface
 * // for demonstration we use an arrow function
 * rois.sort((a, b) => b.surface - a.surface);
 *
 * // the first Roi (the biggest is expected to be the pill)
 *
 * var pillMask = rois[0].getMask({
 *   scale: 0.7   // we will scale down the mask to take just the center of the pill and avoid border effects
 * });
 *
 * // image-js remembers the parent of the image and the relative
 * // position of a derived image. This is the case for a crop as
 * // well as for Roi
 *
 * var pill = image.extract(pillMask);
 * pill.save('pill.jpg');
 *
 * var histogram = pill.getHistograms({ maxSlots: 16 });
 *
 * console.log(histogram);
 *
 * @example
 * // Example of use of IJS in the browser
 *
 * <script>
 *  var canvas = document.getElementById('myCanvasID');
 *  var image = IJS.fromCanvas(canvas);
 * </script>
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

    if (!data) data = createPixelArray(this);
    this.setData(data);
  }

  get [Symbol.toStringTag]() {
    return 'IJSImage';
  }

  /**
   * Replace the internal array that holds the image's data.
   * @param {Array|TypedArray} data
   */
  setData(data) {
    let length = getTheoreticalPixelArraySize(this);
    if (length !== data.length) {
      throw new RangeError(`incorrect data size. Should be ${length} and found ${data.length}`);
    }
    this.data = data;
    this.computed = null;
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

  /**
   * Create a new Image based on the characteristics of another one.
   * @param {Image} other
   * @param {object} [options] - Override options to change some parameters
   * @return {Image}
   * @example
   * const newImage = Image.createFrom(image, { width: 100 });
   */
  static createFrom(other, options) {
    const newOptions = {
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
   * Create a new manager for regions of interest based on the current image.
   * @param {object} [options]
   * @return {RoiManager}
   */
  getRoiManager(options) {
    return new RoiManager(this, options);
  }

  /**
   * Create a new image based on the current image.
   * By default the method will copy the data.
   * @instance
   * @param {object} options
   * @param {boolean} [options.copyData=true] - Specify if we want also to clone
   *          the data or only the image parameters (size, colorModel, ...)
   * @return {Image} - The source image clone
   * @example
   * var emptyImage = image.clone({ copyData: false });
   */
  clone(options = {}) {
    const { copyData = true } = options;
    return new Image(this, copyData);
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

valueMethods(Image);
bitMethods(Image);
exportMethods(Image);

Image.prototype.checkProcessable = checkProcessable;
Image.prototype.getRGBAData = getRGBAData;

Image.load = load;
Image.extendMethod = extendMethod;
Image.extendProperty = extendProperty;
extend(Image);
