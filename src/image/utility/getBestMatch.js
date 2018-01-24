import Matrix from '../../util/matrix';

/**
 * Try to match the current pictures with another one
 * @memberof Image
 * @instance
 * @param {Image} image - Other image to match
 * @param {object} [options]
 * @return {number[]}
 */
export default function match(image, options = {}) {
  let { border } = options;

  this.checkProcessable('getChannel', {
    bitDepth: [8, 16]
  });

  if (this.bitDepth !== image.bitDepth) {
    throw new Error('Both images must have the same bitDepth');
  }
  if (this.channels !== image.channels) {
    throw new Error('Both images must have the same number of channels');
  }
  if (this.colorModel !== image.colorModel) {
    throw new Error('Both images must have the same colorModel');
  }

  // there could be many names
  let similarityMatrix = new Matrix(image.width, image.height, -Infinity);

  let currentX = Math.floor(image.width / 2);
  let currentY = Math.floor(image.height / 2);
  let middleX = currentX;
  let middleY = currentY;
  let theEnd = false;

  while (!theEnd) {
    let toCalculatePositions = similarityMatrix.localSearch(currentX, currentY, -Infinity);
    for (let i = 0; i < toCalculatePositions.length; i++) {
      let position = toCalculatePositions[i];
      let similarity = this.getSimilarity(image, { border: border, shift: [middleX - position[0], middleY - position[1]] });
      similarityMatrix[position[0]][position[1]] = similarity;
    }

    let max = similarityMatrix.localMax(currentX, currentY);
    if (max.position[0] !== currentX || max.position[1] !== currentY) {
      currentX = max.position[0];
      currentY = max.position[1];
    } else {
      theEnd = true;
    }
  }

  return [currentX - middleX, currentY - middleY];
}
