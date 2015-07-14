'use strict';

import createROIMap from './createROIMap';
import createROI from './createROI';

export default class ROIManager {

    constructor(image, options = {}) {
        this._image = image;
        this._options = options;
        this._layers = {};
    }

    putMask(mask, maskLabel = 'default', options = {}) {
        var opt = Object.assign({}, this._options, options);
        this._layers[maskLabel] = new ROILayer(mask, opt);
    }

    getROI(maskLabel = 'default') {
        return this._layers[maskLabel].roi;
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