import type { BitDepth } from 'fast-png';

import type { Image } from './Image.js';
import type { HistogramOptions } from './compute/index.js';
import {
  histogram,
  maxImage,
  meanImage,
  medianImage,
  minImage,
  sum,
} from './stack/index.js';
import {
  checkImagesValid,
  verifySameDimensions,
} from './stack/utils/checkImagesValid.js';
import type { ImageColorModel } from './utils/constants/colorModels.js';

export class Stack {
  /**
   * The array of images.
   */
  private readonly images: Image[];
  /**
   * The stack size.
   */
  public readonly size: number;
  /**
   * Do the images have an alpha channel?
   */
  public readonly alpha: boolean;
  /**
   * The color model of the images.
   */
  public readonly colorModel: ImageColorModel;
  /**
   * The bit depth of the images.
   */
  public readonly bitDepth: BitDepth;
  /**
   * Whether all the images of the stack have the same dimensions.
   */
  public readonly sameDimensions: boolean;
  /**
   * The number of channels of the images.
   */
  public readonly channels: number;

  /**
   * Create a new stack from an array of images.
   * The images must have the same bit depth and color model.
   * @param images - Array of images from which to create the stack.
   */
  public constructor(images: Image[]) {
    checkImagesValid(images);
    this.images = images;
    this.size = images.length;
    this.alpha = images[0].alpha;
    this.colorModel = images[0].colorModel;
    this.channels = images[0].channels;
    this.bitDepth = images[0].bitDepth;
    this.sameDimensions = verifySameDimensions(images);
  }

  *[Symbol.iterator](): IterableIterator<Image> {
    for (const image of this.images) {
      yield image;
    }
  }

  /**
   * Clone a stack. The images are a copy of the original images.
   * @returns A new stack with the same images.
   */
  public clone(): Stack {
    return new Stack(this.images.map((image) => image.clone()));
  }

  /**
   * Get the images of the stack. Mainly for debugging purposes.
   * @returns The images.
   */
  public getImages(): Image[] {
    return this.images;
  }

  /**
   * Get the image at the given index.
   * @param index - The index of the image.
   * @returns The image.
   */
  public getImage(index: number): Image {
    return this.images[index];
  }

  /**
   * Get a value from an image of the stack.
   * @param stackIndex - Index of the image in the stack.
   * @param row - Row index of the pixel.
   * @param column - Column index of the pixel.
   * @param channel - The channel to retrieve.
   * @returns The value at the given position.
   */
  public getValue(
    stackIndex: number,
    row: number,
    column: number,
    channel: number,
  ): number {
    return this.images[stackIndex].getValue(row, column, channel);
  }

  /**
   * Get a value from an image of the stack. Specify the pixel position using its index.
   * @param stackIndex - Index of the image in the stack.
   * @param index - The index of the pixel.
   * @param channel - The channel to retrieve.
   * @returns The value at the given position.
   */
  public getValueByIndex(
    stackIndex: number,
    index: number,
    channel: number,
  ): number {
    return this.images[stackIndex].getValueByIndex(index, channel);
  }

  /**
   * Return the image containing the minimum values of all the images in the stack for
   * each pixel. All the images must have the same dimensions.
   * @returns The minimum image.
   */
  public minImage(): Image {
    return minImage(this);
  }

  /**
   * Return the image containing the maximum values of all the images in the stack for
   * each pixel. All the images must have the same dimensions.
   * @returns The maximum image.
   */
  public maxImage(): Image {
    return maxImage(this);
  }

  /**
   * Return the image containing the median values of all the images in the stack for
   * each pixel. All the images must have the same dimensions.
   * @returns The median image.
   */
  public medianImage(): Image {
    return medianImage(this);
  }

  /**
   * Return the image containing the average values of all the images in the stack for
   * each pixel. All the images must have the same dimensions.
   * @returns The mean image.
   */
  public meanImage(): Image {
    return meanImage(this);
  }

  /**
   * Return a 16 bits depth image containing the sum values of all the images in the stack for
   * each pixel.
   * @returns The sum image.
   */
  public sum(): Image {
    return sum(this);
  }

  /**
   * Get the sum of all the histograms of the stack's images. If no channel is specified in the options, the images must be GREY.
   * @param options - Histogram options.
   * @returns The histogram of the stack.
   */
  public histogram(options: HistogramOptions = {}): Uint32Array {
    return histogram(this, options);
  }
  /**
   * Align all the images of the stack on the image at the given index.
   * @param refIndex - The index of the reference image.
   */
  // public alignImages(refIndex: number): Stack {}

  /**
   * Map a function on all the images of the stack.
   * @param callback - Function to apply on each image.
   * @returns New stack with the modified images.
   */
  public map(callback: (image: Image) => Image): Stack {
    return new Stack(this.images.map(callback));
  }

  /**
   * Filter the images in the stack.
   * @param callback - Function to decide which images to keep.
   * @returns New filtered stack.
   */
  public filter(callback: (image: Image) => boolean): Stack {
    return new Stack(this.images.filter(callback));
  }
}
