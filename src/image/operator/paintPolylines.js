import { getColors } from '../../util/color';

/**
 * Paint polylines on the current image.
 * @memberof Image
 * @instance
 * @param {Array<Array<number>>} polylines - Array of array of [x,y] points
 * @param {object} [options]
 * @param {Array<number>|string}     [options.color] - Array of 3 elements (R, G, B) or a valid css color.
 * @param {Array<Array<number>>|Array<string>} [options.colors] - Array of Array of 3 elements (R, G, B) for each color of each mask
 * @param {boolean}             [options.randomColors=true] - To paint each mask with a random color if color and colors are undefined
 * @param {boolean}             [options.distinctColors=false] - To paint each mask with a different color if color and colors are undefined
 * @param {object} [options.shape] - Definition of the shape, see Shape contructor.
 * @return {this} The original painted image
 */
export default function paintPolylines(polylines, options = {}) {
  let optionsCopy = Object.assign({}, options);

  this.checkProcessable('paintPolylines', {
    bitDepth: [8, 16],
  });

  let colors = getColors(
    Object.assign({}, options, { numberColors: polylines.length }),
  );

  for (let i = 0; i < polylines.length; i++) {
    optionsCopy.color = colors[i % colors.length];
    this.paintPolyline(polylines[i], optionsCopy);
  }

  return this;
}
