import ROI from './roi';

/**
 * ROI are created from a roiMap
 * The roiMap contains mainty an array of identifiers that define
 * for each data to which ROI it belongs
 * @memberof ROIManager
 * @instance
 */

export default function createROI(roiMap) {

    // we need to find all all the different IDs there is in the data
    let data = roiMap.data;
    let mapIDs = {};
    roiMap.positive = 0;
    roiMap.negative = 0;

    for (let i = 0; i < data.length; i++) {
        if (data[i] && !mapIDs[data[i]]) {
            mapIDs[data[i]] = true;
            if (data[i] > 0) {
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
            if (data[target] !== 0) {
                let mapID = data[target];
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
