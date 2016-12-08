import {env} from './image/environment';

// Shim support for Array.prototype.includes
import arrayIncludes from 'array-includes';
arrayIncludes.shim();

module.exports = exports = require('./image/Image').default;
exports.Stack = require('./stack/Stack').default;
exports.Shape = require('./util/Shape').default;
exports.Kernel = require('./kernel/kernel');

exports.Static = {
    grey: require('./image/transform/greyAlgorithms').names,
    mask: require('./image/transform/mask/maskAlgorithms').names
};

if (env === 'browser') {
    exports.Worker = require('./worker/worker').default;
}
