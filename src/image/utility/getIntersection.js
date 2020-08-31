/**
 * Find intersection of points between two different masks
 * @memberof Image
 * @instance
 * @param {Image} mask2 - a mask (1 bit image)
 * @return {object} - object containing number of white pixels for mask1, for mask 2 and for them both
 */
export default function getIntersection(mask2) {
  let mask1 = this;
  let closestParent = mask1.getClosestCommonParent(mask2);

  let startPos1 = mask1.getRelativePosition(closestParent, {
    defaultFurther: true,
  });
  let allRelPos1 = getRelativePositionForAllPixels(mask1, startPos1);
  let startPos2 = mask2.getRelativePosition(closestParent, {
    defaultFurther: true,
  });
  let allRelPos2 = getRelativePositionForAllPixels(mask2, startPos2);

  let commonSurface = getCommonSurface(allRelPos1, allRelPos2);
  let intersection = {
    whitePixelsMask1: [],
    whitePixelsMask2: [],
    commonWhitePixels: [],
  };

  for (let i = 0; i < commonSurface.length; i++) {
    let currentRelativePos = commonSurface[i];
    let realPos1 = [
      currentRelativePos[0] - startPos1[0],
      currentRelativePos[1] - startPos1[1],
    ];
    let realPos2 = [
      currentRelativePos[0] - startPos2[0],
      currentRelativePos[1] - startPos2[1],
    ];
    let valueBitMask1 = mask1.getBitXY(realPos1[0], realPos1[1]);
    let valueBitMask2 = mask2.getBitXY(realPos2[0], realPos2[1]);

    if (valueBitMask1 === 1 && valueBitMask2 === 1) {
      intersection.commonWhitePixels.push(currentRelativePos);
    }
  }

  for (let i = 0; i < allRelPos1.length; i++) {
    let posX;
    let posY;
    if (i !== 0) {
      posX = Math.floor(i / mask1.width);
      posY = i % mask1.width;
    }
    if (mask1.getBitXY(posX, posY) === 1) {
      intersection.whitePixelsMask1.push(allRelPos1[i]);
    }
  }

  for (let i = 0; i < allRelPos2.length; i++) {
    let posX = 0;
    let posY = 0;
    if (i !== 0) {
      posX = Math.floor(i / mask2.width);
      posY = i % mask2.width;
    }
    if (mask2.getBitXY(posX, posY) === 1) {
      intersection.whitePixelsMask2.push(allRelPos2[i]);
    }
  }

  return intersection;
}

/**
 * Get relative position array for all pixels in masks
 * @param {Image} mask - a mask (1 bit image)
 * @param {Array<number>} startPosition - start position of mask relative to parent
 * @return {Array} - relative position of all pixels
 * @private
 */
function getRelativePositionForAllPixels(mask, startPosition) {
  let relativePositions = [];
  for (let i = 0; i < mask.height; i++) {
    for (let j = 0; j < mask.width; j++) {
      let originalPos = [i, j];
      relativePositions.push([
        originalPos[0] + startPosition[0],
        originalPos[1] + startPosition[1],
      ]);
    }
  }
  return relativePositions;
}

/**
 * Finds common surface for two arrays containing the positions of the pixels relative to parent image
 * @param {Array<number>} positionArray1 - positions of pixels relative to parent
 * @param {Array<number>} positionArray2 - positions of pixels relative to parent
 * @return {Array<number>} - positions of common pixels for both arrays
 * @private
 */
function getCommonSurface(positionArray1, positionArray2) {
  let i = 0;
  let j = 0;
  let commonSurface = [];
  while (i < positionArray1.length && j < positionArray2.length) {
    if (
      positionArray1[i][0] === positionArray2[j][0] &&
      positionArray1[i][1] === positionArray2[j][1]
    ) {
      commonSurface.push(positionArray1[i]);
      i++;
      j++;
    } else if (
      positionArray1[i][0] < positionArray2[j][0] ||
      (positionArray1[i][0] === positionArray2[j][0] &&
        positionArray1[i][1] < positionArray2[j][1])
    ) {
      i++;
    } else {
      j++;
    }
  }
  return commonSurface;
}
