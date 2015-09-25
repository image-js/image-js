import extend from './extend';

let computedPropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get: undefined
};

export default function Stack(images) {
    let stack;
    if (Array.isArray(images)) {
        stack = new Array(images.length);
        for (let i = 0; i < images.length; i++) {
            stack[i] = images[i];
        }
    } else if (typeof images === 'number') {
        stack = new Array(images);
    } else {
        stack = [];
    }
    stack.computed = null;
    stack.__proto__ = Stack.prototype;
    return stack;
}

Stack.extendMethod = function extendMethod(name, method, {inPlace = false, returnThis = true, partialArgs = []} = {}) {
    if (inPlace) {
        Stack.prototype[name] = function (...args) {
            // remove computed properties
            this.computed = null;
            let result = method.apply(this, [...partialArgs, ...args]);
            if (returnThis)
                return this;
            return result;
        };
    } else {
        Stack.prototype[name] = function (...args) {
            return method.apply(this, [...partialArgs, ...args]);
        };
    }
    return Stack;
};

Stack.extendProperty = function extendProperty(name, method, {partialArgs = []} = {}) {
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
    Object.defineProperty(Stack.prototype, name, computedPropertyDescriptor);
    return Stack;
};

Stack.__proto__ = Array;
Stack.prototype.__proto__ = Array.prototype;
Stack.prototype.map = function (cb, thisArg) {
    if (typeof cb !== 'function') {
        throw new TypeError(cb + ' is not a function');
    }
    let newStack = new Stack(this.length);
    for (let i = 0; i < this.length; i++) {
        newStack[i] = cb.call(thisArg, this[i], i, this);
    }
    return newStack;
};

// this method check if a process can be applied on the current image
Stack.prototype.checkProcessable = function (processName, options = {}) {
    if (typeof processName !== 'string') {
        throw new TypeError('checkProcessable requires as first parameter the processName (a string)');
    }
    if (this.size === 0) {
        throw new TypeError('The process: ' + processName + ' can not be applied on an empty stack');
    }
    this[0].checkProcessable(processName, options);
    for (let i = 1; i < this.length; i++) {
        if ((options.sameSize === undefined || options.sameSize) && this[0].width !== this[i].width) {
            throw new TypeError('The process: ' + processName + ' can not be applied if width is not identical in all images');
        }
        if ((options.sameSize === undefined || options.sameSize) && this[0].height !== this[i].height) {
            throw new TypeError('The process: ' + processName + ' can not be applied if height is not identical in all images');
        }
        if ((options.sameAlpha === undefined || options.sameAlpha) && this[0].alpha !== this[i].alpha) {
            throw new TypeError('The process: ' + processName + ' can not be applied if alpha is not identical in all images');
        }
        if ((options.sameBitDepth === undefined || options.sameBitDepth) && this[0].bitDepth !== this[i].bitDepth) {
            throw new TypeError('The process: ' + processName + ' can not be applied if bitDepth is not identical in all images');
        }
        if ((options.sameColorModel === undefined || options.sameColorModel) && this[0].colorModel !== this[i].colorModel) {
            throw new TypeError('The process: ' + processName + ' can not be applied if colorModel is not identical in all images');
        }
        if ((options.sameNumberChannels === undefined || options.sameNumberChannels) && this[0].channels !== this[i].channels) {
            throw new TypeError('The process: ' + processName + ' can not be applied if channels is not identical in all images');
        }
    }
};

extend(Stack);
