import { RgbColor } from 'colord';

import { Mask } from './Mask';
import { correctColor } from './correctColor';
import {
  Point,
  drawLineOnIjs,
  drawPolygonOnIjs,
  drawPolylineOnIjs,
  DrawPolygonOnIjsOptions,
  DrawPolylineOnIjsOptions,
  DrawRectangleOptions,
  drawRectangle,
  DrawLineOnIjsOptions,
} from './draw';
import {
  BlurOptions,
  blur,
  ConvolutionOptions,
  directConvolution,
  separableConvolution,
  gaussianBlur,
  GaussianBlurOptions,
  subtractImage,
  SubtractImageOptions,
  HypotenuseOptions,
  rawDirectConvolution,
  GradientFilterOptions,
  gradientFilter,
  derivativeFilter,
  DerivativeFilterOptions,
  flip,
  FlipOptions,
  hypotenuse,
  invert,
  InvertOptions,
  level,
  LevelOptions,
} from './filters';
import {
  bottomHat,
  BottomHatOptions,
  cannyEdgeDetector,
  CannyEdgeOptions,
  close,
  CloseOptions,
  dilate,
  DilateOptions,
  erode,
  ErodeOptions,
  morphologicalGradient,
  MorphologicalGradientOptions,
  open,
  OpenOptions,
  topHat,
  TopHatOptions,
} from './morphology';
import {
  convertColor,
  ConvertColorOptions,
  convertDepth,
  copyTo,
  CopyToOptions,
  crop,
  CropOptions,
  grey,
  paintMask,
  PaintMaskOptions,
  split,
} from './operations';
import { ImageColorModel, colorModels } from './utils/colorModels';
import { validateChannel, validateValue } from './utils/validators';

import {
  extract,
  ExtractOptions,
  GreyOptions,
  histogram,
  HistogramOptions,
  resize,
  ResizeOptions,
  rotate,
  RotateOptions,
  threshold,
  ThresholdOptions,
  transform,
  TransformOptions,
} from '.';

export { ImageColorModel, colorModels };

export type ImageDataArray = Uint8Array | Uint16Array | Uint8ClampedArray;
/**
 * Bit depth of the image (nb of bits that encode each value in the image).
 */
export enum ColorDepth {
  UINT1 = 1,
  UINT8 = 8,
  UINT16 = 16,
}

export enum ImageCoordinates {
  CENTER = 'CENTER',
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
}

export interface ImageOptions {
  /**
   * Number of bits per value in each channel.
   * Default: `ColorDepth.UINT8`.
   */
  depth?: ColorDepth;

  /**
   * Typed array holding the image data.
   */
  data?: ImageDataArray;

  /**
   * Color model of the created image.
   * Default: `ImageColorModel.RGB`.
   */
  colorModel?: ImageColorModel;
}

export interface CreateFromOptions extends ImageOptions {
  width?: number;
  height?: number;
}

export type ImageValues = [number, number, number, number];

export class IJS {
  /**
   * The number of columns of the image.
   */
  public readonly width: number;

  /**
   * The number of rows of the image.
   */
  public readonly height: number;

  /**
   * The total number of pixels in the image (width × height).
   */
  public readonly size: number;

  /**
   * The number of bits per value in each channel.
   */
  public readonly depth: ColorDepth;

  /**
   * The color model of the image.
   */
  public readonly colorModel: ImageColorModel;

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
  private readonly data: ImageDataArray;

  /**
   * Construct a new IJS knowing its dimensions.
   *
   * @param width - Image width.
   * @param height - Image height.
   * @param options - Image options.
   */
  public constructor(
    width: number,
    height: number,
    options: ImageOptions = {},
  ) {
    const {
      depth = ColorDepth.UINT8,
      data,
      colorModel = ImageColorModel.RGB,
    } = options;

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
    this.depth = depth;
    this.colorModel = colorModel;

    const colorModelDef = colorModels[colorModel];
    this.components = colorModelDef.components;
    this.alpha = colorModelDef.alpha;
    this.channels = colorModelDef.channels;

    this.maxValue = 2 ** depth - 1;

    if (data === undefined) {
      this.data = createPixelArray(
        this.size,
        this.channels,
        this.alpha,
        this.depth,
        this.maxValue,
      );
    } else {
      if (depth === ColorDepth.UINT8 && data instanceof Uint16Array) {
        throw new Error(`depth is ${depth} but data is Uint16Array`);
      } else if (depth === ColorDepth.UINT16 && data instanceof Uint8Array) {
        throw new Error(`depth is ${depth} but data is Uint8Array`);
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
   * Create a new IJS based on the properties of an existing one.
   *
   * @param other - Reference image.
   * @param options - Image options.
   * @returns New image.
   */
  public static createFrom(
    other: IJS | Mask,
    options: CreateFromOptions = {},
  ): IJS {
    const { width = other.width, height = other.height } = options;
    let depth;
    if (other instanceof IJS) {
      depth = other.depth;
    } else {
      depth = ColorDepth.UINT8;
    }
    return new IJS(width, height, {
      depth: depth,
      colorModel: other.colorModel,
      ...options,
    });
  }

  /**
   * Get all the channels of a pixel.
   *
   * @param column - Column index.
   * @param row - Row index.
   * @returns Channels of the pixel.
   */
  public getPixel(column: number, row: number): number[] {
    const result = [];
    const start = (row * this.width + column) * this.channels;
    for (let i = 0; i < this.channels; i++) {
      result.push(this.data[start + i]);
    }
    return result;
  }

  /**
   * Set all the channels of a pixel.
   *
   * @param column - Column index.
   * @param row - Row index.
   * @param value - New channel values of the pixel to set.
   */
  public setPixel(column: number, row: number, value: number[]): void {
    const start = (row * this.width + column) * this.channels;
    for (let i = 0; i < this.channels; i++) {
      this.data[start + i] = value[i];
    }
  }

  /**
   * Get all the channels of a pixel using its index.
   *
   * @param index - Index of the pixel.
   * @returns Channels of the pixel.
   */
  public getPixelByIndex(index: number): number[] {
    const result = [];
    const start = index * this.channels;
    for (let i = 0; i < this.channels; i++) {
      result.push(this.data[start + i]);
    }
    return result;
  }

  /**
   * Set all the channels of a pixel using its index.
   *
   * @param index - Index of the pixel.
   * @param value - New channel values of the pixel to set.
   */
  public setPixelByIndex(index: number, value: number[]): void {
    const start = index * this.channels;
    for (let i = 0; i < this.channels; i++) {
      this.data[start + i] = value[i];
    }
  }

  /**
   * Get the value of a specific pixel channel. Select pixel using coordinates.
   *
   * @param column - Column index.
   * @param row - Row index.
   * @param channel - Channel index.
   * @returns Value of the specified channel of one pixel.
   */
  public getValue(column: number, row: number, channel: number): number {
    return this.data[(row * this.width + column) * this.channels + channel];
  }

  /**
   * Set the value of a specific pixel channel. Select pixel using coordinates.
   *
   * @param column - Column index.
   * @param row - Row index.
   * @param channel - Channel index.
   * @param value - Value to set.
   */
  public setValue(
    column: number,
    row: number,
    channel: number,
    value: number,
  ): void {
    this.data[(row * this.width + column) * this.channels + channel] = value;
  }

  /**
   * Get the value of a specific pixel channel. Select pixel using index.
   *
   * @param index - Index of the pixel.
   * @param channel - Channel index.
   * @returns Value of the channel of the pixel.
   */
  public getValueByIndex(index: number, channel: number): number {
    return this.data[index * this.channels + channel];
  }
  /**
   * Set the value of a specific pixel channel. Select pixel using index.
   *
   * @param index - Index of the pixel.
   * @param channel - Channel index.
   * @param value - Value to set.
   */
  public setValueByIndex(index: number, channel: number, value: number): void {
    this.data[index * this.channels + channel] = value;
  }

  /**
   * Return the raw image data.
   *
   * @returns The raw data.
   */
  public getRawImage() {
    return {
      width: this.width,
      height: this.height,
      data: this.data,
      channels: this.channels,
      depth: this.depth,
    };
  }

  public [Symbol.for('nodejs.util.inspect.custom')](): string {
    return `IJS {
  width: ${this.width}
  height: ${this.height}
  depth: ${this.depth}
  colorModel: ${this.colorModel}
  channels: ${this.channels}
  data: ${printData(this)}
}`;
  }

  /**
   * Fill the image with a value or a color.
   *
   * @param value - Value or color.
   * @returns The image instance.
   */
  public fill(value: number | number[]): this {
    if (typeof value === 'number') {
      validateValue(value, this);
      this.data.fill(value);
      return this;
    } else {
      if (value.length !== this.channels) {
        throw new RangeError(
          `the size of value must match the number of channels (${this.channels}). Got ${value.length} instead`,
        );
      }
      value.forEach((val) => validateValue(val, this));
      for (let i = 0; i < this.data.length; i += this.channels) {
        for (let j = 0; j <= this.channels; j++) {
          this.data[i + j] = value[j];
        }
      }
      return this;
    }
  }

  /**
   * Fill one channel with a value.
   *
   * @param channel - The channel to fill.
   * @param value - The new value.
   * @returns The image instance.
   */
  public fillChannel(channel: number, value: number): this {
    validateChannel(channel, this);
    validateValue(value, this);
    for (let i = channel; i < this.data.length; i += this.channels) {
      this.data[i] = value;
    }
    return this;
  }

  /**
   * Fill the alpha channel with the specified value.
   *
   * @param value - New channel value.
   * @returns The image instance.
   */
  public fillAlpha(value: number): this {
    validateValue(value, this);
    if (!this.alpha) {
      throw new Error(
        'fillAlpha can only be called if the image has an alpha channel',
      );
    }
    const alphaIndex = this.channels - 1;
    return this.fillChannel(alphaIndex, value);
  }

  /**
   * Create a copy of this image.
   *
   * @returns The image clone.
   */
  public clone(): IJS {
    return IJS.createFrom(this, { data: this.data.slice() });
  }
  /**
   * Modify all the values of the image using the given callback.
   *
   * @param cb - Callback that modifies a given value-
   */
  public changeEach(cb: (value: number) => number): void {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = cb(this.data[i]);
    }
  }

  /**
   * Get the coordinates of a point in the image. The reference is the top-left corner.
   *
   * @param coordinates - The point for which you want the coordinates.
   * @param round - Should the coordinates be rounded? This is useful when you want the center of the image.
   * @returns Coordinates of the point in the format [x, y].
   */
  public getCoordinates(
    coordinates: ImageCoordinates,
    round = false,
  ): [number, number] {
    switch (coordinates) {
      case ImageCoordinates.CENTER: {
        const centerX = (this.width - 1) / 2;
        const centerY = (this.height - 1) / 2;
        if (round) {
          return [Math.round(centerX), Math.round(centerY)];
        } else {
          return [centerX, centerY];
        }
      }
      case ImageCoordinates.TOP_LEFT:
        return [0, 0];
      case ImageCoordinates.TOP_RIGHT:
        return [this.width - 1, 0];
      case ImageCoordinates.BOTTOM_LEFT:
        return [0, this.height - 1];
      case ImageCoordinates.BOTTOM_RIGHT:
        return [this.width - 1, this.height - 1];
      default:
        throw new Error(`Unknow image coordinates ${coordinates}`);
    }
  }

  // COMPUTE

  public histogram(options?: HistogramOptions): Uint32Array {
    return histogram(this, options);
  }

  // DRAW

  /**
   * Draw a line defined by two points onto an image.
   *
   * @param from - Line starting point.
   * @param to - Line ending point.
   * @param options - Draw Line options.
   * @returns The mask with the line drawing.
   */
  public drawLine(
    from: Point,
    to: Point,
    options: DrawLineOnIjsOptions = {},
  ): IJS {
    return drawLineOnIjs(this, from, to, options);
  }

  /**
   * Draw a rectangle defined by position of the top-left corner, width and height.
   *
   * @param options - Draw rectangle options.
   * @returns The image with the rectangle drawing.
   */
  public drawRectangle(options: DrawRectangleOptions<IJS> = {}): IJS {
    return drawRectangle(this, options);
  }

  /**
   * Draw a polyline defined by an array of points on an image.
   *
   * @param points - Polyline array of points.
   * @param options - Draw polyline options.
   * @returns The image with the polyline drawing.
   */
  public drawPolyline(
    points: Point[],
    options: DrawPolylineOnIjsOptions = {},
  ): IJS {
    return drawPolylineOnIjs(this, points, options);
  }

  /**
   * Draw a polygon defined by an array of points onto an image.
   *
   * @param points - Polygon vertices.
   * @param options - Draw Line options.
   * @returns The image with the polygon drawing.
   */
  public drawPolygon(
    points: Point[],
    options: DrawPolygonOnIjsOptions = {},
  ): IJS {
    return drawPolygonOnIjs(this, points, options);
  }

  // OPERATIONS
  public split(): IJS[] {
    return split(this);
  }

  public convertColor(
    colorModel: ImageColorModel,
    options?: ConvertColorOptions,
  ): IJS {
    return convertColor(this, colorModel, options);
  }

  public convertDepth(newDepth: ColorDepth): IJS {
    return convertDepth(this, newDepth);
  }

  public grey(options?: GreyOptions): IJS {
    return grey(this, options);
  }

  public copyTo(target: IJS, options: CopyToOptions<IJS> = {}): IJS {
    return copyTo(this, target, options);
  }

  public threshold(options: ThresholdOptions = {}): Mask {
    return threshold(this, options);
  }

  /**
   * Crop the input image to a desired size.
   *
   * @param [options] - Crop options.
   * @returns The new cropped image
   */
  public crop(options?: CropOptions): IJS {
    return crop(this, options);
  }

  /**
   * Extract the pixels of an image, as specified in a mask.
   *
   * @param mask - The mask defining which pixels to keep.
   * @param options - Extract options.
   * @returns The extracted image.
   */
  public extract(mask: Mask, options?: ExtractOptions): IJS {
    return extract(this, mask, options);
  }

  /**
   * Paint a mask onto an image and the given position and with the given color.
   *
   * @param mask - Mask to paint on the image.
   * @param options - Paint mask options.
   * @returns The painted image.
   */
  public paintMask(mask: Mask, options?: PaintMaskOptions): IJS {
    return paintMask(this, mask, options);
  }

  // FILTERS

  public blur(options: BlurOptions): IJS {
    return blur(this, options);
  }

  public directConvolution(
    kernel: number[][],
    options?: ConvolutionOptions,
  ): IJS {
    return directConvolution(this, kernel, options);
  }

  /**
   * Compute direct convolution of an image and return an array with the raw values.
   *
   * @param kernel - Kernel used for the convolution.
   * @param options - Convolution options.
   * @returns Array with the raw convoluted values.
   */
  public rawDirectConvolution(
    kernel: number[][],
    options?: ConvolutionOptions,
  ): Float64Array {
    return rawDirectConvolution(this, kernel, options);
  }

  public separableConvolution(
    kernelX: number[],
    kernelY: number[],
    options?: ConvolutionOptions,
  ): IJS {
    return separableConvolution(this, kernelX, kernelY, options);
  }

  /**
   * Apply a gaussian filter to an image.
   *
   * @param options - Gaussian blur options.
   * @returns The blurred image.
   */
  public gaussianBlur(options: GaussianBlurOptions): IJS {
    return gaussianBlur(this, options);
  }
  /**
   * Flip the image.
   *
   * @param options - Flip options
   * @returns The flipped image.
   */
  public flip(options?: FlipOptions): IJS {
    return flip(this, options);
  }
  /**
   * Invert the colors of the image.
   *
   * @param options - Inversion options
   * @returns The inverted image.
   */
  public invert(options?: InvertOptions): IJS {
    return invert(this, options);
  }

  /**
   * Subtract other from an image.
   *
   * @param other - Image to subtract
   * @param options - Inversion options
   * @returns The subtracted image.
   */
  public subtractImage(other: IJS, options?: SubtractImageOptions): IJS {
    return subtractImage(this, other, options);
  }

  /**
   * Calculate a new image that is the hypotenuse between the current image and the other.
   *
   * @param other - Other image.
   * @param options - Hypotenuse options.
   * @returns Hypotenuse of the two images.
   */
  public hypotenuse(other: IJS, options?: HypotenuseOptions): IJS {
    return hypotenuse(this, other, options);
  }

  /**
   * Apply a gradient filter to an image.
   *
   * @param options - Gradient filter options.
   * @returns The gradient image.
   */
  public gradientFilter(options: GradientFilterOptions): IJS {
    return gradientFilter(this, options);
  }

  /**
   * Apply a derivative filter to an image.
   *
   * @param options - Derivative filter options.
   * @returns The processed image.
   */
  public derivativeFilter(options?: DerivativeFilterOptions): IJS {
    return derivativeFilter(this, options);
  }

  /**
   * Level the image using the optional input and output value. This function allows you to enhance the image's contrast.
   *
   * @param options - Level options.
   * @returns The levelled image.
   */
  public level(options?: LevelOptions): IJS {
    return level(this, options);
  }

  /**
   * Correct the colors in an image using the reference colors.
   *
   * @param measuredColors - Colors from the image, which will be compared to the reference.
   * @param referenceColors - Reference colors.
   * @returns Image with the colors corrected.
   */
  public correctColor(
    measuredColors: RgbColor[],
    referenceColors: RgbColor[],
  ): IJS {
    return correctColor(this, measuredColors, referenceColors);
  }

  // GEOMETRY

  public rotate(angle: number, options?: RotateOptions): IJS {
    return rotate(this, angle, options);
  }

  public resize(options: ResizeOptions): IJS {
    return resize(this, options);
  }

  public transform(
    transformMatrix: number[][],
    options?: TransformOptions,
  ): IJS {
    return transform(this, transformMatrix, options);
  }

  // MORPHOLOGY
  /**
   * Erode an image.
   *
   * @param options - Erode options.
   * @returns The eroded image.
   */
  public erode(options?: ErodeOptions): IJS {
    return erode(this, options);
  }
  /**
   * Dilate an image.
   *
   * @param options - Dilate options.
   * @returns The dilated image.
   */
  public dilate(options?: DilateOptions): IJS {
    return dilate(this, options);
  }
  /**
   * Open an image.
   *
   * @param options - Open options.
   * @returns The opened image.
   */
  public open(options?: OpenOptions): IJS {
    return open(this, options);
  }

  /**
   * Close an image.
   *
   * @param options - Close options.
   * @returns The closed image.
   */
  public close(options?: CloseOptions): IJS {
    return close(this, options);
  }

  /**
   * Top hat of an image.
   *
   * @param options - Top hat options.
   * @returns The top-hatted image.
   */
  public topHat(options?: TopHatOptions): IJS {
    return topHat(this, options);
  }

  /**
   * Bottom hat of an image.
   *
   * @param options - Bottom hat options.
   * @returns The bottom-hatted image.
   */
  public bottomHat(options?: BottomHatOptions): IJS {
    return bottomHat(this, options);
  }

  /**
   * Apply morphological gradient to an image.
   *
   * @param options - morphological gradient options.
   * @returns The processed image.
   */
  public morphologicalGradient(options?: MorphologicalGradientOptions): IJS {
    return morphologicalGradient(this, options);
  }

  /**
   * Apply Canny edge detection to an image.
   *
   * @param options - Canny edge detection options.
   * @returns The processed image.
   */
  public cannyEdgeDetector(options?: CannyEdgeOptions): Mask {
    return cannyEdgeDetector(this, options);
  }
}

/**
 * Create data array and set alpha channel to max value if applicable.
 *
 * @param size - Number of pixels.
 * @param channels - Number of channels.
 * @param alpha - Specify if there is alpha channel.
 * @param depth - Number of bits per channel.
 * @param maxValue - Maximal acceptable value for the channels.
 * @returns The new pixel array.
 */
function createPixelArray(
  size: number,
  channels: number,
  alpha: boolean,
  depth: ColorDepth,
  maxValue: number,
): ImageDataArray {
  const length = channels * size;
  let arr;
  switch (depth) {
    case ColorDepth.UINT8:
      arr = new Uint8Array(length);
      break;
    case ColorDepth.UINT16:
      arr = new Uint16Array(length);
      break;
    default:
      throw new Error(`unexpected color depth: ${depth}`);
  }

  // Alpha channel is 100% by default.
  if (alpha) {
    for (let i = channels - 1; i < length; i += channels) {
      arr[i] = maxValue;
    }
  }

  return arr;
}

/**
 * Returns the image data as a formatted string.
 *
 * @param img - The image instance.
 * @returns Formatted string containing the image data.
 */
function printData(img: IJS): string {
  const result = [];
  const padding = img.depth === 8 ? 3 : 5;

  for (let row = 0; row < img.height; row++) {
    const currentRow = [];
    for (let column = 0; column < img.width; column++) {
      for (let channel = 0; channel < img.channels; channel++) {
        currentRow.push(
          String(img.getValue(column, row, channel)).padStart(padding, ' '),
        );
      }
    }
    result.push(`[${currentRow.join(' ')}]`);
  }

  return `{
    ${`[\n     ${result.join('\n     ')}\n    ]`}
  }`;
}
