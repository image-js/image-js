'use strict';

import IJ from '../ij';
import {RGB} from '../model/models';

export default function paintMasks(rois, options) {

    this.checkProcessable('paintMasks', {
        components: 3,
        bitDepth: [8, 16],
        colorModel: RGB
    });

    var options=options || {};
    var color = options.color || [this.maxValue,0,0]
    if (! Array.isArray(rois)) rois=[rois];

    for (let i=0; i<rois.length; i++) {
        var roi=rois[i];
        for (let x=0; x<roi.width; x++) {
            for (let y=0; y<roi.height; y++) {
                if (roi.getBitXY(x,y)) {
                    for (let component=0; component<this.components; component++) {
                        this.setValueXY(x+roi.position[0], y+roi.position[1], component, color[component]);
                    }
                }
            }
        }
    }
}
