import { inverse, Matrix } from 'ml-matrix';

import { Image, ImageCoordinates } from '../Image';
import { getClamp } from '../utils/clamp';
import { getBorderInterpolation, BorderType } from '../utils/interpolateBorder';
import {
  getInterpolationFunction,
  InterpolationType,
} from '../utils/interpolatePixel';

export interface TransformOptions {
  /**
   * Width of the output image.
   */
  width?: number;
  /**
   * Height of the output image.
   */
  height?: number;
  /**
   * Method to use to interpolate the new pixels
   *
   * @default InterpolationType.BILINEAR
   */

  interpolationType?: InterpolationType;
  /**
   * Specify how the borders should be handled.
   *
   * @default BorderType.CONSTANT
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is CONSTANT.
   *
   * @default 0
   */
  borderValue?: number;
  /**
   * Should the transform matrix be inverted?
   */
  inverse?: boolean;
  /*
    Bypasses width and height options to include
    every pixel of the original image inside the transformed image.
  */
  fullImage?: boolean;
}

/**
 * Transforms an image using a matrix.
 *
 * @param image - Original image.
 * @param transformMatrix - 2×3 transform matrix.
 * @param options - Transform options.
 * @returns The new image.
 */
export function transform(
  image: Image,
  transformMatrix: number[][],
  options: TransformOptions = {},
): Image {
  const {
    borderType = BorderType.CONSTANT,
    borderValue = 0,
    interpolationType = InterpolationType.BILINEAR,
    fullImage,
  } = options;
  let { width = image.width, height = image.height } = options;

  if (fullImage) {
    transformMatrix = transformMatrix.map((row) => row.slice());
    transformMatrix[0][2] = 0;
    transformMatrix[1][2] = 0;
    const corners = [
      image.getCoordinates(ImageCoordinates.TOP_LEFT),
      image.getCoordinates(ImageCoordinates.TOP_RIGHT),
      image.getCoordinates(ImageCoordinates.BOTTOM_RIGHT),
      image.getCoordinates(ImageCoordinates.BOTTOM_LEFT),
    ];

    corners[1][0] += 1;
    corners[2][0] += 1;
    corners[2][1] += 1;
    corners[3][1] += 1;

    const transformedCorners = corners.map((corner) => {
      return [
        transformPoint(transformMatrix[0], corner[0], corner[1]),
        transformPoint(transformMatrix[1], corner[0], corner[1]),
      ];
    });

    const xCoordinates = transformedCorners.map((c) => c[0]);
    const yCoordinates = transformedCorners.map((c) => c[1]);
    const maxX = Math.max(...xCoordinates);
    const maxY = Math.max(...yCoordinates);
    const minX = Math.min(...xCoordinates);
    const minY = Math.min(...yCoordinates);
    const center = [(image.width - 1) / 2, (image.height - 1) / 2];

    width = maxX - minX;
    height = maxY - minY;

    const centerX = transformPoint(transformMatrix[0], center[0], center[1]);
    const centerY = transformPoint(transformMatrix[1], center[0], center[1]);
    const a = (width - 1) / 2 - centerX;
    const b = (height - 1) / 2 - centerY;
    transformMatrix[0][2] = a;
    transformMatrix[1][2] = b;
    width = Math.round(width);
    height = Math.round(height);
  }

  if (
    transformMatrix.length !== 2 ||
    transformMatrix[0].length !== 3 ||
    transformMatrix[1].length !== 3
  ) {
    throw new Error(
      `transform: transformation matrix must be 2x3, found ${transformMatrix.length}x${transformMatrix[1].length}`,
    );
  }

  if (!options.inverse) {
    transformMatrix = [transformMatrix[0], transformMatrix[1], [0, 0, 1]];
    transformMatrix = inverse(new Matrix(transformMatrix)).to2DArray();
  }
  const newImage = Image.createFrom(image, {
    width,
    height,
  });

  const interpolateBorder = getBorderInterpolation(borderType, borderValue);
  const clamp = getClamp(newImage);

  const interpolate = getInterpolationFunction(interpolationType);
  for (let row = 0; row < newImage.height; row++) {
    for (let column = 0; column < newImage.width; column++) {
      const nx = transformPoint(transformMatrix[0], column, row);
      const ny = transformPoint(transformMatrix[1], column, row);
      for (let channel = 0; channel < newImage.channels; channel++) {
        const newValue = interpolate(
          image,
          nx,
          ny,
          channel,
          interpolateBorder,
          clamp,
        );
        newImage.setValue(column, row, channel, newValue);
      }
    }
  }

  return newImage;
}

/**
 * Apply a transformation to a point.
 *
 * @param transform - Transformation matrix.
 * @param column - Column of the point.
 * @param row - Row of the point.
 * @returns New value.
 */
function transformPoint(
  transform: number[],
  column: number,
  row: number,
): number {
  return transform[0] * column + transform[1] * row + transform[2];
}
