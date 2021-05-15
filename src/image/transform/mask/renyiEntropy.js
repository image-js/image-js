// see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// Kapur J.N., Sahoo P.K., and Wong A.K.C. (1985) "A New Method for
// Gray-Level Picture Thresholding Using the Entropy of the Histogram"
// Graphical Models and Image Processing, 29(3): 273-285
// M. Emre Celebi
// 06.15.2007
// Ported to ImageJ plugin by G.Landini from E Celebi's fourier_0.8 routines
export default function renyiEntropy(histogram, total) {
  let optThreshold; // Optimal threshold
  let firstBin; // First non-zero bin
  let lastBin; // last non-zero bin

  let normHisto = new Array(histogram.length); // normalized histogram
  let P1 = new Array(histogram.length); // acumulative normalized histogram
  let P2 = new Array(histogram.length); // acumulative normalized histogram

  // Entropy Variables
  let threshold1 = 0;
  let threshold2 = 0;
  let threshold3 = 0;
  let maxEnt1 = 0.0;
  let maxEnt2 = 0.0;
  let maxEnt3 = 0.0;
  let alpha2 = 0.5;
  let term2 = 1.0 / (1.0 - alpha2);
  let alpha3 = 2.0;
  let term3 = 1.0 / (1.0 - alpha3);

  for (let ih = 0; ih < histogram.length; ih++) {
    normHisto[ih] = histogram[ih] / total;
  }

  P1[0] = normHisto[0];
  P2[0] = 1.0 - P1[0];
  for (let ih = 1; ih < histogram.length; ih++) {
    P1[ih] = P1[ih - 1] + normHisto[ih];
    P2[ih] = 1.0 - P1[ih];
  }

  /* Determine the first non-zero bin */
  firstBin = 0;
  for (let ih = 0; ih < histogram.length; ih++) {
    if (Math.abs(P1[ih]) >= Number.EPSILON) {
      firstBin = ih;
      break;
    }
  }

  /* Determine the last non-zero bin */
  lastBin = histogram.length - 1;
  for (let ih = histogram.length - 1; ih >= firstBin; ih--) {
    if (Math.abs(P2[ih]) >= Number.EPSILON) {
      lastBin = ih;
      break;
    }
  }

  /* Maximum Entropy Thresholding - BEGIN */
  /* ALPHA = 1.0 */
  /* Calculate the total entropy each gray-level
     and find the threshold that maximizes it
     */
  for (let it = firstBin; it <= lastBin; it++) {
    /* Entropy of the background pixels */
    let entBack1 = 0.0;
    let entBack2 = 0.0;
    let entBack3 = 0.0;
    for (let ih = 0; ih <= it; ih++) {
      if (histogram[ih] !== 0) {
        entBack1 -= (normHisto[ih] / P1[it]) * Math.log(normHisto[ih] / P1[it]);
      }
      entBack2 += Math.sqrt(normHisto[ih] / P1[it]);
      entBack3 += (normHisto[ih] * normHisto[ih]) / (P1[it] * P1[it]);
    }

    /* Entropy of the object pixels */
    let entObj1 = 0.0;
    let entObj2 = 0.0;
    let entObj3 = 0.0;
    for (let ih = it + 1; ih < histogram.length; ih++) {
      if (histogram[ih] !== 0) {
        entObj1 -= (normHisto[ih] / P2[it]) * Math.log(normHisto[ih] / P2[it]);
      }
      entObj2 += Math.sqrt(normHisto[ih] / P2[it]);
      entObj3 += (normHisto[ih] * normHisto[ih]) / (P2[it] * P2[it]);
    }

    /* Total entropy */
    let totEnt1 = entBack1 + entObj1;
    let totEnt2 =
      term2 * (entBack2 * entObj2 > 0.0 ? Math.log(entBack2 * entObj2) : 0.0);
    let totEnt3 =
      term3 * (entBack3 * entObj3 > 0.0 ? Math.log(entBack3 * entObj3) : 0.0);

    if (totEnt1 > maxEnt1) {
      maxEnt1 = totEnt1;
      threshold1 = it;
    }

    if (totEnt2 > maxEnt2) {
      maxEnt2 = totEnt2;
      threshold2 = it;
    }

    if (totEnt3 > maxEnt3) {
      maxEnt3 = totEnt3;
      threshold3 = it;
    }
  }
  /* End Maximum Entropy Thresholding */

  let tStars = [threshold1, threshold2, threshold3];
  tStars.sort((a, b) => a - b);

  let betas;

  /* Adjust beta values */
  if (Math.abs(tStars[0] - tStars[1]) <= 5) {
    if (Math.abs(tStars[1] - tStars[2]) <= 5) {
      betas = [1, 2, 1];
    } else {
      betas = [0, 1, 3];
    }
  } else {
    if (Math.abs(tStars[1] - tStars[2]) <= 5) {
      betas = [3, 1, 0];
    } else {
      betas = [1, 2, 1];
    }
  }

  /* Determine the optimal threshold value */
  let omega = P1[tStars[2]] - P1[tStars[0]];
  optThreshold = Math.round(
    tStars[0] * (P1[tStars[0]] + 0.25 * omega * betas[0]) +
      0.25 * tStars[1] * omega * betas[1] +
      tStars[2] * (P2[tStars[2]] + 0.25 * omega * betas[2]),
  );

  return optThreshold;
}
