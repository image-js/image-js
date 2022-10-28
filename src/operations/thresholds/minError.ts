/*
 * see http://rsb.info.nih.gov/ij/developer/source/ij/process/AutoThresholder.java.html
 * The method is present in: An iterative implementation of Kittler and Illingworth's Minimum Error
 * thresholding:Kittler, J & Illingworth, J (1986), "Minimum error thresholding", Pattern Recognition 19: 41-47
 * @param histogram - the histogram of the image
 * @param total - the number of pixels in the image
 * @returns {number} - the threshold
 */

/**
 * Return a threshold for a histogram using Li algorithm.
 *
 * @param histogram - Image histogram.
 * @param total - Number of pixels in the image.
 * @returns The threshold.
 */
export default function minError(
  histogram: Uint32Array,
  total: number,
): number {
  let threshold;
  let Tprev = -2;
  let mu, nu, p, q, sigma2, tau2, w0, w1, w2, sqterm, temp;

  /* Calculate the mean gray-level */
  let mean = 0;
  for (let ih = 0; ih < histogram.length; ih++) {
    mean += ih * histogram[ih];
  }

  mean /= total;

  threshold = mean;

  while (threshold !== Tprev) {
    // Calculate some statistics.
    const sumA1 = sumA(histogram, threshold);
    const sumA2 = sumA(histogram, histogram.length - 1);
    const sumB1 = sumB(histogram, threshold);
    const sumB2 = sumB(histogram, histogram.length - 1);
    const sumC1 = sumC(histogram, threshold);
    const sumC2 = sumC(histogram, histogram.length - 1);

    mu = sumB1 / sumA1;
    nu = (sumB2 - sumB1) / (sumA2 - sumA1);
    p = sumA1 / sumA2;
    q = (sumA2 - sumA1) / sumA2;
    sigma2 = sumC1 / sumA1 - mu * mu;
    tau2 = (sumC2 - sumC1) / (sumA2 - sumA1) - nu * nu;

    // The terms of the quadratic equation to be solved.
    w0 = 1 / sigma2 - 1 / tau2;
    w1 = mu / sigma2 - nu / tau2;
    w2 =
      (mu * mu) / sigma2 -
      (nu * nu) / tau2 +
      Math.log10((sigma2 * (q * q)) / (tau2 * (p * p)));

    // If the next threshold would be imaginary, return with the current one.
    sqterm = w1 * w1 - w0 * w2;
    if (sqterm < 0) {
      return threshold;
    }

    // The updated threshold is the integer part of the solution of the quadratic equation.
    Tprev = threshold;
    temp = (w1 + Math.sqrt(sqterm)) / w0;

    if (Number.isNaN(temp)) {
      threshold = Tprev;
    } else {
      threshold = Math.floor(temp);
    }
  }
  return threshold;
}

// aux func

function sumA(y: Uint32Array, j: number): number {
  let x = 0;
  for (let i = 0; i <= j; i++) {
    x += y[i];
  }
  return x;
}

function sumB(y: Uint32Array, j: number): number {
  let x = 0;
  for (let i = 0; i <= j; i++) {
    x += i * y[i];
  }
  return x;
}

function sumC(y: Uint32Array, j: number): number {
  let x = 0;
  for (let i = 0; i <= j; i++) {
    x += i * i * y[i];
  }
  return x;
}
