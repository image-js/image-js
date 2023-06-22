import { getAffineTransform as matrixGetAffineTransform } from 'ml-affine-transform';
import { ransac } from 'ml-ransac';

import { Point, Image, writeSync, ImageColorModel } from '../..';
import {
  Match,
  Montage,
  MontageDisposition,
  bruteForceOneMatch,
  getCrosscheckMatches,
} from '../../featureMatching';
import { getBrief } from '../../featureMatching/descriptors/getBrief';
import { filterEuclideanDistance } from '../../featureMatching/matching/filterEuclideanDistance';
import { getMinMax } from '../../utils/getMinMax';

import { affineFitFunction } from './affineFitFunction';
import { createAffineTransformModel } from './createAffineTransformModel';
import { getEuclideanDistance } from './getEuclideanDistance';
import { getMatrixFromPoints } from './getMatrixFromPoints';

export interface GetAffineTransformOptions {
  /**
   * @default 31
   */
  centroidPatchDiameter?: number;
  /**
   * @default 10
   */
  bestKeypointRadius?: number;
  /**
   * Should only the crossckeck matches be considered.
   * @default true
   */
  crosscheck?: boolean;
  /**
   * Should the contrast of the images be enhanced before feature matching.
   * @default true
   */
  enhanceContrast?: boolean;
  /**
   * Margin in pixels all around the destination image. This margin is removed for
   * the contrast improvement.
   * @default 0
   */
  sourceMargin?: number;
  /**
   * Origin of the destination image relative to the top-left corner of the source image.
   * Roughly indicates the position of the destination image in the source image.
   * @default { column: 0, row: 0 }
   */
  destinationOrigin?: Point;
  /**
   * Max number of iterations of the ransac algorithm.
   */
  maxRansacNbIterations?: number;
  /**
   * Save images with matches for debugging.
   * @default false
   */
  debug?: boolean;
  /**
   * Path of the debug image.
   * @default `${__dirname}/montage.png`
   */
  debugImagePath?: string;
}

export interface AffineTransform {
  /**
   * Translation of source points along x and y axes.
   */
  translation: Point;
  /**
   * Clockwise angle in degrees.
   */
  rotation: number;
  /**
   * Scaling factor from source to destination.
   */
  scale: number;
}

export interface GetAffineTransformResult {
  /**
   * Affine transformation from source to destination.
   */
  transform: AffineTransform;
  stats: {
    /**
     * Number of matches of feature matching between source and destination.
     * The bigger this number is, the better.
     */
    nbMatches: number;
    /**
     * Number of inliers resulting from the ransac algorithm.
     */
    nbInliers: number;
    /**
     * Number of iterations of the RANSAC algorithm.
     */
    nbRansacIterations: number;
    /**
     * Number of source keypoints used for matching.
     */
    nbSourceKeypoints: number;
    /**
     * Number of destination keypoints used for matching.
     */
    nbDestinationKeypoints: number;
  };
}

/**
 * Get the affine transformation from the source to the destination image.
 * @param source - Source image. Should be the image to align on the reference image.
 * It can have an additional margin, specified in the options.
 * @param destination - Destination image. Should be the reference image.
 * @param options - Get destination translation options.
 * @returns The affine transformation from source to destination image.
 */
export function getAffineTransform(
  source: Image,
  destination: Image,
  options: GetAffineTransformOptions = {},
): GetAffineTransformResult {
  const {
    centroidPatchDiameter = 31,
    bestKeypointRadius = 5,
    sourceMargin = 0,
    enhanceContrast = true,
    crosscheck = true,
    destinationOrigin = { column: 0, row: 0 },
    maxRansacNbIterations,
    debug = false,
    debugImagePath = `${__dirname}/montage.png`,
  } = options;

  if (source.colorModel !== ImageColorModel.GREY) {
    source = source.grey();
  }
  if (destination.colorModel !== ImageColorModel.GREY) {
    destination = destination.grey();
  }

  // enhance images contrast
  if (enhanceContrast) {
    const sourceWithoutMargin = source.crop({
      origin: { row: sourceMargin, column: sourceMargin },
      width: source.width - 2 * sourceMargin,
      height: source.height - 2 * sourceMargin,
    });

    const sourceExtremums = getMinMax(sourceWithoutMargin);
    source.level({
      inputMin: sourceExtremums.min[0],
      inputMax: sourceExtremums.max[0],
      out: source,
    });

    const destinationExtremums = getMinMax(destination);
    destination.level({
      inputMin: destinationExtremums.min[0],
      inputMax: destinationExtremums.max[0],
      out: destination,
    });
  } // compute briefs

  const sourceBrief = getBrief(source, {
    centroidPatchDiameter,
    bestKptRadius: bestKeypointRadius,
  });
  const destinationBrief = getBrief(destination, {
    centroidPatchDiameter,
    bestKptRadius: bestKeypointRadius,
  });

  const nbSourceKeypoints = sourceBrief.keypoints.length;
  const nbDestinationKeypoints = destinationBrief.keypoints.length;

  // match reference and destination keypoints
  let matches: Match[] = [];
  if (crosscheck) {
    matches = getCrosscheckMatches(
      sourceBrief.descriptors,
      destinationBrief.descriptors,
    );
  } else {
    matches = bruteForceOneMatch(
      sourceBrief.descriptors,
      destinationBrief.descriptors,
    );

    matches = filterEuclideanDistance(
      matches,
      sourceBrief.keypoints,
      destinationBrief.keypoints,
      { origin: destinationOrigin },
    );
  }

  if (matches.length < 2) {
    throw new Error(
      'Insufficient number of matches found to compute affine transform (less than 2).',
    );
  }

  // extract source and destination points
  let sourcePoints: Point[] = [];
  let destinationPoints: Point[] = [];
  for (const match of matches) {
    sourcePoints.push(sourceBrief.keypoints[match.sourceIndex].origin);
    destinationPoints.push(
      destinationBrief.keypoints[match.destinationIndex].origin,
    );
  }

  // find inliers with ransac
  let nbInliers = sourcePoints.length;
  let nbRansacIterations = 0;
  let inliers: number[] = [0, 1];
  if (sourcePoints.length > 2) {
    const ransacResult = ransac(sourcePoints, destinationPoints, {
      distanceFunction: getEuclideanDistance,
      modelFunction: createAffineTransformModel,
      fitFunction: affineFitFunction,
      maxNbIterations: maxRansacNbIterations,
    });
    nbRansacIterations = ransacResult.nbIterations;

    inliers = ransacResult.inliers;
    nbInliers = inliers.length;

    const newSrcPoints = [];
    const newDstPoints = [];
    for (let inlier of inliers) {
      newSrcPoints.push(sourcePoints[inlier]);
      newDstPoints.push(destinationPoints[inlier]);
    }
    sourcePoints = newSrcPoints;
    destinationPoints = newDstPoints;
  }

  // create debug image
  if (debug) {
    const montage = new Montage(source, destination, {
      disposition: MontageDisposition.VERTICAL,
    });

    montage.drawMatches(
      matches,
      sourceBrief.keypoints,
      destinationBrief.keypoints,
      { showDistance: true },
    );

    const inlierMatches: Match[] = [];

    for (let inlier of inliers) {
      inlierMatches.push(matches[inlier]);
    }

    montage.drawMatches(
      inlierMatches,
      sourceBrief.keypoints,
      destinationBrief.keypoints,
      { color: [0, 0, 255] },
    );

    const drawKeypointsBaseOptions = {
      fill: true,
      color: [0, 255, 0],
      showScore: true,
      markerSize: 3,
    };

    montage.drawKeypoints(sourceBrief.keypoints, drawKeypointsBaseOptions);
    montage.drawKeypoints(destinationBrief.keypoints, {
      origin: montage.destinationOrigin,
      ...drawKeypointsBaseOptions,
    });

    writeSync(debugImagePath, montage.image);
  }

  // compute affine transform from destination to reference
  const sourceMatrix = getMatrixFromPoints(sourcePoints);
  const destinationMatrix = getMatrixFromPoints(destinationPoints);
  const affineTransform = matrixGetAffineTransform(
    sourceMatrix,
    destinationMatrix,
  );

  return {
    transform: {
      rotation: affineTransform.rotation,
      scale: affineTransform.scale,
      translation: {
        column: Math.round(affineTransform.translation.x),
        row: Math.round(affineTransform.translation.y),
      },
    },
    stats: {
      nbMatches: matches.length,
      nbInliers,
      nbRansacIterations,
      nbSourceKeypoints,
      nbDestinationKeypoints,
    },
  };
}
