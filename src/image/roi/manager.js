import fromMask from './creator/fromMask';
import fromMask2 from './creator/fromMask2';
import fromExtrema from './creator/fromExtrema';
import fromWaterShed from './creator/fromWaterShed';
import fromPoints from './creator/fromPoints';
import extendObject from 'extend';
import Image from '../image';
import ROIMap from './ROIMap';
import ROILayer from './ROILayer';

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

    /**
     *
     * @param {object} [options]
     * @returns {ROIManager}
     */
    fromExtrema(options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromExtrema.call(this._image, options);
        this._layers[opt.label] = new ROILayer(roiMap, opt);
    }

    /**
     * @param {[[number]]} points - an array of points
     * @param {object} [options]
     * @returns {ROIManager}
     */
    fromPoints(points, options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromPoints.call(this._image, points, options);
        this._layers[opt.label] = new ROILayer(roiMap, opt);
        return this;
    }


    /**
     * @param {number[]} roiMap
     * @param {object} [options]
     */
    putMap(roiMap, options = {}) {
        let map = new ROIMap(this._image, roiMap);
        let opt = extendObject({}, this._options, options);
        this._layers[opt.label] = new ROILayer(map, opt);
        return this;
    }

    /**
     *
     * @param {object} [options]
     * @returns {ROIManager}
     */
    fromWaterShed(options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromWaterShed.call(this._image, options);
        this._layers[opt.label] = new ROILayer(roiMap, opt);
    }

    /**
     *
     * @param {Image} mask
     * @param {object} [options]
     * @returns {ROIManager}
     */
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

    /**
     *
     * @param {object} [options]
     * @returns {ROIMap}
     */
    getMap(options = {}) {
        let opt = extendObject({}, this._options, options);
        if (!this._layers[opt.label]) return;
        return this._layers[opt.label].roiMap;
    }


    /**
     * Return the IDs of the Regions Of Interest (ROI) as an array of number
     * @param {object} [options]
     * @returns {[number]}
     */
    getROIIDs(options = {}) {
        let rois = this.getROI(options);
        if (!rois) return;
        let ids = new Array(rois.length);
        for (let i = 0; i < rois.length; i++) {
            ids[i] = rois[i].id;
        }
        return ids;
    }

    /**
     * Allows to select ROI based on size, label and sign.
     * @param {object} [options={}]
     * @param {string} [options.label='default'] Label of the layer containing the ROI
     * @param {boolean} [options.positive=true] Select the positive region of interest
     * @param {boolean} [options.negative=true] Select he negative region of interest
     * @param {number} [options.minSurface=0]
     * @param {number} [options.maxSurface=Number.POSITIVE_INFINITY]
     * @param {number} [options.minWidth=0]
     * @param {number} [options.minHeight=Number.POSITIVE_INFINITY]
     * @param {number} [options.maxWidth=0]
     * @param {number} [options.maxHeight=Number.POSITIVE_INFINITY]
     * @returns {[ROI]}
     */

    getROI(options = {}) {
        let {
            label = this._options.label,
            positive = true,
            negative = true,
            minSurface = 0,
            maxSurface = Number.POSITIVE_INFINITY,
            minWidth = 0,
            maxWidth = Number.POSITIVE_INFINITY,
            minHeight = 0,
            maxHeight = Number.POSITIVE_INFINITY
        } = options;

        if (!this._layers[label]) {
            throw new Error('getROI: This ROI layer (' + label + ') does not exists.');
        }

        let allROIs = this._layers[label].roi;

        // todo Is this old way to change the array size still faster ?
        let rois = new Array(allROIs.length);
        let ptr = 0;
        for (let i = 0; i < allROIs.length; i++) {
            let roi = allROIs[i];
            if (((roi.id < 0 && negative) || roi.id > 0 && positive)
                && roi.surface >= minSurface
                && roi.surface <= maxSurface
                && roi.width >= minWidth
                && roi.width <= maxWidth
                && roi.height >= minHeight
                && roi.height <= maxHeight
            ) {
                rois[ptr++] = roi;
            }
        }
        rois.length = ptr;
        return rois;
    }

    /**
     * Returns an array of masks
     * @param {object} [options]
     * @returns {[Image]} Retuns an array of masks (1 bit Image)
     */
    getMasks(options = {}) {
        let rois = this.getROI(options);

        let masks = new Array(rois.length);
        for (let i = 0; i < rois.length; i++) {
            masks[i] = rois[i].getMask(options);
        }
        return masks;
    }

    /**
     *
     * @param {object} [options]
     * @returns {[number]}
     */
    getData(options = {}) {
        let opt = extendObject({}, this._options, options);
        if (this._layers[opt.label]) {
            return this._layers[opt.label].roiMap.data;
        }
    }

    /**
     * Paint the ROI on a copy of the image adn return this image.
     * @param {object} [options] - all the options to select ROIs
     * @param {array<number>} [options.color=[255,0,0]] - Array of 3 elements (R, G, B), default is red.
     * @param {number} [options.alpha=255] - Value from 0 to 255.
     * @param {array<array<number>>} [options.colors] - Array of Array of 3 elements (R, G, B) for each color of each mask
     * @param {number} [options.scale=1] - Scaling factor to apply to the mask
     * @param {string} [options.kind='normal'] - 'contour', 'box', 'filled', 'center' or 'normal'
     * @param {boolean} [options.randomColors=false]  To paint each mask with a random color
     * @param {boolean} [options.distinctColors=false] To paint each mask with a different color
     * @param {boolean|string} [options.showLabels=false] Paint a mask property on the image. If true will display the 'id'.
     *                      May be any property of the ROI.
     * @param {string} [options.labelColor='blue'] Define the color to paint the labels
     * @param {string} [options.labelFont='12px Helvetica']
     *
     *  id: true / false
     *  color
     * @returns {*|null}
     */

    paint(options = {}) {
        let {showLabels, labelColor = 'blue', labelFont = '12px Helvetica'} = options;

        if (!this._painted) this._painted = this._image.rgba8();
        let masks = this.getMasks(options);

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

    /**
     * Reset the changes to the current painted iamge to the image that was
     * used during the creation of the ROIManager except if a new image is
     * specified as parameter;
     * #param {object} [options]
     * @param {Image} [options.image] A new iamge that you would like to sue for painting over
     */
    resetPainted(options = {}) {
        const {image} = options;
        if (image) {
            this._painted = this.image.rgba8();
        } else {
            this._painted = this._image.rgba8();
        }
    }

    /**
     *  Return a new roiMAP changed with the fusion of certain ROIs.
     * @param {object} [options]
     * @param {string} [algorithm='commonBorder'] ; algorithm used to decide which ROIs are merged.
     * @param {number} [minCommonBorderLength=5] is an integer, determine the strength of the merging.
     * @returns {*}
     */

    mergeROI(options = {}) {
        let opt = extendObject({}, this._options, options);
        let {
            algorithm = 'commonBorder',
            minCommonBorderLength = 5
        } = options;
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
        let data = this.getMap(opt).data;
        for (let index = 0; index < data.length; index++) {
            if (data[index] !== 0) {
                for (let array of toMerge) {
                    if (data[index] === array[0]) {
                        data[index] = array[1];
                    }
                }
            }
        }
        this.putMap(data, opt);
    }
}


