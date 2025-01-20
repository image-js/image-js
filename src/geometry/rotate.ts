import { Image } from '../Image.js';

export type RotateAngle = 90 | 180 | 270 | -90 | -180 | -270;

/**
 * Rotates an image in multiples of 90 degrees.
 * @param image - The image to rotate.
 * @param angle - The angle to rotate the image by. Positive values rotate clockwise, negative values rotate counter-clockwise.
 * @returns - The rotated image.
 */
export function rotate(image: Image, angle: RotateAngle): Image {
  const newWidth = angle % 180 === 0 ? image.width : image.height;
  const newHeight = angle % 180 === 0 ? image.height : image.width;
  const newImage = Image.createFrom(image, {
    width: newWidth,
    height: newHeight,
  });

  if (angle === 90 || angle === -270) {
    for (let column = 0; column < image.width; column++) {
      for (let row = 0; row < image.height; row++) {
        for (let channel = 0; channel < image.channels; channel++) {
          newImage.setValue(
            newImage.width - row - 1,
            column,
            channel,
            image.getValue(column, row, channel),
          );
        }
      }
    }
  } else if (angle === 180 || angle === -180) {
    for (let column = 0; column < image.width; column++) {
      for (let row = 0; row < image.height; row++) {
        for (let channel = 0; channel < image.channels; channel++) {
          newImage.setValue(
            newImage.width - column - 1,
            newImage.height - row - 1,
            channel,
            image.getValue(column, row, channel),
          );
        }
      }
    }
  } else if (angle === 270 || angle === -90) {
    for (let column = 0; column < image.width; column++) {
      for (let row = 0; row < image.height; row++) {
        for (let channel = 0; channel < image.channels; channel++) {
          newImage.setValue(
            row,
            newImage.height - column - 1,
            channel,
            image.getValue(column, row, channel),
          );
        }
      }
    }
  } else {
    throw new RangeError(`invalid angle: ${angle}`);
  }

  return newImage;
}
