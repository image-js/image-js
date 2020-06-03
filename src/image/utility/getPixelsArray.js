/**
 * Returns an array of arrays containing the pixel values in the form
 * [[R1, G1, B1], [R2, G2, B2], ...]
 * @memberof Image
 * @instance
 * @return {Array<Array<number>>}
 */
export default function getPixelsArray() {
  this.checkProcessable('getPixelsArray', {
    bitDepth: [8, 16, 32],
  });

  let array = new Array(this.size);
  let ptr = 0;
  for (let i = 0; i < this.data.length; i += this.channels) {
    let pixel = new Array(this.components);
    for (let j = 0; j < this.components; j++) {
      pixel[j] = this.data[i + j];
    }
    array[ptr++] = pixel;
  }

  return array;
}
