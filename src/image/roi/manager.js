import fromMask from './creator/fromMask';
import fromExtrema from './creator/fromExtrema';
import fromPoints from './creator/fromPoints';
import createROI from './createROI';
import extendObject from 'extend';
import Image from '../image';


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
        let roiMap = fromExtrema.call(this._image, options);
        this._layers[opt.label] = new ROILayer(roiMap, opt);
    }

    generateROIFromPoints(points, options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromPoints.call(this._image, points, options);
        this._layers[opt.label] = new ROILayer(roiMap, opt);
    }

    putMask(mask, options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromMask.call(this._image, mask, options);
        this._layers[opt.label] = new ROILayer(roiMap, opt);
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

    // return a mask corresponding to all the selected masks
    getMask(options = {}) {
        let mask = Image.create(this._image.width, this._image.height, {kind:'BINARY'});
        let masks = this.getROIMasks(options);
        for (let i = 0; i < masks.length; i++) {
            let roi = masks[i];
            // we need to find the parent image to calculate the relative position

            for (let x = 0; x < roi.width; x++) {
                for (let y = 0; y < roi.height; y++) {
                    if (roi.getBitXY(x, y)) {
                        mask.setBitXY(x + roi.position[0], y + roi.position[1]);
                    }
                }
            }
        }
        return mask;
    }


    resetPainted(image) {
        this._painted = image;
    }
}

class ROILayer {
    constructor(roiMap, options) {
        this.roiMap = roiMap;
        this.options = options;
        this.roi = createROI(this.roiMap);
    }
}
