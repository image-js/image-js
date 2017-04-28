
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
                        if (currentInfo[neighbourID] >= minCommonBorderLength && currentInfo[neighbourID] <= maxCommonBorderLength) {
                            // the common border are in the range. We should merge
                            let newNeighbourID = neighbourID;
                            if (oldToNew[neighbourID]) newNeighbourID = oldToNew[neighbourID];
                            let newCurrentID = currentID;
                            if (oldToNew[currentID]) newCurrentID = oldToNew[currentID];

                            if (Number(newNeighbourID) !== newCurrentID) {
                                let smallerID = Math.min(newNeighbourID, newCurrentID);
                                let largerID = Math.max(newNeighbourID, newCurrentID);

                                if (!newMap[smallerID]) {
                                    newMap[smallerID] = {};
                                }
                                newMap[smallerID][largerID] = true;
                                oldToNew[largerID] = smallerID;
                                if (newMap[largerID]) { // need to put everything to smallerID and remove property
                                    for (let id of Object.keys(newMap[largerID])) {
                                        newMap[smallerID][id] = true;
                                        oldToNew[id] = smallerID;
                                    }
                                    delete newMap[largerID];
                                }
                            }
                        }
                    }
                }
                break;
            case 'commonborderratio':

                break;
            default:
                throw Error('Unknown algorithm to merge roi: ' + algorithm);
        }

        currentPosition++;
    }

    let minMax = roiMap.minMax;
    let shift = -minMax.min;
    let max = minMax.max + shift;
    let oldToNewArray = new Array(max + 1).fill(0);
    for (let key of Object.keys(oldToNew)) {
        oldToNewArray[Number(key) + shift] = oldToNew[key];
    }
    // time to change the roiMap
    let data = roiMap.data;
    for (let i = 0; i < data.length; i++) {
        let currentValue = data[i];
        if (currentValue !== 0) {
            let newValue = oldToNewArray[currentValue + shift];
            if (newValue !== 0) {
                data[i] = newValue;
            }
        }
    }

    roiMap.computed = {};

    return roiMap;

}

