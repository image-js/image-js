import RoiMap from '../RoiMap';
import PriorityQueue from 'js-priority-queue';
import {dxs, dys} from './../../../util/dxdy.js';
/**
 * @memberof RoiManager
 * @instance
 * @param {Object} options
 * @param options.fillMaxValue - Limit of filling. By example, we can fill to a maximum value 32000 of a 16 bitDepth image.
 * @param options.points - Array of object [{x:2, y:3, id:1}, ...]. The id for each points is obligatory
 * @param options.interval - A parameter which specify the level of filling each iteration. Every pixels in the current interval will be filled.
 * @param options.mask - A binary image, the same size as the image. The algorithm will fill only if the current pixel in the binary mask is true.
 * @returns {RoiMap}
 */

export default function fromWaterShed(options = {}) {
    let {
        fillMaxValue = this.maxValue,
        points,
        mask
    } = options;
    let image = this;
    image.checkProcessable('fromWaterShed', {
        bitDepth: [8, 16],
        components: 1
    });

    //WaterShed is done from points in the image. We can either specify those points in options,
    // or it is gonna take the minimum locals of the image by default.
    if (!points) {
        points = image.getLocalExtrema({algorithm: 'min', mask: mask});
    }

    let data = new Int16Array(image.size);
    let width = image.width;
    let height = image.height;
    let toProcess = new PriorityQueue({
        comparator: (a, b) => a[2] - b[2],
        strategy: PriorityQueue.BinaryHeapStrategy
    });
    for (let i = 0; i < points.length; i++) {
        let index = points[i][0] + points[i][1] * width;
        data[index] = i + 1;
        let intensity = image.data[index];
        if (intensity <= fillMaxValue) {
            toProcess.queue([points[i][0], points[i][1], intensity]);
        }
    }


    //Then we iterate through each points
    while (toProcess.length > 0) {
        let currentPoint = toProcess.dequeue();
        let currentValueIndex = currentPoint[0] + currentPoint[1] * width;

        for (let dir = 0; dir < 4; dir++) {
            let newX = currentPoint[0] + dxs[dir];
            let newY = currentPoint[1] + dys[dir];
            if (newX >= 0 && newY >= 0 && newX < width && newY < height) {
                let currentNeighbourIndex = newX + newY * width;
                if (!mask || mask.getBit(currentNeighbourIndex)) {
                    let intensity = image.data[currentNeighbourIndex];
                    if (intensity <= fillMaxValue) {
                        if (data[currentNeighbourIndex] === 0) {
                            data[currentNeighbourIndex] = data[currentValueIndex];
                            toProcess.queue([currentPoint[0] + dxs[dir], currentPoint[1] + dys[dir], intensity]);
                        }
                    }
                }
            }
        }
    }

    return new RoiMap(image, data);
}
