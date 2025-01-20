import { Image } from '../../Image.js';
import type { Point } from '../../geometry/index.js';
import type { FastKeypoint } from '../keypoints/getFastKeypoints.js';
import type { Match } from '../matching/bruteForceMatch.js';

import type { DrawKeypointsOptions } from './drawKeypoints.js';
import { drawKeypoints } from './drawKeypoints.js';
import type { DrawMatchesOptions } from './drawMatches.js';
import { drawMatches } from './drawMatches.js';
import { scaleKeypoints } from './scaleKeypoints.js';

export const MontageDisposition = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MontageDisposition =
  (typeof MontageDisposition)[keyof typeof MontageDisposition];

export interface MontageOptions {
  /**
   * Factor by which to scale the images.
   *  @default `1`
   */
  scale?: number;
  /**
   * How should the images be aligned: vertically or horizontally.
   * @default `'horizontal'`
   */
  disposition?: MontageDisposition;
}

export class Montage {
  /**
   * Scaled width of the first image.
   */
  public readonly sourceWidth: number;
  /**
   * Scaled height of the first image.
   */
  public readonly sourceHeight: number;
  /**
   * Scaled width of the second image.
   */
  public readonly destinationWidth: number;
  /**
   * Scaled height of the second image.
   */
  public readonly destinationHeight: number;
  /**
   * Origin of the destination / second image relative to top-left corner of the Montage.
   */
  public readonly destinationOrigin: Point;
  /**
   * Width of the Montage.
   */
  public readonly width: number;
  /**
   * Height of the Montage.
   */
  public readonly height: number;
  /**
   * Factor by which to scale the images are scaled in the montage.
   */
  public readonly scale: number;

  public readonly disposition: MontageDisposition;

  /**
   * Image of the Montage.
   */
  public image: Image;

  /**
   * Create a Montage of two images. The two images are placed side by side for comparison.
   * @param source - First image.
   * @param destination - Second image.
   * @param options  - Montage options.
   */
  public constructor(
    source: Image,
    destination: Image,
    options: MontageOptions = {},
  ) {
    const { scale = 1, disposition = 'horizontal' } = options;

    if (!Number.isInteger(scale)) {
      throw new TypeError('scale must be an integer');
    }

    this.scale = scale;
    this.disposition = disposition;

    this.sourceWidth = scale * source.width;
    this.destinationWidth = scale * destination.width;
    this.sourceHeight = scale * source.height;
    this.destinationHeight = scale * destination.height;

    if (disposition === 'horizontal') {
      this.destinationOrigin = { row: 0, column: this.sourceWidth };
      this.width = this.sourceWidth + this.destinationWidth;
      this.height = Math.max(this.sourceHeight, this.destinationHeight);
    } else if (disposition === 'vertical') {
      this.destinationOrigin = { row: this.sourceHeight, column: 0 };
      this.width = Math.max(this.sourceWidth, this.destinationWidth);
      this.height = this.sourceHeight + this.destinationHeight;
    } else {
      throw new RangeError(`invalid disposition type: ${disposition}`);
    }

    if (source.colorModel !== 'RGB') {
      source = source.convertColor('RGB');
    }
    if (destination.colorModel !== 'RGB') {
      destination = destination.convertColor('RGB');
    }

    const image = new Image(this.width, this.height);

    source
      .resize({ xFactor: scale, yFactor: scale })
      .copyTo(image, { out: image });
    destination.resize({ xFactor: scale, yFactor: scale }).copyTo(image, {
      out: image,
      origin: this.destinationOrigin,
    });

    this.image = image;
  }

  /**
   * Draw keypoints on the Montage.
   * @param keypoints - Keypoints to draw.
   * @param options - Draw keypoints options.
   */
  public drawKeypoints(
    keypoints: FastKeypoint[],
    options: DrawKeypointsOptions = {},
  ): void {
    const scaledKeypoints = scaleKeypoints(keypoints, this.scale);
    this.image = drawKeypoints(this.image, scaledKeypoints, options);
  }

  /**
   * Draw the matches between source and destination keypoints.
   * @param matches - Matches to draw.
   * @param sourceKeypoints - Source keypoints.
   * @param destinationKeypoints  - Destination keypoints.
   * @param options - Draw matches options.
   */
  public drawMatches(
    matches: Match[],
    sourceKeypoints: FastKeypoint[],
    destinationKeypoints: FastKeypoint[],
    options: DrawMatchesOptions = {},
  ): void {
    this.image = drawMatches(
      this,
      matches,
      sourceKeypoints,
      destinationKeypoints,
      options,
    );
  }
}
