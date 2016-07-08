
import Matrix from 'ml-matrix';


/**
 * @memberof Image
 * @instance
 */

export default function getMatrix({channel} = {}) {

    this.checkProcessable('getMatrix', {
        bitDepth: [8, 16]
    });

    if (channel === undefined) {
        if (this.components > 1) {
            throw new RangeError('You need to define the channel for an image that contains more than one channel');
        }
        channel = 0;
    }

    let matrix = new Array(this.height);
    for (let x = 0; x < this.height; x++) {
        matrix[x] = new Array(this.width);
    }
    for (let x = 0; x < this.height; x++) {
        for (let y = 0; y < this.width; y++) {
            matrix[x][y] = this.getValueXY(y,x,channel);
        }
    }

    return new Matrix(matrix);
}
