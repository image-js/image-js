/* eslint-disable import/order */
import matchAndCrop from './transform/matchAndCrop';

import min from './compute/min';
import max from './compute/max';
import median from './compute/median';
import histogram from './compute/histogram';
import histograms from './compute/histograms';

import average from './utility/average';

export default function extend(Stack) {
  // let inPlace = {inPlace: true};
  Stack.extendMethod('matchAndCrop', matchAndCrop);

  Stack.extendMethod('getMin', min);
  Stack.extendMethod('getMax', max);
  Stack.extendMethod('getMedian', median);
  Stack.extendMethod('getHistogram', histogram);
  Stack.extendMethod('getHistograms', histograms);

  Stack.extendMethod('getAverage', average);
}
