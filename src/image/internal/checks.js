export function checkRow(image, row) {
  if (row < 0 || row >= image.height) {
    throw new RangeError(
      `row must be included between 0 and ${
        image.height - 1
      }. Current value: ${row}`,
    );
  }
}

export function checkColumn(image, column) {
  if (column < 0 || column >= image.width) {
    throw new RangeError(
      `column must be included between 0 and ${
        image.width - 1
      }. Current value: ${column}`,
    );
  }
}

export function checkChannel(image, channel) {
  if (channel < 0 || channel >= image.channels) {
    throw new RangeError(
      `channel must be included between 0 and ${
        image.channels - 1
      }. Current value: ${channel}`,
    );
  }
}

/**
 * @typedef {('nearestNeighbor'|'bilinear')} InterpolationAlgorithm
 */
export const validInterpolations = {
  nearestneighbor: 'nearestNeighbor',
  nearestneighbour: 'nearestNeighbor',
  bilinear: 'bilinear',
};

export function checkInterpolation(interpolation) {
  if (typeof interpolation !== 'string') {
    throw new TypeError('interpolation must be a string');
  }
  interpolation = interpolation.toLowerCase();
  if (!validInterpolations[interpolation]) {
    throw new RangeError(`invalid interpolation algorithm: ${interpolation}`);
  }
  return validInterpolations[interpolation];
}
