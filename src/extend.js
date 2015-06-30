'use strict';

// filters
import invert from './filter/invert';

// transformers
import crop from './transform/crop';

export default function extend(IJ) {
    IJ.extend('invert', invert, true);

    IJ.extend('crop', crop);
}
