import { inverse, Matrix } from 'ml-matrix';

import { Image, ImageCoordinates } from '../Image';
import { getInterpolationFunction } from '../utils/interpolatePixel';
import { InterpolationType, BorderType } from '../types';
import { getBorderInterpolation } from '../utils/interpolateBorder';
import { getClamp } from '../utils/clamp';

export interface ITransformOptions {
  width?: number;
  height?: number;
  interpolationType?: InterpolationType;
  borderType?: BorderType;
  inverse?: boolean;
  borderValue?: number;
  fullImage?: boolean;
}

export function transform(
  image: Image,
  transformMatrix: number[][],
  options: ITransformOptions = {}
): Image {
  const {
    borderType = BorderType.CONSTANT,
    borderValue = 0,
    interpolationType = InterpolationType.BILINEAR
  } = options;
  let { width = image.width, height = image.height } = options;

  if (options.fullImage) {
    transformMatrix = transformMatrix.map((row) => row.slice());
    transformMatrix[0][2] = 0;
    transformMatrix[1][2] = 0;
    const corners = [
      image.getCoordinates(ImageCoordinates.TOP_LEFT),
      image.getCoordinates(ImageCoordinates.TOP_RIGHT),
      image.getCoordinates(ImageCoordinates.BOTTOM_RIGHT),
      image.getCoordinates(ImageCoordinates.BOTTOM_LEFT)
    ];

    corners[1][0] += 1;
    corners[2][0] += 1;
    corners[2][1] += 1;
    corners[3][1] += 1;

    const transformedCorners = corners.map((corner) => {
      return [
        transformPoint(transformMatrix[0], corner[0], corner[1]),
        transformPoint(transformMatrix[1], corner[0], corner[1])
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
      `transformation matrix must be 2x3, found ${transformMatrix.length}x${
        transformMatrix[1].length
      }`
    );
  }

  if (!options.inverse) {
    transformMatrix = [transformMatrix[0], transformMatrix[1], [0, 0, 1]];
    transformMatrix = inverse(new Matrix(transformMatrix)).to2DArray();
  }
  const newImage = Image.createFrom(image, {
    width,
    height
  });

  const interpolateBorder = getBorderInterpolation(borderType, borderValue);
  const clamp = getClamp(newImage);

  const interpolate = getInterpolationFunction(interpolationType);
  const hFactor = newImage.width * newImage.channels;
  for (let y = 0; y < newImage.height; y++) {
    const hOffset = hFactor * y;
    for (let x = 0; x < newImage.width; x++) {
      const wOffset = hOffset + x * image.channels;
      const nx = transformPoint(transformMatrix[0], x, y);
      const ny = transformPoint(transformMatrix[1], x, y);
      for (let c = 0; c < newImage.channels; c++) {
        const newValue = interpolate(
          image,
          nx,
          ny,
          c,
          interpolateBorder,
          clamp
        );
        newImage.data[wOffset + c] = newValue;
      }
    }
  }

  return newImage;
}

function transformPoint(transform: number[], x: number, y: number): number {
  return transform[0] * x + transform[1] * y + transform[2];
}
