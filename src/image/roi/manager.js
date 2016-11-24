import fromMask from './creator/fromMask';
import fromMaxima from './creator/fromMaxima';
import fromWaterShed from './creator/fromWaterShed';
import fromPoints from './creator/fromPoints';
import extendObject from 'extend';
import Image from '../Image';
import RoiMap from './RoiMap';
import RoiLayer from './RoiLayer';

/**
 * A manager of Regions of Interest. A RoiManager is related to a specific Image
 * and may contain multiple layers. Each layer is characterized by a label whose is
 * name by default 'default'
 * @class RoiManager
 * @param {Image} image
 * @param {object} [options]
 */
export default class RoiManager {
    constructor(image, options = {}) {
        this._image = image;
        this._options = options;
        if (!this._options.label) {
            this._options.label = 'default';
        }
        this._layers = {};
        this._painted = null;
    }

    // docs is in the corresponding file
    fromMaxima(options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromMaxima.call(this._image, options);
        this._layers[opt.label] = new RoiLayer(roiMap, opt);
    }

    // docs is in the corresponding file
    fromPoints(points, options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromPoints.call(this._image, points, options);
        this._layers[opt.label] = new RoiLayer(roiMap, opt);
        return this;
    }


    /**
     * @param {number[]} roiMap
     * @param {object} [options]
     * @return {this}
     */
    putMap(roiMap, options = {}) {
        let map = new RoiMap(this._image, roiMap);
        let opt = extendObject({}, this._options, options);
        this._layers[opt.label] = new RoiLayer(map, opt);
        return this;
    }

    // docs is in the corresponding file
    fromWaterShed(options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromWaterShed.call(this._image, options);
        this._layers[opt.label] = new RoiLayer(roiMap, opt);
    }

    // docs is in the corresponding file
    fromMask(mask, options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromMask.call(this._image, mask, options);
        this._layers[opt.label] = new RoiLayer(roiMap, opt);
        return this;
    }


    /* Seems slower and less general (only provides positive Roi)
    fromMaskConnectedComponentLabelingAlgorithm(mask, options = {}) {
        let opt = extendObject({}, this._options, options);
        let roiMap = fromMask2.call(this._image, mask, options);
        this._layers[opt.label] = new RoiLayer(roiMap, opt);
        return this;
    }
     */

    /**
     *
     * @param {object} [options]
     * @return {RoiMap}
     */
    getMap(options = {}) {
        let opt = extendObject({}, this._options, options);
        this._assertLayerWithLabel(opt.label);
        return this._layers[opt.label].roiMap;
    }


    /**
     * Return the IDs of the Regions Of Interest (Roi) as an array of number
     * @param {object} [options]
     * @return {number[]}
     */
    getRoiIds(options = {}) {
        let rois = this.getRois(options);
        if (rois) {
            let ids = new Array(rois.length);
            for (let i = 0; i < rois.length; i++) {
                ids[i] = rois[i].id;
            }
            return ids;
        }
        throw new Error('ROIs not found');
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
     * @return {Roi[]}
     */
    getRois(options = {}) {
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
            throw new Error('getRoi: This Roi layer (' + label + ') does not exists.');
        }

        let allRois = this._layers[label].roi;

        // todo Is this old way to change the array size still faster ?
        let rois = new Array(allRois.length);
        let ptr = 0;
        for (let i = 0; i < allRois.length; i++) {
            let roi = allRois[i];
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
     * See @links Roi.getMask for the options
     * @param {object} [options]
     * @return {Image[]} Retuns an array of masks (1 bit Image)
     */
    getMasks(options = {}) {
        let rois = this.getRois(options);

        let masks = new Array(rois.length);
        for (let i = 0; i < rois.length; i++) {
            masks[i] = rois[i].getMask(options);
        }
        return masks;
    }

    /**
     *
     * @param {object} [options]
     * @return {number[]}
     */
    getData(options = {}) {
        let opt = extendObject({}, this._options, options);
        this._assertLayerWithLabel(opt.label);
        return this._layers[opt.label].roiMap.data;
    }

    /**
     * Paint the ROI on a copy of the image adn return this image.
     * For painting options @links Image.paintMasks
     * For ROI selection options @links RoiManager.getMasks
     * @param {object} [options] - all the options to select ROIs
     * @param {string} [options.labelProperty] - Paint a mask property on the image.
     *                                  May be any property of the ROI like
     *                                  for example id, surface, width, height, meanX, meanY.
     * @return {Image} - The painted RGBA 8 bits image
     */
    paint(options = {}) {
        let {
            labelProperty
        } = options;
        if (!this._painted) {
            this._painted = this._image.rgba8();
        }
        let masks = this.getMasks(options);

        if (labelProperty) {
            let rois = this.getRois(options);
            options.labels = rois.map((roi) => roi[labelProperty]);
            options.labelsPosition = rois.map((roi) => [roi.meanX, roi.meanY]);
        }

        this._painted.paintMasks(masks, options);
        return this._painted;
    }

    // return a mask corresponding to all the selected masks
    getMask(options = {}) {
        let mask = new Image(this._image.width, this._image.height, {kind: 'BINARY'});
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
     * used during the creation of the RoiManager except if a new image is
     * specified as parameter;
     * @param {object} [options]
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
     * Return a new roiMAP changed with the fusion of certain ROIs.
     * @param {object} [options]
     * @param {string} [options.algorithm='commonBorder'] ; algorithm used to decide which ROIs are merged.
     * @param {number} [options.minCommonBorderLength=5] is an integer, determine the strength of the merging.
     * @return {this}
     */
    mergeRoi(options = {}) {
        let opt = extendObject({}, this._options, options);
        let {
            algorithm = 'commonBorder',
            minCommonBorderLength = 5
        } = options;
        let rois = this.getRois(opt);
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
            default:
                throw new Error(`Unexpected algorithm: ${algorithm}`);
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

        return this;
    }


    findCorrespondingRoi(roiMap, options = {}) {
        let allRois = this.getRois(options);
        let allRelated = [];
        for (let i = 0; i < allRois.length; i++) {
            let currentRoi = allRois[i];
            let x = currentRoi.minX;
            let y = currentRoi.minY;
            let allPoints = currentRoi.points;
            let roiSign = Math.sign(currentRoi.id);
            let currentRelated = correspondingRoisInformation(x, y, allPoints, roiMap, roiSign);
            allRelated.push(currentRelated);
        }
        return allRelated;
    }


    _assertLayerWithLabel(label) {
        if (!this._layers[label]) {
            throw new Error(`no layer with label ${label}`);
        }
    }


}

function correspondingRoisInformation(x, y, points, roiMap, roiSign) {
    let correspondingRois = {id: [], surface: [], roiSurfaceCovered: [], same: 0, opposite: 0, total: 0};
    for (let i = 0; i < points.length; i++) {
        let currentPoint = points[i];
        let currentX = currentPoint[0];
        let currentY = currentPoint[1];
        let correspondingRoiMapIndex = (currentX + x) + (currentY + y) * roiMap.width;
        let value = roiMap.data[correspondingRoiMapIndex];

        if (value > 0 || value < 0) {
            if (correspondingRois.id.includes(value)) {
                correspondingRois.surface[correspondingRois.id.indexOf(value)] += 1;
            } else {
                correspondingRois.id.push(value);
                correspondingRois.surface.push(1);
            }
        }
    }

    for (let i = 0; i < correspondingRois.id.length; i++) {
        let currentSign = Math.sign(correspondingRois.id[i]);
        if (currentSign === roiSign) {
            correspondingRois.same += correspondingRois.surface[i];
        } else {
            correspondingRois.opposite += correspondingRois.surface[i];
        }
        correspondingRois.roiSurfaceCovered[i] = correspondingRois.surface[i] / points.length;
    }
    correspondingRois.total = correspondingRois.opposite + correspondingRois.same;

    return correspondingRois;
}

