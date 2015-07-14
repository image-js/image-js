'use strict';

export default class ROI {

    constructor(map, id) {
        this.map = map;
        this.id = id;
        this.surround = 0; // what is the map value surrounding
        this.minX = Number.POSITIVE_INFINITY;
        this.maxX = Number.NEGATIVE_INFINITY;
        this.minY = Number.POSITIVE_INFINITY;
        this.maxY = Number.NEGATIVE_INFINITY;
        this.meanX = 0;
        this.meanY = 0;
        this.surface = 0;
    }

    getMask() {
        if (this.mask) return this.mask;

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

        return this.mask = img;
    }

}