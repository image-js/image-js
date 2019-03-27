import { Image } from '../Image';

export interface IWriteCanvasOptions {
  /**
   * If set to `true` (default), the canvas element will be resized to fit the image.
   */
  resizeCanvas?: boolean;
  dx?: number;
  dy?: number;
  dirtyX?: number;
  dirtyY?: number;
  dirtyWidth?: number;
  dirtyHeight?: number;
}

export function writeCanvas(
  canvas: HTMLCanvasElement,
  image: Image,
  options: IWriteCanvasOptions = {}
): void {
  const {
    resizeCanvas = true,
    dx = 0,
    dy = 0,
    dirtyX = 0,
    dirtyY = 0,
    dirtyWidth = image.width,
    dirtyHeight = image.height
  } = options;
  if (resizeCanvas) {
    canvas.width = image.width;
    canvas.height = image.height;
  }
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
    dx,
    dy,
    dirtyX,
    dirtyY,
    dirtyWidth,
    dirtyHeight
  );
}
