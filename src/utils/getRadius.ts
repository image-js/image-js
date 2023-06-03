/**
 * Compute the radius of the circle of given size.
 * @param size - Size of the circle.
 * @returns The radius.
 */
export function getRadius(size: number): number {
  if (size % 2 !== 1 || size < 0) {
    throw new RangeError('size must be positive and odd');
  }
  return (size - 1) / 2;
}
