/***
 *
 * see http://rsb.info.nih.gov/ij/developer/source/ij/process/AutoThresholder.java.html.
 * Huang: Implements Huang's fuzzy thresholding method: Huang, L-K & Wang, M-J J (1995),
 * "Image thresholding by minimizing the measure of fuzziness", Pattern Recognition 28(1): 41-51
 *
 */

export default function huang(histogram) {
    /* Determine the first non-zero bin */
    let first_bin = 0;
    for (let ih = 0; ih < histogram.length; ih++) {
        if (histogram[ih] !== 0) {
            first_bin = ih;
            break;
        }
    }

    /* Determine the last non-zero bin */
    let last_bin = histogram.length - 1;
    for (let ih = histogram.length - 1; ih >= first_bin; ih--) {
        if (histogram[ih] !== 0) {
            last_bin = ih;
            break;
        }
    }

    let term = 1.0 / (last_bin - first_bin);
    let mu_0 = new Array(histogram.length);
    let sum_pix = 0;
    let num_pix = 0;
    for (let ih = first_bin; ih < histogram.length; ih++) {
        sum_pix += ih * histogram[ih];
        num_pix += histogram[ih];
        mu_0[ih] = sum_pix / num_pix;
    }

    let mu_1 = new Array(histogram.length);
    sum_pix = num_pix = 0;
    for (let ih = last_bin; ih > 0; ih--) {
        sum_pix += ih * histogram[ih];
        num_pix += histogram[ih];
        mu_1[ih - 1] = sum_pix /  num_pix;
    }

    /* Determine the threshold that minimizes the fuzzy entropy*/
    let threshold = -1;
    let min_ent = Number.MAX_VALUE;
    for (let it = 0; it < histogram.length; it++) {
        let ent = 0;
        let mu_x;
        for (let ih = 0; ih <= it; ih++) {
            /* Equation (4) in Ref. 1 */
            mu_x = 1 / (1 + term * Math.abs(ih - mu_0[it]));
            if (!((mu_x  < 1e-06) || (mu_x > 0.999999))) {
                /* Equation (6) & (8) in Ref. 1 */
                ent += histogram[ih] * (-mu_x * Math.log (mu_x) - (1 - mu_x) * Math.log (1 - mu_x));
            }
        }

        for (let ih = it + 1; ih < histogram.length; ih++) {
            /* Equation (4) in Ref. 1 */
            mu_x = 1 / (1 + term * Math.abs (ih - mu_1[it]));
            if (!((mu_x  < 1e-06) || (mu_x > 0.999999))) {
                /* Equation (6) & (8) in Ref. 1 */
                ent += histogram[ih] * (-mu_x * Math.log (mu_x) - (1 - mu_x) * Math.log(1 - mu_x));
            }
        }

        if (ent < min_ent) {
            min_ent = ent;
            threshold = it;
        }
    }
    return threshold;
}
