import { Canvas } from 'skia-canvas';

import { Image } from '../Image.js';
import type { Point } from '../geometry/index.js';
import { validateValues } from '../utils/validators/validators.js';

type Label = number | string;

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
 * @returns Image with drawn labels.
 */
export function drawLabels(
  image: Image,
  labels: Label[],
  coordinates: Point[],
  options: DrawLabelsWithCanvasOptions = {},
) {
  const canvas = new Canvas(image.width, image.height);
  const { font = '12px Helvetica', fontColor = [255, 255, 255] } = options;

  validateValues(fontColor, image);

  const normalizedColor = [
    fontColor[0] ?? 255,
    fontColor[1] ?? 255,
    fontColor[2] ?? 255,
  ];

  const ctx = canvas.getContext('2d');
  const newData = toRgba8(image);
  const imageData = ctx.createImageData(image.width, image.height);
  imageData.data.set(newData);
  ctx.putImageData(imageData, 0, 0);

  ctx.font = font;
  ctx.fillStyle = `rgba(${normalizedColor.join(',')})`;

  for (let i = 0; i < labels.length; i++) {
    const coordinate = coordinates[i % coordinates.length];

    ctx.fillText(
      labels[i % labels.length] as string,
      coordinate.column,
      coordinate.row,
    );
  }

  const resultData = fromRgba8(
    ctx.getImageData(0, 0, image.width, image.height).data,
    image.channels,
  );
  const newImage = new Image(image.width, image.height, {
    data: resultData,
    colorModel: image.colorModel,
  });

  return newImage;
}
/**
 * Converts image data to RGBA8 format to be compatible with canvas data format.
 * @param image - Image to convert data from.
 * @returns Clamped array of RGBA8 data.
 */
function toRgba8(image: Image) {
  const result = new Uint8ClampedArray(image.width * image.height * 4);
  const numberOfChannels = image.channels;
  const bitDepth = image.bitDepth;
  const srcData = image.getRawImage().data;
  let index = 0;

  switch (numberOfChannels) {
    case 4:
      for (let i = 0; i < srcData.length; i++) {
        result[i] = srcData[i] >>> (bitDepth - 8);
      }
      return result;
    case 3:
      for (let i = 0; i < srcData.length; i += numberOfChannels) {
        result[index++] = srcData[i] >>> (bitDepth - 8);
        result[index++] = srcData[i + 1] >>> (bitDepth - 8);
        result[index++] = srcData[i + 2] >>> (bitDepth - 8);
        result[index++] = 255 >>> (bitDepth - 8);
      }
      return result;
    case 2:
      for (let i = 0; i < srcData.length; i += numberOfChannels) {
        result[index++] = srcData[i] >>> (bitDepth - 8);
        result[index++] = srcData[i] >>> (bitDepth - 8);
        result[index++] = srcData[i] >>> (bitDepth - 8);
        result[index++] = srcData[i + 1] >>> (bitDepth - 8);
      }
      return result;
    default:
      for (let i = 0; i < srcData.length; i += numberOfChannels) {
        result[index++] = srcData[i] >>> (bitDepth - 8);
        result[index++] = srcData[i] >>> (bitDepth - 8);
        result[index++] = srcData[i] >>> (bitDepth - 8);
        result[index++] = 255 >>> (bitDepth - 8);
      }

      return result;
  }
}
/**
 * Converts RGBA8 data to 8-bit data of image's inital color model.
 * @param srcData - Source image data.
 * @param numberOfChannels - Number of channels of the initial image.
 * @returns Array with converted image data.
 */
function fromRgba8(srcData: Uint8ClampedArray, numberOfChannels: number) {
  const rgbaPixelSize = 4;
  const result = new Uint8ClampedArray(
    (srcData.length / rgbaPixelSize) * numberOfChannels,
  );
  let index = 0;
  switch (numberOfChannels) {
    case 4:
      return srcData;
    case 3:
      for (let i = 0; i < srcData.length; i += rgbaPixelSize) {
        result[index++] = srcData[i];
        result[index++] = srcData[i + 1];
        result[index++] = srcData[i + 2];
      }
      return result;
    case 2:
      for (let i = 0; i < srcData.length; i += rgbaPixelSize) {
        result[index++] = srcData[i];
        result[index++] = 255;
      }
      return result;

    default:
      for (let i = 0; i < srcData.length; i += rgbaPixelSize) {
        result[index++] = srcData[i];
      }
      return result;
  }
}
