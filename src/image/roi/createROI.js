import ROI from './roi';

/**
 * ROI are created from a roiMap
 * The roiMap contains mainty an array of identifiers that define
 * for each pixels to which ROI it belongs
 * @memberof ROIManager
 * @instance
 */

export default function createROI(roiMap) {

    // we need to find all all the different IDs there is in the pixels
    let pixels = roiMap.pixels;
    let mapIDs = {};
    for (let i = 0; i < pixels.length; i++) {
        if (pixels[i] && !mapIDs[pixels[i]]) {
            mapIDs[pixels[i]] = true;
            if (pixels[i] > 0) {
                roiMap.positive++;
            } else {
                roiMap.negative++;
            }
        }
    }

    let rois = {};
    for (let mapID in mapIDs) {
        rois[mapID] = new ROI(roiMap, mapID * 1);
    }

    let width = roiMap.width;
    let height = roiMap.height;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let target = y * width + x;
            if (pixels[target] !== 0) {
                let mapID = pixels[target];
                if (x < rois[mapID].minX) rois[mapID].minX = x;
                if (x > rois[mapID].maxX) rois[mapID].maxX = x;
                if (y < rois[mapID].minY) rois[mapID].minY = y;
                if (y > rois[mapID].maxY) rois[mapID].maxY = y;
                rois[mapID].meanX += x;
                rois[mapID].meanY += y;
                rois[mapID].surface++;
            }
        }
    }

    let roiArray = [];
    for (let mapID in mapIDs) {
        rois[mapID].meanX /= rois[mapID].surface;
        rois[mapID].meanY /= rois[mapID].surface;
        roiArray.push(rois[mapID]);
    }

    return roiArray;
}
