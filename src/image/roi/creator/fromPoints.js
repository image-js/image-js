/*
We will annotate each point to define to which area it belongs
 */

import ROIMap from './../ROIMap';
import Shape from './Shape';

export default function fromPoints(points, options = {}) {
    let shape=new Shape(options);
    // based on a binary image we will create plenty of small images
    let pixels = new Int16Array(this.size); // maxValue: 32767, minValue: -32768
    let positiveID = 0;
    for (let i = 0; i < points[0].length; i++) {
        positiveID++;
        let xP=points[0][i];
        let yP=points[1][i];
        for (let j = 0; j < shape.on[0].length; j++) {
            let xS=shape.on[0][j];
            let yS=shape.on[1][j];
            if (
                ((xP+xS)>=0) &&
                ((yP+yS)>=0) &&
                ((xP+xS)<this.width) &&
                ((yP+yS)<this.height)
            ) {
                pixels[xP+xS+(yP+yS)*this.width]=positiveID;
            }
        }
    }

    return new ROIMap(this, pixels, 0, positiveID);
}
