import {RGB} from '../model/model';
import {css2array} from '../../util/color';

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
 * @param {string}              [options.font='12px Helvetica'] - Paint the labels in a different CSS style
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

    if (! Array.isArray(labels)) {
        throw Error('paintLabels: labels must be an array');
    }

    if (! Array.isArray(positions)) {
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
    }
    
    if (labels.length!==positions.length) {
        throw Error('paintLabels: positions and labels must be arrays from the same size');
    }
    
    // We convert everything to array so that we can simply loop thourgh all the labels
    if (! Array.isArray(color)) color=[color];
    if (! Array.isArray(font)) font=[font];


    if (Array.isArray(labels) && labels.length > 0) {
        let canvas = this.getCanvas({originalData: true});
        let ctx = canvas.getContext('2d');
        for (let i = 0; i < labels.length; i++) {
            ctx.fillStyle = color[i % color.length];
            ctx.font = font[i % font.length];
            let position = positions[i];
            ctx.fillText(labels[i], position[0], position[1]);
        }
        this.setData(ctx.getImageData(0, 0, this.width, this.height).data);
    }

    return this;
}
