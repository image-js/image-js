'use strict';

import IJ from '../ij';
import {RGB} from '../model/models';

export default function paintMasks(masks, options) {

    this.checkProcessable('paintMasks', {
        components: 3,
        bitDepth: [8, 16],
        colorModel: RGB
    });

    console.log(options);

    var options=options || {};
    var color = options.color || [this.maxValue,0,0]
    if (! Array.isArray(masks)) masks=[masks];

    var numberChannels=Math.min(this.channels, color.length);

    console.log(this.channels, numberChannels, color.length);

    for (let i=0; i<masks.length; i++) {
        var roi=masks[i];
        for (let x=0; x<roi.width; x++) {
            for (let y=0; y<roi.height; y++) {
                if (roi.getBitXY(x,y)) {
                    for (let channel=0; channel<numberChannels; channel++) {
                        this.setValueXY(x+roi.position[0], y+roi.position[1], channel, color[channel]);
                    }
                }
            }
        }
    }
}
