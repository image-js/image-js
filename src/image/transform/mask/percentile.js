// See http://imagej.nih.gov/ij/download/tools/source/ij/process/AutoThresholder.java
// W. Doyle, "Operation useful for similarity-invariant pattern recognition,"
// Journal of the Association for Computing Machinery, vol. 9,pp. 259-267, 1962.
// ported to ImageJ plugin by G.Landini from Antti Niemisto's Matlab code (GPL)
// Original Matlab code Copyright (C) 2004 Antti Niemisto
// See http://www.cs.tut.fi/~ant/histthresh/ for an excellent slide presentation
// and the original Matlab code.
export default function percentile(histogram) {
  let threshold = -1;
  let percentile = 0.5; // default fraction of foreground pixels
  let avec = new Array(histogram.length);

  let total = partialSum(histogram, histogram.length - 1);
  let temp = 1.0;

  for (let i = 0; i < histogram.length; i++) {
    avec[i] = Math.abs(partialSum(histogram, i) / total - percentile);
    if (avec[i] < temp) {
      temp = avec[i];
      threshold = i;
    }
  }

  return threshold;
}

function partialSum(histogram, endIndex) {
  let x = 0;
  for (let i = 0; i <= endIndex; i++) {
    x += histogram[i];
  }
  return x;
}
