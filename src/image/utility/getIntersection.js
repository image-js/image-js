import getClosestCommonParent from './getClosestCommonParent';
/**
 * Find intersection of points between two different masks
 * @param {Image} - a mask (1 bit image)
 * @param {Image} - a mask (1 bit image)
 * @return {Object} - object containing number of white pixels for mask1, for mask 2 and for them both
 */
export default function getIntersection(mask1, mask2) {

    let parent = getClosestCommonParent(mask1, mask2);
    let startPos1 = mask1.getRelativePosition(parent);
    let allRelPos1 = getRelativePositionForAllPixels(mask1, startPos1);
    let startPos2 = mask2.getRelativePosition(parent);
    let allRelPos2 = getRelativePositionForAllPixels(mask2, startPos2);
    let commonSurface = getCommonSurface(allRelPos1, allRelPos2);
    let intersection = {whitePixelsMask1: [], whitePixelsMask2: [], commonWhitePixels: []};

    for (let i = 0; i < commonSurface.length; i++) {
        let currentRelativePos = commonSurface[i];
        let realPos1 = [currentRelativePos[0] - startPos1[0], currentRelativePos[1] - startPos1[1]];
        let realPos2 = [currentRelativePos[0] - startPos2[0], currentRelativePos[1] - startPos2[1]];

        let valueBitMask1 = mask1.getBitXY(realPos1[0], realPos1[1]);
        let valueBitMask2 = mask2.getBitXY(realPos2[0], realPos2[1]);

        if (valueBitMask1 === 1) {
            intersection.whitePixelsMask1[i] = currentRelativePos;
        }
        if (valueBitMask2 === 1) {
            intersection.whitePixelsMask2[i] = currentRelativePos;
        }
        if (valueBitMask1 === 1 && valueBitMask2 === 1) {
            intersection.commonWhitePixels[i] = currentRelativePos;
        }
    }

}

/**
 * Get relative position array for all pixels in masks
 * @param {Image} - a mask (1 bit image)
 * @param {Array} - number array, start position of mask relative to parent
 * @returns {Array} - relative position of all pixels
 */
function getRelativePositionForAllPixels(mask, startPosition) {
    let relativePositions = [];
    for (let i = 0; i < mask.height; i++) {
        for (let j = 0; j < mask.width; j++) {
            let originalPos = [i, j];
            relativePositions[(i + j)] = [originalPos[0] + startPosition[0], originalPos[1] + startPosition[1]];
        }
    }
    return relativePositions;
}

/**
 * Finds common surface for two arrays containing the positions of the pixels relative to parent image
 * @param {Array} - number array containing positions of pixels relative to parent
 * @param {Array} - number array containing positions of pixels relative to parent
 * @returns {Array} - number array containing positions of common pixels for both arrays
 */
function getCommonSurface(positionArray1, positionArray2) {
    let i = 0;
    let j = 0;
    let commonSurface = [];
    while (i < positionArray1.length && j < positionArray2.length) {
        if (positionArray1[i][0] === positionArray2[j][0] && positionArray1[i][1] === positionArray2[j][1]) {
            commonSurface[i] = positionArray1[i];
            i++;
            j++;
        } else if (positionArray1[i][0] < positionArray2[j][0]
            || (positionArray1[i][0] === positionArray2[j][0] && positionArray1[i][1] < positionArray2[j][1])) {
            i++;
        } else {
            j++;
        }
    }
    return commonSurface;
}
