'use strict';

// filters
import invert from './filter/invert';

// transformers
import crop from './transform/crop';
import grey from './transform/grey';

export default function extend(IJ) {
    IJ.extend('invert', invert, true);

    IJ.extend('crop', crop);
    IJ.extend('grey', grey);
    IJ.extend('gray', grey);
}
