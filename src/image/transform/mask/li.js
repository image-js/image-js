/*
 * see http://rsb.info.nih.gov/ij/developer/source/ij/process/AutoThresholder.java.html
 * The method is present in: Implements Li's Minimum Cross Entropy thresholding method
 * This implementation is based on the iterative version (Ref. 2nd reference below) of the algorithm.
 *  1) Li, CH & Lee, CK (1993), "Minimum Cross Entropy Thresholding", Pattern Recognition 26(4): 61 625
 *  2) Li, CH & Tam, PKS (1998), "An Iterative Algorithm for Minimum Cross Entropy Thresholding",
 *     Pattern Recognition Letters 18(8): 771-776
 *  3) Sezgin, M & Sankur, B (2004), "Survey over Image Thresholding Techniques and Quantitative Performance
 *     Evaluation",Journal of Electronic Imaging 13(1): 146-165
 * @param histogram - the histogram of the image
 * @param total - the number of pixels in the image
 * @returns {number} - the threshold
 */


export default function li(histogram, total) {
  let threshold;
  let sumBack; /* sum of the background pixels at a given threshold */
  let sumObj;  /* sum of the object pixels at a given threshold */
  let numBack; /* number of background pixels at a given threshold */
  let numObj;  /* number of object pixels at a given threshold */
  let oldThresh;
  let newThresh;
  let meanBack; /* mean of the background pixels at a given threshold */
  let meanObj;  /* mean of the object pixels at a given threshold */
  let mean;  /* mean gray-level in the image */
  let tolerance; /* threshold tolerance */
  let temp;
  tolerance = 0.5;

  /* Calculate the mean gray-level */
  mean = 0.0;
  for (let ih = 0; ih < histogram.length; ih++) {
    mean += ih * histogram[ih];
  }

  mean /= total;
  /* Initial estimate */
  newThresh = mean;

  do {
    oldThresh = newThresh;
    threshold = (oldThresh + 0.5)|0; /* range */

    /* Calculate the means of background and object pixels */
    /* Background */
    sumBack = 0;
    numBack = 0;

    for (let ih = 0; ih <= threshold; ih++) {
      sumBack += ih * histogram[ih];
      numBack += histogram[ih];
    }
    meanBack = (numBack === 0 ? 0.0 : (sumBack / numBack));

    /* Object */
    sumObj = 0;
    numObj = 0;
    for (let ih = threshold + 1; ih < histogram.length; ih++) {
      sumObj += ih * histogram[ih];
      numObj += histogram[ih];
    }
    meanObj = (numObj === 0 ? 0.0 : (sumObj / numObj));
    temp = (meanBack - meanObj) / (Math.log(meanBack) - Math.log(meanObj));

    if (temp < -Number.EPSILON) {
      newThresh = (temp - 0.5)|0;
    } else {
      newThresh = (temp + 0.5)|0;
    }
    /*  Stop the iterations when the difference between the
         new and old threshold values is less than the tolerance */
  }
  while (Math.abs(newThresh - oldThresh) > tolerance);

  return threshold;
}

