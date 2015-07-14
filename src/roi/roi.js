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
        return this.maxX - this.minX;
    }

    get height() {
        return this.maxY - this.minY;
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
    console.log(roi);
    var roiMap = roi.map;
    var pixels = roiMap.pixels;
    // we check the first line and the last line

    // TODO calculate fromX, fromY, toX, toY when not on border


    for (let y = 0; y < roi.height; y += roi.height - 1) {
        for (let x = 1; x < roi.width - 1; x++) {
            let target = (y + roi.minY) * roiMap.width + x + roi.minX;
            console.log(pixels[target], roi.id);
            if (pixels[target] == roi.id && pixels[target - 1] != roi.id) return pixels[target - 1];
            if (pixels[target] == roi.id && pixels[target + 1] != roi.id) return pixels[target + 1];
        }
    }
    // we check the first column and the last column
    for (let x = 0; x < roiMap.width; x += roiMap.width - 1) {
        for (let y = 1; x < roiMap.height - 1; x++) {
            let target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (pixels[target] == roi.id && pixels[target - roiMap.width] != roiMap.id) return pixels[target - roiMap.width];
            if (pixels[target] == roi.id && pixels[target + roiMap.width] != roiMap.id) return pixels[target + roiMap.width];
        }
    }

    return 0;
}
