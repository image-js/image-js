'use strict';

// filters
import invert from './filter/invert';
import invertMatrix from './filter/invertMatrix';
import invertGetterSetter from './filter/invertGetterSetter';

// transformers
import crop from './transform/crop';
import grey from './transform/grey';

// computers
import {getHistogram, getHistograms} from './compute/histogram';

export default function extend(IJ) {
    IJ.extendMethod('invert', invert, true); // true means the process is in-place
    IJ.extendMethod('invertMatrix', invertMatrix, true);
    IJ.extendMethod('invertGetterSetter', invertGetterSetter, true);

    IJ.extendMethod('crop', crop); // last parameter is "false" because it creates a new image
    IJ.extendMethod('grey', grey).extendMethod('gray', grey);


    IJ.extendMethod('getHistogram', getHistogram).extendProperty('histogram', getHistogram);
    IJ.extendMethod('getHistograms', getHistograms).extendProperty('histograms', getHistograms);
}
