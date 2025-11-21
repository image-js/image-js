import type { CanvasRenderingContext2D as SkiaCanvasRenderingContext2D } from 'skia-canvas';

import type { Image, ImageDataArray } from '../../Image.ts';
import type { Point } from '../../geometry/index.ts';
import { getCanvasContext } from '../../utils/cross_platform.ts';
import { getOutputImage } from '../../utils/getOutputImage.ts';
import { validateValues } from '../../utils/validators/validators.ts';

export interface DrawTextLabel {
  /**
   * Text of the label.
   */
  content: number | string;
  /**
   * Position to draw the label at.
   */
  position: Point;
  /**
   *  Size and type of font.
   *  If specified, this overrides the general font from DrawTextOptions.
   */
  font?: string;
  /**
   *  Font color. Should be in rgba8 format.
   *  If specified, this overrides the general fontColor from DrawTextOptions.
   */
  fontColor?: number[];
}

export interface DrawTextOptions {
  /**
   *  General size and type of font.
   *  Used as the default when font is not specified in individual text labels.
   */
  font?: string;
  /**
   *  General font color.
   *  Used as the default when fontColor is not specified in individual text labels.
   */
  fontColor?: number[];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Image;
}

/**
 * Draws text on an image.
 * @param image - Image to write text on.
 * @param text - Text to write on the image.
 * @param options - Out Options
 * @returns Image with drawn text.
 */
export function drawText(
  image: Image,
  text: DrawTextLabel | DrawTextLabel[],
  options?: DrawTextOptions,
) {
  if (Array.isArray(text) && text.length === 0) {
    throw new Error('At least one text element must be provided');
  }

  const newImage = getOutputImage(image, options, { clone: true });
  const defaultFont = options?.font ?? '12px Helvetica';
  const defaultColor = options?.fontColor ?? [255, 255, 255, 255];

  const ctx = getCanvasContext(image.width, image.height);
  if (!Array.isArray(text)) {
    drawTextElement(image, ctx, text, defaultFont, defaultColor);
  } else {
    for (const label of text) {
      drawTextElement(image, ctx, label, defaultFont, defaultColor);
    }
  }

  layerCanvas(
    newImage.getRawImage().data,
    ctx.getImageData(0, 0, image.width, image.height).data,
    image.channels,
    image.bitDepth,
  );

  return newImage;
}

function drawTextElement(
  image: Image,
  ctx: OffscreenCanvasRenderingContext2D | SkiaCanvasRenderingContext2D,
  text: DrawTextLabel,
  defaultFont: string,
  defaultColor: number[],
) {
  ctx.font = text.font ?? defaultFont;
  const fontColor = text.fontColor ?? defaultColor;
  validateValues(fontColor, image);
  const alpha = fontColor[3] ? fontColor[3] / 255 : 1;
  const normalizedColor = [
    fontColor[0] ?? 0,
    fontColor[1] ?? 0,
    fontColor[2] ?? 0,
    alpha,
  ];
  ctx.fillStyle = `rgba(${normalizedColor.join(',')})`;
  ctx.fillText(String(text.content), text.position.column, text.position.row);
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
