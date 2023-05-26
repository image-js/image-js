// see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// J. M. S. Prewitt and M. L. Mendelsohn, "The analysis of cell images," in
// Annals of the New York Academy of Sciences, vol. 128, pp. 1035-1053, 1966.
// ported to ImageJ plugin by G.Landini from Antti Niemisto's Matlab code (GPL)
// Original Matlab code Copyright (C) 2004 Antti Niemisto
// See http://www.cs.tut.fi/~ant/histthresh/ for an excellent slide presentation
// and the original Matlab code

/**
 * Return a threshold for a histogram.
 * @param histogram - Image histogram.
 * @returns The threshold.
 */
export default function minimum(histogram: Uint32Array): number {
  if (histogram.length < 2) {
    // validate that the histogram has at least two color values
    return 0;
  }
  let iterations = 0; // number of iterations of the smoothing process
  let threshold = -1;
  let max = -1; // maximum color value with a greater number of pixels to 0
  let histogramCopy = new Array(histogram.length); // a copy of the histogram
  for (let i = 0; i < histogram.length; i++) {
    histogramCopy[i] = histogram[i];
    if (histogram[i] > 0) {
      max = i;
    }
  }
  while (!bimodalTest(histogramCopy)) {
    histogramCopy = smoothed(histogramCopy);
    iterations++;
    if (iterations > 10000) {
      // if they occur more than 10000 iterations it returns -1
      return threshold;
    }
  }
  for (let i = 1; i < max; i++) {
    if (
      histogramCopy[i - 1] > histogramCopy[i] &&
      histogramCopy[i + 1] >= histogramCopy[i]
    ) {
      threshold = i;
      break;
    }
  }
  return threshold;
}
function smoothed(histogram: number[]): number[] {
  // Smooth with a 3 point running mean filter
  const auHistogram = new Array(histogram.length); // a copy of the histogram for the smoothing process
  for (let i = 1; i < histogram.length - 1; i++) {
    auHistogram[i] = (histogram[i - 1] + histogram[i] + histogram[i + 1]) / 3;
  }
  auHistogram[0] = (histogram[0] + histogram[1]) / 3;
  auHistogram[histogram.length - 1] =
    ((histogram.at(-2) as number) + (histogram.at(-1) as number)) / 3;
  return auHistogram;
}

function bimodalTest(histogram: number[]): boolean {
  // It is responsible for determining if a histogram is bimodal
  const len = histogram.length;
  let isBimodal = false;
  let peaks = 0;
  for (let k = 1; k < len - 1; k++) {
    if (histogram[k - 1] < histogram[k] && histogram[k + 1] < histogram[k]) {
      peaks++;
      if (peaks > 2) {
        return false;
      }
    }
  }
  if (peaks === 2) {
    isBimodal = true;
  }
  return isBimodal;
}
