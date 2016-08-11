import {RGB} from '../model/model';
import {Color} from '../../util/color';
/**
 * Paint a mask or masks on the current image.
 * @memberof Image
 * @instance
 * @param masks {(Image|Image[])} mask - Image containing a binary mask
 * @param color {array} [$1.color=[max,0,0]] - Array of 3 elements (R, G, B), default is red.
 * @param colors {array} Array of Array of 3 elements (R, G, B) for each color of each mask.
 * @param randomColors If we we would like to paint each mask with a random color
 * @param distinctColors If we we would like to paint each mask with a different color (default: false);
 * @returns {Image} The original painted image
 */

export default function paintMasks(masks, {
    color = [this.maxValue, 0, 0],
    colors,
    randomColors = false,
    distinctColors = false
} = {}) {

    this.checkProcessable('paintMasks', {
        components: 3,
        bitDepth: [8, 16],
        colorModel: RGB
    });

    if (!Array.isArray(masks)) masks = [masks];

    let numberChannels = Math.min(this.channels, color.length);
    if (distinctColors) colors = Color.getDistinctColors(masks.length);


    for (let i = 0; i < masks.length; i++) {
        let roi = masks[i];
        // we need to find the parent image to calculate the relative position

        if (colors) {
            color = colors[i % masks.legnth];
        } else if (randomColors) {
            color = Color.getRandom();
        }

        for (let x = 0; x < roi.width; x++) {
            for (let y = 0; y < roi.height; y++) {
                if (roi.getBitXY(x, y)) {
                    for (let channel = 0; channel < numberChannels; channel++) {
                        this.setValueXY(x + roi.position[0], y + roi.position[1], channel, color[channel]);
                    }
                }
            }
        }
    }
}
