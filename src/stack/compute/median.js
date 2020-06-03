import { median as medianFromHistogram } from '../../util/histogram';

/**
 * @memberof Stack
 * @instance
 * @return {number[]}
 */
export default function median() {
  this.checkProcessable('median', {
    bitDepth: [8, 16],
  });

  let histograms = this.getHistograms({ maxSlots: this[0].maxValue + 1 });
  let result = new Array(histograms.length);
  for (let c = 0; c < histograms.length; c++) {
    let histogram = histograms[c];
    result[c] = medianFromHistogram(histogram);
  }
  return result;
}
