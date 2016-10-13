import {RGB} from '../model/model';
import {getDistinctColors, getRandomColor} from '../../util/color';
import {css2array} from '../../util/color';

/**
 * Paint a mask or masks on the current image.
 * @memberof Image
 * @instance
 * @param {(Image|array<Image>)}     masks - Image containing a binary mask
 * @param {object}              [options]
 * @param {[number]|string}     [options.color='red'] - Array of 3 elements (R, G, B) or a valid css color.
 * @param {array<array<number>>} [options.colors] - Array of Array of 3 elements (R, G, B) for each color of each mask
 * @param {number}              [options.alpha=255\ - Value from 0 to 255 to specify the alpha.
 * @param {boolean}             [options.randomColors=false] - To paint each mask with a random color
 * @param {boolean}             [options.distinctColors=false] - To paint each mask with a different color
 * @param {array<string>}       [options.labels] - Array of labels to display. Should the the same size as masks.
 * @param {array<array<number>>}} [options.labelsPosition] - Array of points [x,y] where the labels should be displayed.
 *                                      By default it is the 0,0 position of the correesponding mask.
 * @param {string}              [options.labelColor='blue'] - Define the color to paint the labels
 * @param {string}              [options.labelFont='12px Helvetica'] - Paint the labels in a different CSS style

 *
 * @returns {Image} The original painted image
 */


export default function paintMasks(masks, options = {}) {
    let {
        color = 'red',
        colors,
        alpha = 255,
        randomColors = false,
        distinctColors = false,
        labels = [],
        labelsPosition = [],
        labelColor = 'blue',
        labelFont = '12px Helvetica'
    } = options;

    this.checkProcessable('paintMasks', {
        channels: 4,
        bitDepth: [8, 16],
        colorModel: RGB
    });

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

    if (!Array.isArray(masks)) {
        masks = [masks];
    }

    if (distinctColors) {
        colors = getDistinctColors(masks.length);
    }

    for (let i = 0; i < masks.length; i++) {
        let mask = masks[i];
        // we need to find the parent image to calculate the relative position

        if (colors) {
            color = colors[i % colors.length];
        } else if (randomColors) {
            color = getRandomColor();
        }

        for (let x = 0; x < mask.width; x++) {
            for (let y = 0; y < mask.height; y++) {
                if (mask.getBitXY(x, y)) {
                    for (let component = 0; component < Math.min(this.components, color.length); component++) {
                        if (alpha === 255) {
                            this.setValueXY(x + mask.position[0], y + mask.position[1], component, color[component]);
                        } else {
                            let value = this.getValueXY(x + mask.position[0], y + mask.position[1], component);
                            value = Math.round((value * (255 - alpha) + color[component] * alpha) / 255);
                            this.setValueXY(x + mask.position[0], y + mask.position[1], component, value);
                        }
                    }
                }
            }
        }
    }

    if (Array.isArray(labels) && labels.length > 0) {
        let canvas = this.getCanvas({originalData: true});
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = labelColor;
        ctx.font = labelFont;
        for (let i = 0; i < Math.min(masks.length, labels.length); i++) {
            let position = (labelsPosition[i]) ? labelsPosition[i] : masks[i].position;
            ctx.fillText(labels[i], position[0], position[1]);
        }
        this.data = ctx.getImageData(0, 0, this.width, this.height).data;
    }
}
