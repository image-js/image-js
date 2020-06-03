/**
 * @memberof Stack
 * @instance
 * @return {number[]}
 */
export default function min() {
  this.checkProcessable('min', {
    bitDepth: [8, 16],
  });

  let min = this[0].min;
  for (let i = 1; i < this.length; i++) {
    for (let j = 0; j < min.length; j++) {
      min[j] = Math.min(min[j], this[i].min[j]);
    }
  }
  return min;
}
