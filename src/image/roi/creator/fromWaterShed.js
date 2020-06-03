import PriorityQueue from 'js-priority-queue';

import { dxs, dys } from '../../../util/dxdy.js';
import RoiMap from '../RoiMap';

/**
 * This method allows to create a ROIMap using the water shed algorithm. By default this algorithm
 * will fill the holes and therefore the lowest value of the image (black zones).
 * If no points are given, the function will look for all the minimal points.
 * If no mask is given the algorithm will completely fill the image.
 * Please take care about the value that has be in the mask ! In order to be coherent with the expected mask,
 * meaning that if it is a dark zone, the mask will be dark the normal behaviour to fill a zone
 * is that the mask pixel is clear (value of 0) !
 * However if you work in the 'invert' mode, the mask value has to be 'set' and the method will look for
 * maxima.
 * @memberof RoiManager
 * @instance
 * @param {object} [options={}]
 * @param {Array<Array<number>>} [options.points] - Array of points [[x1,y1], [x2,y2], ...].
 * @param {number} [options.fillMaxValue] - Limit of filling. By example, we can fill to a maximum value 32000 of a 16 bitDepth image.
 *          If invert this will corresponds to the minimal value
 * @param {Image} [options.image=this] - By default the waterShed will be applied on the current image. However waterShed can only be applied
 *                              on 1 component image. This allows to specify a grey scale image on which to apply waterShed..
 * @param {Image} [options.mask] - A binary image, the same size as the image. The algorithm will fill only if the current pixel in the binary mask is true.
 * @param {boolean} [options.invert=false] - By default we fill the minima
 * @return {RoiMap}
 */
export default function fromWaterShed(options = {}) {
  let {
    points,
    mask,
    image,
    fillMaxValue = this.maxValue,
    invert = false,
  } = options;
  let currentImage = image || this;
  currentImage.checkProcessable('fromWaterShed', {
    bitDepth: [8, 16],
    components: 1,
  });

  /*
     We need to invert the logic because we are always using method to look for maxima and not minima and
     here water is expected to fill the minima first ...
    */

  invert = !invert;

  // WaterShed is done from points in the image. We can either specify those points in options,
  // or it is gonna take the minimum locals of the image by default.
  if (!points) {
    points = currentImage.getLocalMaxima({
      invert,
      mask,
    });
  }

  let maskExpectedValue = invert ? 0 : 1;

  let data = new Int16Array(currentImage.size);
  let width = currentImage.width;
  let height = currentImage.height;
  let toProcess = new PriorityQueue({
    comparator: (a, b) => a[2] - b[2],
    strategy: PriorityQueue.BinaryHeapStrategy,
  });
  for (let i = 0; i < points.length; i++) {
    let index = points[i][0] + points[i][1] * width;
    data[index] = i + 1;
    let intensity = currentImage.data[index];
    if (
      (invert && intensity <= fillMaxValue) ||
      (!invert && intensity >= fillMaxValue)
    ) {
      toProcess.queue([points[i][0], points[i][1], intensity]);
    }
  }

  // Then we iterate through each points
  while (toProcess.length > 0) {
    let currentPoint = toProcess.dequeue();
    let currentValueIndex = currentPoint[0] + currentPoint[1] * width;

    for (let dir = 0; dir < 4; dir++) {
      let newX = currentPoint[0] + dxs[dir];
      let newY = currentPoint[1] + dys[dir];
      if (newX >= 0 && newY >= 0 && newX < width && newY < height) {
        let currentNeighbourIndex = newX + newY * width;
        if (!mask || mask.getBit(currentNeighbourIndex) === maskExpectedValue) {
          let intensity = currentImage.data[currentNeighbourIndex];
          if (
            (invert && intensity <= fillMaxValue) ||
            (!invert && intensity >= fillMaxValue)
          ) {
            if (data[currentNeighbourIndex] === 0) {
              data[currentNeighbourIndex] = data[currentValueIndex];
              toProcess.queue([
                currentPoint[0] + dxs[dir],
                currentPoint[1] + dys[dir],
                intensity,
              ]);
            }
          }
        }
      }
    }
  }

  return new RoiMap(currentImage, data);
}
