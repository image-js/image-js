import {
  invert,
  InvertOptions,
  subtractImage,
  SubtractImageOptions,
} from './filters';
import {
  close,
  CloseOptions,
  dilate,
  DilateOptions,
  ErodeOptions,
  open,
  OpenOptions,
} from './morphology';
import { erode } from './morphology/erode';
import { boolToNumber } from './utils/boolToNumber';

import { ImageColorModel, ColorDepth, colorModels, IJS, convertColor } from '.';

export type BitValue = 1 | 0 | boolean;

export interface MaskOptions {
  /**
   * Typed array holding the mask data.
   */
  data?: Uint8Array;
}

export interface MaskCreateFromOptions extends MaskOptions {
  width?: number;
  height?: number;
}

export class Mask {
  /**
   * The number of columns of the mask.
   */
  public readonly width: number;

  /**
   * The number of rows of the mask.
   */
  public readonly height: number;

  /**
   * The total number of bits in the mask (width × height).
   */
  public readonly size: number;

  /**
   * The number of bits per value in each channel (always 1).
   */
  public readonly depth: ColorDepth;

  /**
   * The color model of the mask (always BINARY).
   */
  public readonly colorModel: ImageColorModel;

  /**
   * The number of color channels in the image, excluding the alpha channel.
   * (always 1)
   */
  public readonly components: number;

  /**
   * The number of channels in the mask, including the alpha channel.
   * (always 1)
   */
  public readonly channels: number;

  /**
   * Specifying that the mask has no an alpha channel.
   */
  public readonly alpha: boolean;

  /**
   * The maximum value that a pixel channel can have.
   */
  public readonly maxValue: number;

  /**
   * Typed array holding the mask data.
   */
  private readonly data: Uint8Array;

  /**
   * Construct a new Mask knowing its dimensions.
   *
   * @param width - Image width.
   * @param height - Image height.
   * @param options - Image options.
   */
  public constructor(width: number, height: number, options: MaskOptions = {}) {
    const { data } = options;

    if (width < 1 || !Number.isInteger(width)) {
      throw new RangeError(
        `width must be an integer and at least 1. Received ${width}`,
      );
    }

    if (height < 1 || !Number.isInteger(height)) {
      throw new RangeError(
        `height must be an integer and at least 1. Received ${height}`,
      );
    }

    this.width = width;
    this.height = height;
    this.size = width * height;
    this.depth = ColorDepth.UINT1;
    this.colorModel = ImageColorModel.BINARY;

    const colorModelDef = colorModels[this.colorModel];
    this.components = colorModelDef.components;
    this.alpha = colorModelDef.alpha;
    this.channels = colorModelDef.channels;

    this.maxValue = 1;

    if (data === undefined) {
      this.data = new Uint8Array(this.size);
    } else {
      const expectedLength = this.size * this.channels;
      if (data.length !== expectedLength) {
        throw new RangeError(
          `incorrect data size: ${data.length}. Expected ${expectedLength}`,
        );
      }
      this.data = data;
    }
  }

  /**
   * Create a new Mask based on the properties of an existing one.
   *
   * @param other - Reference Mask.
   * @param options - Mask options.
   * @returns New mask.
   */
  public static createFrom(
    other: Mask | IJS,
    options: MaskCreateFromOptions = {},
  ): Mask {
    const { width = other.width, height = other.height } = options;
    return new Mask(width, height, options);
  }

  /**
   * Create a copy of this image.
   *
   * @returns The image clone.
   */
  public clone(): Mask {
    return Mask.createFrom(this, { data: this.data.slice() });
  }

  /**
   * Get the value of a bit.
   *
   * @param row - Row index.
   * @param column - Column index.
   * @returns The bit value.
   */
  public getBit(row: number, column: number): number {
    const index = row * this.width + column;
    return this.data[index];
  }

  /**
   * Set the value of a bit.
   *
   * @param row - Row index.
   * @param column - Column index.
   * @param value - New bit value.
   */
  public setBit(row: number, column: number, value: BitValue): void {
    let result = boolToNumber(value);
    const index = row * this.width + column;
    this.data[index] = result;
  }

  /**
   * Get the value of a bit using index.
   *
   * @param index - Index of the pixel.
   * @returns Value of the bit.
   */
  public getBitByIndex(index: number): number {
    return this.data[index * this.channels];
  }

  /**
   * Set the value of a bit using index.
   *
   * @param index - Index of the pixel.
   * @param value - Value to set.
   */
  public setBitByIndex(index: number, value: BitValue): void {
    let result = boolToNumber(value);
    this.data[index * this.channels] = result;
  }

  /**
   * Get the value of a bit. Function exists for compatibility with IJS.
   *
   * @param row - Row index.
   * @param column - Column index.
   * @param channel - Index of the channel, must be zero.
   * @returns The bit value.
   */
  public getValue(row: number, column: number, channel: number): number {
    checkChannel(channel);
    return this.getBit(row, column);
  }

  /**
   * Set the value of a bit. Function exists for compatibility with IJS.
   *
   * @param row - Row index.
   * @param column - Column index.
   * @param channel - Index of the channel, must be zero.
   * @param value - New bit value.
   */
  public setValue(
    row: number,
    column: number,
    channel: number,
    value: BitValue,
  ): void {
    checkChannel(channel);
    this.setBit(row, column, value);
  }

  /**
   * Get the value of a bit using index. Function exists for compatibility with IJS.
   *
   * @param index - Index of the pixel.
   * @param channel - Index of the channel, must be zero.
   * @returns Value of the bit.
   */
  public getValueByIndex(index: number, channel: number): number {
    checkChannel(channel);
    return this.getBitByIndex(index);
  }
  /**
   * Set the value of a bit using index. Function exists for compatibility with IJS.
   *
   * @param index - Index of the pixel.
   * @param channel - Index of the channel, must be zero.
   * @param value - Value to set.
   */
  public setValueByIndex(
    index: number,
    channel: number,
    value: BitValue,
  ): void {
    checkChannel(channel);
    this.setBitByIndex(index, value);
  }

  /**
   * Return the raw mask data.
   *
   * @returns The raw data.
   */
  public getRawImage() {
    return {
      width: this.width,
      height: this.height,
      data: this.data,
    };
  }

  public [Symbol.for('nodejs.util.inspect.custom')](): string {
    return `Mask {
  width: ${this.width}
  height: ${this.height}
  data: ${printData(this)}
}`;
  }

  /**
   * Fill the mask with a value.
   *
   * @param value - Value of the bit.
   * @returns The mask instance.
   */
  public fill(value: BitValue): this {
    let result = boolToNumber(value);
    this.data.fill(result);
    return this;
  }

  public convertColor(colorModel: ImageColorModel): IJS {
    return convertColor(this, colorModel);
  }

  // FILTERS
  /**
   * Invert the colors of the mask.
   *
   * @param options - Inversion options
   * @returns The inverted mask.
   */
  public invert(options?: InvertOptions): Mask {
    return invert(this, options);
  }

  /**
   * Subtract otherMask from mask.
   *
   * @param otherMask - Image to subtract
   * @param options - Inversion options
   * @returns The subtracted mask.
   */
  public subtractImage(otherMask: Mask, options?: SubtractImageOptions): Mask {
    return subtractImage(this, otherMask, options);
  }

  // MORPHOLOGY
  /**
   * Erode a Mask.
   *
   * @param options - Erode options
   * @returns The eroded mask.
   */
  public erode(options?: ErodeOptions): Mask {
    return erode(this, options);
  }

  /**
   * Dilate an image.
   *
   * @param options - Dilate options.
   * @returns The dilated image.
   */
  public dilate(options?: DilateOptions): Mask {
    return dilate(this, options);
  }

  /**
   * Open an image.
   *
   * @param options - Open options.
   * @returns The opened image.
   */
  public open(options?: OpenOptions): Mask {
    return open(this, options);
  }

  /**
   * Close an image.
   *
   * @param options - Close options.
   * @returns The closed image.
   */
  public close(options?: CloseOptions): Mask {
    return close(this, options);
  }
}

/**
 * Returns all values of a mask as a string.
 *
 * @param mask - Input mask.
 * @returns Formatted string with all values of a mask.
 */
function printData(mask: Mask): string {
  const result = [];
  const padding = 2;
  for (let i = 0; i < mask.height; i++) {
    const line = [];
    for (let j = 0; j < mask.width; j++) {
      line.push(String(mask.getBit(i, j)).padStart(padding, ' '));
    }
    result.push(`[${line.join(' ')}]`);
  }
  return result.join('\n     ');
}

/**
 * Verify the channel value of a mask
 *
 * @param channel - The channel value
 */
function checkChannel(channel: number) {
  if (channel !== 0) {
    throw new Error(`Channel value must be 0 on type Mask, got ${channel}.`);
  }
}
