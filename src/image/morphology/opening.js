/**
 * In mathematical morphology, opening is the dilation of the erosion of a set A by a structuring element B. Together with closing, the opening serves in computer vision and image processing as a basic workhorse of morphological noise removal. Opening removes small objects from the foreground (usually taken as the bright pixels) of an image, placing them in the background, while closing removes small holes in the foreground, changing small islands of background into foreground. (Wikipedia)
 * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
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
