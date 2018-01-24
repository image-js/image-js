import Shape from '../../util/Shape';
import { getColors } from '../../util/color';

/**
 * Paint pixels on the current image.
 * @memberof Image
 * @instance
 * @param {Array<Array<number>>} points - Array of [x,y] points
 * @param {object} [options]
 * @param {Array<number>|string}     [options.color] - Array of 3 elements (R, G, B) or a valid css color.
 * @param {Array<Array<number>>|Array<string>} [options.colors] - Array of Array of 3 elements (R, G, B) for each color of each mask
 * @param {boolean}             [options.randomColors=true] - To paint each mask with a random color if color and colors are undefined
 * @param {boolean}             [options.distinctColors=false] - To paint each mask with a different color if color and colors are undefined
 * @param {object} [options.shape] - Definition of the shape, see Shape contructor.
 * @return {this} The original painted image
 */
export default function paintPoints(points, options = {}) {
  let {
    shape
  } = options;

  this.checkProcessable('paintPoints', {
    bitDepth: [8, 16]
  });

  let colors = getColors(Object.assign({}, options, { numberColors: points.length }));

  let shapePixels = (new Shape(shape)).getPoints();

  let numberChannels = Math.min(this.channels, colors[0].length);

  for (let i = 0; i < points.length; i++) {
    let color = colors[i % colors.length];
    let xP = points[i][0];
    let yP = points[i][1];
    for (let j = 0; j < shapePixels.length; j++) {
      let xS = shapePixels[j][0];
      let yS = shapePixels[j][1];
      if (
        ((xP + xS) >= 0) &&
                ((yP + yS) >= 0) &&
                ((xP + xS) < this.width) &&
                ((yP + yS) < this.height)
      ) {
        let position = (xP + xS + (yP + yS) * this.width) * this.channels;
        for (let channel = 0; channel < numberChannels; channel++) {
          this.data[position + channel] = color[channel];
        }
      }
    }
  }

  return this;
}
