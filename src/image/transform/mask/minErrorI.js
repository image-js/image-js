/*
 * see http://rsb.info.nih.gov/ij/developer/source/ij/process/AutoThresholder.java.html
 * The method is present in: An 	iterative implementation of Kittler and Illingworth's Minimum Error
 * thresholding:Kittler, J & Illingworth, J (1986), "Minimum error thresholding", Pattern Recognition 19: 41-47
 * @param histogram - the histogram of the image
 *        total - the number of pixels in the image
 * @returns {number} - the threshold
 */

export default function minErrorI(histogram, total) {

    let threshold;
    let Tprev = -2;
    let mu, nu, p, q, sigma2, tau2, w0, w1, w2, sqterm, temp;
    let mean; /* mean gray-level in the image */

    /* Calculate the mean gray-level */
    mean = 0.0;
    for (let ih = 0; ih < histogram.length; ih++) {
        mean += ih * histogram[ih];
    }

    mean /= total;

    threshold = mean;

    while (threshold !== Tprev) {
        //Calculate some statistics.

        mu = B(histogram, threshold) / A(histogram, threshold);
        nu = (B(histogram, histogram.length - 1) - B(histogram, threshold)) / (A(histogram, histogram.length - 1) - A(histogram, threshold));
        p = A(histogram, threshold) / A(histogram, histogram.length - 1);
        q = (A(histogram, histogram.length - 1) - A(histogram, threshold)) / A(histogram, histogram.length - 1);
        sigma2 = C(histogram, threshold) / A(histogram, threshold) - (mu * mu);
        tau2 = (C(histogram, histogram.length - 1) - C(histogram, threshold)) / (A(histogram, histogram.length - 1) - A(histogram, threshold)) - (nu * nu);

        //The terms of the quadratic equation to be solved.
        w0 = 1.0 / sigma2 - 1.0 / tau2;
        w1 = mu / sigma2 - nu / tau2;
        w2 = (mu * mu) / sigma2 - (nu * nu) / tau2 + Math.log10((sigma2 * (q * q)) / (tau2 * (p * p)));

        //If the next threshold would be imaginary, return with the current one.
        sqterm = (w1 * w1) - w0 * w2;
        if (sqterm < 0) {
            return threshold;
        }

        //The updated threshold is the integer part of the solution of the quadratic equation.
        Tprev = threshold;
        temp = (w1 + Math.sqrt(sqterm)) / w0;

        if (isNaN(temp)) {
            threshold = Tprev;
        }
        else {
            threshold = Math.floor(temp);
        }

    }
    return threshold;
}

//aux func

function A(y, j) {
    let x = 0;
    for (let i = 0;i <= j; i++) {
        x += y[i];
    }
    return x;
}

function B(y, j) {
    let x = 0;
    for (let i = 0; i <= j; i++) {
        x += i * y[i];
    }
    return x;
}

function C(y, j) {
    let x = 0;
    for (let i = 0; i <= j; i++) {
        x += i * i * y[i];
    }
    return x;
}
