import createROIMapFromMask from './createROIMapFromMask';
import createROI from './createROI';
import extendObject from 'extend';

export default class ROIManager {

    constructor(image, options = {}) {
        this._image = image;
        this._options = options;
        this._layers = {};
        this._painted = null;
    }

    putMask(mask, maskLabel = 'default', options = {}) {
        let opt = extendObject({}, this._options, options);
        this._layers[maskLabel] = new ROILayer(mask, opt);
    }

    getROIMap(maskLabel = 'default') {
        if (!this._layers[maskLabel]) return;
        return this._layers[maskLabel].roiMap;
    }

    getROIIDs(maskLabel = 'default', options) {
        let rois = this.getROI(maskLabel, options);
        if (!rois) return;
        let ids = new Array(rois.length);
        for (let i = 0; i < rois.length; i++) {
            ids[i] = rois[i].id;
        }
        return ids;
    }

    getROI(maskLabel = 'default', {
        positive = true,
        negative = true,
        minSurface = 0,
        maxSurface = Number.POSITIVE_INFINITY
        } = {}) {
        let allROIs = this._layers[maskLabel].roi;
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

    getROIMasks(maskLabel = 'default', options = {}) {
        let rois = this.getROI(maskLabel, options);
        let masks = new Array(rois.length);
        for (let i = 0; i < rois.length; i++) {
            masks[i] = rois[i].mask;
        }
        return masks;
    }

    getPixels(maskLabel = 'default', options = {}) {
        if (this._layers[maskLabel]) {
            return this._layers[maskLabel].roiMap.pixels;
        }
    }

    paint(maskLabel = 'default', options = {}) {
        if (!this._painted) this._painted = this._image.clone();
        let masks = this.getROIMasks(maskLabel, options);
        this._painted.paintMasks(masks, options);
        return this._painted;
    }


    resetPainted() {
        this._painted = undefined;
    }

}

class ROILayer {
    constructor(mask, options) {
        this.mask = mask;
        this.options = options;
        this.roiMap = createROIMapFromMask(this.mask, options);
        this.roi = createROI(this.roiMap);
    }
}
