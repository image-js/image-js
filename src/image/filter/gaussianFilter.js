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
 * @returns {Image}
 */

export default function gaussianFilter(options = {}) {
    let {
		radius = 1,
		sigma,
		channels,
		border = 'copy',
        algorithm = 'auto'
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

    return convolution.call(this, kernel, {
        border: border,
        channels: channels,
        algorithm: algorithm
    });
}

function getKernel(radius, sigma) {
    if (radius < 1) {
        throw new RangeError('Radius should be grater than 0');
    }
    let n = 2 * radius + 1;

    let kernel = new Array(n * n);

	//gaussian kernel is calculated
    let sigma2 = 2 * (sigma * sigma); //2*sigma^2
    let PI2sigma2 = Math.PI * sigma2; //2*PI*sigma^2

    for (let i = 0; i <= radius; i++) {
        for (let j = i; j <= radius; j++) {
            let value = Math.exp(-((i * i) + (j * j)) / sigma2) / PI2sigma2;
            kernel[(i + radius) * n + (j + radius)] = value;
            kernel[(i + radius) * n + (-j + radius)] = value;
            kernel[(-i + radius) * n + (j + radius)] = value;
            kernel[(-i + radius) * n + (-j + radius)] = value;
            kernel[(j + radius) * n + (i + radius)] = value;
            kernel[(j + radius) * n + (-i + radius)] = value;
            kernel[(-j + radius) * n + (i + radius)] = value;
            kernel[(-j + radius) * n + (-i + radius)] = value;
        }
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
