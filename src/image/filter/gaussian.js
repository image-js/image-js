import Image from '../image';
import convolution from '../operator/convolution';

export default function gaussianFilter({
	neighbors = 1,
	sigma,
	boundary = 'copy'
	} = {}) {

	this.checkProcessable('gaussianFilter', {
		components: [1],
		bitDepth: [8, 16]
	});

	let kernel;
	if (sigma) {
		kernel = getSigmaKernel(sigma);
	} else {
		// sigma approximation using neighbors
		sigma = 0.3 * (neighbors - 1) + 0.8;
		kernel = getKernel(neighbors, sigma);
	}


	return convolution.call(this, kernel, boundary);
}

function getKernel(neighbors, sigma) {
	if (neighbors < 1) {
		throw new RangeError('Number of neighbors should be grater than 0');
	}
	let n = 2 * neighbors + 1;

	let kernel = new Array(n * n);

	//gaussian kernel is calculated
	let sigma2 = 2 * (sigma * sigma); //2*sigma^2
	let PI2sigma2 = Math.PI * sigma2; //2*PI*sigma^2

	for (let i = 0; i <= neighbors; i++) {
		for (let j = i; j <= neighbors; j++) {
			let value = Math.exp(-((i * i) + (j * j)) / sigma2) / PI2sigma2;
			kernel[(i + neighbors) * n + (j + neighbors)] = value;
			kernel[(i + neighbors) * n + (-j + neighbors)] = value;
			kernel[(-i + neighbors) * n + (j + neighbors)] = value;
			kernel[(-i + neighbors) * n + (-j + neighbors)] = value;
			kernel[(j + neighbors) * n + (i + neighbors)] = value;
			kernel[(j + neighbors) * n + (-i + neighbors)] = value;
			kernel[(-j + neighbors) * n + (i + neighbors)] = value;
			kernel[(-j + neighbors) * n + (-i + neighbors)] = value;
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
