'use strict';

export default
class ROI {

    constructor(map, id) {
        this.map = map;
        this.id = id;
        this.minX = Number.POSITIVE_INFINITY;
        this.maxX = Number.NEGATIVE_INFINITY;
        this.minY = Number.POSITIVE_INFINITY;
        this.maxY = Number.NEGATIVE_INFINITY;
        this.meanX = 0;
        this.meanY = 0;
        this.surface = 0;
        this.computed = {}; // what is the map value surrounding
    }

    get width() {
        return this.maxX - this.minX + 1;
    }

    get height() {
        return this.maxY - this.minY + 1;
    }

    get surround() {
        if (this.computed.surround) return this.computed.surround;
        return this.computed.surround = getSurroundingID(this);
    }

    get mask() {
        if (this.computed.mask) return this.computed.mask;

        let width = this.maxX - this.minX + 1;
        let height = this.maxY - this.minY + 1;
        let img = new IJ(width, height, {
            kind: 'BINARY',
            position: [this.minX, this.minY]
        });
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (this.map.pixels[x + this.minX + (y + this.minY) * this.map.width] === this.id) img.setBitXY(x, y);
            }
        }

        return this.computed.mask = img;
    }
}


function getSurroundingID(roi) {
    let roiMap = roi.map;
    let pixels = roiMap.pixels;
    // we check the first line and the last line
    let fromX=Math.max(roi.minX,1);
    let toX=Math.min(roi.width,roiMap.width-2);

    // not optimized  if height=1 !
    for (let y of [0, roi.height - 1]) {
        for (let x = 0; x < roi.width; x++) {
            let target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (Math.max(roi.minX,x)>0 && pixels[target] == roi.id && pixels[target - 1] != roi.id) return pixels[target - 1];
            if (Math.min(roi.maxX,x)<(roiMap.width-1) && pixels[target] == roi.id && pixels[target + 1] != roi.id) return pixels[target + 1];
        }
    }


    // we check the first column and the last column
    let fromY=Math.max(roi.minY,1);
    let toY=Math.min(roi.height,roiMap.height-2);
    // not optimized  if width=1 !
    for (let x of [0, roi.width-1]) {
        for (let y = 0; y < roi.height; y++) {
            let target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (Math.max(roi.minY,y)>0 && pixels[target] == roi.id && pixels[target - roiMap.width] != roiMap.id) return pixels[target - roiMap.width];
            if (Math.min(roi.maxY,y)<(roiMap.height-1) && pixels[target] == roi.id && pixels[target + roiMap.width] != roiMap.id) return pixels[target + roiMap.width];
        }
    }

    return 0; // the selection takes the whole rectangle
}
