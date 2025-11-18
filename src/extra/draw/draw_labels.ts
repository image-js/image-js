import type { Image, ImageDataArray } from '../../Image.ts';
import type { Point } from '../../geometry/index.ts';
import { getCanvasContext } from '../../utils/cross_platform.ts';
import { validateValues } from '../../utils/validators/validators.ts';

/**
 * Label to draw on an image.
 */
export interface DrawLabelsLabel {
  /**
   * Text of the label.
   */
  text: number | string;
  /**
   * Position to draw the label at.
   */
  position: Point;
}

/**
 * Options for drawing labels on an image.
 */
export interface DrawLabelsOptions {
  /**
   *  Size and type of font.
   */
  font?: string;
  /**
   *  Font color. Should be in rgba8 format.
   */
  fontColor?: number[];
}

/**
 * Draws labels on an image.
 * @param image - Image to draw labels on.
 * @param labels - Labels to draw.
 * @param options - Options.
 * @returns new image with drawn labels on it.
 */
export function drawLabels(
  image: Image,
  labels: DrawLabelsLabel[],
  options: DrawLabelsOptions = {},
) {
  const newImage = image.clone();
  const { font = '12px Helvetica', fontColor = [255, 255, 255, 255] } = options;

  if (labels.length === 0) {
    throw new Error('At least one label must be provided');
  }
  validateValues(fontColor, image);
  const alpha = fontColor[3] ? fontColor[3] / 255 : 1;
  const normalizedColor = [
    fontColor[0] ?? 0,
    fontColor[1] ?? 0,
    fontColor[2] ?? 0,
    alpha,
  ];

  const ctx = getCanvasContext(image.width, image.height);
  ctx.font = font;
  ctx.fillStyle = `rgba(${normalizedColor.join(',')})`;
  for (const label of labels) {
    ctx.fillText(String(label.text), label.position.column, label.position.row);
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

    for (const channel of config.channelOffsets) {
      const targetIndex = imageIndex + channel;
      imageData[targetIndex] =
        Math.round(
          canvasData[canvasIndex + channel] * canvasAlpha +
            imageData[targetIndex] * invAlpha,
        ) << bitShift;
    }
    if (config.hasAlpha) {
      const alphaIndex = imageIndex + (config.alphaOffset as number);
      const imageAlpha = (imageData[alphaIndex] >>> bitShift) / 255;

      const newAlpha = canvasAlpha + imageAlpha * (1 - canvasAlpha);
      imageData[alphaIndex] = Math.round(newAlpha * 255) << bitShift;
    }

    imageIndex += numberOfChannels;
    canvasIndex += 4;
  }
}

/**
 * Configuration for different channel numbers when layering canvas with onto destination image.
 */
interface ChannelConfig {
  channelOffsets: number[];
  hasAlpha: boolean;
  alphaOffset: number | undefined; // Required when hasAlpha is true
}

const CHANNEL_CONFIGS: Record<number, ChannelConfig> = {
  // GREY
  1: {
    channelOffsets: [0],
    hasAlpha: false,
    alphaOffset: undefined,
  },
  // GREYA
  2: {
    channelOffsets: [0],
    hasAlpha: true,
    alphaOffset: 1,
  },
  3: {
    // RGB
    channelOffsets: [0, 1, 2],
    hasAlpha: false,
    alphaOffset: undefined,
  },
  4: {
    // RGBA
    channelOffsets: [0, 1, 2],
    hasAlpha: true,
    alphaOffset: 3,
  },
};
