// see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// W. Tsai, "Moment-preserving thresholding: a new approach," Computer Vision,
// Graphics, and Image Processing, vol. 29, pp. 377-393, 1985.
// Ported to ImageJ plugin by G.Landini from the the open source project FOURIER 0.8
// by M. Emre Celebi , Department of Computer Science, Louisiana State University in Shreveport
// Shreveport, LA 71115, USA
// http://sourceforge.net/projects/fourier-ipal
// http://www.lsus.edu/faculty/~ecelebi/fourier.htm
export default function moments(histogram, total) {
// moments
  let m0 = 1.0;
  let m1 = 0.0;
  let m2 = 0.0;
  let m3 = 0.0;
  let sum = 0.0;
  let p0;
  let cd, c0, c1, z0, z1; /* auxiliary variables */
  let threshold = -1;
  let histogramLength = histogram.length;
  let normalizedHistogram = new Array(histogramLength);
  for (let i = 0; i < histogramLength; i++) {
    normalizedHistogram[i] = histogram[i] / total;
  }
  /* Calculate the first, second, and third order moments */
  for (let i = 0; i < histogramLength; i++) {
    m1 += i * normalizedHistogram[i];
    m2 += i * i * normalizedHistogram[i];
    m3 += i * i * i * normalizedHistogram[i];
  }
  /*
     First 4 moments of the gray-level image should match the first 4 moments
     of the target binary image. This leads to 4 equalities whose solutions
     are given in the Appendix of Ref. 1
     */
  cd = m0 * m2 - m1 * m1; // determinant of the matriz of hankel for moments 2x2
  c0 = (-m2 * m2 + m1 * m3) / cd;
  c1 = (m0 * -m3 + m2 * m1) / cd;
  // new two gray values where z0<z1
  z0 = 0.5 * (-c1 - Math.sqrt(c1 * c1 - 4.0 * c0));
  z1 = 0.5 * (-c1 + Math.sqrt(c1 * c1 - 4.0 * c0));
  p0 = (z1 - m1) / (z1 - z0); /* Fraction of the object pixels in the target binary image (p0z0+p1z1=m1) */
  // The threshold is the gray-level closest to the p0-tile of the normalized histogram
  for (let i = 0; i < histogramLength; i++) {
    sum += normalizedHistogram[i];
    if (sum > p0) {
      threshold = i;
      break;
    }
  }
  return threshold;
}
