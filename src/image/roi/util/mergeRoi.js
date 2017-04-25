"use strict";


/**
 * Return a new roiMAP changed with the fusion of certain ROIs.
 * @param {object} [options]
 * @param {string} [options.algorithm='commonBorderLength'] ; algorithm used to decide which ROIs are merged.
 * @param {number} [options.minCommonBorderLength=5] is an integer, determine the strength of the merging.
 * @param {number} [options.maxCommonBorderLength=5] is an integer, determine the strength of the merging.
 *
 * @return {this}
 */


export default function mergeRoi(roiMap, options = {}) {
    let {
        algorithm = 'commonBorderLength',
        minCommonBorderLength = 5,
        maxCommonBorderLength = 100,
        minCommonBorderRatio = 0.3,
        maxCommonBorderRatio = 1
    } = options;

    let common = roiMap.commonBorderLength;

    algorithm = algorithm.toLowerCase();
    console.log(common);

    let toAnalyse = Object.keys(common);
    let currentPosition = 0;

    while (currentPosition < toAnalyse.length) {
        let currentID = toAnalyse[currentPosition];
        let currentInfo = common[currentID];
        switch (algorithm) {
            case 'commonborderlength':
                let neighbourIDs = Object.keys(currentInfo);
                console.log(neighbourIDs);
                for (let neighbourID of neighbourIDs) {
                    console.log(neighbourID, currentID);
                    if (neighbourID !== currentID) { // it is not myself ...
                        if (currentInfo[neighbourID]>=minCommonBorderLength && currentInfo[neighbourID]<=maxCommonBorderLength) {
                            console.log('Should merge');
                        }
                    }
                }
                break;
            case 'commonborderratio':

                break;
            default:
                throw Error('Unknown algorithm to merge roi: '+algorithm);
        }

        currentPosition++;
    }


    return roiMap;

}

function merge(common, id1, id2) {

}
