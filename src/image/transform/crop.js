import Image from '../Image';

/**
 * Crops the image
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.x=0] - x coordinate to place the zero of the new image
 * @param {number} [options.y=0] - y coordinate to place the zero of the new image
 * @param {number} [options.width=this.width-x] - width of the new image
 * @param {number} [options.height=this.height-y] - height of the new image
 * @return {Image} The new cropped image
 * @example
 * var cropped = image.crop({
 *   x:0,
 *   y:0
 * });
 */
export default function crop(options = {}) {
  let {
    x = 0,
    y = 0,
    width = this.width - x,
    height = this.height - y,
  } = options;
  this.checkProcessable('crop', {
    bitDepth: [1, 8, 16],
  });
  x = Math.round(x);
  y = Math.round(y);
  width = Math.round(width);
  height = Math.round(height);

  if (x > this.width - 1 || y > this.height - 1) {
    throw new RangeError(
      `crop: origin (x:${x}, y:${y}) out of range (${this.width - 1}; ${
        this.height - 1
      })`,
    );
  }

  if (width <= 0 || height <= 0) {
    throw new RangeError(
      `crop: width and height (width:${width}; height:${height}) must be positive numbers`,
    );
  }

  if (x < 0 || y < 0) {
    throw new RangeError(
      `crop: x and y (x:${x}, y:${y}) must be positive numbers`,
    );
  }

  if (width > this.width - x || height > this.height - y) {
    throw new RangeError(
      `crop: (x: ${x}, y:${y}, width:${width}, height:${height}) size is out of range`,
    );
  }

  let result = this;
  if (this.bitDepth === 1) {
    const newImage = new Image(width, height, {
      kind: 'BINARY',
      parent: this,
    });
    result = cropBinary(this, newImage, x, y, width, height);
  } else {
    const newImage = Image.createFrom(this, {
      width,
      height,
      position: [x, y],
    });
    result = cropDefault(this, newImage, x, y, width, height);
  }

  return result;
}

function cropDefault(img, newImage, x, y, width, height) {
  let xWidth = width * img.channels;
  let y1 = y + height;
  let ptr = 0; // pointer for new array

  let jLeft = x * img.channels;

  for (let i = y; i < y1; i++) {
    let j = i * img.width * img.channels + jLeft;
    let jL = j + xWidth;

    for (; j < jL; j++) {
      newImage.data[ptr++] = img.data[j];
    }
  }

  return newImage;
}

function cropBinary(img, newImage, x, y, width, height) {
  let xWidth = width * img.channels;
  let y1 = y + height;
  let ptr = 0; // pointer for new array

  let jLeft = x * img.channels;

  for (let i = y; i < y1; i++) {
    let j = i * img.width * img.channels + jLeft;
    let jL = j + xWidth;

    for (; j < jL; j++) {
      if (img.getBit(j)) {
        newImage.setBit(ptr);
      }
      ++ptr;
    }
  }

  return newImage;
}
