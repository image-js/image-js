import { Image, ImageColorModel } from '../Image';

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
   * Number of best matches to display.
   *
   * @default matches.length
   */
  nbBestMatches?: number;
}

/**
 * Draw the source descriptors on the source image and
 * their matches on the destination image side by side.
 *
 * @param source - The source image.
 * @param destination - The destination image.
 * @param sourceKeypoints
 * @param destinationKeypoints
 * @param matches - The matches between source and destination.
 * @param options
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
  const { circleDiameter = 10, color = [255, 0, 0] } = options;

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
  source.copyTo(result, {
    out: result,
    origin: { column: source.width, row: 0 },
  });

  for (let match of matches) {
    const sourcePoint = sourceKeypoints[match.sourceIndex].origin;
    result.drawCircle(sourcePoint, circleDiameter, {
      color,
      out: result,
    });

    const destinationPoint =
      destinationKeypoints[match.destinationIndex].origin;
    destinationPoint.column += source.width;
    result.drawCircle(destinationPoint, circleDiameter, {
      color,
      out: result,
    });
    result.drawLine(sourcePoint, destinationPoint, {
      out: result,
      strokeColor: color,
    });
  }

  return result;
}
