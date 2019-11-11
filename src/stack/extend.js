/* eslint-disable import/order */
import matchAndCrop from './transform/matchAndCrop';

import min from './compute/min';
import max from './compute/max';
import median from './compute/median';
import histogram from './compute/histogram';
import histograms from './compute/histograms';

import averageImage from './utility/averageImage';
import maxImage from './utility/maxImage';
import minImage from './utility/minImage';

export default function extend(Stack) {
  // let inPlace = {inPlace: true};
  Stack.extendMethod('matchAndCrop', matchAndCrop);

  Stack.extendMethod('getMin', min);
  Stack.extendMethod('getMax', max);
  Stack.extendMethod('getMedian', median);
  Stack.extendMethod('getHistogram', histogram);
  Stack.extendMethod('getHistograms', histograms);

  Stack.extendMethod('getAverage', averageImage); // to be removed but will be a breaking change

  Stack.extendMethod('getAverageImage', averageImage);
  Stack.extendMethod('getMaxImage', maxImage);
  Stack.extendMethod('getMinImage', minImage);
}
