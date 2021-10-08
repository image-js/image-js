import { IJS } from '../IJS';

import { readCanvas } from './readCanvas';

export function readImg(img: CanvasImageSource): IJS {
  const canvas = document.createElement('canvas');
  canvas.width = img.width as number;
  canvas.height = img.height as number;
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    throw new Error('could not get context from canvas element');
  }
  ctx.drawImage(img, 0, 0);
  return readCanvas(canvas);
}
