'use strict';

import createROIMap from './createROIMap';
import createROI from './createROI';

export default class ROIManager {

    constructor(image, options = {}) {
        this._image = image;
        this._options = options;
        this._layers = {};
        this._painted;
    }

    putMask(mask, maskLabel = 'default', options = {}) {
        var opt = Object.assign({}, this._options, options);
        this._layers[maskLabel] = new ROILayer(mask, opt);
    }

    getROIMap(maskLabel = 'default') {
        if (! this._layers[maskLabel]) return;
        return  this._layers[maskLabel].roiMap;
    }

    getROI(maskLabel = 'default', {
            positive=true,
            negative=true,
            minSurface=0,
            maxSurface=Number.POSITIVE_INFINITY
        } = {}) {
        var allROIs=this._layers[maskLabel].roi;
        var rois=new Array(allROIs.length);
        var ptr=0;
        for (var i=0; i<allROIs.length; i++) {
            var roi=allROIs[i];
            if (((roi.id<0 && negative) || roi.id>0 && positive)
                && roi.surface>minSurface
                && roi.surface<maxSurface) {
                rois[ptr++]=roi;
            }
        }
        rois.length=ptr;
        return rois;
    }

    getROIMasks(maskLabel = 'default', options = {}) {
        var rois=this.getROI(maskLabel, options);
        var masks=new Array(rois.length);
        for (var i=0; i<rois.length; i++) {
            masks[i]=rois[i].getMask();
        }
        return masks;
    }

    getPixels(maskLabel = 'default', options = {}) {
        if (this._layers[maskLabel]) {
            return this._layers[maskLabel].roiMap.pixels;
        }
        return;
    }

    paint(maskLabel = 'default', options = {}) {
        if (!this._painted) this._painted=this._image.clone();
        var masks=this.getROIMasks(maskLabel, options);
        this._painted.paintMasks(masks, options);
        return this._painted;
    }


    resetPainted() {
        this._painted=undefined;
    }

}

class ROILayer {
    constructor(mask, options) {
        this.mask = mask;
        this.options = options;
        this.roiMap = createROIMap(this.mask, options);
        this.roi = createROI(this.roiMap);
    }
}