import mcch from 'monotone-chain-convex-hull';

/**
 * Returns the convex hull of a binary image
 * @memberof Image
 * @instance
 * @return {Array<Array<number>>}
 */
export default function monotoneChainConvexHull() {
  return mcch(this.extendedPoints, { sorted: false });
}
