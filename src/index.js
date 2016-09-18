import {env} from './image/environment';

module.exports = exports = require('./image/image').default;
exports.Stack = require('./stack/stack').default;
exports.Kernel = require('./kernel/kernel');

exports.Algorithms = {
    grey : require('./image/transform/transformers').algorithms
};

if (env === 'browser') {
    exports.Worker = require('./worker/worker').default;
}
