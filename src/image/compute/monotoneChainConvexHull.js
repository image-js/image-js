import mcch from 'monotone-chain-convex-hull';

/**
 * Returns the convex hull of a binary image
 * @memberof Image
 * @instance
 * @return {Array<Array<number>>}
 */
export default function monotoneChainConvexHull() {
    const image = this;
    image.checkProcessable('monotoneChainConvexHull', {bitDepth: 1});

    const points = image.getPoints();

    const result = mcch(points, {sorted: true});

    // TODO: this is required for the MBR algorithm to work. Remove when it has been adapted
    result.reverse();
    const first = result.pop();
    result.unshift(first);
    return result;
}
