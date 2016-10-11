import {env} from './image/environment';

module.exports = exports = require('./image/Image').default;
exports.Stack = require('./stack/stack').default;
exports.Shape = require('./util/shape').default;
exports.Kernel = require('./kernel/kernel');

exports.Static = {
    grey: require('./image/transform/greyAlgorithms').names,
    mask: require('./image/transform/mask/maskAlgorithms').names
};

if (env === 'browser') {
    exports.Worker = require('./worker/worker').default;
}
