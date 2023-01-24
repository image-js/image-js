import { Image } from '../../Image';
import { Point } from '../../geometry';
import { FastKeypoint } from '../keypoints/getFastKeypoints';
import { Match } from '../matching/bruteForceMatch';

import { drawKeypoints, DrawKeypointsOptions } from './drawKeypoints';
import { drawMatches, DrawMatchesOptions } from './drawMatches';
import { getBasicMontage } from './getBasicMontage';
import { scaleKeypoints } from './scaleKeypoints';

export interface MontageOptions {
  /**
   * Factor by which to scale the images.
   *
   * @default 1
   */
  scale?: number;
}

export class Montage {
  /**
   * Scaled width of the left images.
   */
  public readonly leftWidth: number;
  /**
   * Scaled height of the left images.
   */
  public readonly leftHeight: number;
  /**
   * Scaled width of the right images.
   */
  public readonly rightWidth: number;
  /**
   * Scaled height of the right images.
   */
  public readonly rightHeight: number;
  /**
   * Origin of the right image relative to top-left corner of the Montage.
   */
  public readonly leftOrigin: Point;
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
  /**
   * Image of the Montage.
   */
  public image: Image;

  /**
   * Create a Montage of two images. The two images are placed side by side for comparison.
   *
   * @param image1 - Left image.
   * @param image2 - Right image.
   * @param options  - Montage options.
   */
  public constructor(
    image1: Image,
    image2: Image,
    options: MontageOptions = {},
  ) {
    const { scale = 1 } = options;

    this.scale = scale;
    this.leftWidth = scale * image1.width;
    this.rightWidth = scale * image1.width;
    this.leftHeight = scale * image1.height;
    this.rightHeight = scale * image2.height;

    this.leftOrigin = { row: 0, column: this.rightWidth };

    this.width = this.leftWidth + this.rightWidth;
    this.height = Math.max(this.leftHeight, this.rightHeight);
    this.image = getBasicMontage(image1, image2, scale);
  }

  /**
   * Draw keypoints on the Montage.
   *
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
   *
   * @param matches - Matches to draw.
   * @param sourceKeypoints - Source keypoints.
   * @param destinationKeypoints  - Destination keypoints
   * @param options - Draw matches options.
   */
  public drawMatches(
    matches: Match[],
    sourceKeypoints: FastKeypoint[],
    destinationKeypoints: FastKeypoint[],
    options: DrawMatchesOptions = {},
  ): void {
    const scaledSource = scaleKeypoints(sourceKeypoints, this.scale);
    const scaledDestination = scaleKeypoints(destinationKeypoints, this.scale);

    this.image = drawMatches(
      this,
      matches,
      scaledSource,
      scaledDestination,
      options,
    );
  }
}
