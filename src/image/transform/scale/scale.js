import Image from '../../Image';

import nearestNeighbor from './nearestNeighbor';
import {factorDimensions} from '../../../util/converter';

/**
 * Rescale an image
 * @memberof Image
 * @instance
 * @param {number} [width=this.width]
 * @param {number} [height=this.height]
 * @param {number} [factor=1]
 * @param {string} [algorithm='nearestNeighbor']
 */


export default function scale(options = {}) {
    const {
        width = this.width,
        height = this.height,
        factor = 1,
        algorithm = 'nearestNeighbor'
    } = options;


    const {width: newWidth, height: newHeight} = factorDimensions(factor, width, height);

    let newImage = Image.createFrom(this, {width: newWidth, height: newHeight});

    switch (algorithm.toLowerCase()) {
        case 'nearestneighbor':
        case 'nearestneighbour':
            nearestNeighbor.call(this, newImage, newWidth, newHeight);
            break;
        default:
            throw new Error('Unsupported scale algorithm: ' + algorithm);
    }

    return newImage;
}
