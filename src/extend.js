// filters
import invertGetSet from './filter/invertGetSet';
import invertIterator from './filter/invertIterator';
import invertMatrix from './filter/invertMatrix';
import invertOneLoop from './filter/invertOneLoop';
import invertPixel from './filter/invertPixel';
import invertApply from './filter/invertApply';
import invertBinaryLoop from './filter/invertBinaryLoop';
import meanFilter from './filter/blur';
import medianFilter from './filter/median';
import gaussianFilter from './filter/gaussian';

// transformers
import crop from './transform/crop';
import grey from './transform/grey/grey';
import mask from './transform/mask/mask';
import pad from './transform/pad';

import split from './utility/split';
import paintMasks from './operator/paintMasks';

// computers
import {getHistogram, getHistograms} from './compute/histogram';
import getColorHistogram from './compute/colorHistogram';
import getPixelsArray from './compute/pixelsArray';
import getSVD from './compute/svd';
import countPixels from './compute/countPixels';

export default function extend(Image) {
    Image.extendMethod('invertGetSet', invertGetSet, true); // true means the process is in-place
    Image.extendMethod('invertIterator', invertIterator, true);
    Image.extendMethod('invertMatrix', invertMatrix, true);
    Image.extendMethod('invertPixel', invertPixel, true);
    Image.extendMethod('invertOneLoop', invertOneLoop, true);
    Image.extendMethod('invertApply', invertApply, true);
    Image.extendMethod('invert', invertApply, true);
    Image.extendMethod('invertBinaryLoop', invertBinaryLoop, true);
    Image.extendMethod('meanFilter', meanFilter);
    Image.extendMethod('medianFilter', medianFilter);
    Image.extendMethod('gaussianFilter', gaussianFilter);

    Image.extendMethod('crop', crop); // last parameter is "false" because it creates a new image
    Image.extendMethod('grey', grey).extendMethod('gray', grey);
    Image.extendMethod('mask', mask);
    Image.extendMethod('pad', pad);

    Image.extendMethod('split', split);

    Image.extendMethod('paintMasks', paintMasks);

    Image.extendMethod('countPixels', countPixels);
    Image.extendMethod('getHistogram', getHistogram).extendProperty('histogram', getHistogram);
    Image.extendMethod('getHistograms', getHistograms).extendProperty('histograms', getHistograms);
    Image.extendMethod('getColorHistogram', getColorHistogram).extendProperty('colorHistogram', getColorHistogram);
    Image.extendMethod('getPixelsArray', getPixelsArray).extendProperty('pixelsArray', getPixelsArray);
    Image.extendMethod('getSVD', getSVD).extendProperty('svd', getSVD);
}
