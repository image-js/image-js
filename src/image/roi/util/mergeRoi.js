/**
 * In place modification of the roiMap that joins regions of interest
 * @param {object} [options]
 * @param {string|function(object,number,number)} [options.algorithm='commonBorderLength'] algorithm used to decide which ROIs are merged.
 *      Current implemented algorithms are 'commonBorderLength' that use the parameters
 *      'minCommonBorderLength' and 'maxCommonBorderLength' as well as 'commonBorderRatio' that uses
 *      the parameters 'minCommonBorderRatio' and 'maxCommonBorderRatio'.
 * @param {number} [options.minCommonBorderLength=5] minimal common number of pixels for merging
 * @param {number} [options.maxCommonBorderLength=100] maximal common number of pixels for merging
 * @param {number} [options.minCommonBorderRatio=0.3] minimal common border ratio for merging
 * @param {number} [options.maxCommonBorderRatio=1] maximal common border ratio for merging
 * @return {this}
 * @private
 */
export default function mergeRoi(options = {}) {
  const {
    algorithm = 'commonBorderLength',
    minCommonBorderLength = 5,
    maxCommonBorderLength = 100,
    minCommonBorderRatio = 0.3,
    maxCommonBorderRatio = 1,
  } = options;

  let checkFunction = function (currentInfo, currentID, neighbourID) {
    return (
      currentInfo[neighbourID] >= minCommonBorderLength &&
      currentInfo[neighbourID] <= maxCommonBorderLength
    );
  };
  if (typeof algorithm === 'function') {
    checkFunction = algorithm;
  }
  if (algorithm.toLowerCase() === 'commonborderratio') {
    checkFunction = function (currentInfo, currentID, neighbourID) {
      let ratio = Math.min(
        currentInfo[neighbourID] / currentInfo[currentID],
        1,
      );
      return ratio >= minCommonBorderRatio && ratio <= maxCommonBorderRatio;
    };
  }
  const roiMap = this;
  const borderLengths = roiMap.commonBorderLength;
  let newMap = {};
  let oldToNew = {};

  for (let currentID of Object.keys(borderLengths)) {
    let currentInfo = borderLengths[currentID];
    let neighbourIDs = Object.keys(currentInfo);
    for (let neighbourID of neighbourIDs) {
      if (neighbourID !== currentID) {
        // it is not myself ...
        if (checkFunction(currentInfo, currentID, neighbourID)) {
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
            if (newMap[largerID]) {
              // need to put everything to smallerID and remove property
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
