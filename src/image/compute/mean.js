import { mean as histogramMean } from '../../util/histogram';

/**
 * Returns an array with the average value of each channel
 * @memberof Image
 * @instance
 * @return {number[]} Array having has size the number of channels
 */
export default function mean() {
  let histograms = this.getHistograms({ maxSlots: this.maxValue + 1 });
  let result = new Array(histograms.length);
  for (let c = 0; c < histograms.length; c++) {
    let histogram = histograms[c];
    result[c] = histogramMean(histogram);
  }
  return result;
}
