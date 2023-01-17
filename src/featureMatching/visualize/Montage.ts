import { Image } from '../../Image';
import { Point } from '../../geometry';
import { FastKeypoint } from '../keypoints/getFastKeypoints';
import { Match } from '../matching/bruteForceMatch';

import { drawKeypoints, DrawKeypointsOptions } from './drawKeypoints';
import { drawMatches, DrawMatchesOptions } from './drawMatches';
import { getBasicMontage } from './getBasicMontage';

export class Montage {
  public readonly leftWidth: number;
  public readonly leftHeight: number;
  public readonly rightWidth: number;
  public readonly rightHeight: number;

  public readonly leftOrigin: Point;

  public readonly width: number;
  public readonly height: number;

  public image: Image;

  public constructor(image1: Image, image2: Image) {
    this.leftWidth = image1.width;
    this.rightWidth = image1.width;
    this.leftHeight = image1.height;
    this.rightHeight = image2.height;

    this.leftOrigin = { row: 0, column: image1.width };

    this.width = image1.width + image2.width;
    this.height = Math.max(image1.width, image2.width);
    this.image = getBasicMontage(image1, image2);
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
    // modify this.image
  }
}
