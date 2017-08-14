/**
 * @memberof Image
 * @instance
 * @param {Matrix} kernel
 * @return {Image}
 */
export default function morphologicalGradient(kernel) {
    this.checkProcessable('max', {
        bitDepth: [8, 16],
        channel: [1]
    });
    if (kernel.columns - 1 % 2 === 0 || kernel.rows - 1 % 2 === 0) {
        throw new TypeError('The number of rows and columns of the kernel must be odd');
    }

    const openImage = this.openning(kernel);
    const newImage = this.subtractImage(openImage, {absolute: true});
    return newImage;
}
