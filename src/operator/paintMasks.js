'use strict';

import {RGB} from '../model/models';

export default function paintMasks(masks, {
    color = [this.maxValue, 0, 0]
    } = {}) {

    this.checkProcessable('paintMasks', {
        components: 3,
        bitDepth: [8, 16],
        colorModel: RGB
    });

    if (!Array.isArray(masks)) masks = [masks];

    var numberChannels = Math.min(this.channels, color.length);

    for (let i = 0; i < masks.length; i++) {
        var roi = masks[i];
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
