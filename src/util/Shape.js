import Image from '../image/Image';
import { BINARY } from '../image/core/kindNames';

import zerosMatrix from './zerosMatrix';

const cross = [
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
];

const smallCross = [
  [0, 1, 0],
  [1, 1, 1],
  [0, 1, 0],
];

/**
 * Class representing a shape
 * @class Shape
 * @param {object} [options]
 * @param {string} [options.kind='cross'] - Predefined matrix shape, 'cross' or 'smallCross'
 * @param {string} [options.shape] - Value may be 'square', 'rectangle', 'circle', 'ellipse' or 'triangle'
 *                                  The size of the shape will be determined by the size, width and height.
 *                                  A Shape is by default filled.
 * @param {number} [options.size]
 * @param {number} [options.width=options.size] - width of the shape. Must be odd.
 * @param {number} [options.height=options.size] - width of the shape. Must be odd.
 * @param {boolean} [options.filled=true] - If false only the border ot the shape is taken into account.
 */
export default class Shape {
  constructor(options = {}) {
    let { kind = 'cross', shape, size, width, height, filled = true } = options;
    if (size) {
      width = size;
      height = size;
    }

    if (shape) {
      switch (shape.toLowerCase()) {
        case 'square':
        case 'rectangle':
          this.matrix = rectangle(width, height, { filled });
          break;
        case 'circle':
        case 'ellipse':
          this.matrix = ellipse(width, height, { filled });
          break;
        case 'triangle':
          this.matrix = triangle(width, height, { filled });
          break;
        default:
          throw new Error(`Shape: unexpected shape: ${shape}`);
      }
    } else if (kind) {
      switch (kind.toLowerCase()) {
        case 'cross':
          this.matrix = cross;
          break;
        case 'smallcross':
          this.matrix = smallCross;
          break;
        default:
          throw new Error(`Shape: unexpected kind: ${kind}`);
      }
    } else {
      throw new Error('Shape: expected a kind or a shape option');
    }
    this.height = this.matrix.length;
    this.width = this.matrix[0].length;
    this.halfHeight = (this.height / 2) >> 0;
    this.halfWidth = (this.width / 2) >> 0;
  }

  /**
   * Returns an array of [x,y] points
   * @return {Array<Array<number>>} - Array of [x,y] points
   */
  getPoints() {
    let matrix = this.matrix;
    let points = [];
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[0].length; x++) {
        if (matrix[y][x]) {
          points.push([x - this.halfWidth, y - this.halfHeight]);
        }
      }
    }
    return points;
  }

  /**
   * Returns a Mask (1 bit Image) corresponding to this shape.
   * @return {Image}
   */
  getMask() {
    let img = new Image(this.width, this.height, {
      kind: BINARY,
    });
    for (let y = 0; y < this.matrix.length; y++) {
      for (let x = 0; x < this.matrix[0].length; x++) {
        if (this.matrix[y][x]) {
          img.setBitXY(x, y);
        }
      }
    }
    return img;
  }
}

function rectangle(width, height, options) {
  const matrix = zerosMatrix(height, width);
  if (options.filled) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        matrix[y][x] = 1;
      }
    }
  } else {
    for (let y of [0, height - 1]) {
      for (let x = 0; x < width; x++) {
        matrix[y][x] = 1;
      }
    }
    for (let y = 0; y < height; y++) {
      for (let x of [0, width - 1]) {
        matrix[y][x] = 1;
      }
    }
  }

  return matrix;
}

function ellipse(width, height, options) {
  const matrix = zerosMatrix(height, width, options);
  let yEven = 1 - (height % 2);
  let xEven = 1 - (width % 2);
  let a = Math.floor((width - 1) / 2); // horizontal ellipse axe
  let b = Math.floor((height - 1) / 2); // vertical ellipse axe
  let a2 = a * a;
  let b2 = b * b;
  if (options.filled) {
    for (let y = 0; y <= b; y++) {
      let shift = Math.floor(Math.sqrt(a2 - (a2 * y * y) / b2));
      for (let x = a - shift; x <= a; x++) {
        matrix[b - y][x] = 1;
        matrix[b + y + yEven][x] = 1;
        matrix[b - y][width - x - 1] = 1;
        matrix[b + y + yEven][width - x - 1] = 1;
      }
    }
  } else {
    for (let y = 0; y <= b; y++) {
      let shift = Math.floor(Math.sqrt(a2 - (a2 * y * y) / b2));
      let x = a - shift;
      matrix[b - y][x] = 1;
      matrix[b + y + yEven][x] = 1;
      matrix[b - y][width - x - 1] = 1;
      matrix[b + y + yEven][width - x - 1] = 1;
    }

    for (let x = 0; x <= a; x++) {
      let shift = Math.floor(Math.sqrt(b2 - (b2 * x * x) / a2));
      let y = b - shift;
      matrix[y][a - x] = 1;
      matrix[y][a + x + xEven] = 1;
      matrix[height - y - 1][a - x] = 1;
      matrix[height - y - 1][a + x + xEven] = 1;
    }
  }
  return matrix;
}

function triangle(width, height, options) {
  if (!options.filled) {
    throw new Error('Non filled triangle is not implemented');
  }
  const matrix = zerosMatrix(height, width, options);
  for (let y = 0; y < height; y++) {
    let shift = Math.floor(((1 - y / height) * width) / 2);
    for (let x = shift; x < width - shift; x++) {
      matrix[y][x] = 1;
    }
  }
  return matrix;
}
