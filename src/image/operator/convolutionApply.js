import Image from '../image';
import convolution from '../operator/convolution';

/*
 example of 1x1 kernel:
 kernel = [1];
 example of 2x2 kernel:
 kernel = [1,1,1,1];
 example of 3x3 kernel:
 kernel = [1,1,1,1,-9,1,1,1,1];
 example of 1x3 Kernel:
 kernel = [[-1],[0],[1]];
 example of 3x1 Kernel:
 kernel = [[-1,0,1]];
 example of 3x5 kernel:
 kernel = [[1,1,1],[1,1,1],[1,-15,1],[1,1,1],[1,1,1]];
 example of 5x3 kernel:
 kernel = [[1,1,1,1,1],[1,1,-15,1,1],[1,1,1,1,1]];
 */
export default function convolutionApply(kernel) {

    this.checkProcessable('convolutionApply', {
        components:[1],
        bitDepth:[8]
    });

    let newImage = Image.createFrom(this, {
        kind: {
            components: 1,
            alpha: this.alpha,
            bitDepth: this.bitDepth,
            colorModel: null
        }
    });

    convolution.call(this, newImage, kernel);

    return newImage;
}
