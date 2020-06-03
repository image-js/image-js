import Roi from './Roi';

/**
 * A layer that is caracterised by a {@link RoiMap} and that will
 * generated automatically the corresponding ROI.
 * ROI should be a continuous
 * surface (it is not tested when it is not continous ...)
 * From the roiMap, the RoiLayer will create the corresponding
 * {@link ROI}.
 *
 * @class RoiLayer
 * @private
 * @param {Image} image
 * @param {object} [options]
 */
export default class RoiLayer {
  constructor(roiMap, options) {
    this.roiMap = roiMap;
    this.options = options;
    this.roi = this.createRoi();
  }

  /**
   * Roi are created from a roiMap
   * The roiMap contains mainty an array of identifiers that define
   * for each data to which Roi it belongs
   * @memberof RoiManager
   * @instance
   * @return {Roi[]}
   */
  createRoi() {
    // we need to find all all the different IDs there is in the data
    let data = this.roiMap.data;
    let mapIDs = {};
    this.roiMap.positive = 0;
    this.roiMap.negative = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i] && !mapIDs[data[i]]) {
        mapIDs[data[i]] = true;
        if (data[i] > 0) {
          this.roiMap.positive++;
        } else {
          this.roiMap.negative++;
        }
      }
    }

    let rois = {};

    for (let mapID in mapIDs) {
      rois[mapID] = new Roi(this.roiMap, mapID * 1);
    }
    let width = this.roiMap.width;
    let height = this.roiMap.height;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let target = y * width + x;
        if (data[target] !== 0) {
          const mapID = data[target];
          const roi = rois[mapID];
          if (x < roi.minX) {
            roi.minX = x;
          }
          if (x > roi.maxX) {
            roi.maxX = x;
          }
          if (y < roi.minY) {
            roi.minY = y;
          }
          if (y > roi.maxY) {
            roi.maxY = y;
          }
          roi.meanX += x;
          roi.meanY += y;
          roi.surface++;
        }
      }
    }
    let roiArray = [];
    for (let mapID in mapIDs) {
      rois[mapID].meanX /= rois[mapID].surface;
      rois[mapID].meanY /= rois[mapID].surface;
      roiArray.push(rois[mapID]);
    }

    return roiArray;
  }
}
