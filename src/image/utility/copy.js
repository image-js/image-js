/**
 * Make a copy of the current image
 * @memberof Image
 * @instance
 * @param {Image} fromImage
 * @param {Image} toImage
 * @param {number} x
 * @param {number} y
 */
export default function copyImage(fromImage, toImage, x, y) {
  let fromWidth = fromImage.width;
  let fromHeight = fromImage.height;
  let toWidth = toImage.width;
  let channels = fromImage.channels;
  for (let i = 0; i < fromWidth; i++) {
    for (let j = 0; j < fromHeight; j++) {
      for (let k = 0; k < channels; k++) {
        let source = (j * fromWidth + i) * channels + k;
        let target = ((y + j) * toWidth + x + i) * channels + k;
        toImage.data[target] = fromImage.data[source];
      }
    }
  }
}
