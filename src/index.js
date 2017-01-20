module.exports = exports = require('./image/Image').default;
exports.Stack = require('./stack/Stack').default;
exports.Shape = require('./util/Shape').default;
exports.Kernel = require('./kernel/kernel');

exports.Static = {
    grey: require('./image/transform/greyAlgorithms').names,
    mask: require('./image/transform/mask/maskAlgorithms').names
};

exports.Worker = require('./worker/worker').default;
