/*
 * The method is present in: Uses the 	mean of grey levels as the threshold. It is described in:
 * Glasbey, CA (1993), "An analysis of histogram-based thresholding algorithms",
 * CVGIP: Graphical Models and Image Processing 55: 532-537
 * @param histogram - the histogram of the image
 *        total - the number of pixels in the image
 * @returns {number} - the threshold
 */

export default function mean(histogram, total) {

    let threshold = -1;
    let sum = 0;

    for (let i = 0; i < histogram.length; i++) {
        sum += i * histogram[i];
    }

    threshold = Math.floor(sum / total);

    return threshold;
}

