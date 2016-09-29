/**
 * The roiMap is an array of the size of the original image data that contains
 * positive and negative numbers. When the number is common, it corresponds
 * to one region of interest (ROI)
 *
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
