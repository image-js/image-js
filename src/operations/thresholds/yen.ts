// see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// Implements Yen  thresholding method
// 1) Yen J.C., Chang F.J., and Chang S. (1995) "A New Criterion
//    for Automatic Multilevel Thresholding" IEEE Trans. on Image
//    Processing, 4(3): 370-378
// 2) Sezgin M. and Sankur B. (2004) "Survey over Image Thresholding
//    Techniques and Quantitative Performance Evaluation" Journal of
//    Electronic Imaging, 13(1): 146-165
//    http://citeseer.ist.psu.edu/sezgin04survey.html
//
// M. Emre Celebi
// 06.15.2007
// Ported to ImageJ plugin by G.Landini from E Celebi's fourier_0.8 routines

/**
 * Return a threshold for a histogram using Yen algorithm.
 *
 * @param histogram - The image histogram.
 * @param total - Total number of pixels of the image.
 * @returns The threshold.
 */
export default function yen(histogram: Uint32Array, total: number): number {
  const normHisto = new Array<number>(histogram.length); // normalized histogram
  for (let ih = 0; ih < histogram.length; ih++) {
    normHisto[ih] = histogram[ih] / total;
  }

  const P1 = new Array<number>(histogram.length); // cumulative normalized histogram
  P1[0] = normHisto[0];
  for (let ih = 1; ih < histogram.length; ih++) {
    P1[ih] = P1[ih - 1] + normHisto[ih];
  }

  const P1Sq = new Array<number>(histogram.length);
  P1Sq[0] = normHisto[0] * normHisto[0];
  for (let ih = 1; ih < histogram.length; ih++) {
    P1Sq[ih] = P1Sq[ih - 1] + normHisto[ih] * normHisto[ih];
  }

  const P2Sq = new Array<number>(histogram.length);
  P2Sq[histogram.length - 1] = 0;
  for (let ih = histogram.length - 2; ih >= 0; ih--) {
    P2Sq[ih] = P2Sq[ih + 1] + normHisto[ih + 1] * normHisto[ih + 1];
  }

  /* Find the threshold that maximizes the criterion */
  let threshold = -1;
  let maxCrit = Number.MIN_VALUE;
  let crit;
  for (let it = 0; it < histogram.length; it++) {
    crit =
      -1 * (P1Sq[it] * P2Sq[it] > 0 ? Math.log(P1Sq[it] * P2Sq[it]) : 0) +
      2 * (P1[it] * (1 - P1[it]) > 0 ? Math.log(P1[it] * (1 - P1[it])) : 0);
    if (crit > maxCrit) {
      maxCrit = crit;
      threshold = it;
    }
  }
  return threshold;
}
