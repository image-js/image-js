import Image from '../Image';
import Matrix from 'ml-matrix';

/**
 * Erosion is one of two fundamental operations (the other being dilation) in morphological image processing from which all other morphological operations are based (from Wikipedia).
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/erosion_dilatation/erosion_dilatation.html
 * https://en.wikipedia.org/wiki/Erosion_(morphology)
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {Matrix} [options.kernel]
 * @return {Image}
 */
export default function erode(options = {}) {
    let {
        kernel = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]])
    } = options;

    this.checkProcessable('erode', {
        bitDepth: [8, 16],
        channel: [1]
    });
    if (kernel.columns - 1 % 2 === 0 || kernel.rows - 1 % 2 === 0) {
        throw new TypeError('erode: The number of rows and columns of the kernel must be odd');
    }

    const newImage = Image.createFrom(this);
    let currentMatrix = this.getMatrix();
    let newMatrix = new Matrix(currentMatrix);
    let shiftX = (kernel.columns - 1) / 2;
    let shiftY = (kernel.rows - 1) / 2;


    for (let i = 0; i < currentMatrix.columns; i++) {
        for (let j = 0; j < currentMatrix.rows; j++) {
            let startRow = Math.max(0, i - shiftX);
            let endRow = Math.min(currentMatrix.rows - 1, i + shiftX);
            let startColumn = Math.max(0, j - shiftY);
            let endColumn = Math.min(currentMatrix.columns - 1, j + shiftY);
            if (startRow >= endRow || startColumn >= endColumn) {
                continue;
            }
            let tmpMatrix = currentMatrix.subMatrix(startRow, endRow, startColumn, endColumn);

            newMatrix.set(i, j, maxOfConvolution(tmpMatrix, kernel));
        }
    }
    newImage.setMatrix(newMatrix);
    return newImage;
}

function maxOfConvolution(a, b) {
    let maximum = 0;
    for (let i = 0; i < a.rows; i++) {
        for (let j = 0; j < a.columns; j++) {
            if (b.get(i, j) === 1) {
                if (a.get(i, j) > maximum) {
                    maximum = a.get(i, j);
                }
            }
        }
    }
    return maximum;
}
