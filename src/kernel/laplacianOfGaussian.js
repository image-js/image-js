// http://homepages.inf.ed.ac.uk/rbf/HIPR2/log.htm

export function laplacianOfGaussian(sigma, nPoints, factor) {
  let kernel = new Array(nPoints);
  let i, j, x2, y2;
  if (!factor) {
    factor = 100;
  }
  factor *= -1; // -480/(Math.PI*Math.pow(sigma,4));
  let center = (nPoints - 1) / 2;
  let sigma2 = 2 * sigma * sigma;
  for (i = 0; i < nPoints; i++) {
    kernel[i] = new Array(nPoints);
    y2 = (i - center) * (i - center);
    for (j = 0; j < nPoints; j++) {
      x2 = (j - center) * (j - center);
      kernel[i][j] = Math.round(
        factor * (1 - (x2 + y2) / sigma2) * Math.exp(-(x2 + y2) / sigma2),
      );
    }
  }

  return kernel;
}
