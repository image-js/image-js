import { SVD } from 'ml-matrix';

/**
 * TODO would be suprised if this stuff works
 * @memberof Image
 * @instance
 * @return {object} SVD result
 */
export default function getSvd() {
  this.checkProcessable('getSvd', {
    bitDepth: [1]
  });

  return new SVD(this.points);
}
