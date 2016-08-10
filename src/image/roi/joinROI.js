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
    let toFusion = new Set();
    switch (algorithm.toLocaleLowerCase()) {
        //Algorithms. We can add more algorithm to create other types of merging.
        case 'cells' :
            for (let i = 0; i < rois.length; i++) {
                for (let k = 0; k < rois[i].neighboursID.length; k++) {
                    //If the length of wall of the current region and his neighbour is big enough, we join the rois.
                    if (rois[i].neighboursID[k] !== 0 && rois[i].neighboursID[k] < rois[i].id && rois[i].neighboursBorderLength[k] * value >= rois[i].contour) {
                        toFusion.add([rois[i].id, rois[i].neighboursID[k]]);
                    }
                }
            }
    }


    //Now we can modify the roiMap by merging each region determined before
    let roiMap = rois[0].map;
    for (let index = 0; index < roiMap.pixels.length; index++) {
        if (roiMap.pixels[index] !== 0) {
            for (let array of toFusion) {
                if (roiMap.pixels[index] === array[0]) {
                    roiMap.pixels[index] = array[1];
                }
            }
        }
    }

    return roiMap;

}
