import type { RgbColor } from 'colord';
import { match } from 'ts-pattern';

import type { Mask } from './Mask.js';
import type { DivideOptions } from './compare/divide.js';
import { divide } from './compare/divide.js';
import type { SubtractImageOptions } from './compare/index.js';
import { add, subtract } from './compare/index.js';
import type { MultiplyOptions } from './compare/multiply.js';
import { multiply } from './compare/multiply.js';
import type {
  HistogramOptions,
  MeanOptions,
  MedianOptions,
  VarianceOptions,
} from './compute/index.js';
import { histogram, mean, median, variance } from './compute/index.js';
import { correctColor } from './correctColor/index.js';
import type {
  DrawCircleOnImageOptions,
  DrawLineOnImageOptions,
  DrawMarkerOptions,
  DrawPointsOptions,
  DrawPolygonOnImageOptions,
  DrawPolylineOnImageOptions,
  DrawRectangleOptions,
} from './draw/index.js';
import {
  drawCircleOnImage,
  drawLineOnImage,
  drawMarker,
  drawMarkers,
  drawPoints,
  drawPolygonOnImage,
  drawPolylineOnImage,
  drawRectangle,
} from './draw/index.js';
import type {
  BlurOptions,
  ConvolutionOptions,
  DerivativeFilterOptions,
  FlipOptions,
  GaussianBlurOptions,
  GradientFilterOptions,
  HypotenuseOptions,
  IncreaseContrastOptions,
  InvertOptions,
  LevelOptions,
  MedianFilterOptions,
  PixelateOptions,
} from './filters/index.js';
import {
  blur,
  derivativeFilter,
  directConvolution,
  flip,
  gaussianBlur,
  gradientFilter,
  hypotenuse,
  increaseContrast,
  invert,
  level,
  medianFilter,
  pixelate,
  rawDirectConvolution,
  separableConvolution,
} from './filters/index.js';
import type {
  Point,
  ResizeOptions,
  RotateAngle,
  TransformOptions,
  TransformRotateOptions,
} from './geometry/index.js';
import {
  resize,
  rotate,
  transform,
  transformRotate,
} from './geometry/index.js';
import type { ImageMetadata } from './load/load.types.js';
import type {
  BottomHatOptions,
  CannyEdgeOptions,
  CloseOptions,
  DilateOptions,
  ErodeOptions,
  MorphologicalGradientOptions,
  OpenOptions,
  TopHatOptions,
} from './morphology/index.js';
import {
  bottomHat,
  cannyEdgeDetector,
  close,
  dilate,
  erode,
  morphologicalGradient,
  open,
  topHat,
} from './morphology/index.js';
import type {
  ConvertColorOptions,
  CopyToOptions,
  CropAlphaOptions,
  CropOptions,
  CropRectangleOptions,
  ExtractOptions,
  GreyOptions,
  PaintMaskOnImageOptions,
  ThresholdOptions,
} from './operations/index.js';
import {
  convertBitDepth,
  convertColor,
  copyTo,
  crop,
  cropAlpha,
  cropRectangle,
  extract,
  grey,
  paintMaskOnImage,
  split,
  threshold,
} from './operations/index.js';
import type { ImageColorModel } from './utils/constants/colorModels.js';
import { colorModels } from './utils/constants/colorModels.js';
import { getMinMax } from './utils/getMinMax.js';
import {
  validateChannel,
  validateValue,
} from './utils/validators/validators.js';

export type ImageDataArray = Uint8Array | Uint16Array | Uint8ClampedArray;

/**
 * Bit depth of the image (nb of bits that encode each value in the image).
 */
export type BitDepth = 1 | 8 | 16;

export const ImageCoordinates = {
  CENTER: 'center',
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ImageCoordinates =
  (typeof ImageCoordinates)[keyof typeof ImageCoordinates];

export interface ImageOptions {
  /**
   * Number of bits per value in each channel.
   * @default `8`.
   */
  bitDepth?: BitDepth;

  /**
   * Typed array holding the image data.
   */
  data?: ImageDataArray;

  /**
   * Color model of the created image.
   * @default `'RGB'`.
   */
  colorModel?: ImageColorModel;

  /**
   * Origin of the image relative to a parent image (top-left corner).
   * @default `{row: 0, column: 0}`
   */
  origin?: Point;

  meta?: ImageMetadata;
}

export interface CreateFromOptions extends ImageOptions {
  width?: number;
  height?: number;
}

export type ImageValues = [number, number, number, number];

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
   * The total number of pixels in the image (width × height).
   */
  public readonly size: number;

  /**
   * The number of bits per value in each channel.
   */
  public readonly bitDepth: BitDepth;

  /**
   * The color model of the image.
   */
  public readonly colorModel: ImageColorModel;

  /**
   * The number of color channels in the image, excluding the alpha channel.
   * A GREY image has 1 component. An RGB image has 3 components.
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
   * Origin of the image relative to a the parent image.
   */
  public readonly origin: Point;

  public readonly meta?: ImageMetadata;

  /**
   * Typed array holding the image data.
   */
  private readonly data: ImageDataArray;

  /**
   * Construct a new Image knowing its dimensions.
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
      bitDepth = 8,
      data,
      colorModel = 'RGB',
      origin = { row: 0, column: 0 },
      meta,
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
    this.bitDepth = bitDepth;
    this.colorModel = colorModel;
    this.origin = origin;
    this.meta = meta;

    const colorModelDef = colorModels[colorModel];
    this.components = colorModelDef.components;
    this.alpha = colorModelDef.alpha;
    this.channels = colorModelDef.channels;

    this.maxValue = 2 ** bitDepth - 1;

    if (data === undefined) {
      this.data = createPixelArray(
        this.size,
        this.channels,
        this.alpha,
        this.bitDepth,
        this.maxValue,
      );
    } else {
      if (bitDepth === 8 && data instanceof Uint16Array) {
        throw new RangeError(`bitDepth is ${bitDepth} but data is Uint16Array`);
      } else if (bitDepth === 16 && data instanceof Uint8Array) {
        throw new RangeError(`bitDepth is ${bitDepth} but data is Uint8Array`);
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
   * Create a new Image based on the properties of an existing one.
   * @param other - Reference image.
   * @param options - Image options.
   * @returns New image.
   */
  public static createFrom(
    other: Image | Mask,
    options: CreateFromOptions = {},
  ): Image {
    const { width = other.width, height = other.height } = options;
    let bitDepth: BitDepth;
    if (other instanceof Image) {
      bitDepth = other.bitDepth;
    } else {
      bitDepth = 8;
    }
    return new Image(width, height, {
      bitDepth,
      colorModel: other.colorModel,
      origin: other.origin,
      ...options,
    });
  }

  /**
   * Get all the channels of a pixel.
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

  public getColumn(column: number): number[][] {
    const columnValues = [];
    for (let i = 0; i < this.channels; i++) {
      const channelValues = [];
      for (let j = 0; j < this.height; j++) {
        channelValues.push(this.getValue(column, j, i));
      }
      columnValues.push(channelValues);
    }
    return columnValues;
  }

  public getRow(row: number): number[][] {
    const rowValues = [];
    for (let i = 0; i < this.channels; i++) {
      const channelValues = [];
      for (let j = 0; j < this.width; j++) {
        channelValues.push(this.getValue(j, row, i));
      }
      rowValues.push(channelValues);
    }
    return rowValues;
  }
  /**
   * Set all the channels of a pixel.
   * @param column - Column index.
   * @param row - Row index.
   * @param value - New color of the pixel to set.
   */
  public setPixel(column: number, row: number, value: number[]): void {
    const start = (row * this.width + column) * this.channels;
    for (let i = 0; i < this.channels; i++) {
      this.data[start + i] = value[i];
    }
  }

  /**
   * Set all the channels of a pixel if the coordinates are inside the image.
   * @param column - Column index.
   * @param row - Row index.
   * @param value - New color of the pixel to set.
   */
  public setVisiblePixel(column: number, row: number, value: number[]): void {
    if (column >= 0 && column < this.width && row >= 0 && row < this.height) {
      this.setPixel(column, row, value);
    }
  }

  /**
   * Get all the channels of a pixel using its index.
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
   * Set the value of a specific pixel channel. Select pixel using coordinates.
   * If the value is out of range it is set to the closest extremety.
   * @param column - Column index.
   * @param row - Row index.
   * @param channel - Channel index.
   * @param value - Value to set.
   */
  public setClampedValue(
    column: number,
    row: number,
    channel: number,
    value: number,
  ): void {
    if (value < 0) value = 0;
    else if (value > this.maxValue) value = this.maxValue;
    this.data[(row * this.width + column) * this.channels + channel] = value;
  }
  /**
   * Get the value of a specific pixel channel. Select pixel using index.
   * @param index - Index of the pixel.
   * @param channel - Channel index.
   * @returns Value of the channel of the pixel.
   */
  public getValueByIndex(index: number, channel: number): number {
    return this.data[index * this.channels + channel];
  }
  /**
   * Set the value of a specific pixel channel. Select pixel using index.
   * @param index - Index of the pixel.
   * @param channel - Channel index.
   * @param value - Value to set.
   */
  public setValueByIndex(index: number, channel: number, value: number): void {
    this.data[index * this.channels + channel] = value;
  }

  /**
   * Set the value of a specific pixel channel. Select pixel using index.
   * If the value is out of range it is set to the closest extremety.
   * @param index - Index of the pixel.
   * @param channel - Channel index.
   * @param value - Value to set.
   */
  public setClampedValueByIndex(
    index: number,
    channel: number,
    value: number,
  ): void {
    if (value < 0) value = 0;
    else if (value > this.maxValue) value = this.maxValue;
    this.data[index * this.channels + channel] = value;
  }

  /**
   * Get the value of a specific pixel channel. Select pixel using a point.
   * @param point - Coordinates of the desired pixel.
   * @param channel - Channel index.
   * @returns Value of the channel of the pixel.
   */
  public getValueByPoint(point: Point, channel: number): number {
    return this.getValue(point.column, point.row, channel);
  }

  /**
   * Set the value of a specific pixel channel. Select pixel using a point.
   * @param point - Coordinates of the pixel.
   * @param channel - Channel index.
   * @param value - Value to set.
   */
  public setValueByPoint(point: Point, channel: number, value: number): void {
    this.setValue(point.column, point.row, channel, value);
  }

  /**
   * Find the min and max values of each channel of the image.
   * @returns An object with arrays of the min and max values.
   */
  public minMax(): { min: number[]; max: number[] } {
    return getMinMax(this);
  }

  /**
   * Return the raw image data.
   * @returns The raw data.
   */
  public getRawImage() {
    return {
      width: this.width,
      height: this.height,
      data: this.data,
      channels: this.channels,
      bitDepth: this.bitDepth,
    };
  }

  public [Symbol.for('nodejs.util.inspect.custom')](): string {
    let dataString;
    if (this.height > 20 || this.width > 20) {
      dataString = '[...]';
    } else {
      dataString = printData(this);
    }
    return `Image {
  width: ${this.width}
  height: ${this.height}
  bitDepth: ${this.bitDepth}
  colorModel: ${this.colorModel}
  channels: ${this.channels}
  data: ${dataString}
}`;
  }

  /**
   * Fill the image with a value or a color.
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
          `the size of value must match the number of channels (${this.channels}). Received ${value.length}`,
        );
      }
      for (const val of value) validateValue(val, this);
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
   * Get one channel of the image as an array.
   * @param channel - The channel to fill.
   * @returns Array with the channel values.
   */
  public getChannel(channel: number): number[] {
    validateChannel(channel, this);
    const result = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      result[i] = this.data[channel + i * this.channels];
    }
    return result;
  }

  /**
   * Fill the alpha channel with the specified value.
   * @param value - New channel value.
   * @returns The image instance.
   */
  public fillAlpha(value: number): this {
    validateValue(value, this);
    if (!this.alpha) {
      throw new TypeError(
        'fillAlpha can only be called if the image has an alpha channel',
      );
    }
    const alphaIndex = this.channels - 1;
    return this.fillChannel(alphaIndex, value);
  }

  /**
   * Create a copy of this image.
   * @returns The image clone.
   */
  public clone(): Image {
    return Image.createFrom(this, { data: this.data.slice() });
  }

  /**
   * Modify all the values of the image using the given callback.
   * @param cb - Callback that modifies a given value.
   */
  public changeEach(cb: (value: number) => number): void {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = cb(this.data[i]);
    }
  }

  /**
   * Get the coordinates of a point in the image. The reference is the top-left corner.
   * @param coordinates - The point for which you want the coordinates.
   * @param round - Whether the coordinates should be rounded. This is useful when you want the center of the image.
   * @returns Coordinates of the point in the format [column, row].
   */
  public getCoordinates(coordinates: ImageCoordinates, round = false): Point {
    return match(coordinates)
      .with('center', () => {
        const centerX = (this.width - 1) / 2;
        const centerY = (this.height - 1) / 2;
        if (round) {
          return { column: Math.round(centerX), row: Math.round(centerY) };
        } else {
          return { column: centerX, row: centerY };
        }
      })
      .with('top-left', () => ({ column: 0, row: 0 }))
      .with('top-right', () => ({ column: this.width - 1, row: 0 }))
      .with('bottom-left', () => ({ column: 0, row: this.height - 1 }))
      .with('bottom-right', () => ({
        column: this.width - 1,
        row: this.height - 1,
      }))
      .exhaustive();
  }

  // COMPARE
  /**
   * Subtract other from an image.
   * @param other - Image to subtract.
   * @param options - Inversion options.
   * @returns The subtracted image.
   */
  public subtract(other: Image, options: SubtractImageOptions = {}): Image {
    return subtract(this, other, options);
  }

  public add(other: Image): Image {
    return add(this, other);
  }
  /**
   *  Multiply image pixels by a constant.
   * @param value - Value which pixels will be multiplied to.
   * @param options - Multiply options.
   * @returns Multiplied image.
   */
  public multiply(value: number, options: MultiplyOptions = {}): Image {
    return multiply(this, value, options);
  }
  /**
   *  Divide image pixels by a constant.
   * @param value - Value which pixels will be divided to.
   * @param options - Divide options.
   * @returns Divided image.
   */
  public divide(value: number, options: DivideOptions = {}): Image {
    return divide(this, value, options);
  }
  // COMPUTE

  public histogram(options?: HistogramOptions): Uint32Array {
    return histogram(this, options);
  }

  /**
   * Compute the mean pixel of an image.
   * @param options - Mean options.
   * @returns The mean pixel.
   */
  public mean(options?: MeanOptions): number[] {
    return mean(this, options);
  }

  /**
   * Compute the median pixel of an image.
   * @param options - Median options.
   * @returns The median pixel.
   */
  public median(options?: MedianOptions): number[] {
    return median(this, options);
  }

  /**
   * Compute the variance of each channel of an image.
   * @param options - Variance options.
   * @returns The variance of the channels of the image.
   */
  public variance(options?: VarianceOptions): number[] {
    return variance(this, options);
  }

  // DRAW

  /**
   * Draw a set of points on an image.
   * @param points - Array of points.
   * @param options - Draw points on Image options.
   * @returns New mask.
   */
  public drawPoints(points: Point[], options: DrawPointsOptions = {}): Image {
    return drawPoints(this, points, options);
  }

  /**
   * Draw a line defined by two points onto an image.
   * @param from - Line starting point.
   * @param to - Line ending point.
   * @param options - Draw Line options.
   * @returns The mask with the line drawing.
   */
  public drawLine(
    from: Point,
    to: Point,
    options: DrawLineOnImageOptions = {},
  ): Image {
    return drawLineOnImage(this, from, to, options);
  }

  /**
   * Draw a rectangle defined by position of the top-left corner, width and height.
   * @param options - Draw rectangle options.
   * @returns The image with the rectangle drawing.
   */
  public drawRectangle(options: DrawRectangleOptions<Image> = {}): Image {
    return drawRectangle(this, options);
  }

  /**
   * Draw a polyline defined by an array of points on an image.
   * @param points - Polyline array of points.
   * @param options - Draw polyline options.
   * @returns The image with the polyline drawing.
   */
  public drawPolyline(
    points: Point[],
    options: DrawPolylineOnImageOptions = {},
  ): Image {
    return drawPolylineOnImage(this, points, options);
  }

  /**
   * Draw a polygon defined by an array of points onto an image.
   * @param points - Polygon vertices.
   * @param options - Draw Line options.
   * @returns The image with the polygon drawing.
   */
  public drawPolygon(
    points: Point[],
    options: DrawPolygonOnImageOptions = {},
  ): Image {
    return drawPolygonOnImage(this, points, options);
  }

  /**
   * Draw a circle defined by center and radius onto an image.
   * @param center - Circle center.
   * @param radius - Circle radius.
   * @param options - Draw circle options.
   * @returns The image with the circle drawing.
   */
  public drawCircle(
    center: Point,
    radius: number,
    options: DrawCircleOnImageOptions = {},
  ): Image {
    return drawCircleOnImage(this, center, radius, options);
  }

  /**
   * Draw a marker on the image.
   * @param point - Marker center point.
   * @param options - Draw marker options.
   * @returns The image with the marker drawing.
   */
  public drawMarker(point: Point, options: DrawMarkerOptions = {}): Image {
    return drawMarker(this, point, options);
  }

  /**
   * Draw markers on the image.
   * @param points - Markers center points.
   * @param options - Draw marker options.
   * @returns The image with the markers drawing.
   */
  public drawMarkers(points: Point[], options: DrawMarkerOptions = {}): Image {
    return drawMarkers(this, points, options);
  }

  // OPERATIONS
  public split(): Image[] {
    return split(this);
  }

  public convertColor(
    colorModel: ImageColorModel,
    options?: ConvertColorOptions,
  ): Image {
    return convertColor(this, colorModel, options);
  }

  public convertBitDepth(newDepth: BitDepth): Image {
    return convertBitDepth(this, newDepth);
  }

  public grey(options?: GreyOptions): Image {
    return grey(this, options);
  }

  public copyTo(target: Image, options: CopyToOptions<Image> = {}): Image {
    return copyTo(this, target, options);
  }

  public threshold(options: ThresholdOptions = {}): Mask {
    return threshold(this, options);
  }

  /**
   * Crop the input image to a desired size.
   * @param [options] - Crop options.
   * @returns The new cropped image.
   */
  public crop(options?: CropOptions): Image {
    return crop(this, options);
  }

  /**
   * Crop an oriented rectangle from the image.
   * If the rectangle's length or width are not an integers, its dimension is expanded in both directions such as the length and width are integers.
   * @param points - The points of the rectangle. Points must be circling around the rectangle (clockwise or anti-clockwise)
   * @param options - Crop options, see {@link CropRectangleOptions}
   * @returns The cropped image. The orientation of the image is the one closest to the rectangle passed as input.
   */
  public cropRectangle(points: Point[], options?: CropRectangleOptions) {
    return cropRectangle(this, points, options);
  }

  /**
   * Crops the image based on the alpha channel
   * This removes lines and columns where the alpha channel is lower than a threshold value.
   * @param options - Crop alpha options.
   * @returns The cropped image.
   */
  public cropAlpha(options: CropAlphaOptions = {}): Image {
    return cropAlpha(this, options);
  }

  /**
   * Extract the pixels of an image, as specified in a mask.
   * @param mask - The mask defining which pixels to keep.
   * @param options - Extract options.
   * @returns The extracted image.
   */
  public extract(mask: Mask, options?: ExtractOptions): Image {
    return extract(this, mask, options);
  }

  /**
   * Paint a mask onto an image and the given position and with the given color.
   * @param mask - Mask to paint on the image.
   * @param options - Paint mask options.
   * @returns The painted image.
   */
  public paintMask(mask: Mask, options?: PaintMaskOnImageOptions): Image {
    return paintMaskOnImage(this, mask, options);
  }

  // FILTERS

  public blur(options: BlurOptions): Image {
    return blur(this, options);
  }

  public pixelate(options: PixelateOptions): Image {
    return pixelate(this, options);
  }

  public directConvolution(
    kernel: number[][],
    options?: ConvolutionOptions,
  ): Image {
    return directConvolution(this, kernel, options);
  }

  /**
   * Compute direct convolution of an image and return an array with the raw values.
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
  ): Image {
    return separableConvolution(this, kernelX, kernelY, options);
  }

  /**
   * Apply a gaussian filter to an image.
   * @param options - Gaussian blur options.
   * @returns The blurred image.
   */
  public gaussianBlur(options: GaussianBlurOptions): Image {
    return gaussianBlur(this, options);
  }
  /**
   * Flip the image.
   * @param options - Flip options.
   * @returns The flipped image.
   */
  public flip(options?: FlipOptions): Image {
    return flip(this, options);
  }

  /**
   *   Invert the colors of the image.
   * @param options - Inversion options.
   * @returns The inverted image.
   */
  public invert(options?: InvertOptions): Image {
    return invert(this, options);
  }

  /**
   * Calculate a new image that is the hypotenuse between the current image and the other.
   * @param other - Other image.
   * @param options - Hypotenuse options.
   * @returns Hypotenuse of the two images.
   */
  public hypotenuse(other: Image, options?: HypotenuseOptions): Image {
    return hypotenuse(this, other, options);
  }

  /**
   * Apply a gradient filter to an image.
   * @param options - Gradient filter options.
   * @returns The gradient image.
   */
  public gradientFilter(options: GradientFilterOptions): Image {
    return gradientFilter(this, options);
  }

  /**
   * Apply a derivative filter to an image.
   * @param options - Derivative filter options.
   * @returns The processed image.
   */
  public derivativeFilter(options?: DerivativeFilterOptions): Image {
    return derivativeFilter(this, options);
  }

  /**
   * Level the image using the optional input and output value. This function allows you to enhance the image's contrast.
   * @param options - Level options.
   * @returns The levelled image.
   */
  public level(options?: LevelOptions): Image {
    return level(this, options);
  }

  /**
   * Increase the contrast of an image by spanning each channel on the range [0, image.maxValue].
   * @param options - Increase contrast options.
   * @returns The enhanced image.
   */
  public increaseContrast(options: IncreaseContrastOptions = {}): Image {
    return increaseContrast(this, options);
  }

  /**
   * Correct the colors in an image using the reference colors.
   * @param measuredColors - Colors from the image, which will be compared to the reference.
   * @param referenceColors - Reference colors.
   * @returns Image with the colors corrected.
   */
  public correctColor(
    measuredColors: RgbColor[],
    referenceColors: RgbColor[],
  ): Image {
    return correctColor(this, measuredColors, referenceColors);
  }
  /**
   * Apply a median filter to the image.
   * @param options - Options to apply for median filter.
   * @returns Image after median filter.
   */
  public medianFilter(options: MedianFilterOptions) {
    return medianFilter(this, options);
  }

  // GEOMETRY

  public resize(options: ResizeOptions): Image {
    return resize(this, options);
  }

  public rotate(angle: RotateAngle): Image {
    return rotate(this, angle);
  }

  public transform(
    transformMatrix: number[][],
    options?: TransformOptions,
  ): Image {
    return transform(this, transformMatrix, options);
  }

  public transformRotate(
    angle: number,
    options?: TransformRotateOptions,
  ): Image {
    return transformRotate(this, angle, options);
  }

  // MORPHOLOGY
  /**
   * Erode an image.
   * @param options - Erode options.
   * @returns The eroded image.
   */
  public erode(options?: ErodeOptions): Image {
    return erode(this, options);
  }
  /**
   * Dilate an image.
   * @param options - Dilate options.
   * @returns The dilated image.
   */
  public dilate(options?: DilateOptions): Image {
    return dilate(this, options);
  }
  /**
   * Open an image.
   * @param options - Open options.
   * @returns The opened image.
   */
  public open(options?: OpenOptions): Image {
    return open(this, options);
  }

  /**
   * Close an image.
   * @param options - Close options.
   * @returns The closed image.
   */
  public close(options?: CloseOptions): Image {
    return close(this, options);
  }

  /**
   * Top hat of an image.
   * @param options - Top hat options.
   * @returns The top-hatted image.
   */
  public topHat(options?: TopHatOptions): Image {
    return topHat(this, options);
  }

  /**
   * Bottom hat of an image.
   * @param options - Bottom hat options.
   * @returns The bottom-hatted image.
   */
  public bottomHat(options?: BottomHatOptions): Image {
    return bottomHat(this, options);
  }

  /**
   * Apply morphological gradient to an image.
   * @param options - Morphological gradient options.
   * @returns The processed image.
   */
  public morphologicalGradient(options?: MorphologicalGradientOptions): Image {
    return morphologicalGradient(this, options);
  }

  /**
   * Apply Canny edge detection to an image.
   * @param options - Canny edge detection options.
   * @returns The processed image.
   */
  public cannyEdgeDetector(options?: CannyEdgeOptions): Mask {
    return cannyEdgeDetector(this, options);
  }
}

/**
 * Create data array and set alpha channel to max value if applicable.
 * @param size - Number of pixels.
 * @param channels - Number of channels.
 * @param alpha - Specify if there is alpha channel.
 * @param bitDepth - Number of bits per channel.
 * @param maxValue - Maximal acceptable value for the channels.
 * @returns The new pixel array.
 */
function createPixelArray(
  size: number,
  channels: number,
  alpha: boolean,
  bitDepth: BitDepth,
  maxValue: number,
): ImageDataArray {
  const length = channels * size;
  const arr = match(bitDepth)
    .with(8, () => new Uint8Array(length))
    .with(16, () => new Uint16Array(length))
    .otherwise(() => {
      throw new RangeError(`invalid bitDepth: ${bitDepth}`);
    });

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
 * @param img - The image instance.
 * @returns Formatted string containing the image data.
 */
function printData(img: Image): string {
  const result = [];
  const padding = img.bitDepth === 8 ? 3 : 5;

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
    [\n     ${result.join('\n     ')}\n    ]
  }`;
}
