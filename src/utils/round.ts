/**
 * Round a pixel value.
 *
 * @param value - Value of the pixel.
 * @returns The rounded value.
 */
export function round(value: number): number {
  if (value % 0.5 !== 0) {
    return Math.round(value);
  }
  return Math.floor(value) % 2 === 0 ? Math.floor(value) : Math.ceil(value);
}
