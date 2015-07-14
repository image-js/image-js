'use strict';

import IJ from '../ij';

import ROI from './roi';

export default function createROI(roiMap) {

    var size = roiMap.total;
    var rois = new Array(size);
    for (var i = 0; i < size; i++) {
        let mapID = -roiMap.negative + i;
        if (i >= roiMap.negative) mapID++;
        rois[i] = new ROI(roiMap, mapID);
    }
    var pixels = roiMap.pixels;
    for (let x = 0; x < roiMap.width; x++) {
        for (let y = 0; y < roiMap.height; y++) {
            let target = y * roiMap.width + x;
            let mapID = pixels[target] + roiMap.negative;
            if (mapID > roiMap.negative) mapID--;
            if (x < rois[mapID].minX) rois[mapID].minX = x;
            if (x > rois[mapID].maxX) rois[mapID].maxX = x;
            if (y < rois[mapID].minY) rois[mapID].minY = y;
            if (y > rois[mapID].maxY) rois[mapID].maxY = y;
            rois[mapID].meanX += x;
            rois[mapID].meanY += y;
            rois[mapID].surface++;
        }
    }
    for (var i = 0; i < size; i++) {
        let mapID = -roiMap.negative + i;
        if (i >= roiMap.negative) mapID++;
        rois[i].meanX /= rois[i].surface;
        rois[i].meanY /= rois[i].surface;
    }
    for (var i=0; i<rois.length; i++) {
        rois[i].surround=getSurroundingID(rois[i], roiMap);
    }
    return rois;
}



function getSurroundingID(roi, roiMap) {
    var pixels=roiMap.pixels;
    // we check the first line and the last line
    for (let y in [0, roiMap.height - 1]) {
        for (let x = 1; x < roiMap.width-1; x++) {
            let target = y * roiMap.width + x;
            if (pixels[target] == roiMap.id && pixels[target - 1] != roiMap.id) return pixels[target - 1];
            if (pixels[target] == roiMap.id && pixels[target + 1] != roiMap.id) return pixels[target + 1];
        }
    }
    // we check the first column and the last column
    for (let x in [0, roiMap.width - 1]) {
        for (let y = 1; x < roiMap.height-1; x++) {
            let target = y * roiMap.width + x;
            if (pixels[target] == roiMap.id && pixels[target - roiMap.width] != roiMap.id) return pixels[target - roiMap.width];
            if (pixels[target] == roiMap.id && pixels[target + roiMap.width] != roiMap.id) return pixels[target + roiMap.width];
        }
    }

    return 0;
}