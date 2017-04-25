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


    console.log(common);

    return roiMap;

}
