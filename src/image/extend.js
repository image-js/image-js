/* eslint-disable import/order */

// filters
import absFilter from './filter/abs';
import invertFilter from './filter/invert';
import flipXFilter from './filter/flipX';
import flipYFilter from './filter/flipY';
import blurFilter from './filter/blurFilter';
import medianFilter from './filter/medianFilter';
import gaussianFilter from './filter/gaussianFilter';
import sobelFilter from './filter/sobelFilter';
import scharrFilter from './filter/scharrFilter';
import gradientFilter from './filter/gradientFilter';
import levelFilter from './filter/level';
import addFilter from './filter/add';
import subtractFilter from './filter/subtract';
import subtractImage from './filter/subtractImage';
import hypotenuseFilter from './filter/hypotenuse';
import multiplyFilter from './filter/multiply';
import divideFilter from './filter/divide';
import backgroundFilter from './filter/background';

// morphology transforms
import dilate from './morphology/dilate';
import erode from './morphology/erode';
import open from './morphology/open';
import close from './morphology/close';
import topHat from './morphology/topHat';
import blackHat from './morphology/blackHat';
import morphologicalGradient from './morphology/morphologicalGradient';

// transforms
import warpingFourPoints from './transform/warping';
import crop from './transform/crop';
import cropAlpha from './transform/cropAlpha';
import resize from './transform/resize/resize';
import hsv from './transform/hsv';
import hsl from './transform/hsl';
import cmyk from './transform/cmyk';
import rgba8 from './transform/rgba8';
import grey from './transform/grey';
import mask from './transform/mask/mask';
import pad from './transform/pad';
import colorDepth from './transform/colorDepth';
import { rotate, rotateLeft, rotateRight } from './transform/rotate';
import insert from './transform/insert';

// utility
import setBorder from './utility/setBorder';
import split from './utility/split';
import getChannel from './utility/getChannel';
import combineChannels from './utility/combineChannels';
import setChannel from './utility/setChannel';
import getSimilarity from './utility/getSimilarity';
import getPixelsGrid from './utility/getPixelsGrid';
import getBestMatch from './utility/getBestMatch';
import getRow from './utility/getRow';
import getColumn from './utility/getColumn';
import getMatrix from './utility/getMatrix';
import setMatrix from './utility/setMatrix';
import getPixelsArray from './utility/getPixelsArray';
import getIntersection from './utility/getIntersection';
import getClosestCommonParent from './utility/getClosestCommonParent';
import getThreshold from './utility/getThreshold';

// operators
import cannyEdge from './operator/cannyEdge';
import convolution from './operator/convolution';
import extract from './operator/extract';
import floodFill from './operator/floodFill';
import paintLabels from './operator/paintLabels';
import paintMasks from './operator/paintMasks';
import paintPoints from './operator/paintPoints';
import paintPolyline from './operator/paintPolyline';
import paintPolylines from './operator/paintPolylines';
import paintPolygon from './operator/paintPolygon';
import paintPolygons from './operator/paintPolygons';

// computers
import { getHistogram, getHistograms } from './compute/histogram';
import getColorHistogram from './compute/colorHistogram';
import getMin from './compute/min';
import getMax from './compute/max';
import getSum from './compute/sum';
import getMoment from './compute/moment';
import getLocalMaxima from './compute/localMaxima';
import getMean from './compute/mean';
import getMedian from './compute/median';
import getPoints from './compute/points';
import getExtendedPoints from './compute/extendedPoints';
import getRelativePosition from './compute/relativePosition';
import countAlphaPixels from './compute/countAlphaPixels';
import monotoneChainConvexHull from './compute/monotoneChainConvexHull';
import minimalBoundingRectangle from './compute/minimalBoundingRectangle';

export default function extend(Image) {
  let inPlace = { inPlace: true };

  Image.extendMethod('invert', invertFilter);
  Image.extendMethod('abs', absFilter);
  Image.extendMethod('level', levelFilter, inPlace);
  Image.extendMethod('add', addFilter, inPlace);
  Image.extendMethod('subtract', subtractFilter, inPlace);
  Image.extendMethod('subtractImage', subtractImage);
  Image.extendMethod('multiply', multiplyFilter, inPlace);
  Image.extendMethod('divide', divideFilter, inPlace);
  Image.extendMethod('hypotenuse', hypotenuseFilter);
  Image.extendMethod('background', backgroundFilter);
  Image.extendMethod('flipX', flipXFilter);
  Image.extendMethod('flipY', flipYFilter);

  Image.extendMethod('blurFilter', blurFilter);
  Image.extendMethod('medianFilter', medianFilter);
  Image.extendMethod('gaussianFilter', gaussianFilter);
  Image.extendMethod('sobelFilter', sobelFilter);
  Image.extendMethod('gradientFilter', gradientFilter);
  Image.extendMethod('scharrFilter', scharrFilter);

  Image.extendMethod('dilate', dilate);
  Image.extendMethod('erode', erode);
  Image.extendMethod('open', open);
  Image.extendMethod('close', close);
  Image.extendMethod('topHat', topHat);
  Image.extendMethod('blackHat', blackHat);
  Image.extendMethod('morphologicalGradient', morphologicalGradient);

  Image.extendMethod('warpingFourPoints', warpingFourPoints);
  Image.extendMethod('crop', crop);
  Image.extendMethod('cropAlpha', cropAlpha);
  Image.extendMethod('resize', resize).extendMethod('scale', resize);
  Image.extendMethod('hsv', hsv);
  Image.extendMethod('hsl', hsl);
  Image.extendMethod('cmyk', cmyk);
  Image.extendMethod('rgba8', rgba8);
  Image.extendMethod('grey', grey).extendMethod('gray', grey);
  Image.extendMethod('mask', mask);
  Image.extendMethod('pad', pad);
  Image.extendMethod('colorDepth', colorDepth);
  Image.extendMethod('setBorder', setBorder, inPlace);
  Image.extendMethod('rotate', rotate);
  Image.extendMethod('rotateLeft', rotateLeft);
  Image.extendMethod('rotateRight', rotateRight);
  Image.extendMethod('insert', insert);

  Image.extendMethod('getRow', getRow);
  Image.extendMethod('getColumn', getColumn);
  Image.extendMethod('getMatrix', getMatrix);
  Image.extendMethod('setMatrix', setMatrix);
  Image.extendMethod('getPixelsArray', getPixelsArray);
  Image.extendMethod('getIntersection', getIntersection);
  Image.extendMethod('getClosestCommonParent', getClosestCommonParent);
  Image.extendMethod('getThreshold', getThreshold);

  Image.extendMethod('split', split);
  Image.extendMethod('getChannel', getChannel);
  Image.extendMethod('combineChannels', combineChannels);
  Image.extendMethod('setChannel', setChannel);
  Image.extendMethod('getSimilarity', getSimilarity);
  Image.extendMethod('getPixelsGrid', getPixelsGrid);
  Image.extendMethod('getBestMatch', getBestMatch);

  Image.extendMethod('cannyEdge', cannyEdge);
  Image.extendMethod('convolution', convolution);
  Image.extendMethod('extract', extract);
  Image.extendMethod('floodFill', floodFill);
  Image.extendMethod('paintLabels', paintLabels, inPlace);
  Image.extendMethod('paintMasks', paintMasks, inPlace);
  Image.extendMethod('paintPoints', paintPoints, inPlace);
  Image.extendMethod('paintPolyline', paintPolyline, inPlace);
  Image.extendMethod('paintPolylines', paintPolylines, inPlace);
  Image.extendMethod('paintPolygon', paintPolygon, inPlace);
  Image.extendMethod('paintPolygons', paintPolygons, inPlace);

  Image.extendMethod('countAlphaPixels', countAlphaPixels);
  Image.extendMethod('monotoneChainConvexHull', monotoneChainConvexHull);
  Image.extendMethod('minimalBoundingRectangle', minimalBoundingRectangle);
  Image.extendMethod('getHistogram', getHistogram).extendProperty(
    'histogram',
    getHistogram,
  );
  Image.extendMethod('getHistograms', getHistograms).extendProperty(
    'histograms',
    getHistograms,
  );
  Image.extendMethod('getColorHistogram', getColorHistogram).extendProperty(
    'colorHistogram',
    getColorHistogram,
  );
  Image.extendMethod('getMin', getMin).extendProperty('min', getMin);
  Image.extendMethod('getMax', getMax).extendProperty('max', getMax);
  Image.extendMethod('getSum', getSum).extendProperty('sum', getSum);
  Image.extendMethod('getMoment', getMoment).extendProperty(
    'moment',
    getMoment,
  );
  Image.extendMethod('getLocalMaxima', getLocalMaxima);
  Image.extendMethod('getMedian', getMedian).extendProperty(
    'median',
    getMedian,
  );
  Image.extendMethod('getMean', getMean).extendProperty('mean', getMean);
  Image.extendMethod('getPoints', getPoints).extendProperty(
    'points',
    getPoints,
  );
  Image.extendMethod('getExtendedPoints', getExtendedPoints).extendProperty(
    'extendedPoints',
    getExtendedPoints,
  );
  Image.extendMethod('getRelativePosition', getRelativePosition);
}
