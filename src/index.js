import {env} from './image/environment';

module.exports = exports = require('./image/image').default;
exports.Stack = require('./stack/stack').default;
exports.Kernel = require('./kernel/kernel');

if (env === 'browser') {
    exports.Worker = require('./worker/worker').default;
}
