/**
 * @memberof Image
 * @instance
 * @param {Matrix} kernel
 * @return {Image}
 */
export default function opening(kernel) {
    this.checkProcessable('opening', {
        bitDepth: [8, 16],
        channel: [1]
    });
    if (kernel.columns - 1 % 2 === 0 || kernel.rows - 1 % 2 === 0) {
        throw new TypeError('opening: The number of rows and columns of the kernel must be odd');
    }

    let newImage = this.erode(kernel);
    newImage = newImage.dilate(kernel);
    return newImage;
}
