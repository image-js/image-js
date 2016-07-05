import {KernelRidgeRegression} from 'ml-regression';
import Image from '../image';

/**
 * @memberof Image
 * @instance
 * @returns {Image}
 */

export default function getBackground(coordinates, values, options) {
    const model = new KernelRidgeRegression(coordinates, values, options);
    const allCoordinates = new Array(this.size);
    for (let i = 0; i < this.width; i++) {
        for (let j = 0; j < this.height; j++) {
            allCoordinates[j * this.width + i] = [i, j];
        }
    }
    const result = model.predict(allCoordinates);
    const background = Image.createFrom(this);
    for (let i = 0; i < this.size; i++) {
        background.data[i] = Math.min(this.maxValue, Math.max(0, result[i][0]));
    }
    return background;
}
