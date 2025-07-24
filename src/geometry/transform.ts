import { Matrix, inverse } from 'ml-matrix';

import { Image } from '../Image.js';
import { getClamp } from '../utils/clamp.js';
import type { BorderType } from '../utils/interpolateBorder.js';
import { getBorderInterpolation } from '../utils/interpolateBorder.js';
import type { InterpolationType } from '../utils/interpolatePixel.js';
import { getInterpolationFunction } from '../utils/interpolatePixel.js';

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
   * Method to use to interpolate the new pixels.
   * @default `'bilinear'`
   */

  interpolationType?: InterpolationType;
  /**
   * Specify how the borders should be handled.
   * @default `'constant'`
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is 'constant'.
   *  @default `0`
   */
  borderValue?: number;
  /**
   * Whether the transform matrix should be inverted.
   */
  inverse?: boolean;
  /**
   * Bypasses width and height options to include
   * every pixel of the original image inside the transformed image.
   */
  fullImage?: boolean;
}

/**
 * Transforms an image using a matrix.
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
    borderType = 'constant',
    borderValue = 0,
    interpolationType = 'bilinear',
    fullImage,
  } = options;
  let { width = image.width, height = image.height } = options;

  if (!isValidMatrix(transformMatrix)) {
    throw new TypeError(
      `transformation matrix must be 2x3 or 3x3. Received ${transformMatrix.length}x${transformMatrix[1].length}`,
    );
  }
  if (transformMatrix.length === 2) {
    transformMatrix.push([0, 0, 1]);
  }

  if (fullImage) {
    transformMatrix = transformMatrix.map((row) => row.slice());
    transformMatrix[0][2] = 0;
    transformMatrix[1][2] = 0;
    const corners = [
      image.getCoordinates('top-left'),
      image.getCoordinates('top-right'),
      image.getCoordinates('bottom-right'),
      image.getCoordinates('bottom-left'),
    ];

    corners[1].column += 1;
    corners[2].column += 1;
    corners[2].row += 1;
    corners[3].row += 1;

    const transformedCorners = corners.map((corner) => {
      return [
        transformPoint(
          transformMatrix[0],
          transformMatrix[2],
          corner.column,
          corner.row,
        ),
        transformPoint(
          transformMatrix[1],
          transformMatrix[2],
          corner.column,
          corner.row,
        ),
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

    const centerX = transformPoint(
      transformMatrix[0],
      transformMatrix[2],
      center[0],
      center[1],
    );
    const centerY = transformPoint(
      transformMatrix[1],
      transformMatrix[2],
      center[0],
      center[1],
    );
    const a = (width - 1) / 2 - centerX;
    const b = (height - 1) / 2 - centerY;
    transformMatrix[0][2] = a;
    transformMatrix[1][2] = b;
    width = Math.round(width);
    height = Math.round(height);
  }

  if (!options.inverse) {
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
      const nx = transformPoint(
        transformMatrix[0],
        transformMatrix[2],
        column,
        row,
      );
      const ny = transformPoint(
        transformMatrix[1],
        transformMatrix[2],
        column,
        row,
      );
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
 * @param transform - Transformation matrix.
 * @param perspective - Perspective matrix.
 * @param column - Column of the point.
 * @param row - Row of the point.
 * @returns New value.
 */
function transformPoint(
  transform: number[],
  perspective: number[],
  column: number,
  row: number,
): number {
  return (
    (transform[0] * column + transform[1] * row + transform[2]) /
    (perspective[0] * column + perspective[1] * row + perspective[2])
  );
}

function isValidMatrix(transformationMatrix: number[][]) {
  return (
    (transformationMatrix.length === 3 &&
      transformationMatrix[0].length === 3 &&
      transformationMatrix[1].length === 3 &&
      transformationMatrix[2].length === 3) ||
    (transformationMatrix.length === 2 &&
      transformationMatrix[0].length === 3 &&
      transformationMatrix[1].length === 3)
  );
}
