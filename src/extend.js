'use strict';

// filters
import invert from './filter/invert';
import invertMatrix from './filter/invertMatrix';
import invertOneLoop from './filter/invertOneLoop';
import invertBinaryLoop from './filter/invertBinaryLoop';

// transformers
import crop from './transform/crop';
import grey from './transform/grey/grey';
import mask from './transform/mask/mask';

import split from './utility/split';
import createROIs from './roi/createROIs';
import mapMask from './roi/mapMask';
import mapInfo from './roi/mapInfo';
import paintMasks from './operator/paintMasks';

// computers
import {getHistogram, getHistograms} from './compute/histogram';

export default function extend(IJ) {
    IJ.extendMethod('invert', invert, true); // true means the process is in-place
    IJ.extendMethod('invertMatrix', invertMatrix, true);
    IJ.extendMethod('invertOneLoop', invertOneLoop, true);
    IJ.extendMethod('invertBinaryLoop', invertBinaryLoop, true);

    IJ.extendMethod('crop', crop); // last parameter is "false" because it creates a new image
    IJ.extendMethod('grey', grey).extendMethod('gray', grey);
    IJ.extendMethod('mask', mask);

    IJ.extendMethod('split', split);
    IJ.extendMethod('createROIs', createROIs);
    IJ.extendMethod('mapMask', mapMask);
    IJ.extendMethod('mapInfo', mapInfo);

    IJ.extendMethod('paintMasks', paintMasks);

    IJ.extendMethod('getHistogram', getHistogram).extendProperty('histogram', getHistogram);
    IJ.extendMethod('getHistograms', getHistograms).extendProperty('histograms', getHistograms);
}
