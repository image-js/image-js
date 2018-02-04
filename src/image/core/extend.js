import hasOwn from 'has-own';

import Image from '../Image';

let computedPropertyDescriptor = {
  configurable: true,
  enumerable: false,
  get: undefined
};

export function extendMethod(name, method, options = {}) {
  let {
    inPlace = false,
    returnThis = true,
    partialArgs = []
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
  } else {
    Image.prototype[name] = function (...args) {
      return method.apply(this, [...partialArgs, ...args]);
    };
  }
  return Image;
}

export function extendProperty(name, method, options = {}) {
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
