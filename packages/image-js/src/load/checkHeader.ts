export default function checkHeader(
  buf: ArrayBufferView,
  header: number[]
): boolean {
  if (buf.byteLength < header.length) {
    return false;
  }

  const arr = new Uint8Array(buf.buffer, buf.byteOffset, header.length);

  for (let i = 0; i < header.length; i++) {
    if (header[i] !== arr[i]) {
      return false;
    }
  }
  return true;
}
