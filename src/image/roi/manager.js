import Qty from 'js-quantities';

import deepValue from '../../util/deepValue';
import Image from '../Image';

import RoiLayer from './RoiLayer';
import RoiMap from './RoiMap';
import fromMask from './creator/fromMask';
import fromMaskConnectedComponentLabelingAlgorithm from './creator/fromMaskConnectedComponentLabelingAlgorithm';
import fromMaxima from './creator/fromMaxima';
import fromPoints from './creator/fromPoints';
import fromWaterShed from './creator/fromWaterShed';

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
    let opt = Object.assign({}, this._options, options);
    let roiMap = fromMaxima.call(this._image, options);
    this._layers[opt.label] = new RoiLayer(roiMap, opt);
  }

  // docs is in the corresponding file
  fromPoints(points, options = {}) {
    let opt = Object.assign({}, this._options, options);
    let roiMap = fromPoints.call(this._image, points, options);
    this._layers[opt.label] = new RoiLayer(roiMap, opt);
    return this;
  }

  /**
   * @param {number[]} map
   * @param {object} [options]
   * @return {this}
   */
  putMap(map, options = {}) {
    let roiMap = new RoiMap(this._image, map);
    let opt = Object.assign({}, this._options, options);
    this._layers[opt.label] = new RoiLayer(roiMap, opt);
    return this;
  }

  // docs is in the corresponding file
  fromWaterShed(options = {}) {
    let opt = Object.assign({}, this._options, options);
    let roiMap = fromWaterShed.call(this._image, options);
    this._layers[opt.label] = new RoiLayer(roiMap, opt);
  }

  // docs is in the corresponding file
  fromMask(mask, options = {}) {
    let opt = Object.assign({}, this._options, options);
    let roiMap = fromMask.call(this._image, mask, options);
    this._layers[opt.label] = new RoiLayer(roiMap, opt);
    return this;
  }

  fromMaskConnectedComponentLabelingAlgorithm(mask, options = {}) {
    let opt = Object.assign({}, this._options, options);
    let roiMap = fromMaskConnectedComponentLabelingAlgorithm.call(
      this._image,
      mask,
      options,
    );
    this._layers[opt.label] = new RoiLayer(roiMap, opt);
    return this;
  }

  /**
   *
   * @param {object} [options]
   * @return {RoiMap}
   */
  getMap(options = {}) {
    let opt = Object.assign({}, this._options, options);
    this._assertLayerWithLabel(opt.label);
    return this._layers[opt.label].roiMap;
  }

  /**
   * Return statistics about rows
   * @param {object} [options]
   * @return {object[]}
   */
  rowsInfo(options = {}) {
    return this.getMap(options).rowsInfo();
  }

  /**
   * Return statistics about columns
   * @param {object} [options]
   * @return {object[]}
   */
  colsInfo(options = {}) {
    return this.getMap(options).rowsInfo();
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
   * @param {number} [options.minRatio=0] Ratio width / height
   * @param {number} [options.maxRatio=Number.POSITIVE_INFINITY]
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
      maxHeight = Number.POSITIVE_INFINITY,
      minRatio = 0,
      maxRatio = Number.POSITIVE_INFINITY,
    } = options;

    if (!this._layers[label]) {
      throw new Error(`this Roi layer (${label}) does not exist`);
    }

    const allRois = this._layers[label].roi;

    const rois = [];
    for (const roi of allRois) {
      if (
        ((roi.id < 0 && negative) || (roi.id > 0 && positive)) &&
        roi.surface >= minSurface &&
        roi.surface <= maxSurface &&
        roi.width >= minWidth &&
        roi.width <= maxWidth &&
        roi.height >= minHeight &&
        roi.height <= maxHeight &&
        roi.ratio >= minRatio &&
        roi.ratio <= maxRatio
      ) {
        rois.push(roi);
      }
    }
    return rois;
  }

  /**
   * Get an ROI by its id.
   * @param {number} roiId
   * @param {object} [options={}]
   * @param {string} [options.label='default'] Label of the layer containing the ROI
   * @return {Roi}
   */
  getRoi(roiId, options = {}) {
    const { label = this._options.label } = options;

    if (!this._layers[label]) {
      throw new Error(`this Roi layer (${label}) does not exist`);
    }

    const roi = this._layers[label].roi.find((roi) => roi.id === roiId);
    if (!roi) {
      throw new Error(`found no Roi with id ${roiId}`);
    }

    return roi;
  }

  /**
   * Returns an array of masks
   * See {@link Roi.getMask} for the options
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
   * Returns an array of masks
   * See {@link Roi.getAnalysisMasks} for the options
   * @param {object} [options]
   * @return {Image[]} Retuns an array of masks (1 bit Image)
   */
  getAnalysisMasks(options = {}) {
    const { analysisProperty } = options;
    let maskProperty = `${analysisProperty}Mask`;
    let rois = this.getRois(options);

    if (rois.length === 0 || !rois[0][maskProperty]) return [];
    return rois.map((roi) => roi[maskProperty]);
  }

  /**
   *
   * @param {object} [options]
   * @return {number[]}
   */
  getData(options = {}) {
    let opt = Object.assign({}, this._options, options);
    this._assertLayerWithLabel(opt.label);
    return this._layers[opt.label].roiMap.data;
  }

  /**
   * Paint the ROI on a copy of the image and return this image.
   * For painting options {@link Image.paintMasks}
   * For ROI selection options, see {@link RoiManager.getMasks}
   * @param {object} [options] - all the options to select ROIs
   * @param {string} [options.labelProperty] - Paint a mask property on the image.
   *                                  May be any property of the ROI like
   *                                  for example id, surface, width, height, meanX, meanY.
   * @param {number} [options.pixelSize] Size of a pixel in SI
   * @param {string} [options.unit="pixel"] Unit in which to display the values
   * @return {Image} - The painted RGBA 8 bits image
   */
  paint(options = {}) {
    let { labelProperty, analysisProperty } = options;

    if (!this._painted) {
      this._painted = this._image.rgba8();
    }
    let masks = this.getMasks(options);

    if (labelProperty) {
      const rois = this.getRois(options);
      options.labels = rois.map((roi) => deepValue(roi, labelProperty));
      const max = Math.max(...options.labels);

      let isSurface = false;
      let isDistance = false;
      if (labelProperty.includes('surface')) {
        isSurface = true;
      } else if (
        /(?:perimeter|min|max|external|width|height|length)/.test(labelProperty)
      ) {
        isDistance = true;
      }

      if (isFinite(max)) {
        let unitLabel = '';
        if (
          options.unit !== 'pixel' &&
          options.pixelSize &&
          (isDistance || isSurface)
        ) {
          unitLabel = isSurface ? `${options.unit}^2` : options.unit;
          let siLabel = isSurface ? 'm^2' : 'm';
          let factor = isSurface ? options.pixelSize ** 2 : options.pixelSize;
          const convert = Qty.swiftConverter(siLabel, unitLabel);
          options.labels = options.labels.map((value) => {
            return convert(factor * value);
          });
        }

        if (max > 50) {
          options.labels = options.labels.map(
            (number) => Math.round(number) + unitLabel,
          );
        } else if (max > 10) {
          options.labels = options.labels.map(
            (number) => number.toFixed(1) + unitLabel,
          );
        } else {
          options.labels = options.labels.map(
            (number) => number.toFixed(2) + unitLabel,
          );
        }
      }
      options.labelsPosition = rois.map((roi) => [roi.meanX, roi.meanY]);
    }

    this._painted.paintMasks(masks, options);

    if (analysisProperty) {
      let analysisMasks = this.getAnalysisMasks(options);

      this._painted.paintMasks(analysisMasks, {
        color: options.analysisColor,
        alpha: options.analysisAlpha,
      });
    }

    return this._painted;
  }

  // return a mask corresponding to all the selected masks
  getMask(options = {}) {
    let mask = new Image(this._image.width, this._image.height, {
      kind: 'BINARY',
    });
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
    const { image } = options;
    if (image) {
      this._painted = this.image.rgba8();
    } else {
      this._painted = this._image.rgba8();
    }
  }

  /**
   * In place modification of the roiMap that joins regions of interest
   * @param {object} [options]
   * @param {string|function(object,number,number)} [options.algorithm='commonBorderLength'] algorithm used to decide which ROIs are merged.
   *      Current implemented algorithms are 'commonBorderLength' that use the parameters
   *      'minCommonBorderLength' and 'maxCommonBorderLength' as well as 'commonBorderRatio' that uses
   *      the parameters 'minCommonBorderRatio' and 'maxCommonBorderRatio'.
   * @param {number} [options.minCommonBorderLength=5] minimal common number of pixels for merging
   * @param {number} [options.maxCommonBorderLength=100] maximal common number of pixels for merging
   * @param {number} [options.minCommonBorderRatio=0.3] minimal common border ratio for merging
   * @param {number} [options.maxCommonBorderRatio=1] maximal common border ratio for merging
   * @return {this}
   */
  mergeRoi(options = {}) {
    const roiMap = this.getMap(options);
    roiMap.mergeRoi(options);
    this.putMap(roiMap.data, options);
    return this;
  }

  /**
   * Merge multiple rois into one.
   * All rois in the provided array will be merged into the first one.
   * @param {Array<number>} roiIds - A list of Roi ids to merge
   * @param {object} [options]
   */
  mergeRois(roiIds, options = {}) {
    if (!Array.isArray(roiIds) || roiIds.some((id) => !Number.isInteger(id))) {
      throw new Error('Roi ids must be an array of integers');
    }
    if (roiIds.length < 2) {
      throw new Error('Roi ids must have at least two elements');
    }
    if (new Set(roiIds).size !== roiIds.length) {
      throw new Error('Roi ids must be all different');
    }
    // Throws if one of the ids is wrong
    roiIds.forEach((roiId) => this.getRoi(roiId));

    const roiMap = this.getMap(options);
    roiMap.mergeRois(roiIds);
    this.putMap(roiMap.data, options);
    return this;
  }

  /**
   * Finds all corresponding ROIs for all ROIs in the manager
   * @param {number[]} roiMap
   * @param {object} [options]
   * @return {Array} array of objects returned in correspondingRoisInformation
   */
  findCorrespondingRoi(roiMap, options = {}) {
    let allRois = this.getRois(options);
    let allRelated = [];
    for (let i = 0; i < allRois.length; i++) {
      let currentRoi = allRois[i];
      let x = currentRoi.minX;
      let y = currentRoi.minY;
      let allPoints = currentRoi.points;
      let roiSign = Math.sign(currentRoi.id);
      let currentRelated = correspondingRoisInformation(
        x,
        y,
        allPoints,
        roiMap,
        roiSign,
      );
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

/**
 * For a given ROI, find corresponding ROIs and properties in given ROIMap.
 * Returns an object containing the ID of ROIs, the surface shared by given and corresponding ROIs,
 * the percentage of given ROI surface covered by the corresponding ROI, the number of points with same and opposite signs,
 * the total number of points (same and opposite).
 * @param {number} x - minX value of ROI
 * @param {number} y - minY value of ROI
 * @param {Array<Array<number>>} points - points of ROI
 * @param {Array<number>} roiMap - roiMap from which we get the corresponding ROI
 * @param {number} roiSign - sign of ROI
 * @return {object} {{id: Array, surface: Array, roiSurfaceCovered: Array, same: number, opposite: number, total: number}}
 * @private
 */
function correspondingRoisInformation(x, y, points, roiMap, roiSign) {
  let correspondingRois = {
    id: [],
    surface: [],
    roiSurfaceCovered: [],
    same: 0,
    opposite: 0,
    total: 0,
  };
  for (let i = 0; i < points.length; i++) {
    let currentPoint = points[i];
    let currentX = currentPoint[0];
    let currentY = currentPoint[1];
    let correspondingRoiMapIndex = currentX + x + (currentY + y) * roiMap.width;
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
    correspondingRois.roiSurfaceCovered[i] =
      correspondingRois.surface[i] / points.length;
  }
  correspondingRois.total = correspondingRois.opposite + correspondingRois.same;

  return correspondingRois;
}
