import { getColors } from '../../util/color';
import { RGB } from '../model/model';

/**
 * Paint a mask or masks on the current image.
 * @memberof Image
 * @instance
 * @param {(Image|Array<Image>)}     masks - Image containing a binary mask
 * @param {object}              [options]
 * @param {Array<number>|string}     [options.color] - Array of 3 elements (R, G, B) or a valid css color.
 * @param {Array<Array<number>>|Array<string>} [options.colors] - Array of Array of 3 elements (R, G, B) for each color of each mask
 * @param {boolean}             [options.randomColors=true] - To paint each mask with a random color if color and colors are undefined
 * @param {boolean}             [options.distinctColors=false] - To paint each mask with a different color if color and colors are undefined
 * @param {number}              [options.alpha=255] - Value from 0 to 255 to specify the alpha.
 * @param {Array<string>}       [options.labels] - Array of labels to display. Should the the same size as masks.
 * @param {Array<Array<number>>} [options.labelsPosition] - Array of points [x,y] where the labels should be displayed.
 *                                      By default it is the 0,0 position of the correesponding mask.
 * @param {string}              [options.labelColor='blue'] - Define the color to paint the labels
 * @param {string}              [options.labelFont='12px Helvetica'] - Paint the labels in a different CSS style
 * @return {this} The original painted image
 */
export default function paintMasks(masks, options = {}) {
  let {
    alpha = 255,
    labels = [],
    labelsPosition = [],
    labelColor = 'blue',
    labelFont = '12px Helvetica',
  } = options;

  this.checkProcessable('paintMasks', {
    channels: [3, 4],
    bitDepth: [8, 16],
    colorModel: RGB,
  });

  let colors = getColors(
    Object.assign({}, options, { numberColors: masks.length }),
  );

  if (!Array.isArray(masks)) {
    masks = [masks];
  }

  for (let i = 0; i < masks.length; i++) {
    let mask = masks[i];
    // we need to find the parent image to calculate the relative position
    let color = colors[i % colors.length];
    for (let x = 0; x < mask.width; x++) {
      for (let y = 0; y < mask.height; y++) {
        if (mask.getBitXY(x, y)) {
          for (
            let component = 0;
            component < Math.min(this.components, color.length);
            component++
          ) {
            if (alpha === 255) {
              this.setValueXY(
                x + mask.position[0],
                y + mask.position[1],
                component,
                color[component],
              );
            } else {
              let value = this.getValueXY(
                x + mask.position[0],
                y + mask.position[1],
                component,
              );
              value = Math.round(
                (value * (255 - alpha) + color[component] * alpha) / 255,
              );
              this.setValueXY(
                x + mask.position[0],
                y + mask.position[1],
                component,
                value,
              );
            }
          }
        }
      }
    }
  }

  if (Array.isArray(labels) && labels.length > 0) {
    let canvas = this.getCanvas();
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = labelColor;
    ctx.font = labelFont;
    for (let i = 0; i < Math.min(masks.length, labels.length); i++) {
      let position = labelsPosition[i] ? labelsPosition[i] : masks[i].position;
      ctx.fillText(labels[i], position[0], position[1]);
    }
    this.data = Uint8Array.from(
      ctx.getImageData(0, 0, this.width, this.height).data,
    );
  }

  return this;
}
