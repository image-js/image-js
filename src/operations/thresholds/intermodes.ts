/*
 *
 * see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
 * Intermodes: This assumes a bimodal histogram. Implements the thresholding Prewitt, JMS & Mendelsohn, ML (1966),
 * "The analysis of cell images", Annals of the NewYork Academy of Sciences 128: 1035-1053
 *
 */

import { assert } from '../../utils/validators/assert.js';

/**
 * Return a threshold for a histogram using Intermodes algorithm.
 * @param histogram - Image histogram.
 * @returns The threshold.
 */
export default function intermodes(histogram: Uint32Array): number {
  const iHisto = histogram.slice();
  let iter = 0;
  while (!bimodalTest(iHisto)) {
    // smooth with a 3 point running mean filter
    let previous = 0;
    let current = 0;
    let next = iHisto[0];
    for (let i = 0; i < histogram.length - 1; i++) {
      previous = current;
      current = next;
      next = iHisto[i + 1];
      iHisto[i] = (previous + current + next) / 3;
    }
    iHisto[histogram.length - 1] = (current + next) / 3;
    iter++;
    assert(iter < 1000, 'Intermodes threshold not found after 1000 iterations');
  }

  // The threshold is the mean between the two peaks.
  let tt = 0;
  for (let i = 1; i < histogram.length - 1; i++) {
    if (iHisto[i - 1] < iHisto[i] && iHisto[i + 1] < iHisto[i]) {
      tt += i;
    }
  }
  return Math.floor(tt / 2);
}

function bimodalTest(iHisto: Uint32Array): boolean {
  let b = false;
  let modes = 0;

  for (let k = 1; k < iHisto.length - 1; k++) {
    if (iHisto[k - 1] < iHisto[k] && iHisto[k + 1] < iHisto[k]) {
      modes++;
      if (modes > 2) {
        return false;
      }
    }
  }
  if (modes === 2) {
    b = true;
  }
  return b;
}
