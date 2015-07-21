import Image from '../image';
import convolution from '../operator/convolution';

export default function gaussianFilter(k, boundary = 'copy') {

	this.checkProcessable('gaussianFilter', {
		components: [1],
		bitDepth: [8, 16]
	});

	if (k < 1) {
		throw new Error('Number of neighbors should be grater than 0');
	}

	//gaussian filter do not is in place
	let newImage = Image.createFrom(this, {
		kind: {
			components: 1,
			alpha: this.alpha,
			bitDepth: this.bitDepth,
			colorModel: null
		}
	});

	let n = 2 * k + 1;
	// sigma approximation using k
	let sigma = 0.3 * (k - 1) + 0.8;
	let kernel = [n * n];

	//gaussian kernel is calculated
	let sigma2 = 2 * (sigma * sigma); //2*sigma^2
	let PI2sigma2 = Math.PI * sigma2; //2*PI*sigma^2

	for(let i = 0; i <= k; i++){
		for(let j = i; j <= k; j++){
			let value = Math.exp(-((i * i) + (j * j))/sigma2) / PI2sigma2;
			kernel[(i + k)*n + (j + k)] = value;
			kernel[(i + k)*n + (-j + k)] = value;
			kernel[(-i + k)*n + (j + k)] = value;
			kernel[(-i + k)*n + (-j + k)] = value;
			kernel[(j + k)*n + (i + k)] = value;
			kernel[(j + k)*n + (-i + k)] = value;
			kernel[(-j + k)*n + (i + k)] = value;
			kernel[(-j + k)*n + (-i + k)] = value;
		}
	}

	convolution.call(this, newImage, kernel, boundary);

	return newImage;
}


