/*
 * see http://rsb.info.nih.gov/ij/developer/source/ij/process/AutoThresholder.java.html
 * The method is present in: Implements Kapur-Sahoo-Wong (Maximum Entropy) thresholding method:
 * Kapur, JN; Sahoo, PK & Wong, ACK (1985), "A New Method for Gray-Level Picture Thresholding Using the Entropy of the Histogram",
 * Graphical Models and Image Processing 29(3): 273-285
 * @param histogram - the histogram of the image
 *        total - the number of pixels in the image
 * @returns {number} - the threshold
 */

export default function maxEntropy(histogram, total) {
  let normHisto = new Array(histogram.length); // normalized histogram
  for (let ih = 0; ih < histogram.length; ih++) {
    normHisto[ih] = histogram[ih] / total;
  }

  let P1 = new Array(histogram.length); // cumulative normalized histogram
  let P2 = new Array(histogram.length);
  P1[0] = normHisto[0];
  P2[0] = 1.0 - P1[0];

  for (let ih = 1; ih < histogram.length; ih++) {
    P1[ih] = P1[ih - 1] + normHisto[ih];
    P2[ih] = 1.0 - P1[ih];
  }

  /* Determine the first non-zero bin */
  let firstBin = 0;
  for (let ih = 0; ih < histogram.length; ih++) {
    if (Math.abs(P1[ih]) >= Number.EPSILON) {
      firstBin = ih;
      break;
    }
  }

  /* Determine the last non-zero bin */
  let lastBin = histogram.length - 1;
  for (let ih = histogram.length - 1; ih >= firstBin; ih--) {
    if (Math.abs(P2[ih]) >= Number.EPSILON) {
      lastBin = ih;
      break;
    }
  }

  // Calculate the total entropy each gray-level
  // and find the threshold that maximizes it
  let threshold = -1;
  let totEnt;  // total entropy
  let maxEnt = Number.MIN_VALUE; // max entropy
  let entBack; // entropy of the background pixels at a given threshold
  let entObj;  // entropy of the object pixels at a given threshold

  for (let it = firstBin; it <= lastBin; it++) {
    /* Entropy of the background pixels */
    entBack = 0.0;
    for (let ih = 0; ih <= it; ih++) {
      if (histogram[ih] !== 0) {
        entBack -= (normHisto[ih] / P1[it]) * Math.log(normHisto[ih] / P1[it]);
      }
    }

    /* Entropy of the object pixels */
    entObj = 0.0;
    for (let ih = it + 1; ih < histogram.length; ih++) {
      if (histogram[ih] !== 0) {
        entObj -= (normHisto[ih] / P2[it]) * Math.log(normHisto[ih] / P2[it]);
      }
    }

    /* Total entropy */
    totEnt = entBack + entObj;

    if (maxEnt < totEnt) {
      maxEnt = totEnt;
      threshold = it;
    }
  }
  return threshold;
}
