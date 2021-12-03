import { ImageDataArray, ImageColorModel, ColorDepth, colorModels } from '..';

// Is this a good approach?
export type BitValue = 1 | 0 | boolean;

export interface MaskOptions {
  /**
   * Typed array holding the mask data.
   */
  data?: ImageDataArray;
}

export interface CreateFromOptions extends MaskOptions {
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
  private readonly data: ImageDataArray;

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
      if (!(data instanceof Uint8Array)) {
        throw new Error(
          `data type is ${typeof data} but expected is Uint8Array`,
        );
      }
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
   * Create a new Mask base on the properties of an existing one.
   *
   * @param other - Reference Mask.
   * @param options - Mask options.
   * @returns New mask.
   */
  public static createFrom(other: Mask, options: CreateFromOptions = {}): Mask {
    const { width = other.width, height = other.height } = options;
    return new Mask(width, height, options);
  }

  /**
   * Get a bit of the mask.
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
  public setBit(row: number, column: number, value: number | boolean): void {
    // that doesn't seem to be a good way
    if (typeof value === 'number') {
      if (value !== 0 && value !== 1) {
        throw new Error(
          `Trying to set bit to ${value}, but only acceptable values are 0 and 1.`,
        );
      }
    } else {
      value = value ? 1 : 0;
    }

    const index = row * this.width + column;
    this.data[index] = value;
  }
}
