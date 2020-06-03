/**
 * @memberof Stack
 * @instance
 * @return {number[]}
 */
export default function max() {
  this.checkProcessable('min', {
    bitDepth: [8, 16],
  });

  let max = this[0].max;
  for (let i = 1; i < this.length; i++) {
    for (let j = 0; j < max.length; j++) {
      max[j] = Math.max(max[j], this[i].max[j]);
    }
  }
  return max;
}
