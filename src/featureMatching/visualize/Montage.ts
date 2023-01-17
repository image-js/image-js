import { Image } from '../../Image';
import { Point } from '../../geometry';
import { FastKeypoint } from '../keypoints/getFastKeypoints';
import { Match } from '../matching/bruteForceMatch';

import { drawKeypoints, DrawKeypointsOptions } from './drawKeypoints';
import { drawMatches, DrawMatchesOptions } from './drawMatches';
import { getBasicMontage } from './getBasicMontage';

export interface MontageOptions {
  /**
   * Factor by which to scale the images.
   *
   * @default 1
   */
  scale?: number;
}

export class Montage {
  public readonly leftWidth: number;
  public readonly leftHeight: number;
  public readonly rightWidth: number;
  public readonly rightHeight: number;

  public readonly leftOrigin: Point;

  public readonly width: number;
  public readonly height: number;

  public image: Image;

  public constructor(
    image1: Image,
    image2: Image,
    options: MontageOptions = {},
  ) {
    const { scale = 1 } = options;

    this.leftWidth = scale * image1.width;
    this.rightWidth = scale * image1.width;
    this.leftHeight = scale * image1.height;
    this.rightHeight = scale * image2.height;

    this.leftOrigin = { row: 0, column: image1.width };

    this.width = this.leftWidth + this.rightWidth;
    this.height = Math.max(this.leftHeight, this.rightHeight);
    this.image = getBasicMontage(image1, image2, scale);
  }

  public drawKeypoints(
    keypoints: FastKeypoint[],
    options: DrawKeypointsOptions = {},
  ): void {
    this.image = drawKeypoints(this.image, keypoints, options);
  }

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
