'use strict';

import IJ from '../ij';


export default function createROIs(maskInfo, {} = {}) {

    this.checkProcessable('createROIs', {
        bitDepth: [1]
    });


    var size=maskInfo.total;
    var images=new Array(size);
    var rois=new Array(size);
    for (var i=0; i<size; i++) {
        rois[i]={
            minX: Number.POSITIVE_INFINITY,
            maxX: Number.NEGATIVE_INFINITY,
            minY: Number.POSITIVE_INFINITY,
            maxY: Number.NEGATIVE_INFINITY,
            surface: 0
        }
    }
    var pixels=maskInfo.pixels;
    for (let x=0; x<this.width; x++) {
        for (let y=0; y<this.height; y++) {
            var target=y*this.width+x;
            var roiID=pixels[target]+maskInfo.negative;
            if (roiID>maskInfo.negative) roiID--;
            if (x<rois[roiID].minX) rois[roiID].minX=x;
            if (x>rois[roiID].maxX) rois[roiID].maxX=x;
            if (y<rois[roiID].minY) rois[roiID].minY=y;
            if (y>rois[roiID].maxY) rois[roiID].maxY=y;
            if (roiID==1) console.log(y, rois[roiID].maxY)
            rois[roiID].surface++;
        }
    }
    return rois;

}
