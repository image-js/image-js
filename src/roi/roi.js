'use strict';

export default class ROI {

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
        this.computed={}; // what is the map value surrounding
    }

    get surround() {
        if (this.computed.surround) return this.computed.surround;

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


function getSurroundingID(roi, roiMap) {
    var pixels=roiMap.pixels;
    // we check the first line and the last line
    for (let y in [0, roiMap.height - 1]) {
        for (let x = 1; x < roiMap.width-1; x++) {
            let target = y * roiMap.width + x;
            if (pixels[target] == roiMap.id && pixels[target - 1] != roiMap.id) return pixels[target - 1];
            if (pixels[target] == roiMap.id && pixels[target + 1] != roiMap.id) return pixels[target + 1];
        }
    }
    // we check the first column and the last column
    for (let x in [0, roiMap.width - 1]) {
        for (let y = 1; x < roiMap.height-1; x++) {
            let target = y * roiMap.width + x;
            if (pixels[target] == roiMap.id && pixels[target - roiMap.width] != roiMap.id) return pixels[target - roiMap.width];
            if (pixels[target] == roiMap.id && pixels[target + roiMap.width] != roiMap.id) return pixels[target + roiMap.width];
        }
    }

    return 0;
}
