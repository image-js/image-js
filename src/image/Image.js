import bitMethods from './core/bitMethods';
import checkProcessable from './core/checkProcessable';
import exportMethods from './core/export';
import { extendMethod, extendProperty } from './core/extend';
import getRGBAData from './core/getRGBAData';
import {
  getKind,
  verifyKindDefinition,
  createPixelArray,
  getTheoreticalPixelArraySize,
} from './core/kind';
import { RGBA } from './core/kindNames';
import load from './core/load';
import valueMethods from './core/valueMethods';
import extend from './extend';
import getImageParameters from './internal/getImageParameters';
import RoiManager from './roi/manager';

const objectToString = Object.prototype.toString;

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
 *      Depending the bitDepth Uint8Array (1 bit), Uint8Array (8 bits),
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
  constructor(width, height, data, options) {
    if (arguments.length === 1) {
      options = width;
      ({ width, height, data } = options);
    } else if (data && !data.length) {
      options = data;
      ({ data } = options);
    }
    if (width === undefined) width = 1;
    if (height === undefined) height = 1;
    if (options === undefined) options = {};

    if (typeof options !== 'object' || options === null) {
      throw new TypeError('options must be an object');
    }

    if (!Number.isInteger(width) || width <= 0) {
      throw new RangeError('width must be a positive integer');
    }
    if (!Number.isInteger(height) || height <= 0) {
      throw new RangeError('height must be a positive integer');
    }

    const { kind = RGBA } = options;
    if (typeof kind !== 'string') {
      throw new TypeError('kind must be a string');
    }
    const theKind = getKind(kind);
    const kindDefinition = Object.assign({}, options);
    for (const prop in theKind) {
      if (kindDefinition[prop] === undefined) {
        kindDefinition[prop] = theKind[prop];
      }
    }
    verifyKindDefinition(kindDefinition);

    const { components, bitDepth, colorModel } = kindDefinition;
    const alpha = kindDefinition.alpha + 0;
    const size = width * height;
    const channels = components + alpha;
    const maxValue = bitDepth === 32 ? Number.MAX_VALUE : 2 ** bitDepth - 1;

    if (data === undefined) {
      data = createPixelArray(
        size,
        components,
        alpha,
        channels,
        bitDepth,
        maxValue,
      );
    } else {
      const expectedLength = getTheoreticalPixelArraySize(
        size,
        channels,
        bitDepth,
      );
      if (data.length !== expectedLength) {
        throw new RangeError(
          `incorrect data size: ${data.length}. Should be ${expectedLength}`,
        );
      }
    }

    /**
     * Width of the image.
     * @member {number}
     */
    this.width = width;

    /**
     * Height of the image.
     * @member {number}
     */
    this.height = height;

    /**
     * Typed array holding the image data.
     * @member {TypedArray}
     */
    this.data = data;

    /**
     * Total number of pixels (width * height).
     * @member {number}
     */
    this.size = size;

    /**
     * Number of color channels in the image.
     * A grey image has 1 component. An RGB image has 3 components.
     * @member {number}
     */
    this.components = components;

    /**
     * Alpha is 1 if there is an alpha channel, 0 otherwise.
     * @member {number}
     */
    this.alpha = alpha;

    /**
     * Number of bits per value in each channel.
     * @member {number}
     */
    this.bitDepth = bitDepth;

    /**
     * Maximum value that a pixel can have.
     * @member {number}
     */
    this.maxValue = maxValue;

    /**
     * Color model of the image.
     * @member {ColorModel}
     */
    this.colorModel = colorModel;

    /**
     * Total number of channels. Is equal to `image.components + image.alpha`.
     * @member {number}
     */
    this.channels = channels;

    /**
     * Metadata associated with the image.
     * @member {object}
     */
    this.meta = options.meta || {};

    // TODO review those props
    Object.defineProperty(this, 'parent', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: options.parent || null,
    });
    this.position = options.position || [0, 0];

    this.computed = null;
    this.sizes = [this.width, this.height];
    this.multiplierX = this.channels;
    this.multiplierY = this.channels * this.width;
    this.isClamped = this.bitDepth < 32;
    this.borderSizes = [0, 0]; // when a filter creates a border, it may have impact on future processing like Roi
  }

  get [Symbol.toStringTag]() {
    return 'IJSImage';
  }

  static isImage(object) {
    return objectToString.call(object) === '[object IJSImage]';
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
    const newOptions = getImageParameters(other);
    Object.assign(
      newOptions,
      {
        parent: other,
        position: [0, 0],
      },
      options,
    );
    return new Image(newOptions);
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
   * Create a copy a the current image, including its data.
   * @instance
   * @return {Image}
   */
  clone() {
    const newData = this.data.slice();
    return new Image(this.width, this.height, newData, this);
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
