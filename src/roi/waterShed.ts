import PriorityQueue from 'js-priority-queue';

import type { Image } from '../Image.js';
import type { Mask } from '../Mask.js';
import { getExtrema } from '../compute/index.js';
import type { Point } from '../geometry/index.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

import { RoiMapManager } from './RoiMapManager.js';

/**
 * Point interface that is used in the queue data structure.
 */
interface PointWithIntensity {
  /**
   * @param row - Row of a point.
   */
  row: number;
  /**
   * @param column - Column of a point.
   */
  column: number;
  /**
   * @param intensity - Value of a point.
   */
  intensity: number;
}

export interface WaterShedOptions {
  /**
   * @param points - Points which should be filled by watershed filter.
   * @default - minimum points from getExtrema() function.
   */
  points?: Point[];
  /**
   * @param mask - A binary image, the same size as the image. The algorithm will fill only if the current pixel in the binary mask is not null.
   * @default undefined
   */
  mask?: Mask;
  /**
   * @param threshold - Limit of filling. Maximum value that pixel can have.
   * @default 1
   */
  threshold?: number;
}
/**
 * This method allows to create a ROIMap using the water shed algorithm. By default this algorithm
 * will fill the holes and therefore the lowest value of the image (black zones).
 * If no points are given, the function will look for all the minimal points.
 * If no mask is given the algorithm will completely fill the image.
 * Please take care about the value that has be in the mask ! In order to be coherent with the expected mask,
 * meaning that if it is a dark zone, the mask will be dark the normal behavior to fill a zone
 * is that the mask pixel is clear (value of 0) !
 * If you are looking for 'maxima' the image must be inverted before applying the algorithm
 * @param image - Image that the filter will be applied to.
 * @param options - WaterShedOptions
 * @returns RoiMapManager
 */
export function waterShed(
  image: Image,
  options: WaterShedOptions,
): RoiMapManager {
  let { points } = options;
  const { mask, threshold = 1 } = options;
  const currentImage = image;
  checkProcessable(image, {
    bitDepth: [8, 16],
    components: 1,
  });

  const fillMaxValue = threshold * image.maxValue;

  // WaterShed is done from points in the image. We can either specify those points in options,
  // or it is gonna take the minimum locals of the image by default.
  if (!points) {
    points = getExtrema(image, {
      kind: 'minimum',
      mask,
    });
  }

  const maskExpectedValue = 0;

  const data = new Int32Array(currentImage.size);
  const width = currentImage.width;
  const height = currentImage.height;
  const toProcess = new PriorityQueue({
    comparator: (a: PointWithIntensity, b: PointWithIntensity) =>
      a.intensity - b.intensity,
    strategy: PriorityQueue.BinaryHeapStrategy,
  });
  for (let i = 0; i < points.length; i++) {
    const index = points[i].column + points[i].row * width;
    data[index] = -i - 1;
    const intensity = currentImage.getValueByIndex(index, 0);
    if (intensity <= fillMaxValue) {
      toProcess.queue({
        column: points[i].column,
        row: points[i].row,
        intensity,
      });
    }
  }
  const dxs = [1, 0, -1, 0, 1, 1, -1, -1];
  const dys = [0, 1, 0, -1, 1, -1, 1, -1];
  // Then we iterate through each points

  while (toProcess.length > 0) {
    const currentPoint = toProcess.dequeue();
    const currentValueIndex = currentPoint.column + currentPoint.row * width;
    for (let dir = 0; dir < 4; dir++) {
      const newX = currentPoint.column + dxs[dir];
      const newY = currentPoint.row + dys[dir];
      if (newX >= 0 && newY >= 0 && newX < width && newY < height) {
        const currentNeighbourIndex = newX + newY * width;
        if (
          !mask ||
          mask.getBitByIndex(currentNeighbourIndex) === maskExpectedValue
        ) {
          const intensity = currentImage.getValueByIndex(
            currentNeighbourIndex,
            0,
          );
          if (intensity <= fillMaxValue && data[currentNeighbourIndex] === 0) {
            data[currentNeighbourIndex] = data[currentValueIndex];
            toProcess.queue({
              column: currentPoint.column + dxs[dir],
              row: currentPoint.row + dys[dir],
              intensity,
            });
          }
        }
      }
    }
  }
  const nbNegative = points.length;
  const nbPositive = 0;

  return new RoiMapManager({
    data,
    nbPositive,
    nbNegative,
    width: image.width,
    height: image.height,
  });
}
