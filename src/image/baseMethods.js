import {encode as encodeBmp} from 'fast-bmp';

import {loadImage} from './load';
import {getType, canWrite} from './mediaTypes';
import RoiManager from './roi/manager';
import {encode as base64Encode} from '../util/base64';
import Stack from '../stack/Stack';

const baseStaticMethods = {
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
    load(url, options) {
        return loadImage(url, options);
    },

    extendMethod(name, method, options = {}) {
        const Image = this;

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
    },

    isTypeSupported(type, operation = 'write') {
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
};

const baseMethods = {
    /**
     * Creates a dataURL string from the image.
     * @memberof Image
     * @instance
     * @param {string} [type='image/png']
     * @param {boolean} [async=false] - set to true to asynchronously generate the dataURL
     * This is required on Node.js for jpeg compression.
     * @return {string|Promise<string>}
     */
    toDataURL(type = 'image/png', async = false) {
        type = getType(type);
        function bmpUrl(ctx) {
            const u8 = encodeBmp(ctx);
            const base64 = base64Encode(u8);
            return `data:${type};base64,${base64}`;
        }
        if (async) {
            return new Promise((resolve, reject) => {
                if (type === 'image/bmp') {
                    resolve(bmpUrl(this));
                } else {
                    this.getCanvas().toDataURL(type, function (err, text) {
                        if (err) reject(err);
                        else resolve(text);
                    });
                }

            });
        } else {
            if (type === 'image/bmp') {
                return bmpUrl(this);
            } else {
                return this.getCanvas().toDataURL(type);
            }
        }
    },

    /**
     * Create a new manager for regions of interest based on the current image.
     * @memberof Image
     * @instance
     * @param {object} [options]
     * @return {RoiManager}
     */
    getRoiManager(options) {
        return new RoiManager(this, options);
    }
};

export default function (Image) {
    for (const i in baseStaticMethods) {
        Image[i] = baseStaticMethods[i];
    }
    for (const i in baseMethods) {
        Image.prototype[i] = baseMethods[i];
    }
}
