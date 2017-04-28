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
    let newMap = {};
    let oldToNew = {};

    for (let currentID of Object.keys(borderLengths)) {
        let currentInfo = borderLengths[currentID];
        switch (algorithm) {
            case 'commonborderlength':
                let neighbourIDs = Object.keys(currentInfo);
                for (let neighbourID of neighbourIDs) {
                    if (neighbourID !== currentID) { // it is not myself ...
                        if (currentInfo[neighbourID]>=minCommonBorderLength && currentInfo[neighbourID]<=maxCommonBorderLength) {
                            let newNeighbourID = neighbourID;
                            if (oldToNew[neighbourID]) newNeighbourID=oldToNew[neighbourID];
                            let newCurrentID = currentID;
                            if (oldToNew[currentID]) newCurrentID=oldToNew[currentID];

                            let smallerID = Math.min(newNeighbourID, newCurrentID);
                            let largerID = Math.max(newNeighbourID, newCurrentID);

                            if (! newMap[smallerID]) {
                                newMap[smallerID]={};
                            }
                            newMap[smallerID][largerID]=true;
                            oldToNew[largerID]=smallerID;
                            if (newMap[largerID]) { // need to put everything to smallerID and remove property
                                for (let id of Object.keys(newMap[largerID])) {
                                    newMap[smallerID][id]=true;
                                }
                                delete newMap[largerID];
                            }
                            console.log('Should merge', neighbourID, currentID, newMap);
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

    console.log(newMap);

    return roiMap;

}

function merge(common, id1, id2) {

}
