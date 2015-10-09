/*
We will annotate each point to define to which area it belongs
 */

import ROIMap from './../ROIMap';

export default function fromPoints(points, {shape, size, filled} = {}) {

    // based on a binary image we will create plenty of small images
    let pixels = new Int16Array(this.size); // maxValue: 32767, minValue: -32768
    let width = this.width;
    let height = this.height;
    let positiveID = 0;
    for (let i = 0; i < points.length; i++) {
        let point = points[i];
    }



    return new ROIMap(this, pixels, 0, positiveID);

}
