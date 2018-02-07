import { RGB } from '../model/model';
import { css2array } from '../../util/color';

/**
 * Paint a mask or masks on the current image.
 * @memberof Image
 * @instance
 *
 * @param {Array<string>}       [labels] - Array of labels to display. Should the the same size as masks.
 * @param {Array<Array>}        [positions] - Array of labels to display. Should the the same size as masks.
 * @param {object}              [options]
 * @param {number[]|string}     [options.color='red'] - Array of 3 elements (R, G, B) or a valid css color.
 * @param {Array<Array<number>>|Array<string>} [options.colors] - Array of Array of 3 elements (R, G, B) for each color of each mask
 * @param {string|Array<string>} [options.font='12px Helvetica'] - Paint the labels in a different CSS style
 * @param {number|Array<number>} [options.rotate=0] - Rotate each label of a define angle
 * @return {this} The original painted image
 */
export default function paintLabels(labels, positions, options = {}) {
  let {
    color = 'blue',
    colors,
    font = '12px Helvetica',
    rotate = 0
  } = options;

  this.checkProcessable('paintMasks', {
    channels: [3, 4],
    bitDepth: [8, 16],
    colorModel: RGB
  });

  if (!Array.isArray(labels)) {
    throw Error('paintLabels: labels must be an array');
  }

  if (!Array.isArray(positions)) {
    throw Error('paintLabels: positions must be an array');
  }


  if (color && !Array.isArray(color)) {
    color = css2array(color);
  }

  if (colors) {
    colors = colors.map(function (color) {
      if (!Array.isArray(color)) {
        return css2array(color);
      }
      return color;
    });
  } else {
    colors = [color];
  }

  if (labels.length !== positions.length) {
    throw Error('paintLabels: positions and labels must be arrays from the same size');
  }

  // We convert everything to array so that we can simply loop thourgh all the labels
  if (!Array.isArray(font)) font = [font];
  if (!Array.isArray(rotate)) rotate = [rotate];

  let canvas = this.getCanvas();
  let ctx = canvas.getContext('2d');
  for (let i = 0; i < labels.length; i++) {
    ctx.save();
    let color = colors[i % colors.length];
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3] / this.maxValue})`;
    ctx.font = font[i % font.length];
    let position = positions[i];
    ctx.translate(position[0], position[1]);
    ctx.rotate(rotate[i % rotate.length] / 180 * Math.PI);
    ctx.fillText(labels[i], 0, 0);
    ctx.restore();
  }
  this.data = Uint8Array.from(ctx.getImageData(0, 0, this.width, this.height).data);

  return this;
}
