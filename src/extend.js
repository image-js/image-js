// filters
import invertGetSet from './filter/invertGetSet';
import invertIterator from './filter/invertIterator';
import invertMatrix from './filter/invertMatrix';
import invertOneLoop from './filter/invertOneLoop';
import invertPixel from './filter/invertPixel';
import invertApply from './filter/invertApply';
import invertApplyAll from './filter/invertApplyAll';
import invertBinaryLoop from './filter/invertBinaryLoop';
import meanFilter from './filter/blur';
import medianFilter from './filter/median';
import gaussianFilter from './filter/gaussian';

// transformers
import crop from './transform/crop';
import hsv from './transform/hsv';
import hsl from './transform/hsl';
import grey from './transform/grey/grey';
import mask from './transform/mask/mask';
import pad from './transform/pad';

import split from './utility/split';
import paintMasks from './operator/paintMasks';
import copyUsingMask from './operator/copyUsingMask';

// computers
import {getHistogram, getHistograms} from './compute/histogram';
import getHash from './compute/hash';
import getColorHistogram from './compute/colorHistogram';
import getPixelsArray from './compute/pixelsArray';
import getSVD from './compute/svd';
import countPixels from './compute/countPixels';

export default function extend(Image) {
    let inPlace = {inPlace: true};
    Image.extendMethod('invertGetSet', invertGetSet, inPlace);
    Image.extendMethod('invertIterator', invertIterator, inPlace);
    Image.extendMethod('invertMatrix', invertMatrix, inPlace);
    Image.extendMethod('invertPixel', invertPixel, inPlace);
    Image.extendMethod('invertOneLoop', invertOneLoop, inPlace);
    Image.extendMethod('invertApply', invertApply, inPlace);
    Image.extendMethod('invertApplyAll', invertApplyAll, inPlace);
    Image.extendMethod('invert', invertApply, inPlace);
    Image.extendMethod('invertBinaryLoop', invertBinaryLoop, inPlace);
    Image.extendMethod('meanFilter', meanFilter);
    Image.extendMethod('medianFilter', medianFilter);
    Image.extendMethod('gaussianFilter', gaussianFilter);

    Image.extendMethod('crop', crop);
    Image.extendMethod('hsv', hsv);
    Image.extendMethod('hsl', hsl);
    Image.extendMethod('grey', grey).extendMethod('gray', grey);
    Image.extendMethod('mask', mask);
    Image.extendMethod('pad', pad);

    Image.extendMethod('split', split);

    Image.extendMethod('paintMasks', paintMasks);
    Image.extendMethod('copyUsingMask', copyUsingMask);

    Image.extendMethod('countPixels', countPixels);
    Image.extendMethod('getHistogram', getHistogram).extendProperty('histogram', getHistogram);
    Image.extendMethod('getHistograms', getHistograms).extendProperty('histograms', getHistograms);
    Image.extendMethod('getColorHistogram', getColorHistogram).extendProperty('colorHistogram', getColorHistogram);
    Image.extendMethod('getHash', getHash).extendProperty('hash', getHash);
    Image.extendMethod('getPixelsArray', getPixelsArray).extendProperty('pixelsArray', getPixelsArray);
    Image.extendMethod('getSVD', getSVD).extendProperty('svd', getSVD);
}
