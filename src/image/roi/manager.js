import createROIMapFromMask from './creator/fromKask';
import createROIMapFromExtrema from './creator/fromExtrema';
import createROI from './createROI';
import extendObject from 'extend';


let FROM_EXTREMA = 1;
let FROM_MASK = 2;

export default class ROIManager {

    constructor(image, options = {}) {
        this._image = image;
        this._options = options;
        if (!this._options.lebel) this._options.label = 'default';
        this._layers = {};
        this._painted = null;
    }

    generateROIFromExtrema(options = {}) {
        let opt = extendObject({}, this._options, options);
        this._layers[opt.label] = new ROILayer(this._image, FROM_EXTREMA, opt);
    }

    putMask(mask, options = {}) {
        let opt = extendObject({}, this._options, options);
        this._layers[opt.label] = new ROILayer(mask, FROM_MASK, opt);
    }

    getROIMap(options = {}) {
        let opt = extendObject({}, this._options, options);
        if (!this._layers[opt.label]) return;
        return this._layers[opt.label].roiMap;
    }

    getROIIDs(options = {}) {
        let rois = this.getROI(options);
        if (!rois) return;
        let ids = new Array(rois.length);
        for (let i = 0; i < rois.length; i++) {
            ids[i] = rois[i].id;
        }
        return ids;
    }

    getROI({
        label = this._options.label,
        positive = true,
        negative = true,
        minSurface = 0,
        maxSurface = Number.POSITIVE_INFINITY
        } = {}) {

        let allROIs = this._layers[label].roi;
        let rois = new Array(allROIs.length);
        let ptr = 0;
        for (let i = 0; i < allROIs.length; i++) {
            let roi = allROIs[i];
            if (((roi.id < 0 && negative) || roi.id > 0 && positive)
                && roi.surface > minSurface
                && roi.surface < maxSurface) {
                rois[ptr++] = roi;
            }
        }
        rois.length = ptr;
        return rois;
    }

    getROIMasks(options = {}) {
        let rois = this.getROI(options);
        let masks = new Array(rois.length);
        for (let i = 0; i < rois.length; i++) {
            masks[i] = rois[i].mask;
        }
        return masks;
    }

    getPixels(options = {}) {
        let opt = extendObject({}, this._options, options);
        if (this._layers[opt.label]) {
            return this._layers[opt.label].roiMap.pixels;
        }
    }

    paint(options = {}) {
        if (!this._painted) this._painted = this._image.rgba8();
        let masks = this.getROIMasks(options);
        this._painted.paintMasks(masks, options);
        return this._painted;
    }


    resetPainted(image) {
        this._painted = image;
    }
}

class ROILayer {
    constructor(image, type, options) {
        this.options = options;
        switch (type) {
            case FROM_MASK:
                this.roiMap = createROIMapFromMask(image, options);
                break;
            case FROM_EXTREMA:
                this.roiMap = createROIMapFromExtrema(image, options);
                break;
        }
        this.roi = createROI(this.roiMap);
    }
}
