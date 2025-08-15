import { Canvas } from 'skia-canvas';

import type { Image } from '../Image.js';
import type { Point } from '../geometry/index.js';
import { readCanvas } from '../load/readCanvas.js';

interface DrawLabelsWithCanvasOptions {
  /**
   *  Size and type of font.
   */
  font?: string;
  /**
   *  Font color.
   */
  fontColor?: number[];
}
/**
 * Draws different labels on images.
 * @param image - Image to draw labels on.
 * @param labels - Labels to draw.
 * @param coordinates - Coordinates where to draw labels.
 * @param options - DrawLabelsWithCanvasOptions.
 * @returns RGBA image.
 */
export function drawLabelWithCanvas(
  image: Image,
  labels: string[],
  coordinates: Point[],
  options: DrawLabelsWithCanvasOptions = {},
) {
  const canvas = new Canvas(image.width, image.height);
  const { font = '16px sans-serif', fontColor = [255, 255, 255] } = options;
  const ctx = canvas.getContext('2d');
  const prevBitDepth = image.bitDepth;
  const prevColorModel = image.colorModel;
  let newImage = image.clone();
  if (newImage.bitDepth !== 8) {
    newImage = newImage.convertBitDepth(8);
  }
  if (newImage.colorModel !== 'RGBA') {
    newImage = newImage.convertColor('RGBA');
  }

  const imageData = ctx.createImageData(newImage.width, newImage.height);
  imageData.data.set(newImage.getRawImage().data);
  ctx.putImageData(imageData, 0, 0);
  ctx.font = font;
  for (let i = 0; i < labels.length; i++) {
    const coordinate = coordinates[i % coordinates.length];
    ctx.fillStyle = `rgba(${fontColor.join(',')})`;
    ctx.fillText(labels[i % labels.length], coordinate.column, coordinate.row);
  }

  newImage = readCanvas(canvas);
  if (prevBitDepth !== image.bitDepth) {
    newImage = newImage.convertBitDepth(prevBitDepth);
  }
  if (prevColorModel !== newImage.colorModel) {
    newImage = newImage.convertColor(prevColorModel);
  }

  return newImage;
}
