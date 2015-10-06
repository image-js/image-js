// see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// Shanhbag A.G. (1994) "Utilization of Information Measure as a Means of
// Image Thresholding" Graphical Models and Image Processing, 56(5): 414-419
// Ported to ImageJ plugin by G.Landini from E Celebi's fourier_0.8 routines

export default function shanbhag(histogram, total) {
    let threshold;
    let first_bin;
    let last_bin;
    let term;
    let tot_ent;  /* total entropy */
    let min_ent;  /* max entropy */
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
        P1[ih] = P1[ih - 1] + norm_histo[ih];
        P2[ih]= 1.0 - P1[ih];
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
    threshold = -1;
    min_ent = Number.MAX_VALUE;

    for (let it = first_bin; it <= last_bin; it++) {
        /* Entropy of the background pixels */
        ent_back = 0.0;
        term = 0.5 / P1[it];
        for (let ih = 1; ih <= it; ih++)  {
            ent_back -= norm_histo[ih] * Math.log(1.0 - term * P1[ih - 1]);
        }
        ent_back *= term;

        /* Entropy of the object pixels */
        ent_obj = 0.0;
        term = 0.5 / P2[it];
        for (let ih = it + 1; ih < histogram.length; ih++){
            ent_obj -= norm_histo[ih] * Math.log(1.0 - term * P2[ih]);
        }
        ent_obj *= term;

        /* Total entropy */
        tot_ent = Math.abs(ent_back - ent_obj);

        if (tot_ent < min_ent) {
            min_ent = tot_ent;
            threshold = it;
        }
    }
    return threshold;
}
