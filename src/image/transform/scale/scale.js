import Image from '../../Image';

import nearestNeighbor from './nearestNeighbor';
import {factorDimensions} from '../../../util/converter';

/**
 * Rescale an image
 * @memberof Image
 * @instance
 * @param {Object} [options]
 * @param {number} [options.width=this.width] - new width
 * @param {number} [options.height=this.height] - new height
 * @param {number} [options.factor=1] - scaling factor (applied to the new width and height values)
 * @param {string} [options.algorithm='nearestNeighbor']
 */
export default function scale(options = {}) {
    const {
        width = this.width,
        height = this.height,
        factor = 1,
        algorithm = 'nearestNeighbor'
    } = options;

    const {width: newWidth, height: newHeight} = factorDimensions(factor, width, height);

    const newImage = Image.createFrom(this, {width: newWidth, height: newHeight});

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
