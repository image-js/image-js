/**
 * @memberof ROIManager
 * @instance
 */

import ROIMap from './../ROIMap';
import localExtrema from '../../compute/localExtrema';
export default function createROIMapFromWaterShed(
    {
        fillMaxValue = this.maxValue,
        points,
        interval = 200,
        mask
} = {}
)
{
    let image = this;
    image.checkProcessable('createROIMapFromWaterShed', {
        bitDepth: [8, 16],
        components: 1
    });

    if (!points) {
        points = localExtrema(image, {algorithm:'min'});
    }
    let map = new Array(image.width * image.height).fill(0);
    let width = image.width;
    let toProcess = [];
    for (let i = 0; i < points.length; i++) {
        map[points[i].x + points[i].y * width] = points[i].id;
        toProcess.push([points[i].x, points[i].y]);
    }
    let dx =  [+1, 0, -1, 0];
    let dy =  [0, +1, 0, -1];
    for (let threshold = interval; threshold <= fillMaxValue; threshold += interval) {
        for (let i = 0; i < toProcess.length; i++) {
            let currentValueIndex = toProcess[i][0] + toProcess[i][1] * width;
            if (map[currentValueIndex] !== 0 && image.data[currentValueIndex] < threshold) {
                let bool = false;
                for (let dir = 0; dir < 4; dir++) {
                    let currentNeighIndex = toProcess[i][0] + dx[dir] + (toProcess[i][1] + dy[dir]) * width;
                    if (mask && !mask.getBitXY(toProcess[i][0] + dx[dir], toProcess[i][1] + dy[dir])) {
                        continue;
                    }
                    if (map[currentNeighIndex] === 0) {
                        map[currentNeighIndex] = map[currentValueIndex];
                        toProcess.push([toProcess[i][0] + dx[dir], toProcess[i][1] + dy[dir]]);
                        bool = true;
                    }
                }
                if (!bool) {
                    toProcess.splice(i, 1);
                    i--;
                }

            }
        }

    }
    return new ROIMap(image, map);

}
