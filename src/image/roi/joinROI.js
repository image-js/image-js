/**
 *  Return a new roiMAP changed with the fusion of certain ROIs.
 * @param rois is an array of ROIs which share the same roiMAP.
 * @param algorithm ; algorithm used to decide which ROIs are merged.
 * @returns {*}
 */

//To Add: other algorithm to fusion. This one is relative to the length of the wall between two neighbours.

export default function joinROI(rois,
    {
         algorithm = 'cells'
    } = {}
) {
    this.checkProcessable('mask', {
        components: 1,
        bitDepth: [8,16]
    });
    let toFusion = new Map();
    switch (algorithm.toLocaleLowerCase()) {
        case 'cells' :
            for (let i = 0; i < rois.length; i++) {
                rois[i] = rois[i].getROIManager();
                for (let k = 0; k < rois[i].neighID.length; k++) {
                    if (rois[i].neighID[k] !== 0 && rois[i].contourByZone[k] * 5 >= rois[i].contour) {
                        for (let j = 0; j < rois.length; j++) {
                            if (rois[j].id === rois[i].neighID[k] && !toFusion.has(rois[i].id + ':' + rois[j].id) && !toFusion.has(rois[j].id + ':' + rois[i].id)) {
                                toFusion.set(rois[i].id + ':' + rois[j].id, [rois[i].id, rois[j].id]);
                            }
                        }
                    }
                }
            }
    }


    //Now we can modify the roiMap by merging each region determined before
    toFusion = Array.from(toFusion.values());
    let roiManager = rois[0].getROIManager();
    let roiMap = roiManager.getMap();
    for (let index = 0; index < roiMap.pixels.length; index++) {
        if (roiMap.pixels[index] !== 0) {
            for (let i = 0; i < toFusion.length; i++) {
                if (roiMap.pixels[index] === toFusion[i][0]) {
                    roiMap.pixels[index] = toFusion[i][1];
                }
            }
        }
    }

    return roiMap;

}
