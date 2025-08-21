import { Canvas } from 'skia-canvas';

import { Image } from '../Image.js';
import type { Point } from '../geometry/index.js';
import { validateValues } from '../utils/validators/validators.js';

type Label = number | string;

interface DrawLabelsOptions {
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
  options: DrawLabelsOptions = {},
) {
  const canvas = new Canvas(image.width, image.height);
  const { font = '12px Helvetica', fontColor = [255, 255, 255] } = options;

  validateValues(fontColor, image);
  if (coordinates.length === 0) {
    throw new RangeError('You must specify at least one label coordinate.');
  }
  if (labels.length !== coordinates.length) {
    throw new Error('Positions and labels must be arrays of the same size.');
  }

  const normalizedColor = [
    fontColor[0] ?? 255,
    fontColor[1] ?? 255,
    fontColor[2] ?? 255,
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
    image.getRawImage().data as ImageDataArray,
    ctx.getImageData(0, 0, image.width, image.height).data,
    image.channels,
    image.bitDepth,
  );
  const newImage = new Image(image.width, image.height, {
    data: image.getRawImage().data,
    colorModel: image.colorModel,
  });

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
    const alpha = canvasData[canvasIndex + 3] / 255;
    const invAlpha = 1 - alpha;

    for (const channel of config.channels) {
      const targetIndex = imageIndex + channel.targetOffset;
      imageData[targetIndex] =
        Math.round(
          canvasData[canvasIndex + channel.sourceIndex] * alpha +
            imageData[targetIndex] * invAlpha,
        ) << bitShift;
    }

    imageIndex += numberOfChannels;
    canvasIndex += 4;
  }
}

interface ChannelConfig {
  channels: Array<{
    sourceIndex: number; // Index in canvas data (0=R, 1=G, 2=B, 3=A)
    targetOffset: number; // Offset in image data relative to pixel start
  }>;
}

const CHANNEL_CONFIGS: Record<number, ChannelConfig> = {
  1: {
    // Grayscale
    channels: [{ sourceIndex: 0, targetOffset: 0 }],
  },
  2: {
    // Grayscale + Alpha
    channels: [
      { sourceIndex: 0, targetOffset: 0 }, // R -> Grayscale
      { sourceIndex: 3, targetOffset: 1 }, // A -> Alpha
    ],
  },
  3: {
    // RGB
    channels: [
      { sourceIndex: 0, targetOffset: 0 }, // R -> R
      { sourceIndex: 1, targetOffset: 1 }, // G -> G
      { sourceIndex: 2, targetOffset: 2 }, // B -> B
    ],
  },
  4: {
    // RGBA
    channels: [
      { sourceIndex: 0, targetOffset: 0 }, // R -> R
      { sourceIndex: 1, targetOffset: 1 }, // G -> G
      { sourceIndex: 2, targetOffset: 2 }, // B -> B
      { sourceIndex: 3, targetOffset: 3 }, // A -> A
    ],
  },
};
