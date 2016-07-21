/**
 * @memberof ROIManager
 * @instance
 */

import ROIMap from './../ROIMap';
import Shape from './../../../util/shape';

export default function fromCoordinates(pixelsToPaint, options = {}) {
    let shape = new Shape(options);

    // based on a binary image we will create plenty of small images
    let mapPixels = new Int16Array(this.size); // maxValue: 32767, minValue: -32768
    let positiveID = 0;
    let shapePixels = shape.getPixels();
    for (let i = 0; i < pixelsToPaint.length; i++) {
        positiveID++;
        let xP = pixelsToPaint[i][0];
        let yP = pixelsToPaint[i][1];
        for (let j = 0; j < shapePixels.length; j++) {
            let xS = shapePixels[j][0];
            let yS = shapePixels[j][1];
            if (
                ((xP + xS) >= 0) &&
                ((yP + yS) >= 0) &&
                ((xP + xS) < this.width) &&
                ((yP + yS) < this.height)
            ) {
                mapPixels[xP + xS + (yP + yS) * this.width] = positiveID;
            }
        }
    }

    return new ROIMap(this, mapPixels);
}
