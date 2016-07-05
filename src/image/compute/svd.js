let Matrix = require('ml-matrix');

/**
 * @memberof Image
 * @instance
 */


export default function getSVD() {
    this.checkProcessable('getSVD', {
        bitDepth: [1]
    });

    return Matrix.DC.SVD(this.pixelsArray);
}
