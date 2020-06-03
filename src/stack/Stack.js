import hasOwn from 'has-own';

import Image from '../image/Image';

import extend from './extend';

let computedPropertyDescriptor = {
  configurable: true,
  enumerable: false,
  get: undefined,
};

/**
 * Class representing stack of images
 * @class Stack
 */
export default class Stack extends Array {
  constructor(images) {
    if (Array.isArray(images)) {
      super(images.length);
      for (let i = 0; i < images.length; i++) {
        this[i] = images[i];
      }
    } else if (typeof images === 'number') {
      super(images);
    } else {
      super();
    }
    this.computed = null;
  }

  static load(urls) {
    return Promise.all(urls.map(Image.load)).then(
      (images) => new Stack(images),
    );
  }

  static extendMethod(name, method, options = {}) {
    let { inPlace = false, returnThis = true, partialArgs = [] } = options;

    if (inPlace) {
      Stack.prototype[name] = function (...args) {
        // remove computed properties
        this.computed = null;
        let result = method.apply(this, [...partialArgs, ...args]);
        if (returnThis) {
          return this;
        }
        return result;
      };
    } else {
      Stack.prototype[name] = function (...args) {
        return method.apply(this, [...partialArgs, ...args]);
      };
    }
    return Stack;
  }

  static extendProperty(name, method, options = {}) {
    let { partialArgs = [] } = options;

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
    Object.defineProperty(Stack.prototype, name, computedPropertyDescriptor);
    return Stack;
  }

  /**
   * Check if a process can be applied on the stack
   * @param {string} processName
   * @param {object} [options]
   * @private
   */
  checkProcessable(processName, options = {}) {
    if (typeof processName !== 'string') {
      throw new TypeError(
        'checkProcessable requires as first parameter the processName (a string)',
      );
    }
    if (this.size === 0) {
      throw new TypeError(
        `The process: ${processName} can not be applied on an empty stack`,
      );
    }
    this[0].checkProcessable(processName, options);
    for (let i = 1; i < this.length; i++) {
      if (
        (options.sameSize === undefined || options.sameSize) &&
        this[0].width !== this[i].width
      ) {
        throw new TypeError(
          `The process: ${processName} can not be applied if width is not identical in all images`,
        );
      }
      if (
        (options.sameSize === undefined || options.sameSize) &&
        this[0].height !== this[i].height
      ) {
        throw new TypeError(
          `The process: ${processName} can not be applied if height is not identical in all images`,
        );
      }
      if (
        (options.sameAlpha === undefined || options.sameAlpha) &&
        this[0].alpha !== this[i].alpha
      ) {
        throw new TypeError(
          `The process: ${processName} can not be applied if alpha is not identical in all images`,
        );
      }
      if (
        (options.sameBitDepth === undefined || options.sameBitDepth) &&
        this[0].bitDepth !== this[i].bitDepth
      ) {
        throw new TypeError(
          `The process: ${processName} can not be applied if bitDepth is not identical in all images`,
        );
      }
      if (
        (options.sameColorModel === undefined || options.sameColorModel) &&
        this[0].colorModel !== this[i].colorModel
      ) {
        throw new TypeError(
          `The process: ${processName} can not be applied if colorModel is not identical in all images`,
        );
      }
      if (
        (options.sameNumberChannels === undefined ||
          options.sameNumberChannels) &&
        this[0].channels !== this[i].channels
      ) {
        throw new TypeError(
          `The process: ${processName} can not be applied if channels is not identical in all images`,
        );
      }
    }
  }
}

if (!Array[Symbol.species]) {
  // support old engines
  Stack.prototype.map = function (cb, thisArg) {
    if (typeof cb !== 'function') {
      throw new TypeError(`${cb} is not a function`);
    }
    let newStack = new Stack(this.length);
    for (let i = 0; i < this.length; i++) {
      newStack[i] = cb.call(thisArg, this[i], i, this);
    }
    return newStack;
  };
}

extend(Stack);
