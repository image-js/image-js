import { Image, ImageCoordinates } from '../Image';
import { InterpolationType, BorderType } from '../types';

import { transform } from './transform';

interface IRotateOptions {
  center?: ImageCoordinates | [number, number];
  scale?: number;
  width?: number;
  height?: number;
  /*
    Bypasses width, height, and center options to include
    every pixel of the original image inside the rotated image
  */
  fullImage?: boolean;
  interpolationType?: InterpolationType;
  borderType?: BorderType;
  borderValue?: number;
}

export function rotate(
  image: Image,
  angle: number,
  options: IRotateOptions
): Image {
  const center = options.center || ImageCoordinates.CENTER;
  const scale = options.scale || 1;
  const width = options.width;
  const height = options.height;

  let centerCoordinates;
  if (typeof center === 'string') {
    centerCoordinates = image.getCoordinates(center);
  } else {
    centerCoordinates = center;
  }
  const transformMatrix = getRotationMatrix(angle, centerCoordinates, scale);

  return transform(image, transformMatrix, {
    width,
    height,
    borderType: options.borderType,
    interpolationType: options.interpolationType,
    borderValue: options.borderValue,
    fullImage: options.fullImage
  });
}

function getRotationMatrix(
  angle: number,
  center: [number, number],
  scale: number
): number[][] {
  const angleRadians = (angle * Math.PI) / 180;
  const alpha = scale * Math.cos(angleRadians);
  const beta = scale * Math.sin(angleRadians);
  return [
    [alpha, beta, (1 - alpha) * center[0] - beta * center[1]],
    [-beta, alpha, beta * center[0] + (1 - alpha) * center[1]]
  ];
}
