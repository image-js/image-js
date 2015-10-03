// filters
import invertGetSet from './filter/invertGetSet';
import invertIterator from './filter/invertIterator';
import invertOneLoop from './filter/invertOneLoop';
import invertPixel from './filter/invertPixel';
import invertApply from './filter/invertApply';
import invertBinaryLoop from './filter/invertBinaryLoop';
import invert from './filter/invert';
import meanFilter from './filter/blur';
import medianFilter from './filter/median';
import gaussianFilter from './filter/gaussian';
import sobelFilter from './filter/sobel';
import level from './filter/level';
import add from './filter/add';
import subtract from './filter/subtract';
import hypotenuse from './filter/hypotenuse';
import multiply from './filter/multiply';
import divide from './filter/divide';

// transformers
import crop from './transform/crop';
import scale from './transform/scale/scale';
import hsv from './transform/hsv';
import hsl from './transform/hsl';
import grey from './transform/grey/grey';
import mask from './transform/mask/mask';
import pad from './transform/pad';
import resizeBinary from './transform/resizeBinary';
import bitDepth from './transform/bitDepth';


import setBorder from './utility/setBorder';
import split from './utility/split';
import getChannel from './utility/getChannel';
import setChannel from './utility/setChannel';
import getSimilarity from './utility/getSimilarity';
import getBestMatch from './utility/getBestMatch';
import paintMasks from './operator/paintMasks';
import extract from './operator/extract';
import convolution from './operator/convolution';

// computers
import {getHistogram, getHistograms} from './compute/histogram';
import getColorHistogram from './compute/colorHistogram';
import getMin from './compute/min';
import getMax from './compute/max';
import getSum from './compute/sum';
import getMean from './compute/mean';
import getMedian from './compute/median';
import getPixelsArray from './compute/pixelsArray';
import getRelativePosition from './compute/relativePosition';
import getSVD from './compute/svd';
import countAlphaPixels from './compute/countAlphaPixels';

export default function extend(Image) {
    let inPlace = {inPlace: true};
    let inPlaceStack = {inPlace: true, stack: true};
    let stack = {stack: true};

    Image.extendMethod('invertGetSet', invertGetSet, inPlace);
    Image.extendMethod('invertIterator', invertIterator, inPlace);
    Image.extendMethod('invertPixel', invertPixel, inPlace);
    Image.extendMethod('invertOneLoop', invertOneLoop, inPlace);
    Image.extendMethod('invertApply', invertApply, inPlace);
    Image.extendMethod('invert', invert, inPlaceStack);
    Image.extendMethod('invertBinaryLoop', invertBinaryLoop, inPlace);
    Image.extendMethod('level', level, inPlace);
    Image.extendMethod('add', add, inPlace);
    Image.extendMethod('subtract', subtract, inPlace);
    Image.extendMethod('multiply', multiply, inPlace);
    Image.extendMethod('divide', divide, inPlace);
    Image.extendMethod('hypotenuse', hypotenuse);

    Image.extendMethod('meanFilter', meanFilter);
    Image.extendMethod('medianFilter', medianFilter);
    Image.extendMethod('gaussianFilter', gaussianFilter);
    Image.extendMethod('sobelFilter', sobelFilter);

    Image.extendMethod('crop', crop, stack);
    Image.extendMethod('scale', scale, stack);
    Image.extendMethod('hsv', hsv);
    Image.extendMethod('hsl', hsl);
    Image.extendMethod('grey', grey).extendMethod('gray', grey);
    Image.extendMethod('mask', mask);
    Image.extendMethod('pad', pad);
    Image.extendMethod('resizeBinary', resizeBinary);
    Image.extendMethod('colorDepth', bitDepth);
    Image.extendMethod('setBorder', setBorder, inPlace);

    Image.extendMethod('split', split);
    Image.extendMethod('getChannel', getChannel);
    Image.extendMethod('setChannel', setChannel);
    Image.extendMethod('getSimilarity', getSimilarity);
    Image.extendMethod('getBestMatch', getBestMatch);

    Image.extendMethod('paintMasks', paintMasks);
    Image.extendMethod('extract', extract);
    Image.extendMethod('convolution', convolution);

    Image.extendMethod('countAlphaPixels', countAlphaPixels);
    Image.extendMethod('getHistogram', getHistogram).extendProperty('histogram', getHistogram);
    Image.extendMethod('getHistograms', getHistograms).extendProperty('histograms', getHistograms);
    Image.extendMethod('getColorHistogram', getColorHistogram).extendProperty('colorHistogram', getColorHistogram);
    Image.extendMethod('getMin', getMin).extendProperty('min', getMin);
    Image.extendMethod('getMax', getMax).extendProperty('max', getMax);
    Image.extendMethod('getSum', getSum).extendProperty('sum', getSum);
    Image.extendMethod('getMedian', getSum).extendProperty('median', getMedian);
    Image.extendMethod('getMean', getMean).extendProperty('mean', getMean);
    Image.extendMethod('getPixelsArray', getPixelsArray).extendProperty('pixelsArray', getPixelsArray);
    Image.extendMethod('getRelativePosition', getRelativePosition);
    Image.extendMethod('getSVD', getSVD).extendProperty('svd', getSVD);
}
