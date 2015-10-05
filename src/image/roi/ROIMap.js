export default class ROIMap {
    constructor(parent, pixels, negativeID, positiveID) {
        this.parent = parent;
        this.width = parent.width;
        this.height = parent.height;
        this.pixels = pixels; // pixels containing the annotations
        this.negative = -negativeID; // number of negative zones
        this.positive = positiveID; // number of positivie zones
        this.total = positiveID - negativeID; // total number of zones
    }
}
