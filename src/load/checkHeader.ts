/**
 * Check the presence of a header in a byte array.
 * @param arr - The array to check.
 * @param header - The header to check the presence of.
 */
export default function checkHeader(
  arr: Uint8Array,
  header: number[],
): boolean {
  if (arr.length < header.length) {
    return false;
  }
  for (let i = 0; i < header.length; i++) {
    if (header[i] !== arr[i]) {
      return false;
    }
  }
  return true;
}
