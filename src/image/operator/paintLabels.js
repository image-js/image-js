import {RGB} from '../model/model';
import {getDistinctColors, getRandomColor} from '../../util/color';
import {css2array} from '../../util/color';

/**
 * Paint a mask or masks on the current image.
 * @memberof Image
 * @instance
 * 
 * @param {(Image|Image[])}     masks - Image containing a binary mask
 * @param {object}              [options]
 * @param {number[]|string}     [options.color='red'] - Array of 3 elements (R, G, B) or a valid css color.
 * @param {Array<Array<number>>} [options.colors] - Array of Array of 3 elements (R, G, B) for each color of each mask
  * @param {string[]}       [options.labels] - Array of labels to display. Should the the same size as masks.
 * @param {Array<Array<number>>} [options.labelsPosition] - Array of points [x,y] where the labels should be displayed.
 *                                      By default it is the 0,0 position of the correesponding mask.
 * @param {string}              [color='blue'] - Define the color to paint the labels
 * @param {string}              [font='12px Helvetica'] - Paint the labels in a different CSS style
 * @return {this} The original painted image
 */
export default function paintLabels(labels, positions, options = {}) {
    let {
        color = 'blue',
        font = '12px Helvetica'
    } = options;
    
    this.checkProcessable('paintMasks', {
        channels: [3, 4],
        bitDepth: [8, 16],
        colorModel: RGB
    });

    // We convert everything to array so that we can simply loop thourgh all the labels
    if (! color instanceof Array) color=[color];
    if (! font instanceof Array) font=[font];


    if (Array.isArray(labels) && labels.length > 0) {
        let canvas = this.getCanvas({originalData: true});
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = font;
        for (let i = 0; i < labels.length; i++) {
            let position = positions[i];
            ctx.fillText(labels[i], position[0], position[1]);
        }
        this.setData(ctx.getImageData(0, 0, this.width, this.height).data);
    }

    return this;
}
