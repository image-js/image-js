import Image from '../../image';
import {RGB} from '../../model/model';

import luma709 from './luma709';
import luma601 from './luma601';
import minmax from './minmax';
import maximum from './maximum';
import average from './average';

/**
 * Converts the current image to grey scale
 * @memberof Image
 * @instance
 * @returns {Image} - Grey scale image
 */

export default function grey({
    algorithm = 'luma709'
} = {}) {

    if (this.components === 1) {
        return this.clone();
    }

    this.checkProcessable('grey', {colorModel: RGB});

    // TODO: Could be optimized !
    // TODO: Should decide how to deal with alpha channel !
    switch (algorithm.toLowerCase()) {
        case 'red':
            return this.getChannel(0);
        case 'green':
            return this.getChannel(1);
        case 'blue':
            return this.getChannel(2);
        case 'cyan':
            return this.cmyk().getChannel(0);
        case 'magenta':
            return this.cmyk().getChannel(1);
        case 'yellow':
            return this.cmyk().getChannel(2);
        case 'black':
            return this.cmyk().getChannel(3);
        case 'hue':
            return this.hsl().getChannel(0);
        case 'saturation':
            return this.hsl().getChannel(1);
        case 'lightness':
            return this.hsl().getChannel(2);
    }


    let newImage = Image.createFrom(this, {
        components: 1,
        colorModel: null
    });

    switch (algorithm.toLowerCase()) {
        case 'luma709': // sRGB
            luma709.call(this, newImage);
            break;
        case 'luma601': // NTSC
            luma601.call(this, newImage);
            break;
        case 'minmax': // used in HSL color model
            minmax.call(this, newImage);
            break;
        case 'maximum':
            maximum.call(this, newImage);
            break;
        case 'average': // used in HSI color model
            average.call(this, newImage);
            break;
        default:
            throw new Error('Unsupported grey algorithm: ' + algorithm);
    }

    return newImage;
}
