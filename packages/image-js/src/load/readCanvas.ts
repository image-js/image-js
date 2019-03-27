import { Image, ImageKind } from '../Image';

export function readCanvas(canvas: HTMLCanvasElement): Image {
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    throw new Error('could not get context from canvas element');
  }
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return new Image({
    width: imageData.width,
    height: imageData.height,
    data: new Uint8Array(
      imageData.data.buffer,
      imageData.data.byteOffset,
      imageData.data.byteLength
    ),
    kind: ImageKind.RGBA
  });
}
