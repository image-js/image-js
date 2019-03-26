export default function checkHeader(
  buf: ArrayBufferView,
  header: number[]
): boolean {
  const arr = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
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
