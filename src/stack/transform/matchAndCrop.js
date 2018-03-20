import Stack from '../Stack';

// TODO this code seems buggy if it is not 0,0
/**
 * We will try to move a set of images in order to get only the best common part of them.
 * In a stack, we compare 2 consecutive images or directly to a parent.
 * Ignoring border may be dangerous ! If there is a shape on the side of the image there will be a
 * continuous shift if you ignore border. By default it is better to leave it to 0,0
 * Now if the background is not black there will also be no way to shift ...
 * It may therefore be much better to make a background correction before trying to match and crop.
 * @memberof Stack
 * @instance
 * @param {object} [options]
 * @param {string} [options.algorithm='matchToPrevious'] - matchToPrevious or matchToFirst
 * @param {number[]} [options.ignoreBorder=[0, 0]]
 * @return {Stack}
 */
export default function matchAndCrop(options = {}) {
  let {
    algorithm = 'matchToPrevious',
    ignoreBorder = [0, 0]
  } = options;

  this.checkProcessable('matchAndCrop', {
    bitDepth: [8, 16]
  });

  let matchToPrevious = (algorithm === 'matchToPrevious');

  let parent = this[0];
  let results = [];
  results[0] = {
    position: [0, 0],
    image: this[0]
  };

  let relativePosition = [0, 0];

  // we calculate the best relative position to the parent image
  for (let i = 1; i < this.length; i++) {
    let position = parent.getBestMatch(this[i], { border: ignoreBorder });

    results[i] = {
      position: [position[0] + relativePosition[0], position[1] + relativePosition[1]],
      image: this[i]
    };
    if (matchToPrevious) {
      relativePosition[0] += position[0];
      relativePosition[1] += position[1];
      parent = this[i];
    }
  }
  // now we can calculate the cropping that we need to do

  let leftShift = 0;
  let rightShift = 0;
  let topShift = 0;
  let bottomShift = 0;

  for (let i = 0; i < results.length; i++) {
    let result = results[i];
    if (result.position[0] > leftShift) {
      leftShift = result.position[0];
    }
    if (result.position[0] < rightShift) {
      rightShift = result.position[0];
    }
    if (result.position[1] > topShift) {
      topShift = result.position[1];
    }
    if (result.position[1] < bottomShift) {
      bottomShift = result.position[1];
    }
  }
  rightShift = 0 - rightShift;
  bottomShift = 0 - bottomShift;

  for (let i = 0; i < results.length; i++) {
    let result = results[i];

    result.crop = result.image.crop({
      x: leftShift - result.position[0],
      y: topShift - result.position[1],
      width: parent.width - rightShift - leftShift,
      height: parent.height - bottomShift - topShift
    });
  }

  // finally we crop and create a new array of images
  let newImages = [];
  for (let i = 0; i < results.length; i++) {
    newImages[i] = results[i].crop;
  }

  return new Stack(newImages);
}
