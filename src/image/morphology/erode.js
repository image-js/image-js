import Image from '../Image';
import Matrix from 'ml-matrix';

/**
 * @memberof Image
 * @instance
 * @param {Matrix} kernel
 * @return {Image}
 */
export default function erode(kernel) {
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
