import convolution from '../operator/convolution';

/**
 * Apply a gaussian filter to the image
 * @memberof Image
 * @instance
 * @param {object} options
 * @param {number} [options.radius=1] : number of pixels around the current pixel
 * @param {number} [options.sigma]
 * @param {number[]|string[]} [options.channels] : to which channel to apply the filter. By default all but alpha.
 * @param {string} [options.border='copy']
 * @param {boolean} [options.algorithm='auto'] : Algorithm for convolution {@link Image#convolution}
 * @return {Image}
 */
export default function gaussianFilter(options = {}) {
    let {
        radius = 1,
        sigma,
        channels,
        border = 'copy'
    } = options;

    this.checkProcessable('gaussian', {
        bitDepth: [8, 16]
    });

    let kernel;
    if (sigma) {
        kernel = getSigmaKernel(sigma);
    } else {
        // sigma approximation using radius
        sigma = 0.3 * (radius - 1) + 0.8;
        kernel = getKernel(radius, sigma);
    }

    return convolution.call(this, [kernel, kernel], { border, channels, algorithm: 'separable' });
}

const sqrt2Pi = Math.sqrt(2 * Math.PI);

function getKernel(radius, sigma) {
    if (radius < 1) {
        throw new RangeError('Radius should be grater than 0');
    }

    const n = 2 * radius + 1;
    const kernel = new Array(n);
    const twoSigmaSquared = 0 - 1 / (2 * sigma * sigma);
    const sigmaSqrt2Pi = 1 / (sigma * sqrt2Pi);

    for (let i = 0; i <= radius; i++) {
        const value = Math.exp(i * i * twoSigmaSquared) * sigmaSqrt2Pi;
        kernel[radius + i] = value;
        kernel[radius - i] = value;
    }
    return kernel;
}

function getSigmaKernel(sigma) {
    if (sigma <= 0) {
        throw new RangeError('Sigma should be grater than 0');
    }
    let sigma2 = 2 * (sigma * sigma); //2*sigma^2
    let PI2sigma2 = Math.PI * sigma2; //2*PI*sigma^2
    let value = 1 / PI2sigma2;
    let sum = value;
    let neighbors = 0;

    while (sum < 0.99) {
        neighbors++;
        value = Math.exp(-(neighbors * neighbors) / sigma2) / PI2sigma2;
        sum += 4 * value;
        for (let i = 1; i < neighbors; i++) {
            value = Math.exp(-((i * i) + (neighbors * neighbors)) / sigma2) / PI2sigma2;
            sum += 8 * value;
        }
        value = 4 * Math.exp(-(2 * neighbors * neighbors) / sigma2) / PI2sigma2;
        sum +=  value;
    }

    // What does this case mean ?
    if (sum > 1) {
        throw new Error('unexpected sum over 1');
    }

    return getKernel(neighbors, sigma);
}
