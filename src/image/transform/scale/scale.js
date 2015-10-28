import Image from '../../image';

import nearestNeighbor from './nearestNeighbor';
import bilinear from './bilinear';
import {factorDimensions} from '../../../util/converter';

export default function scale({
    width = this.width,
    height = this.height,
    factor = 1,
    algorithm = 'nearestNeighbor'
    } = {}) {

    const {width: newWidth, height: newHeight} = factorDimensions(factor, width, height);

    let newImage = Image.createFrom(this, { width: newWidth, height: newHeight });

    switch (algorithm.toLowerCase()) {
        case 'nearestneighbor':
        case 'nearestneighbour':
            nearestNeighbor.call(this, newImage, newWidth, newHeight);
            break;
        case 'bilinear':
            bilinear.call(this, newImage, newWidth, newHeight);
            break;
        default:
            throw new Error('Unsupported scale algorithm: ' + algorithm);
    }

    return newImage;
}
