/**
 * Flip an image vertically. The image
 * @memberof Image
 * @instance
 * @return {this}
 */
export default function flipY() {
  this.checkProcessable('flipY', {
    bitDepth: [8, 16],
  });

  for (let i = 0; i < Math.floor(this.height / 2); i++) {
    for (let j = 0; j < this.width; j++) {
      let posCurrent = j * this.channels + i * this.width * this.channels;
      let posOpposite =
        j * this.channels + (this.height - 1 - i) * this.channels * this.width;

      for (let k = 0; k < this.channels; k++) {
        let tmp = this.data[posCurrent + k];
        this.data[posCurrent + k] = this.data[posOpposite + k];
        this.data[posOpposite + k] = tmp;
      }
    }
  }

  return this;
}
