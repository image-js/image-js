// see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// Zack, G. W., Rogers, W. E. and Latt, S. A., 1977,
// Automatic Measurement of Sister Chromatid Exchange Frequency,
// Journal of Histochemistry and Cytochemistry 25 (7), pp. 741-753
//
//  modified from Johannes Schindelin plugin
export default function triangle(histogram) {
  // find min and max
  let min = 0;
  let dmax = 0;
  let max = 0;
  let min2 = 0;
  for (let i = 0; i < histogram.length; i++) {
    if (histogram[i] > 0) {
      min = i;
      break;
    }
  }
  if (min > 0) { // line to the (p==0) point, not to histogram[min]
    min--;
  }

  // The Triangle algorithm cannot tell whether the data is skewed to one side or another.
  // This causes a problem as there are 2 possible thresholds between the max and the 2 extremes
  // of the histogram.
  // Here I propose to find out to which side of the max point the data is furthest, and use that as
  //  the other extreme.
  for (let i = histogram.length - 1; i > 0; i--) {
    if (histogram[i] > 0) {
      min2 = i;
      break;
    }
  }
  if (min2 < histogram.length - 1) { // line to the (p==0) point, not to data[min]
    min2++;
  }

  for (let i = 0; i < histogram.length; i++) {
    if (histogram[i] > dmax) {
      max = i;
      dmax = histogram[i];
    }
  }

  // find which is the furthest side
  let inverted = false;
  if ((max - min) < (min2 - max)) {
    // reverse the histogram
    inverted = true;
    let left  = 0;                      // index of leftmost element
    let right = histogram.length - 1;   // index of rightmost element
    while (left < right) {
      // exchange the left and right elements
      let temp = histogram[left];
      histogram[left]  = histogram[right];
      histogram[right] = temp;
      // move the bounds toward the center
      left++;
      right--;
    }
    min = histogram.length - 1 - min2;
    max = histogram.length - 1 - max;
  }

  if (min === max) {
    return min;
  }

  // describe line by nx * x + ny * y - d = 0
  let nx, ny, d;
  // nx is just the max frequency as the other point has freq=0
  nx = histogram[max];   // -min; // data[min]; //  lowest value bmin = (p=0)% in the image
  ny = min - max;
  d = Math.sqrt(nx * nx + ny * ny);
  nx /= d;
  ny /= d;
  d = nx * min + ny * histogram[min];

  // find split point
  let split = min;
  let splitDistance = 0;
  for (let i = min + 1; i <= max; i++) {
    let newDistance = nx * i + ny * histogram[i] - d;
    if (newDistance > splitDistance) {
      split = i;
      splitDistance = newDistance;
    }
  }
  split--;

  if (inverted) {
    // The histogram might be used for something else, so let's reverse it back
    let left  = 0;
    let right = histogram.length - 1;
    while (left < right) {
      let temp = histogram[left];
      histogram[left]  = histogram[right];
      histogram[right] = temp;
      left++;
      right--;
    }
    return (histogram.length - 1 - split);
  } else {
    return split;
  }
}
