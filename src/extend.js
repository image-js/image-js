'use strict';

// filters
import invert from 'ij-filter-invert';

export default function extend(IJ) {
    IJ.extend('invert', invert, true);
}
