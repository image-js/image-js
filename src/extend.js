'use strict';

// filters
import invert from './filters/invert';

export default function extend(IJ) {
    IJ.extend('invert', invert, true);
}
