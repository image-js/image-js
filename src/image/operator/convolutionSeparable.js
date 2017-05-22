import {directConvolution} from 'ml-convolution';

export default function convolutionSeparable(data, kernel, width, height) {
    const result = new Array(data.length);
    const offset = (kernel.length - 1) / 2;
    let tmp, conv;

    conv = new Array(width + kernel.length - 1);
    tmp = new Array(width);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            tmp[x] = data[y * width + x];
        }
        directConvolution(tmp, kernel, conv);
        for (let x = 0; x < width; x++) {
            result[y * width + x] = conv[offset + x];
        }
    }

    conv = new Array(height + kernel.length - 1);
    tmp = new Array(height);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            tmp[y] = result[y * width + x];
        }
        directConvolution(tmp, kernel, conv);
        for (let y = 0; y < height; y++) {
            result[y * width + x] = conv[offset + y];
        }
    }
    return result;
}
