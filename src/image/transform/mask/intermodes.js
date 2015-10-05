/**
 *
 * see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
 * Intermodes: This assumes a bimodal histogram. Implements the thresholding Prewitt, JMS & Mendelsohn, ML (1966),
 * "The analysis of cell images", Annals of the NewYork Academy of Sciences 128: 1035-1053
 *
 */

export default function intermodes(histogram) {

    let iHisto = new Array(histogram.length);
    let iter = 0;
    let threshold = -1;

    for (let i = 0; i < histogram.length; i++) {
        iHisto[i] = histogram[i];
    }

    while (!bimodalTest(iHisto)) {
        //smooth with a 3 point running mean filter
        let previous = 0, current = 0, next = iHisto[0];
        for (let i = 0; i < histogram.length - 1; i++) {
            previous = current;
            current = next;
            next = iHisto[i + 1];
            iHisto[i] = (previous + current + next) / 3;
        }
        iHisto[histogram.length - 1] = (current + next) / 3;
        iter++;
        if (iter > 10000) {
            threshold = -1;
            throw new Error('Intermodes Threshold not found after 10000 iterations');
            return threshold;
        }
    }

    // The threshold is the mean between the two peaks.
    let tt = 0;
    for (let i = 1; i < histogram.length - 1; i++) {
        if (iHisto[i - 1] < iHisto[i] && iHisto[i + 1] < iHisto[i]) {
            tt += i;
        }
    }
    threshold = Math.floor(tt / 2.0);
    return threshold;
}

function bimodalTest(iHisto) {
    let len = iHisto.length;
    let b = false;
    let modes = 0;

    for (let k = 1; k < len - 1; k++) {
        if (iHisto[k-1] < iHisto[k] && iHisto[k+1] < iHisto[k]) {
            modes++;
            if (modes > 2) {
                return false;
            }
        }
    }
    if (modes === 2) {
        b = true;
    }
    return b;
}