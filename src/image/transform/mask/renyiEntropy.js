// see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// Kapur J.N., Sahoo P.K., and Wong A.K.C. (1985) "A New Method for
// Gray-Level Picture Thresholding Using the Entropy of the Histogram"
// Graphical Models and Image Processing, 29(3): 273-285
// M. Emre Celebi
// 06.15.2007
// Ported to ImageJ plugin by G.Landini from E Celebi's fourier_0.8 routines

export default function renyiEntropy(histogram, total) {
    let opt_threshold; //Optimal threshold
    let first_bin; //First non-zero bin
    let last_bin; //last non-zero bin

    let norm_histo = new Array(histogram.length); //normalized histogram
    let P1 = new Array(histogram.length); //acumulative normalized histogram
    let P2 = new Array(histogram.length); //acumulative normalized histogram

    //Entropy Variables
    let threshold1 = 0;
    let threshold2 = 0;
    let threshold3 = 0;
    let max_ent1 = 0.0;
    let max_ent2 = 0.0;
    let max_ent3 = 0.0;
    let alpha2 = 0.5;
    let term2 = 1.0 / (1.0 - alpha2);
    let alpha3 = 2.0;
    let term3 = 1.0 / (1.0 - alpha3);

    for (let ih = 0; ih < histogram.length; ih++)
        norm_histo[ih] = histogram[ih] / total;

    P1[0] = norm_histo[0];
    P2[0] = 1.0 - P1[0];
    for (let ih = 1; ih < histogram.length; ih++) {
        P1[ih] = P1[ih - 1] + norm_histo[ih];
        P2[ih] = 1.0 - P1[ih];
    }

    /* Determine the first non-zero bin */
    first_bin = 0;
    for (let ih = 0; ih < histogram.length; ih++) {
        if (Math.abs(P1[ih]) >= Number.EPSILON) {
            first_bin = ih;
            break;
        }
    }

    /* Determine the last non-zero bin */
    last_bin = histogram.length - 1;
    for (let ih = histogram.length - 1; ih >= first_bin; ih--) {
        if (Math.abs(P2[ih]) >= Number.EPSILON) {
            last_bin = ih;
            break;
        }
    }

    /* Maximum Entropy Thresholding - BEGIN */
    /* ALPHA = 1.0 */
    /* Calculate the total entropy each gray-level
     and find the threshold that maximizes it
     */
    for (let it = first_bin; it <= last_bin; it++) {
        /* Entropy of the background pixels */
        let ent_back1 = 0.0;
        let ent_back2 = 0.0;
        let ent_back3 = 0.0;
        for (let ih = 0; ih <= it; ih++) {
            if (histogram[ih] !== 0) {
                ent_back1 -= (norm_histo[ih] / P1[it]) * Math.log(norm_histo[ih] / P1[it]);
            }
            ent_back2 += Math.sqrt(norm_histo[ih] / P1[it]);
            ent_back3 += (norm_histo[ih] * norm_histo[ih]) / (P1[it] * P1[it]);
        }

        /* Entropy of the object pixels */
        let ent_obj1 = 0.0;
        let ent_obj2 = 0.0;
        let ent_obj3 = 0.0;
        for (let ih = it + 1; ih < histogram.length; ih++) {
            if (histogram[ih] !== 0) {
                ent_obj1 -= (norm_histo[ih] / P2[it]) * Math.log(norm_histo[ih] / P2[it]);
            }
            ent_obj2 += Math.sqrt(norm_histo[ih] / P2[it]);
            ent_obj3 += (norm_histo[ih] * norm_histo[ih]) / (P2[it] * P2[it]);
        }

        /* Total entropy */
        let tot_ent1 = ent_back1 + ent_obj1;
        let tot_ent2 = term2 * ((ent_back2 * ent_obj2) > 0.0 ? Math.log(ent_back2 * ent_obj2) : 0.0);
        let tot_ent3 = term3 * ((ent_back3 * ent_obj3) > 0.0 ? Math.log(ent_back3 * ent_obj3) : 0.0);

        if (tot_ent1 > max_ent1) {
            max_ent1 = tot_ent1;
            threshold1 = it;
        }

        if (tot_ent2 > max_ent2) {
            max_ent2 = tot_ent2;
            threshold2 = it;
        }

        if (tot_ent3 > max_ent3) {
            max_ent3 = tot_ent3;
            threshold3 = it;
        }
    }
    /* End Maximum Entropy Thresholding */

    let t_stars = [threshold1, threshold2, threshold3];
    t_stars.sort((a,b) => a - b);

    let betas;

    /* Adjust beta values */
    if (Math.abs(t_stars[0] - t_stars[1]) <= 5) {
        if (Math.abs(t_stars[1] - t_stars[2]) <= 5) {
            betas = [1, 2, 1];
        }
        else {
            betas = [0, 1, 3];
        }
    }
    else {
        if (Math.abs(t_stars[1] - t_stars[2]) <= 5) {
            betas = [3, 1, 0];
        }
        else {
            betas = [1, 2, 1];
        }
    }

    /* Determine the optimal threshold value */
    let omega = P1[t_stars[2]] - P1[t_stars[0]];
    opt_threshold = Math.round(t_stars[0] * (P1[t_stars[0]] + 0.25 * omega * betas[0]) + 0.25 * t_stars[1] * omega * betas[1] + t_stars[2] * (P2[t_stars[2]] + 0.25 * omega * betas[2]));

    return opt_threshold;
}
