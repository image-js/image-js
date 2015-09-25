import Image from '../image';
import * as KindNames from '../kindNames';

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
        this.computed = {};
    }

    extract(image, {fill = false, scale = 1} = {}) {
        // we use a slow way

        let mask;
        if (fill) {
            mask = this.filledMask;
        } else {
            mask = this.mask;
        }

        if (scale < 1) {
            mask = mask.resizeBinary(scale);
        }

        return image.extract(mask);
    }

    get width() {
        return this.maxX - this.minX + 1;
    }

    get height() {
        return this.maxY - this.minY + 1;
    }

    get surround() {
        if (this.computed.surround) return this.computed.surround;
        return this.computed.surround = getSurroundingIDs(this);
    }

    get internalMapIDs() {
        if (this.computed.internalMapIDs) return this.computed.internalMapIDs;
        return this.computed.internalMapIDs = getInternalMapIDs(this);
    }

    get external() { // points of the ROI that touch the rectangular shape
        if (this.computed.external) return this.computed.external;
        return this.computed.external = getExternal(this);
    }

    get contour() {
        if (this.computed.contour) return this.computed.contour;
        return this.computed.contour = getContour(this);
    }

    get border() {
        if (this.computed.border) return this.computed.border;
        return this.computed.border = getBorder(this);
    }

    get mask() {
        if (this.computed.mask) return this.computed.mask;

        let img = new Image(this.width, this.height, {
            kind: KindNames.BINARY,
            position: [this.minX, this.minY],
            parent: this.map.parent
        });

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.map.pixels[x + this.minX + (y + this.minY) * this.map.width] === this.id) {
                    img.setBitXY(x, y);
                }
            }
        }
        return this.computed.mask = img;
    }

    get filledMask() {
        if (this.computed.filledMask) return this.computed.filledMask;

        let img = new Image(this.width, this.height, {
            kind: KindNames.BINARY,
            position: [this.minX, this.minY],
            parent: this.map.parent
        });

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let target = x + this.minX + (y + this.minY) * this.map.width;
                if (this.internalMapIDs.indexOf(this.map.pixels[target]) >= 0) {
                    img.setBitXY(x, y);
                } // by default a pixel is to 0 so no problems, it will be transparent
            }
        }

        return this.computed.filledMask = img;
    }
}


/* it should really be an array to solve complex cases related to border effect
 Like the image
 0000
 1111
 0000
 1111

 The first row of 1 will be surrouned by 2 differents zones

 Or even worse
 010
 111
 010
 The cross will be surrouned by 4 differents zones

 However in most of the cases it will be an array of one element
 */

function getSurroundingIDs(roi) {
    let surrounding = new Array(1);

    let ptr = 0;
    let roiMap = roi.map;
    let pixels = roiMap.pixels;
    // we check the first line and the last line
    let fromX = Math.max(roi.minX, 1);
    let toX = Math.min(roi.width, roiMap.width - 2);

    // not optimized  if height=1 !
    for (let y of [0, roi.height - 1]) {
        for (let x = 0; x < roi.width; x++) {
            let target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if ((x - roi.minX) > 0 && pixels[target] === roi.id && pixels[target - 1] !== roi.id) {
                let value = pixels[target - 1];
                if (surrounding.indexOf(value) === -1) {
                    surrounding[ptr++] = value;
                }
            }
            if ((roiMap.width - x - roi.minX) > 1 && pixels[target] === roi.id && pixels[target + 1] !== roi.id) {
                let value = pixels[target + 1];
                if (surrounding.indexOf(value) === -1) {
                    surrounding[ptr++] = value;
                }
            }
        }
    }


    // we check the first column and the last column
    let fromY = Math.max(roi.minY, 1);
    let toY = Math.min(roi.height, roiMap.height - 2);
    // not optimized  if width=1 !
    for (let x of [0, roi.width - 1]) {
        for (let y = 0; y < roi.height; y++) {
            let target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if ((y - roi.minY) > 0 && pixels[target] === roi.id && pixels[target - roiMap.width] !== roi.id) {
                let value = pixels[target - roiMap.width];
                if (surrounding.indexOf(value) === -1) {
                    surrounding[ptr++] = value;
                }
            }
            if ((roiMap.height - y - roi.minY) > 1 && pixels[target] === roi.id && pixels[target + roiMap.width] !== roi.id) {
                let value = pixels[target + roiMap.width];
                if (surrounding.indexOf(value) === -1) {
                    surrounding[ptr++] = value;
                }
            }
        }
    }
    if (surrounding[0] === undefined) return [0];
    return surrounding; // the selection takes the whole rectangle
}


/*
 We get the number of pixels of the ROI that touch the rectangle
 This is useful for the calculation of the border
 because we will ignore those special pixels of the rectangle
 border that don't have neighbourgs all around them.
 */

function getExternal(roi) {
    let total = 0;
    let roiMap = roi.map;
    let pixels = roiMap.pixels;

    let topBottom = [0];
    if (roi.height > 1) topBottom[1] = roi.height - 1;
    for (let y of topBottom) {
        for (let x = 1; x < roi.width - 1; x++) {
            let target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (pixels[target] === roi.id) {
                total++;
            }
        }
    }

    let leftRight = [0];
    if (roi.width > 1) leftRight[1] = roi.width - 1;
    for (let x of leftRight) {
        for (let y = 0; y < roi.height; y++) {
            let target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (pixels[target] === roi.id) {
                total++;
            }
        }
    }
    return total;
}

/*
 We will calculate the number of pixels that are involved in border
 Border are all the pixels that touch another "zone". It could be external
 or internal
 All the pixels that touch the box are part of the border and
 are calculated in the getBoxPixels procedure
 */
function getBorder(roi) {
    let total = 0;
    let roiMap = roi.map;
    let pixels = roiMap.pixels;

    for (let x = 1; x < roi.width - 1; x++) {
        for (let y = 1; y < roi.height - 1; y++) {
            let target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (pixels[target] === roi.id) {
                // if a pixel around is not roi.id it is a border
                if ((pixels[target - 1] !== roi.id) ||
                    (pixels[target + 1] !== roi.id) ||
                    (pixels[target - roiMap.width] !== roi.id) ||
                    (pixels[target + roiMap.width] !== roi.id)) {
                    total++;
                }
            }
        }
    }
    return total + roi.external;
}

/*
 We will calculate the number of pixels that are in the external border
 Contour are all the pixels that touch an external "zone".
 All the pixels that touch the box are part of the border and
 are calculated in the getBoxPixels procedure
 */
function getContour(roi) {
    let total = 0;
    let roiMap = roi.map;
    let pixels = roiMap.pixels;

    for (let x = 1; x < roi.width - 1; x++) {
        for (let y = 1; y < roi.height - 1; y++) {
            let target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (pixels[target] === roi.id) {
                // if a pixel around is not roi.id it is a border
                if ((roi.surround.indexOf(pixels[target - 1]) !== -1) ||
                    (roi.surround.indexOf(pixels[target + 1]) !== -1) ||
                    (roi.surround.indexOf(pixels[target - roiMap.width]) !== -1) ||
                    (roi.surround.indexOf(pixels[target + roiMap.width]) !== -1)) {
                    total++;
                }
            }
        }
    }
    return total + roi.external;
}

/*
We will calculate all the ids of the map that are "internal"
This will allow to extract the 'plain' image
 */
function getInternalMapIDs(roi) {
    let internal = [roi.id];
    let roiMap = roi.map;
    let pixels = roiMap.pixels;



    if (roi.height > 2) {
        for (let x = 0; x < roi.width; x++) {
            let target = (roi.minY) * roiMap.width + x + roi.minX;
            if (internal.indexOf(pixels[target]) >= 0) {
                let id = pixels[target + roiMap.width];
                if ((internal.indexOf(id) === -1) && (roi.surround.indexOf(id) === -1)) {
                    internal.push(id);
                }
            }
        }
    }

    let array = new Array(4);
    for (let x = 1; x < roi.width - 1; x++) {
        for (let y = 1; y < roi.height - 1; y++) {
            let target = (y + roi.minY) * roiMap.width + x + roi.minX;
            if (internal.indexOf(pixels[target]) >= 0) {
                // we check if one of the neighbour is not yet in

                array[0] = pixels[target - 1];
                array[1] = pixels[target + 1];
                array[2] = pixels[target - roiMap.width];
                array[3] = pixels[target + roiMap.width];

                for (let i = 0; i < 4; i++) {
                    let id = array[i];
                    if ((internal.indexOf(id) === -1) && (roi.surround.indexOf(id) === -1)) {
                        internal.push(id);
                    }
                }
            }
        }
    }

    return internal;
}