/*
 * The method is present in: Otsu, N (1979), "A threshold selection method from gray-level histograms", IEEE Trans. Sys., Man., Cyber. 9: 62-66
 * The Otsu implementation is based on: https://en.wikipedia.org/wiki/Otsu's_method
 * @param histogram - the histogram of the image
 * @returns {number} - the threshold
 */

export default function otsu(histogramCounts, total) {
  let sumB = 0;
  let wB = 0;
  let maximum = 0;
  let level = 0;

  let sum1 = 0;
  for (let i = 0; i < histogramCounts.length; i++) {
    sum1 += i * histogramCounts[i];
  }

  for (let ii = 0; ii < histogramCounts.length; ii++) {
    wB = wB + histogramCounts[ii];
    const wF = total - wB;
    if (wB === 0 || wF === 0) {
      continue;
    }
    sumB = sumB + ii * histogramCounts[ii];
    const mF = (sum1 - sumB) / wF;
    const between = wB * wF * (sumB / wB - mF) * (sumB / wB - mF);
    if (between >= maximum) {
      level = ii;
      maximum = between;
    }
  }

  return level;
}
