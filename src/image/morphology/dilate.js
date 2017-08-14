import Image from '../Image';
import Matrix from 'ml-matrix';

/**
 * @memberof Image
 * @instance
 * @param {Matrix} kernel
 * @return {Image}
 */
export default function dilate(kernel) {
    if (kernel.columns - 1 % 2 === 0 || kernel.rows - 1 % 2 === 0) {
        // problem
    }
    const newImage = Image.createFrom(this);
    let currentMatrix = this.getMatrix();
    let newMatrix = new Matrix(currentMatrix);
    let shiftX = (kernel.columns - 1) / 2;
    let shiftY = (kernel.rows - 1) / 2;


    for (let i = 0; i < currentMatrix.columns; i++) {
        for (let j = 0; j < currentMatrix.rows; j++) {
            let tmpMatrix = currentMatrix.subMatrix(Math.max(0, i - shiftX), Math.min(currentMatrix.columns - 1, i + shiftX), Math.max(0, j - shiftY), Math.min(currentMatrix.rows - 1, j + shiftY));
            newMatrix.set(i, j, minOfConvolution(tmpMatrix, kernel));
        }
    }
    newImage.setMatrix(newMatrix);
    return newImage;
}

function minOfConvolution(a, b) {
    let minimum = Number.POSITIVE_INFINITY;
    for (let i = 0; i < a.rows; i++) {
        for (let j = 0; j < a.columns; j++) {
            if (b.get(i, j) === 1) {
                if (a.get(i, j) < minimum) {
                    minimum = a.get(i, j);
                }
            }
        }
    }
    return minimum;
}
