/**
 * Flip an image horizontally.
 * @memberof Image
 * @instance
 * @return {this}
 */
export default function flipX() {
  this.checkProcessable('flipX', {
    bitDepth: [8, 16],
  });

  for (let i = 0; i < this.height; i++) {
    let offsetY = i * this.width * this.channels;

    for (let j = 0; j < Math.floor(this.width / 2); j++) {
      let posCurrent = j * this.channels + offsetY;
      let posOpposite = (this.width - j - 1) * this.channels + offsetY;

      for (let k = 0; k < this.channels; k++) {
        let tmp = this.data[posCurrent + k];
        this.data[posCurrent + k] = this.data[posOpposite + k];
        this.data[posOpposite + k] = tmp;
      }
    }
  }

  return this;
}
