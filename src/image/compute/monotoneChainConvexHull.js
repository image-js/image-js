import mcch from 'monotone-chain-convex-hull';

/**
 * Returns the convex hull of a binary image
 * @memberof Image
 * @instance
 * @return {Array<Array<number>>}
 */
export default function monotoneChainConvexHull() {
  const image = this;
  image.checkProcessable('monotoneChainConvexHull', { bitDepth: 1 });

  const points = image.getPoints();

  return mcch(points, { sorted: true });
}
