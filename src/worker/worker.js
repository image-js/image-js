import Image from '../image/image';
import extend from './extend';

class Worker {
    constructor() {
        this._url = null;
        this._deps = [null];
    }
    checkUrl() {
        if (this._url === null) {
            throw new Error('image worker must be initialized with an URL');
        }
    }
    get url() {
        return this._url;
    }
    set url(value) {
        if (typeof value !== 'string') {
            throw new TypeError('worker URL must be a string');
        }
        this._url = value;
        this._deps[0] = value;
    }
    static extendMethod(name, method) {
        Worker.prototype[name] = function (...args) {
            this.checkUrl();
            return method.call(this, ...args);
        };
    }
}

extend(Worker);

export default new Worker();
