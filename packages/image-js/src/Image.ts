import { createFrom } from './misc';
import { invert } from './filters/invert';

type ImageDataArray = Uint8Array | Uint16Array | Float32Array;

export enum BitDepth {
  UINT8 = 8,
  UINT16 = 16,
  FLOAT32 = 32
}

export enum ImageKind {
  GREY = 'GREY',
  GREYA = 'GREYA',
  RGB = 'RGB',
  RGBA = 'RGBA'
}

export interface INewImageOptions {
  /**
   * Number of bits per value in each channel.
   * Default: `BitDepth.UINT8`.
   */
  bitDepth?: BitDepth;

  /**
   * Typed array holding the image data.
   */
  data?: ImageDataArray;

  /**
   * Kind of the created image.
   * Default: `ImageKind.RGB`.
   */
  kind?: ImageKind;
}

export type ImageValues = [number, number, number, number];

const kinds: { [key in ImageKind]: { components: number; alpha: boolean } } = {
  [ImageKind.GREY]: {
    components: 1,
    alpha: false
  },
  [ImageKind.GREYA]: {
    components: 1,
    alpha: true
  },
  [ImageKind.RGB]: {
    components: 3,
    alpha: false
  },
  [ImageKind.RGBA]: {
    components: 3,
    alpha: true
  }
};

export class Image {
  /**
   * The number of columns of the image.
   */
  public readonly width: number;

  /**
   * The number of rows of the image.
   */
  public readonly height: number;

  /**
   * The total number of pixels in the image (width x height).
   */
  public readonly size: number;

  /**
   * The number of bits per value in each channel.
   */
  public readonly bitDepth: BitDepth;

  /**
   * The kind of the image.
   */
  public readonly kind: ImageKind;

  /**
   * The number of color channels in the image, excluding the alpha channel.
   * A grey image has 1 component. An RGB image has 3 components.
   */
  public readonly components: number;

  /**
   * The total number of channels in the image, including the alpha channel.
   */
  public readonly channels: number;

  /**
   * Whether the image has an alpha channel or not.
   */
  public readonly alpha: boolean;

  /**
   * The maximum value that a pixel channel can have.
   */
  public readonly maxValue: number;

  /**
   * Typed array holding the image data.
   */
  public readonly data: ImageDataArray;

  /**
   * Construct a new image knowing its dimensions.
   * @param width
   * @param height
   * @param options
   */
  constructor(width: number, height: number, options: INewImageOptions = {}) {
    if (width < 1 || !Number.isInteger(width)) {
      throw new RangeError(
        `width must be an integer and at least 1. Received ${width}.`
      );
    }

    if (height < 1 || !Number.isInteger(height)) {
      throw new RangeError(
        `height must be an integer and at least 1. Received ${height}.`
      );
    }

    const { bitDepth = BitDepth.UINT8, data, kind = ImageKind.RGB } = options;

    this.width = width;
    this.height = height;
    this.size = width * height;
    this.bitDepth = bitDepth;
    this.kind = kind;

    const kindDef = kinds[kind];
    this.components = kindDef.components;
    this.channels = kindDef.components + Number(kindDef.alpha);
    this.alpha = kindDef.alpha;

    const maxValue = bitDepth === 32 ? 1 : 2 ** bitDepth - 1;
    this.maxValue = maxValue;

    if (data === undefined) {
      this.data = createPixelArray(
        this.size,
        this.channels,
        this.alpha,
        this.bitDepth,
        maxValue
      );
    } else {
      const expectedLength = this.size * this.channels;
      if (data.length !== expectedLength) {
        throw new RangeError(
          `incorrect data size: ${data.length}. Expected ${expectedLength}.`
        );
      }
      this.data = data;
    }
  }

  /**
   * Get all the values of a pixel.
   * @param y - Row index.
   * @param x - Column index.
   * @returns Values of the pixel.
   */
  get(y: number, x: number): number[] {
    const result = [];
    const start = (y * this.width + x) * this.channels;
    for (let i = 0; i < this.channels; i++) {
      result.push(this.data[start + i]);
    }
    return result;
  }

  /**
   * Set all the values of a pixel.
   * @param y - Row index.
   * @param x - Column index.
   * @param value - Values of the pixel to set.
   */
  set(y: number, x: number, value: number[]): void {
    const start = (y * this.width + x) * this.channels;
    for (let i = 0; i < this.channels; i++) {
      this.data[start + i] = value[i];
    }
  }

  /**
   * Get the value of a specific pixel channel.
   * @param y - Row index.
   * @param x - Column index.
   * @param channel - Channel index.
   */
  getValue(y: number, x: number, channel: number): number {
    return this.data[(y * this.width + x) * this.channels + channel];
  }

  /**
   * Set the value of a specific pixel channel.
   * @param y - Row index.
   * @param x - Column index.
   * @param channel - Channel index.
   * @param value - Value to set.
   */
  setValue(y: number, x: number, channel: number, value: number) {
    this.data[(y * this.width + x) * this.channels + channel] = value;
  }

  /**
   * Create a copy of this image.
   */
  clone(): Image {
    return createFrom(this, { data: this.data.slice() });
  }

  changeEach(cb: (value: number) => number) {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = cb(this.data[i]);
    }
  }

  // FILTERS

  /**
   * Invert the colors of the image.
   */
  invert(): Image {
    return invert(this);
  }
}

function createPixelArray(
  size: number,
  channels: number,
  alpha: boolean,
  bitDepth: BitDepth,
  maxValue: number
): ImageDataArray {
  const length = channels * size;
  let arr;
  switch (bitDepth) {
    case BitDepth.UINT8:
      arr = new Uint8Array(length);
      break;
    case BitDepth.UINT16:
      arr = new Uint16Array(length);
      break;
    case BitDepth.FLOAT32:
      arr = new Float32Array(length);
      break;
    default:
      throw new Error(`unexpected bit depth: ${bitDepth}`);
  }

  // Alpha channel is 100% by default.
  if (alpha) {
    for (let i = channels - 1; i < length; i += channels) {
      arr[i] = maxValue;
    }
  }

  return arr;
}
