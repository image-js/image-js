// see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// Shanhbag A.G. (1994) "Utilization of Information Measure as a Means of
// Image Thresholding" Graphical Models and Image Processing, 56(5): 414-419
// Ported to ImageJ plugin by G.Landini from E Celebi's fourier_0.8 routines

export default function shanbhag(histogram, total) {
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
  let minEnt = Number.MAX_VALUE; // min entropy

  let term;
  let totEnt; // total entropy
  let entBack; // entropy of the background pixels at a given threshold
  let entObj;  // entropy of the object pixels at a given threshold
  for (let it = firstBin; it <= lastBin; it++) {
    /* Entropy of the background pixels */
    entBack = 0.0;
    term = 0.5 / P1[it];
    for (let ih = 1; ih <= it; ih++)  {
      entBack -= normHisto[ih] * Math.log(1.0 - term * P1[ih - 1]);
    }
    entBack *= term;

    /* Entropy of the object pixels */
    entObj = 0.0;
    term = 0.5 / P2[it];
    for (let ih = it + 1; ih < histogram.length; ih++) {
      entObj -= normHisto[ih] * Math.log(1.0 - term * P2[ih]);
    }
    entObj *= term;

    /* Total entropy */
    totEnt = Math.abs(entBack - entObj);

    if (totEnt < minEnt) {
      minEnt = totEnt;
      threshold = it;
    }
  }
  return threshold;
}
