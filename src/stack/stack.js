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

Stack.prototype.push = Array.prototype.push;

extend(Stack);
