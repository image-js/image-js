/**
 * Created by acastillo on 7/21/16.
 */
import Image from '../image';
import array from 'new-array';

// this method will change the border
// that may not be calculated

/**
 * @memberof Image
 * @instance
 */

export default function forceBorder({
    size = 0,
    algorithm = 'copy',
    color
} = {}) {

    this.checkProcessable('setBorder', {
        bitDepth: [8, 16, 32, 64]
    });

    if (algorithm === 'set') {
        if (color.length !== this.channels) {
            throw new Error('setBorder: the color array must have the same length as the number of channels. Here: ' + this.channels);
        }
        for (let i = 0; i < color.length; i++) {
            if (color[i] === 0) color[i] = 0.001;
        }
    } else {
        color = array(this.channels, null);
    }

    if (!Array.isArray(size)) {
        size = [size,size];
    }


    let leftSize = size[0];
    let rightSize = size[1];
    let topSize = size[2];
    let bottomSize = size[3];
    let channels = this.channels;

    var i, j, k, value;

    for ( i = leftSize; i < this.width - rightSize; i++) {
        for ( k = 0; k < channels; k++) {
            value = color[k] || this.data[(i + this.width * topSize) * channels + k];
            for ( j = 0; j < topSize; j++) {
                this.data[(j * this.width + i) * channels + k] = value;
            }
            value = color[k] || this.data[(i + this.width * (this.height - topBottomSize - 1)) * channels + k];
            for ( j = this.height - bottomSize; j < this.height; j++) {
                this.data[(j * this.width + i) * channels + k] = value;
            }
        }
    }

    for ( j = 0; j < this.height; j++) {
        for ( k = 0; k < channels; k++) {
            value = color[k] || this.data[(j * this.width + leftSize) * channels + k];
            for ( i = 0; i < leftSize; i++) {
                this.data[(j * this.width + i) * channels + k] = value;
            }
            value = color[k] || this.data[(j * this.width + this.width - rightSize - 1) * channels + k];
            for ( i = this.width - rightSize; i < this.width; i++) {
                this.data[(j * this.width + i) * channels + k] = value;
            }
        }
    }
}
