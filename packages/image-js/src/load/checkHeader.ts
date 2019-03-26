export default function checkHeader(buf: ArrayBufferView, header: number[]) {
  const arr = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  for (let i = 0; i < header.length; i++) {
    if (header[i] !== arr[i]) {
      return false;
    }
  }
  return true;
}
