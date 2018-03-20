/*
This algorithm is nice and is therefore kept here
However it seems to be slower than the get mask and
also provides only the positive ROI
We therefore don't expose it in the roiManager
 */

import DisjointSet from 'ml-disjoint-set';

import RoiMap from '../RoiMap';

const direction4X = [-1,  0];
const direction4Y = [0, -1];
const neighbours4 = [null, null];

const direction8X = [-1, -1,  0,  1];
const direction8Y = [0, -1, -1, -1];
const neighbours8 = [null, null, null, null];

/*
Implementation of the connected-component labeling algorithm
 */
export default function fromMaskConnectedComponentLabelingAlgorithm(mask, options = {}) {
  const {
    allowCorners = false
  } = options;
  let neighbours = 4;
  if (allowCorners) {
    neighbours = 8;
  }

  let directionX;
  let directionY;
  let neighboursList;
  if (neighbours === 8) {
    directionX = direction8X;
    directionY = direction8Y;
    neighboursList = neighbours8;
  } else if (neighbours === 4) {
    directionX = direction4X;
    directionY = direction4Y;
    neighboursList = neighbours4;
  } else {
    throw new RangeError(`unsupported neighbours count: ${neighbours}`);
  }

  const size = mask.size;
  const width = mask.width;
  const height = mask.height;
  const labels = new Array(size);
  const data = new Uint32Array(size);
  const linked = new DisjointSet();

  let currentLabel = 1;
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      // true means out of background
      const index = i + j * width;
      if (mask.getBit(index)) {
        let smallestNeighbour = null;
        for (let k = 0; k < neighboursList.length; k++) {
          const ii = i + directionX[k];
          const jj = j + directionY[k];
          if (ii >= 0 && jj >= 0 && ii < width && jj < height) {
            const index = ii + jj * width;
            let neighbour = labels[index];
            if (!neighbour) {
              neighboursList[k] = null;
            } else {
              neighboursList[k] = neighbour;
              if (!smallestNeighbour || neighboursList[k].value < smallestNeighbour.value) {
                smallestNeighbour = neighboursList[k];
              }
            }
          }
        }
        if (!smallestNeighbour) {
          labels[index] = linked.add(currentLabel++);
        } else {
          labels[index] = smallestNeighbour;
          for (let k = 0; k < neighboursList.length; k++) {
            if (neighboursList[k] && neighboursList[k] !== smallestNeighbour) {
              linked.union(smallestNeighbour, neighboursList[k]);
            }
          }
        }
      }
    }
  }

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const index = i + j * width;
      if (mask.getBit(index)) {
        data[index] = linked.find(labels[index]).value;
      }
    }
  }

  return new RoiMap(mask, data);
}
