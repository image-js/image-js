import {env} from './image/environment';

module.exports = exports = require('./image/image').default;
exports.Stack = require('./stack/stack').default;

if (env === 'browser') {
    exports.Worker = require('./worker/worker').default;
}
