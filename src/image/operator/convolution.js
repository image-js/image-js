import isInteger from 'is-integer';

export default function convolution(newImage, kernel) {
    let kernelWidth, kWidth, kHeight;
    let div = 0, sum = 0, newValue = 0;
    let twoDim = Array.isArray(kernel[0]);

    if (Array.isArray(kernel) && !twoDim) {
        if (isInteger(Math.sqrt(kernel.length))) {
            kernelWidth = Math.sqrt(kernel.length);
            kWidth = kHeight = Math.floor(kernelWidth / 2);
        } else {
            throw new RangeError('Number of neighbors should be grater than 0');
        }
        //calculate div
        for (let i = 0; i < kernel.length; i++) div += kernel[i];
    } else if (twoDim) {
        if ((kernel.width & 1 === 0) || (kernel.height & 1 === 0))
            throw new RangeError('Kernel rows and columns should be odd numbers');
        else {
            kWidth = Math.floor(kernel.length / 2);
            kHeight = Math.floor(kernel[0].length / 2);
        }
        //calculate div
        for (let i = 0; i < kernel.length; i++)
            for (let j = 0; j < kernel[0].length; j++)
                div += kernel[i][j];
    } else {
        throw new Error('Invalid Kernel: ' + kernel);
    }

    for (let x = kWidth; x < this.width - kWidth; x++) {
        for (let y = kHeight; y < this.height - kHeight; y++) {
            sum = 0;
            for (let i = -kWidth; i <= kWidth; i++) {
                for (let j = -kHeight; j <= kHeight; j++) {
                    let kVal = !twoDim ? kernel[(i + kWidth) * kernelWidth + (j + kWidth)] : kernel[kWidth + i][kHeight + j];
                    sum += this.getValueXY(x + i, y + j, 0) * kVal;
                }
            }
            if (div >= 1) newValue = Math.floor(sum / div);
            else newValue = sum;

            newImage.setValueXY(x, y, 0, newValue);
            if (this.alpha) newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));
        }
    }
}