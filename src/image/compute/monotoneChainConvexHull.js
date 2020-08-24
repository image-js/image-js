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

  if (!image.convexHull) {
    Object.defineProperty(image, 'convexHull', {
      enumerable: false,
      writable: true,
    });
    const points = image.getPoints();

    image.convexHull = mcch(points, { sorted: true });
  }

  return image.convexHull;
}
