'use strict';

import IJ from '../../ij';
import {RGB} from '../../model/models';

import luma709 from './luma709';
import luma601 from './luma601';
import minmax from './minmax';
import maximum from './maximum';
import average from './average';

export default function grey({algorithm = 'luma709'} = {}) {

    if (this.components === 1) {
        return this.clone();
    }

    this.checkProcessable('grey', {colorModel: RGB});

    var newImage = IJ.createFrom(this, {
        kind: {
            components: 1,
            alpha: this.alpha,
            bitDepth: this.bitDepth,
            colorModel: null
        }
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
            throw new Error ("Unsupported algorithm: "+algorithm);
    }


    return newImage;
}
