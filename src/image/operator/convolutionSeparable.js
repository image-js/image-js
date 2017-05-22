import {directConvolution} from 'ml-convolution';

export default function convolutionSeparable(data, kernel, width, height) {
    const result = new Array(data.length);
    const offset = (kernel.length - 1) / 2;
    for (let y = 0; y < height; y++) {
        const tmp = new Array(width);
        for (let x = 0; x < width; x++) {
            tmp[x] = data[y * width + x];
        }
        const conv = directConvolution(tmp, kernel);
        for (let x = 0; x < width; x++) {
            result[y * width + x] = conv[offset + x];
        }
    }
    for (let x = 0; x < width; x++) {
        const tmp = new Array(height);
        for (let y = 0; y < height; y++) {
            tmp[y] = result[y * width + x];
        }
        const conv = directConvolution(tmp, kernel);
        for (let y = 0; y < height; y++) {
            result[y * width + x] = conv[offset + y];
        }
    }
    return result;
}
