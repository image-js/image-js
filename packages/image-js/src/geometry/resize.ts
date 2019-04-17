import { Image } from '../Image';
import { InterpolationType, BorderType } from '../types';
import { getInterpolationFunction } from '../utils/interpolatePixel';
import { getBorderInterpolation } from '../utils/interpolateBorder';
import { getClamp } from '../utils/clamp';

export interface IResizeOptions {
  width?: number;
  height?: number;
  xFactor?: number;
  yFactor?: number;
  preserveAspectRatio?: boolean;
  interpolationType?: InterpolationType;
  borderType?: BorderType;
  borderValue?: number;
}

export function resize(image: Image, options: IResizeOptions): Image {
  const {
    interpolationType = InterpolationType.BILINEAR,
    borderType = BorderType.CONSTANT,
    borderValue = 0
  } = options;
  const { width, height } = checkOptions(image, options);
  const newImage = Image.createFrom(image, { width, height });
  const interpolate = getInterpolationFunction(interpolationType);
  const interpolateBorder = getBorderInterpolation(borderType, borderValue);
  const clamp = getClamp(newImage);
  const hFactor = newImage.width * newImage.channels;
  const intervalX = (image.width - 1) / (width - 1);
  const intervalY = (image.height - 1) / (height - 1);
  for (let y = 0; y < newImage.height; y++) {
    const hOffset = hFactor * y;
    for (let x = 0; x < newImage.width; x++) {
      const wOffset = hOffset + x * image.channels;
      const nx = x * intervalX;
      const ny = y * intervalY;
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

function checkOptions(
  image: Image,
  options: IResizeOptions
): { width: number; height: number; xFactor: number; yFactor: number } {
  const {
    width,
    height,
    xFactor,
    yFactor,
    preserveAspectRatio = true
  } = options;

  if (
    width === undefined &&
    height === undefined &&
    xFactor === undefined &&
    yFactor === undefined
  ) {
    throw new Error(
      'At least one of the width, height, xFactor or yFactor options must be passed'
    );
  }

  let newWidth: number;
  let newHeight: number;

  const maybeWidth = getSize(width, xFactor, image.width, preserveAspectRatio);
  const maybeHeight = getSize(
    height,
    yFactor,
    image.height,
    preserveAspectRatio
  );

  if (maybeWidth === undefined) {
    if (maybeHeight !== undefined) {
      newWidth = Math.round(maybeHeight * (image.width / image.height));
    } else {
      throw new Error('UNREACHABLE');
    }
  } else {
    newWidth = maybeWidth;
  }

  if (maybeHeight === undefined) {
    if (maybeWidth !== undefined) {
      newHeight = Math.round(maybeWidth * (image.height / image.width));
    } else {
      throw new Error('UNREACHABLE');
    }
  } else {
    newHeight = maybeHeight;
  }

  return {
    width: newWidth,
    height: newHeight,
    xFactor: xFactor ? xFactor : newWidth / image.width,
    yFactor: yFactor ? yFactor : newHeight / image.height
  };
}

function getSize(
  sizeOpt: number | undefined,
  factor: number | undefined,
  sizeImg: number,
  preserveAspectRatio: boolean
): number | undefined {
  if (sizeOpt === undefined) {
    if (factor !== undefined) {
      return Math.round(sizeImg * factor);
    } else if (!preserveAspectRatio) {
      return sizeImg;
    }
  } else if (factor !== undefined) {
    throw new Error('factor must not be passed with size');
  } else {
    return sizeOpt;
  }
  return undefined;
}
