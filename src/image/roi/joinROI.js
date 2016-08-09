/**
 *  Return a new roiMAP changed with the fusion of certain ROIs.
 * @param rois is an array of ROIs which shares the same roiMAP.
 * @param algorithm ; algorithm used to decide which ROIs are merged.
 * @param value is an integer, determine the strength of the merging.
 * @returns {*}
 */


export default function joinROI(rois,
    {
        algorithm = 'cells',
        value = 5
    } = {}
) {
    let toFusion = new Map();
    switch (algorithm.toLocaleLowerCase()) {
        //Algorithms. We can add more algorithm to create other types of merging.
        case 'cells' :
            for (let i = 0; i < rois.length; i++) {
                for (let k = 0; k < rois[i].neighID.length; k++) {
                    //If the length of wall of the current region and his neighbour is big enough, we join the rois.
                    if (rois[i].neighID[k] !== 0 && rois[i].contourByZone[k] * value >= rois[i].contour) {
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
    let roiMap = rois[0].map;
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
