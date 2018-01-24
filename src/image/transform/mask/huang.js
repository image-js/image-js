/*
 *
 * see http://rsb.info.nih.gov/ij/developer/source/ij/process/AutoThresholder.java.html.
 * Huang: Implements Huang's fuzzy thresholding method: Huang, L-K & Wang, M-J J (1995),
 * "Image thresholding by minimizing the measure of fuzziness", Pattern Recognition 28(1): 41-51
 *
 */

export default function huang(histogram) {
  /* Determine the first non-zero bin */
  let firstBin = 0;
  for (let ih = 0; ih < histogram.length; ih++) {
    if (histogram[ih] !== 0) {
      firstBin = ih;
      break;
    }
  }

  /* Determine the last non-zero bin */
  let lastBin = histogram.length - 1;
  for (let ih = histogram.length - 1; ih >= firstBin; ih--) {
    if (histogram[ih] !== 0) {
      lastBin = ih;
      break;
    }
  }

  let term = 1.0 / (lastBin - firstBin);
  let mu0 = new Array(histogram.length);
  let sumPix = 0;
  let numPix = 0;
  for (let ih = firstBin; ih < histogram.length; ih++) {
    sumPix += ih * histogram[ih];
    numPix += histogram[ih];
    mu0[ih] = sumPix / numPix;
  }

  let mu1 = new Array(histogram.length);
  sumPix = numPix = 0;
  for (let ih = lastBin; ih > 0; ih--) {
    sumPix += ih * histogram[ih];
    numPix += histogram[ih];
    mu1[ih - 1] = sumPix /  numPix;
  }

  /* Determine the threshold that minimizes the fuzzy entropy*/
  let threshold = -1;
  let minEnt = Number.MAX_VALUE;
  for (let it = 0; it < histogram.length; it++) {
    let ent = 0;
    let muX;
    for (let ih = 0; ih <= it; ih++) {
      /* Equation (4) in Ref. 1 */
      muX = 1 / (1 + term * Math.abs(ih - mu0[it]));
      if (!((muX  < 1e-06) || (muX > 0.999999))) {
        /* Equation (6) & (8) in Ref. 1 */
        ent += histogram[ih] * (-muX * Math.log(muX) - (1 - muX) * Math.log(1 - muX));
      }
    }

    for (let ih = it + 1; ih < histogram.length; ih++) {
      /* Equation (4) in Ref. 1 */
      muX = 1 / (1 + term * Math.abs(ih - mu1[it]));
      if (!((muX  < 1e-06) || (muX > 0.999999))) {
        /* Equation (6) & (8) in Ref. 1 */
        ent += histogram[ih] * (-muX * Math.log(muX) - (1 - muX) * Math.log(1 - muX));
      }
    }

    if (ent < minEnt) {
      minEnt = ent;
      threshold = it;
    }
  }
  return threshold;
}
