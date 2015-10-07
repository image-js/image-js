/*
 * see http://rsb.info.nih.gov/ij/developer/source/ij/process/AutoThresholder.java.html
 * The method is present in: Implements Li's Minimum Cross Entropy thresholding method
 * This implementation is based on the iterative version (Ref. 2nd reference below) of the algorithm.
 *  1) Li, CH & Lee, CK (1993), "Minimum Cross 	Entropy Thresholding", Pattern Recognition 26(4): 61 625
 *  2) Li, CH & Tam, PKS (1998), "An Iterative 	Algorithm for Minimum Cross Entropy Thresholding",
 *     Pattern 	Recognition Letters 18(8): 771-776
 *  3) Sezgin, M & Sankur, B (2004), "Survey 	over Image Thresholding Techniques and Quantitative Performance
 *     Evaluation",Journal of Electronic Imaging 13(1): 146-165
 * @param histogram - the histogram of the image
 *        total - the number of pixels in the image
 * @returns {number} - the threshold
 */


export default function li(histogram, total) {

    let threshold;
    let sum_back; /* sum of the background pixels at a given threshold */
    let sum_obj;  /* sum of the object pixels at a given threshold */
    let num_back; /* number of background pixels at a given threshold */
    let num_obj;  /* number of object pixels at a given threshold */
    let old_thresh;
    let new_thresh;
    let mean_back; /* mean of the background pixels at a given threshold */
    let mean_obj;  /* mean of the object pixels at a given threshold */
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
    new_thresh = mean;

    do {
        old_thresh = new_thresh;
        threshold = (old_thresh + 0.5)|0;	/* range */

        /* Calculate the means of background and object pixels */
        /* Background */
        sum_back = 0;
        num_back = 0;

        for (let ih = 0; ih <= threshold; ih++) {
            sum_back += ih * histogram[ih];
            num_back += histogram[ih];
        }
        mean_back = (num_back === 0 ? 0.0 : (sum_back / num_back));

        /* Object */
        sum_obj = 0;
        num_obj = 0;
        for (let ih = threshold + 1; ih < histogram.length; ih++) {
            sum_obj += ih * histogram[ih];
            num_obj += histogram[ih];
        }
        mean_obj = (num_obj === 0 ? 0.0 : (sum_obj / num_obj));
        temp = (mean_back - mean_obj) / (Math.log(mean_back) - Math.log(mean_obj));

        if (temp < -Number.EPSILON) {
            new_thresh = (temp - 0.5)|0;
        }
        else {
            new_thresh = (temp + 0.5)|0;
        }
        /*  Stop the iterations when the difference between the
         new and old threshold values is less than the tolerance */
    }
    while (Math.abs(new_thresh - old_thresh) > tolerance);

    return threshold;
}


