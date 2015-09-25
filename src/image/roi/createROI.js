import ROI from './roi';


/*
ROI are created from a roiMap
The roiMap contains mainty an array of identifiers that define
for each pixels to which ROI it belongs
 */

export default function createROI(roiMap) {

    let size = roiMap.total;
    let rois = new Array(size);
    for (let i = 0; i < size; i++) {
        let mapID = -roiMap.negative + i;
        if (i >= roiMap.negative) mapID++;
        rois[i] = new ROI(roiMap, mapID);
    }
    let pixels = roiMap.pixels;

    let width = roiMap.parent.width;
    let height = roiMap.parent.height;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let target = y * width + x;
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
    for (let i = 0; i < size; i++) {
        let mapID = -roiMap.negative + i;
        if (i >= roiMap.negative) mapID++;
        rois[i].meanX /= rois[i].surface;
        rois[i].meanY /= rois[i].surface;
    }
    return rois;
}
