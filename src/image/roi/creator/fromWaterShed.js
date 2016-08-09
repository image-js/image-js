/**
 * @memberof ROIManager
 * @instance
 */

import ROIMap from './../ROIMap';
import localExtrema from '../../compute/localExtrema';

/**
 *
 * @param fillMaxValue Limit of filling. By example, we can fill to a maximum value 32000 of a 16 bitDepth image.
 * @param points Array of object [{x:2, y:3, id:1}, ...]. The id for each points is obligatory
 * @param interval is a parameter which specify the level of filling each iteration. Every pixels in the current interval will be filled.
 * @param mask is a binary image, the same size as the image. The algorithm will fill only if the current pixel in the binary mask is true.
 * @returns {ROIMap}
 */

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

    //WaterShed is done from points in the image. We can either specify those points in options,
    // or it is gonna take the minima locals of the image by default.
    if (!points) {
        points = image.getLocalExtrema({algorithm:'min'});
    }
    let map = new Array(image.width * image.height).fill(0);
    let width = image.width;
    let toProcess = [];
    for (let i = 0; i < points.length; i++) {
        map[points[i].x + points[i].y * width] = points[i].id;
        toProcess.push([points[i].x, points[i].y]);
    }
    //dx and dy is to iterate through neighbour up down left and right.
    let dx =  [+1, 0, -1, 0];
    let dy =  [0, +1, 0, -1];

    //We iterate from interval to fillMaxValue in the image.
    for (let threshold = interval; threshold <= fillMaxValue; threshold += interval) {

        //Then we iterate through each points
        for (let i = 0; i < toProcess.length; i++) {
            let currentValueIndex = toProcess[i][0] + toProcess[i][1] * width;

            //condition if the current pixel is in the interval
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
                //We need to take off the point which has been processed. Accelerate the filling. (we don't process pixels two times).
                if (!bool) {
                    toProcess.splice(i, 1);
                    i--;
                }

            }
        }

    }
    return new ROIMap(image, map);

}
