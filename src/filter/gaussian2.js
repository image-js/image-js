import Image from '../image';
import convolution from '../operator/convolution';

export default function gaussianFilter(sigma, boundary = 'copy'){

    this.checkProcessable({
        components: [1],
        bitDepth: [8, 16]
    });

    if (sigma <= 0) {
        throw new Error('Sigma should be grater than 0');
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

    //gaussian kernel is calculated
    let sigma2 = 2 * (sigma * sigma); //2*sigma^2
    let PI2sigma2 = Math.PI * sigma2; //2*PI*sigma^2
    let k = 0;
    let value = 1/PI2sigma2;
    let sum = value;

    while(sum < 0.99){
        k++;
        value = Math.exp(-(k * k)/sigma2) / PI2sigma2;
        sum += 4 * value;
        for(let i = 1; i < k; i++){
            value = Math.exp(-((i * i) + (k * k))/sigma2) / PI2sigma2;
            sum += 8 * value;
        }
        value = 4 * Math.exp(-(2* k * k)/sigma2) / PI2sigma2;
        sum +=  value;
    }

    if(sum > 1){
        return this;
    }

    let n = 2 * k + 1;
    let kernel = [n * n];

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

    //print kernel
    //let matrix = '';
    //for(let i = 0; i < kernel.length; i++){
    //    if(i%n == 0){
    //        matrix += '\n';
    //    }
    //    matrix += kernel[i] + ' ';
    //}

    convolution.call(this, newImage, kernel, boundary);

    return newImage;
}