import { Image } from '../Image';

export function writeCanvas(canvas: HTMLCanvasElement, image: Image): void {
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    throw new Error('could not get context from canvas element');
  }
  ctx.putImageData(
    // eslint-disable-next-line no-undef
    new ImageData(
      new Uint8ClampedArray(
        image.data.buffer,
        image.data.byteOffset,
        image.data.byteLength
      ),
      image.width,
      image.height
    ),
    0,
    0
  );
}
