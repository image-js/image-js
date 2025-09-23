import { Canvas } from 'skia-canvas';

import type { Image, ImageDataArray } from '../Image.js';
import type { Point } from '../geometry/index.js';
import { validateValues } from '../utils/validators/validators.js';

export type Label = number | string;

export interface DrawLabelsOptions {
  /**
   *  Size and type of font.
   */
  font?: string;
  /**
   *  Font color.Should be in rgba8 format.
   */
  fontColor?: number[];
}
/**
 * Draws different labels on images.
 * @param image - Image to draw labels on.
 * @param labels - Labels to draw.
 * @param coordinates - Coordinates where to draw labels.
 * @param options - DrawLabelsWithCanvasOptions.
 * @returns new image with drawn labels on it.
 */
export function drawLabels(
  image: Image,
  labels: Label[],
  coordinates: Point[],
  options: DrawLabelsOptions = {},
) {
  const newImage = image.clone();
  const canvas = new Canvas(image.width, image.height);
  const { font = '12px Helvetica', fontColor = [255, 255, 255, 255] } = options;

  validateValues(fontColor, image);
  if (coordinates.length === 0) {
    throw new RangeError('You must specify at least one label coordinate.');
  }
  if (labels.length !== coordinates.length) {
    throw new Error('Positions and labels must be arrays of the same size.');
  }
  const alpha = fontColor[3] ? fontColor[3] / 255 : 1;
  const normalizedColor = [
    fontColor[0] ?? 255,
    fontColor[1] ?? 255,
    fontColor[2] ?? 255,
    alpha,
  ];

  const ctx = canvas.getContext('2d');
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

  layerCanvas(
    newImage.getRawImage().data,
    ctx.getImageData(0, 0, image.width, image.height).data,
    image.channels,
    image.bitDepth,
  );

  return newImage;
}

/**
 * Draws labels on the image data from canvas.
 * @param imageData - Image data to draw text on.
 * @param canvasData - Canvas data to draw on the image.
 * @param numberOfChannels - Number of channels of the initial image.
 * @param bitDepth - Bit depth of the initial image.
 */
function layerCanvas(
  imageData: ImageDataArray,
  canvasData: Uint8ClampedArray,
  numberOfChannels: number,
  bitDepth: number,
) {
  const config = CHANNEL_CONFIGS[numberOfChannels] || CHANNEL_CONFIGS[1];
  const pixelCount = canvasData.length >>> 2;
  const bitShift = bitDepth - 8;

  let imageIndex = 0;
  let canvasIndex = 0;

  for (let pixel = 0; pixel < pixelCount; pixel++) {
    const canvasAlpha = canvasData[canvasIndex + 3] / 255;

    // Skip transparent canvas pixels completely
    if (canvasAlpha === 0) {
      imageIndex += numberOfChannels;
      canvasIndex += 4;
      continue;
    }

    const invAlpha = 1 - canvasAlpha;

    for (const channel of config.channels) {
      const targetIndex = imageIndex + channel.targetOffset;
      imageData[targetIndex] =
        Math.round(
          canvasData[canvasIndex + channel.sourceIndex] * canvasAlpha +
            imageData[targetIndex] * invAlpha,
        ) << bitShift;
    }
    if (config.hasAlpha && typeof config.alphaOffset === 'number') {
      const alphaIndex = imageIndex + config.alphaOffset;
      const imageAlpha = (imageData[alphaIndex] >>> bitShift) / 255;

      const newAlpha = canvasAlpha + imageAlpha * (1 - canvasAlpha);
      imageData[alphaIndex] = Math.round(newAlpha * 255) << bitShift;
    }

    imageIndex += numberOfChannels;
    canvasIndex += 4;
  }
}

interface ChannelConfig {
  channels: Array<{
    sourceIndex: number;
    targetOffset: number;
  }>;
  hasAlpha: boolean;
  alphaOffset: number | undefined; // Required when hasAlpha is true
}

const CHANNEL_CONFIGS: Record<number, ChannelConfig> = {
  1: {
    // Grayscale
    channels: [{ sourceIndex: 0, targetOffset: 0 }],
    hasAlpha: false,
    alphaOffset: undefined,
  },
  2: {
    // Grayscale + Alpha
    channels: [
      { sourceIndex: 0, targetOffset: 0 }, // R -> Grayscale
    ],
    hasAlpha: true,
    alphaOffset: 1,
  },
  3: {
    // RGB
    channels: [
      { sourceIndex: 0, targetOffset: 0 }, // R -> R
      { sourceIndex: 1, targetOffset: 1 }, // G -> G
      { sourceIndex: 2, targetOffset: 2 }, // B -> B
    ],
    hasAlpha: false,
    alphaOffset: undefined,
  },

  4: {
    // RGBA
    channels: [
      { sourceIndex: 0, targetOffset: 0 }, // R -> R
      { sourceIndex: 1, targetOffset: 1 }, // G -> G
      { sourceIndex: 2, targetOffset: 2 }, // B -> B
    ],
    hasAlpha: true,
    alphaOffset: 3,
  },
};
