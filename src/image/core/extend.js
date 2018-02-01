import hasOwn from 'has-own';

import Image from '../Image';
import Stack from '../../stack/Stack';

let computedPropertyDescriptor = {
  configurable: true,
  enumerable: false,
  get: undefined
};

export function extendMethod(name, method, options = {}) {
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
