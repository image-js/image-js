import { Canvas } from 'skia-canvas';

import type { Image } from '../Image.js';
import type { Point } from '../geometry/index.js';
import { readCanvas } from '../load/readCanvas.js';

interface DrawLabelsWithCanvasOptions {
  font?: string;
  fontColor?: number[];
}

export function drawLabelWithCanvas(
  image: Image,
  labels: string[],
  coordinates: Point[],
  options: DrawLabelsWithCanvasOptions = {},
) {
  const canvas = new Canvas(image.width, image.height);
  const { font = '16px sans-serif', fontColor = [255, 255, 255] } = options;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(image.width, image.height);
  imageData.data.set(image.getRawImage().data);
  ctx.putImageData(imageData, 0, 0);
  ctx.font = font;
  for (let i = 0; i < labels.length; i++) {
    const coordinate = coordinates[i % coordinates.length];
    ctx.fillStyle = `rgba(${fontColor.join(',')})`;
    ctx.fillText(labels[i % labels.length], coordinate.column, coordinate.row);
  }

  image = readCanvas(canvas);
  return image;
}
