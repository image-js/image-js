import disjointSet from 'disjoint-set';

import ROIMap from './../ROIMap';

const direction4X = [-1,  0];
const direction4Y = [ 0, -1];
const neighbors4 = [null, null];

const direction8X = [-1, -1,  0,  1];
const direction8Y = [ 0, -1, -1, -1];
const neighbors8 = [null, null, null, null];

export default function createROIMapFromMask2(mask) {

    const size = mask.size;
    const width = mask.width;
    const height = mask.height;
    const labels = new Array(size);
    const linked = disjointSet();

    let currentLabel = 1;
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            // true means out of background
            if (mask.getBitXY(i, j)) {
                let smallestNeighbor;
                for (let k = 0; k < 2; k++) {
                    let ii = i + direction4X[k];
                    let jj = j + direction4Y[k];
                    if (ii >= 0 && jj >= 0 && ii < width && jj < height) {
                        let neighbor = mask.getBitXY(ii, jj);
                        if (!neighbor) {
                            neighbors4[k] = null;
                        } else {
                            neighbors4[k] = labels[ii + jj * width];
                            if (!smallestNeighbor || neighbors4[k].label < smallestNeighbor.label) {
                                smallestNeighbor = neighbors4[k];
                            }
                        }
                    }
                }
                if (!smallestNeighbor) {
                    let label = {label:currentLabel++};
                    linked.add(label);
                    labels[i + j * width] = label;
                } else {
                    labels[i + j * width] = smallestNeighbor;
                    for (let k = 0; k < 2; k++) {
                        if (neighbors4[k]) {
                            linked.union(smallestNeighbor, neighbors4[k]);
                        }
                    }
                }
            }
        }
    }

    const pixels = new Int16Array(size);
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (mask.getBitXY(i, j)) {
                pixels[i + j * width] = linked.find(labels[i + j * width]) + 1;
            }
        }
    }

    return new ROIMap(mask, pixels, 0, currentLabel);

}
