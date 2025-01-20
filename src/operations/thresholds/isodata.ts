/*
 * see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
 * Isodata: Ridler, TW & Calvard, S (1978), "Picture thresholding using an iterative selection method"
 * IEEE Transactions on Systems, Man and Cybernetics 8: 630-632.
 *
 */

import { assert } from '../../utils/validators/assert.js';

/**
 * Return a threshold for a histogram using Isodata algorithm.
 * @param histogram - Image histogram.
 * @returns The threshold.
 */
export default function isodata(histogram: Uint32Array): number {
  let l; // the average grey value of pixels with intensities < g
  let toth; // the the average grey value of pixels with intensities > g
  let totl; // the total the average grey value of pixels with intensities < g
  let h; // the average grey value of pixels with intensities > g
  let g = 0; // threshold value

  for (let i = 1; i < histogram.length; i++) {
    if (histogram[i] > 0) {
      g = i + 1;
      break;
    }
  }

  while (true) {
    l = 0;
    totl = 0;
    for (let i = 0; i < g; i++) {
      totl = totl + histogram[i];
      l = l + histogram[i] * i;
    }
    h = 0;
    toth = 0;
    for (let i = g + 1; i < histogram.length; i++) {
      toth += histogram[i];
      h += histogram[i] * i;
    }
    if (totl > 0 && toth > 0) {
      l /= totl;
      h /= toth;
      if (g === Math.round((l + h) / 2)) {
        break;
      }
    }
    g++;
    assert(g <= histogram.length - 2, 'Threshold not found');
  }
  return g;
}
