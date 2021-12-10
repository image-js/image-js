import { IJS } from '../src';

/**
 * Create a new Mask object from mask data.
 *
 * @param data - Mask data.
 * @returns The new mask.
 */
export function createMask(data: number[][] | string): IJS {
  if (Array.isArray(data)) {
    return createMaskFrom2DArray(data);
  } else {
    return createMaskFromString(data);
  }
}

/**
 * Create a new Mask object from a 2D matrix.
 *
 * @param data - Mask data.
 * @returns The new mask.
 */
function createMaskFrom2DArray(data: number[][]): IJS {
  const height = data.length;
  const width = data[0].length;
  const imageData = new Uint8Array(height * width);
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      imageData[row * width + col] = data[row][col];
    }
  }
  return new IJS(width, height, {
    data: imageData,
  });
}

/**
 * Create a new Mask object from data encoded in a string.
 *
 * @param data - Mask data.
 * @returns The new mask.
 */
function createMaskFromString(data: string): IJS {
  const trimmed = data.trim();
  const lines = trimmed.split('\n');
  const height = lines.length;
  const width = lines[0].trim().split(/[^0-9]+/).length;
  const imageData = new Uint8Array(height * width);
  for (let row = 0; row < height; row++) {
    const line = lines[row].trim();
    const values = line.split(/[^0-9]+/).map((v) => parseInt(v, 10));

    if (values.length !== width) {
      throw new Error(
        `length of row ${row} (${values.length}) does not match width (${width})`,
      );
    }

    for (let col = 0; col < width; col++) {
      imageData[row * width + col] = values[col];
    }
  }

  return new IJS(width, height, {
    data: imageData,
  });
}
