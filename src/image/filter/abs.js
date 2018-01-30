/**
 * Calculate the absolute values of an image. Only works on 32-bit images.
 * @memberof Image
 * @instance
 * @return {this}
 */
export default function abs() {

  this.checkProcessable('abs', {
    bitDepth: [32]
  });

  let data = this.data;
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.abs(data[i]);
  }

  return this;
}
