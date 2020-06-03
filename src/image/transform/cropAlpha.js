/**
 * Crops the image based on the alpha channel
 * This removes lines and columns where the alpha channel is lower than a threshold value.
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.threshold=this.maxValue]
 * @return {Image}
 */
export default function cropAlpha(options = {}) {
  this.checkProcessable('cropAlpha', {
    alpha: 1,
  });

  const { threshold = this.maxValue } = options;

  let left = findLeft(this, threshold, this.components);

  if (left === -1) {
    throw new Error(
      'Could not find new dimensions. Threshold may be too high.',
    );
  }

  let top = findTop(this, threshold, this.components, left);
  let bottom = findBottom(this, threshold, this.components, left);
  let right = findRight(this, threshold, this.components, left, top, bottom);

  return this.crop({
    x: left,
    y: top,
    width: right - left + 1,
    height: bottom - top + 1,
  });
}

function findLeft(image, threshold, channel) {
  for (let x = 0; x < image.width; x++) {
    for (let y = 0; y < image.height; y++) {
      if (image.getValueXY(x, y, channel) >= threshold) {
        return x;
      }
    }
  }
  return -1;
}

function findTop(image, threshold, channel, left) {
  for (let y = 0; y < image.height; y++) {
    for (let x = left; x < image.width; x++) {
      if (image.getValueXY(x, y, channel) >= threshold) {
        return y;
      }
    }
  }
  return -1;
}

function findBottom(image, threshold, channel, left) {
  for (let y = image.height - 1; y >= 0; y--) {
    for (let x = left; x < image.width; x++) {
      if (image.getValueXY(x, y, channel) >= threshold) {
        return y;
      }
    }
  }
  return -1;
}

function findRight(image, threshold, channel, left, top, bottom) {
  for (let x = image.width - 1; x >= left; x--) {
    for (let y = top; y <= bottom; y++) {
      if (image.getValueXY(x, y, channel) >= threshold) {
        return x;
      }
    }
  }
  return -1;
}
