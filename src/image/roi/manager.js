import fromMask from './creator/fromMask';
import fromMask2 from './creator/fromMask2';
import fromExtrema from './creator/fromExtrema';
import fromWaterShed from './creator/fromWaterShed';
import fromPoints from './creator/fromPoints';
import createROI from './createROI';
import extendObject from 'extend';
import Image from '../image';
import ROIMap from './ROIMap';

/**
 * A manager of Regions of Interest. A ROIManager is related to a specific Image
 * and may contain multiple layers. Each layer is characterized by a label whose is
 * name by default 'default'
 * @class ROIManager
 * @param {Image} image
 * @param {object} [options]
 */
export default class ROIManager {
    constructor(image, options = {}) {
        this._image = image;
        this._options = options;
        if (!this._options.label) this._options.label = 'default';
        this._layers = {};
        this._painted = null;
    }

    fromExtrema(options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromExtrema.call(this._image, options);
        this._layers[opt.label] = new ROILayer(roiMap, opt);
    }

    /**
     * @param {[[number]]} pixels - an array of pixels
     * @param {object} options
     */
    fromPoints(pixels, options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromPoints.call(this._image, pixels, options);
        this._layers[opt.label] = new ROILayer(roiMap, opt);
        return this;
    }


    /**
     * @param {number[]} roiMap
     * @param options
     */
    putMap(roiMap, options = {}) {
        let map = new ROIMap(this._image, roiMap);
        let opt = extendObject({}, this._options, options);
        this._layers[opt.label] = new ROILayer(map, opt);
        return this;
    }


    fromWaterShed(options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromWaterShed.call(this._image, options);
        this._layers[opt.label] = new ROILayer(roiMap, opt);
    }

    fromMask(mask, options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromMask.call(this._image, mask, options);
        this._layers[opt.label] = new ROILayer(roiMap, opt);
        return this;
    }


    fromMask2(mask, options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromMask2.call(this._image, mask, options);
        this._layers[opt.label] = new ROILayer(roiMap, opt);
        return this;
    }


    getMap(options = {}) {
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
                && roi.surface >= minSurface
                && roi.surface <= maxSurface) {
                rois[ptr++] = roi;
            }
        }
        rois.length = ptr;
        return rois;
    }


    getMasks(options = {}) {
        let rois = this.getROI(options);

        let masks = new Array(rois.length);
        for (let i = 0; i < rois.length; i++) {
            masks[i] = rois[i].mask;
        }
        return masks;
    }

    getContours(options = {}) {
        let rois = this.getROI(options);

        let contours = new Array(rois.length);
        for (let i = 0; i < rois.length; i++) {
            contours[i] = rois[i].contour;
        }
        return contours;
    }

    getPixels(options = {}) {
        let opt = extendObject({}, this._options, options);
        if (this._layers[opt.label]) {
            return this._layers[opt.label].roiMap.pixels;
        }
    }

    /**
     * Paint the ROI on a copy of the image adn return this image.
     * @param options : all the options to select ROIs
     * @param color {array} [$1.color=[max,0,0]] - Array of 3 elements (R, G, B), default is red.
     * @param alpha Value from 0 to 255 to specify the alpha. Will be used if it is unspecified
     * @param colors {array} Array of Array of 3 elements (R, G, B) for each color of each mask
     * @param contour {boolean} true if display only the contour
     * @param randomColors If we we would like to paint each mask with a random color
     * @param distinctColors If we we would like to paint each mask with a different color (default: false);
     * @param showLabels Paint a mask property on the image (default: false). If true will display the 'id'.
     *                      May be any property of the ROI. . Requires a RGBA image !
     * @param labelColor Define the color to paint the labels (default : 'blue')
     * @param labelFont Define the size of the labels ID (default : '12px Helvetica')
     *  id: true / false
     *  color
     * @returns {*|null}
     */

    paint(options = {}) {
        let showLabels = options.showLabels;
        let labelColor = options.labelColor || 'blue';
        let labelFont = options.labelFont || '12px Helvetica';

        if (!this._painted) this._painted = this._image.rgba8();
        let masks;
        if (options.contour) {
            masks = this.getContours(options);
        } else {
            masks = this.getMasks(options);
        }

        this._painted.paintMasks(masks, options);

        if (showLabels) {
            if (showLabels === true) showLabels = 'id';
            let canvas = this._painted.getCanvas({originalData: true});
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = labelColor;
            ctx.font = labelFont;
            let rois = this.getROI(options);
            for (let i = 0; i < rois.length; i++) {
                ctx.fillText(rois[i][showLabels], rois[i].meanX - 3, rois[i].meanY + 3);
            }
            this._painted.data = ctx.getImageData(0, 0, this._painted.width, this._painted.height).data;
        }
        return this._painted;
    }

    // return a mask corresponding to all the selected masks
    getMask(options = {}) {
        let mask = new Image(this._image.width, this._image.height, {kind:'BINARY'});
        let masks = this.getMasks(options);

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

    /**
     *  Return a new roiMAP changed with the fusion of certain ROIs.
     * @param rois is an array of ROIs which shares the same roiMAP.
     * @param algorithm ; algorithm used to decide which ROIs are merged.
     * @param value is an integer, determine the strength of the merging.
     * @returns {*}
     */

    mergeROI(options = {}) {
        let opt = extendObject({}, this._options, options);
        let algorithm = opt.algorithm || 'commonBorder';
        let minCommonBorderLength = opt.minCommonBorderLength || 5;
        let rois = this.getROI(opt);
        let toMerge = new Set();
        switch (algorithm.toLowerCase()) {
            //Algorithms. We can add more algorithm to create other types of merging.
            case 'commonborder' :
                for (let i = 0; i < rois.length; i++) {
                    for (let k = 0; k < rois[i].borderIDs.length; k++) {
                        //If the length of wall of the current region and his neighbour is big enough, we join the rois.
                        if (rois[i].borderIDs[k] !== 0 && rois[i].borderIDs[k] < rois[i].id && rois[i].borderLengths[k] * minCommonBorderLength >= rois[i].border) {
                            toMerge.add([rois[i].id, rois[i].borderIDs[k]]);
                        }
                    }
                }
                break;
        }


        //Now we can modify the roiMap by merging each region determined before
        let pixels = this.getMap(opt).pixels;
        for (let index = 0; index < pixels.length; index++) {
            if (pixels[index] !== 0) {
                for (let array of toMerge) {
                    if (pixels[index] === array[0]) {
                        pixels[index] = array[1];
                    }
                }
            }
        }
        this.putMap(pixels, opt);
    }
}

class ROILayer {
    constructor(roiMap, options) {
        this.roiMap = roiMap;
        this.options = options;
        this.roi = createROI(this.roiMap);
    }
}
