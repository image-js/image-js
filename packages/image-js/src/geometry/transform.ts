import { inverse, Matrix } from 'ml-matrix';

import { Image } from '../Image';
import { getInterpolationFunction } from '../utils/interpolatePixel';
import { InterpolationType, BorderType } from '../types';

interface ITransformOptions {
  width?: number;
  height?: number;
  interpolationType?: InterpolationType;
  borderType?: BorderType;
  inverse?: boolean;
  borderValue?: number;
}

export function transform(
  image: Image,
  transform: number[][],
  options: ITransformOptions = {}
): Image {
  const width = options.width || image.width;
  const height = options.height || image.height;
  const borderType = options.borderType || BorderType.CONSTANT;
  const borderValue = options.borderValue || 0;
  const interpolationType =
    options.interpolationType || InterpolationType.NEAREST;
  if (
    transform.length !== 2 ||
    transform[0].length !== 3 ||
    transform[1].length !== 3
  ) {
    throw new Error(
      `transformation matrix must be 2x3, found ${transform.length}x${
        transform[0].length
      }`
    );
  }

  if (!options.inverse) {
    transform = [transform[0], transform[1], [0, 0, 1]];
    transform = inverse(new Matrix(transform)).to2DArray();
  }
  const newImage = Image.createFrom(image, {
    width,
    height
  });

  const interpolate = getInterpolationFunction(interpolationType);
  const hFactor = newImage.width * newImage.channels;
  for (let y = 0; y < newImage.height; y++) {
    const hOffset = hFactor * y;
    for (let x = 0; x < newImage.width; x++) {
      const wOffset = hOffset + x * image.channels;
      const nx = transformPointX(transform, x, y);
      const ny = transformPointY(transform, x, y);
      for (let c = 0; c < newImage.channels; c++) {
        const newValue = interpolate(image, nx, ny, c, borderType, borderValue);
        newImage.data[wOffset + c] = newValue;
      }
    }
  }

  return newImage;
}

function transformPointX(transform: number[][], x: number, y: number): number {
  return transform[0][0] * x + transform[0][1] * y + transform[0][2];
}

function transformPointY(transform: number[][], x: number, y: number): number {
  return transform[1][0] * x + transform[1][1] * y + transform[1][2];
}
