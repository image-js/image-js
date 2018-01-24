/**
 * @memberof Stack
 * @instance
 * @param {object} [options]
 * @return {Array<Array<number>>}
 */
export default function histograms(options) {
  this.checkProcessable('min', {
    bitDepth: [8, 16]
  });

  let histograms = this[0].getHistograms(options);
  let histogramLength = histograms[0].length;
  for (let i = 1; i < this.length; i++) {
    let secondHistograms = this[i].getHistograms(options);
    for (let c = 0; c < histograms.length; c++) {
      for (let j = 0; j < histogramLength; j++) {
        histograms[c][j] += secondHistograms[c][j];
      }
    }
  }
  return histograms;
}
