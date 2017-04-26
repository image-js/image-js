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

    let borderLengths = roiMap.commonBorderLength;

    algorithm = algorithm.toLowerCase();

    let currentPosition = 0;
    let oldToNew = {};

    for (let currentID of Object.keys(borderLengths)) {
        let currentInfo = borderLengths[currentID];
        switch (algorithm) {
            case 'commonborderlength':
                let neighbourIDs = Object.keys(currentInfo);
                for (let neighbourID of neighbourIDs) {
                    console.log(neighbourID, currentID);
                    if (neighbourID !== currentID) { // it is not myself ...
                        if (currentInfo[neighbourID]>=minCommonBorderLength && currentInfo[neighbourID]<=maxCommonBorderLength) {
                            let smallerID = Math.min(neighbourID, currentID);
                            let largerID = Math.max(neighbourID, currentID);
                            if (! oldToNew[smallerID]) {
                                oldToNew[smallerID]={};
                            }
                            oldToNew[smallerID][largerID]=true;
                            if (oldToNew[largerID]) { // need to put everything to smallerID and remove property
                                for (let id of Object.keys(oldToNew[largerID])) {
                                    oldToNew[smallerID][id]=true;
                                }
                                delete oldToNew[largerID];
                            }
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

    console.log(oldToNew);

    return roiMap;

}

function merge(common, id1, id2) {

}
