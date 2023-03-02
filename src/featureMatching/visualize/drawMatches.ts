import { Image } from '../../Image';
import { FastKeypoint } from '../keypoints/getFastKeypoints';
import { Match } from '../matching/bruteForceMatch';
import { getColors, GetColorsOptions } from '../utils/getColors';
import { getMatchColor } from '../utils/getMatchColor';
import { sortByDistance } from '../utils/sortByDistance';

import { Montage } from './Montage';
import { scaleKeypoints } from './scaleKeypoints';

export interface DrawMatchesOptions {
  /**
   * Circles diameter in pixels.
   *
   * @default 10
   */
  circleDiameter?: number;
  /**
   * Annotations color.
   *
   * @default [255,0,0]
   */
  color?: number[];
  /**
   * Should the matches be colored depending on the distance?
   *
   * @default false
   */
  showDistance?: boolean;
  /**
   * Options for the coloring of the matches depending on their distance (useful if showDistance = true).
   */
  showDistanceOptions?: GetColorsOptions;
  /**
   * Maximal number of keypoints with best score to draw.
   *
   * @default matches.length
   */
  maxNbMatches?: number;
}

/**
 * Draw the the matches between two images on their montage.
 *
 * @param montage - The montage of two images to match.
 * @param matches - The matches between source and destination.
 * @param sourceKeypoints - Source keypoints.
 * @param destinationKeypoints - Destination keypoints.
 * @param options - Draw matches options.
 * @returns The comparison image.
 */
export function drawMatches(
  montage: Montage,
  matches: Match[],
  sourceKeypoints: FastKeypoint[],
  destinationKeypoints: FastKeypoint[],

  options: DrawMatchesOptions = {},
): Image {
  const {
    circleDiameter = 10,
    color = [255, 0, 0],
    showDistance = false,
    showDistanceOptions,
  } = options;
  let { maxNbMatches = matches.length } = options;

  if (maxNbMatches > matches.length) {
    maxNbMatches = matches.length;
  }

  const scaledSource = scaleKeypoints(sourceKeypoints, montage.scale);
  const scaledDestination = scaleKeypoints(destinationKeypoints, montage.scale);

  let result = montage.image;

  const colors = getColors(result, color, showDistanceOptions);

  const radius = Math.ceil(circleDiameter / 2);
  const matchesSortedByDistance = sortByDistance(matches);
  for (let i = 0; i < maxNbMatches; i++) {
    let matchColor = color;
    if (showDistance) {
      matchColor = getMatchColor(matchesSortedByDistance, i, colors);
    }
    const sourcePoint = scaledSource[matches[i].sourceIndex].origin;
    result.drawCircle(sourcePoint, radius, {
      color: matchColor,
      out: result,
    });

    const relativeDestinationPoint =
      scaledDestination[matches[i].destinationIndex].origin;

    const destinationPoint = {
      column:
        relativeDestinationPoint.column + montage.destinationOrigin.column,
      row: relativeDestinationPoint.row + montage.destinationOrigin.row,
    };
    result.drawCircle(destinationPoint, radius, {
      color: matchColor,
      out: result,
    });
    result.drawLine(sourcePoint, destinationPoint, {
      out: result,
      strokeColor: matchColor,
    });
  }

  return result;
}
