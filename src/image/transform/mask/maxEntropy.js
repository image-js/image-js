/*
 * see http://rsb.info.nih.gov/ij/developer/source/ij/process/AutoThresholder.java.html
 * The method is present in: Implements Kapur-Sahoo-Wong (Maximum Entropy) thresholding method:
 * Kapur, JN; Sahoo, PK & Wong, ACK (1985), "A New Method for Gray-Level Picture Thresholding Using the Entropy of the Histogram",
 * Graphical Models and Image Processing 29(3): 273-285
 * @param histogram - the histogram of the image
 *        total - the number of pixels in the image
 * @returns {number} - the threshold
 */

export default function maxEntropy(histogram, total) {

    let threshold = -1;
    let first_bin;
    let last_bin;
    let tot_ent;  /* total entropy */
    let max_ent;  /* max entropy */
    let ent_back; /* entropy of the background pixels at a given threshold */
    let ent_obj;  /* entropy of the object pixels at a given threshold */
    let norm_histo = []; /* normalized histogram */
    let P1 = []; /* cumulative normalized histogram */
    let P2 = [];

    for (let ih = 0; ih < histogram.length; ih++)
        norm_histo[ih] = histogram[ih] / total;

    P1[0] = norm_histo[0];
    P2[0] = 1.0 - P1[0];

    for (let ih = 1; ih < histogram.length; ih++) {
        P1[ih] = P1[ih-1] + norm_histo[ih];
        P2[ih] = 1.0 - P1[ih];
    }

    /* Determine the first non-zero bin */
    first_bin = 0;
    for (let ih = 0; ih < histogram.length; ih++) {
        if (Math.abs(P1[ih]) >= 2.220446049250313E-16) {
            first_bin = ih;
            break;
        }
    }

    /* Determine the last non-zero bin */
    last_bin = histogram.length - 1;
    for (let ih = histogram.length - 1; ih >= first_bin; ih--) {
        if (Math.abs(P2[ih]) >= 2.220446049250313E-16) {
            last_bin = ih;
            break;
        }
    }

    // Calculate the total entropy each gray-level
    // and find the threshold that maximizes it
    max_ent = Number.MIN_VALUE;

    for (let it = first_bin; it <= last_bin; it++) {
        /* Entropy of the background pixels */
        ent_back = 0.0;
        for (let ih = 0; ih <= it; ih++) {
            if (histogram[ih] != 0) {
                ent_back -= (norm_histo[ih] / P1[it]) * Math.log(norm_histo[ih] / P1[it]);
            }
        }

        /* Entropy of the object pixels */
        ent_obj = 0.0;
        for (let ih = it + 1; ih < histogram.length; ih++) {
            if (histogram[ih]!= 0) {
                ent_obj -= (norm_histo[ih] / P2[it]) * Math.log(norm_histo[ih] / P2[it]);
            }
        }

        /* Total entropy */
        tot_ent = ent_back + ent_obj;

        if (max_ent < tot_ent) {
            max_ent = tot_ent;
            threshold = it;
        }
    }
    return threshold;
}

