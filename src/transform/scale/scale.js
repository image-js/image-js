import Image from '../../image';

import nearestNeighbor from './nearestNeighbor';

export default function scale({
    width = this.width,
    height = this.height,
    algorithm = 'nearestNeighbor'
    } = {}) {

    let newImage = Image.createFrom(this, { width, height });

    switch (algorithm.toLowerCase()) {
        case 'nearestneighbor':
        case 'nearestneighbour':
            nearestNeighbor.call(this, newImage, width, height);
            break;
        default:
            throw new Error('Unsupported scale algorithm: ' + algorithm);
    }

    return newImage;
}
