import Image from '../image';
import convolution from '../operator/convolution';

export default function sobelFilter({
	kernelX = [
		[-1, 0, +1],
		[-2, 0, +2],
		[-1, 0, +1]
	],
	kernelY = [
		[-1, -2, -1],
		[0, 0, 0],
		[+1, +2, +1]
	],
	border = 'copy'
	} = {}) {

	this.checkProcessable('sobelFilter', {
		components: [1],
		bitDepth: [8, 16]
	});

	let gX = convolution.call(this, kernelX, {
		border: border,
		bitDepth: 64
	});

	let gY = convolution.call(this, kernelY, {
		border: border,
		bitDepth: 64
	});

	return gX.hypot(gY, {bitDepth: this.bitDepth});
}
