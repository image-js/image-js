import { Image, ImageColorModel } from '../Image';
import { writeSync } from '../save';

import { Match } from './bruteForceMatch';
import { FastKeypoint } from './getFastKeypoints';

export interface DrawMatchesOptions {
  /**
   * Circles diameter in pixels.
   */
  circleDiameter?: 10;
  /**
   * Annotations color.
   *
   * @default [255,0,0]
   */
  color?: number[];
  /**
   * Should the original keypoints be displayes?
   *
   * @returns false
   */
  showKeypoints?: boolean;
  /**
   * Keypoints color.
   *
   * @default [0,255,0]
   */
  keypointColor?: number[];
  /**
   * Keypoint marker size.
   *
   * @default 3
   */
  keypointSize?: number;
}

/**
 * Draw the source descriptors on the source image and
 * their matches on the destination image side by side.
 *
 * @param source - The source image.
 * @param destination - The destination image.
 * @param sourceKeypoints - Source keypoints.
 * @param destinationKeypoints - Destination keypoints.
 * @param matches - The matches between source and destination.
 * @param options - Draw matches options.
 * @returns The comparison image.
 */
export function drawMatches(
  source: Image,
  destination: Image,
  sourceKeypoints: FastKeypoint[],
  destinationKeypoints: FastKeypoint[],
  matches: Match[],
  options: DrawMatchesOptions = {},
): Image {
  const {
    circleDiameter = 10,
    color = [255, 0, 0],
    showKeypoints = false,
    keypointColor = [0, 255, 0],
    keypointSize = 5,
  } = options;

  if (source.colorModel !== ImageColorModel.RGB) {
    source = source.convertColor(ImageColorModel.RGB);
  }
  if (destination.colorModel !== ImageColorModel.RGB) {
    destination = destination.convertColor(ImageColorModel.RGB);
  }

  const result = new Image(
    source.width + destination.width,
    Math.max(source.height, destination.height),
  );

  source.copyTo(result, { out: result });
  destination.copyTo(result, {
    out: result,
    origin: { column: source.width, row: 0 },
  });

  const radius = Math.ceil(circleDiameter / 2);
  for (let match of matches) {
    const sourcePoint = sourceKeypoints[match.sourceIndex].origin;
    result.drawCircle(sourcePoint, radius, {
      color,
      out: result,
    });

    const relativeDestinationPoint =
      destinationKeypoints[match.destinationIndex].origin;
    const destinationPoint = {
      column: relativeDestinationPoint.column + source.width,
      row: relativeDestinationPoint.row,
    };
    result.drawCircle(destinationPoint, radius, {
      color,
      out: result,
    });
    result.drawLine(sourcePoint, destinationPoint, {
      out: result,
      strokeColor: color,
    });
  }

  const keypointRadius = Math.ceil(keypointSize / 2);
  if (showKeypoints) {
    for (let keypoint of sourceKeypoints) {
      result.drawCircle(keypoint.origin, keypointRadius, {
        color: keypointColor,
        fill: keypointColor,
        out: result,
      });
    }
    for (let keypoint of destinationKeypoints) {
      result.drawCircle(
        {
          column: keypoint.origin.column + source.width,
          row: keypoint.origin.row,
        },
        keypointRadius,
        {
          color: keypointColor,
          fill: keypointColor,
          out: result,
        },
      );
    }
  }

  writeSync('src/featureMatching/result.png', result);
  return result;
}
