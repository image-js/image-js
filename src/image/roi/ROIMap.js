/**
 * Contains an array of the same size of the original image containings
 * the region to which belongs each of the pixels
 * @class ROIMap
 */

export default class ROIMap {
    constructor(parent, data) {
        this.parent = parent;
        this.width = parent.width;
        this.height = parent.height;
        this.data = data;
        this.negative = 0;
        this.positive = 0;
    }

    get total() {
        return this.negative + this.positive;
    }
}
