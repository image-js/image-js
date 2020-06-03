/**
 * The roiMap is an array of the size of the original image data that contains
 * positive and negative numbers. When the number is common, it corresponds
 * to one region of interest (ROI)
 *
 * @class RoiMap
 * @private
 */
import commonBorderLength from './util/commonBorderLength';
import mergeRoi from './util/mergeRoi';

export default class RoiMap {
  constructor(parent, data) {
    this.parent = parent;
    this.width = parent.width;
    this.height = parent.height;
    this.data = data;
    this.negative = 0;
    this.positive = 0;
  }

  get total() {
    return this.negative + this.positive;
  }

  get minMax() {
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] < min) min = this.data[i];
      if (this.data[i] > max) max = this.data[i];
    }
    return { min, max };
  }

  get commonBorderLength() {
    return commonBorderLength(this);
  }

  mergeRoi(options = {}) {
    return mergeRoi.call(this, options);
  }

  mergeRois(rois) {
    const first = rois[0];
    const others = rois.slice(1);
    for (let i = 0; i < this.data.length; i++) {
      if (others.includes(this.data[i])) {
        this.data[i] = first;
      }
    }
  }

  rowsInfo() {
    let rowsInfo = new Array(this.height);
    let currentRow = 0;
    for (let i = 0; i < this.data.length; i += this.width) {
      let info = {
        row: currentRow,
        positivePixel: 0,
        negativePixel: 0,
        zeroPixel: 0,
        positiveRoi: 0,
        negativeRoi: 0,
        medianChange: 0,
      };
      rowsInfo[currentRow++] = info;
      let positives = {};
      let negatives = {};
      let changes = [];
      let previous = this.data[i];
      let current = 0;
      for (let j = i; j < i + this.width; j++) {
        let value = this.data[j];
        if (previous !== value) {
          previous = value;
          changes.push(current);
          current = 0;
        }
        current++;
        if (value > 0) {
          info.positivePixel++;
          if (!positives[value]) {
            positives[value] = true;
          }
        } else if (value < 0) {
          info.negativePixel++;
          if (!negatives[value]) {
            negatives[value] = true;
          }
        } else {
          info.zeroPixel++;
        }
      }
      changes.push(current);
      // TODO use median package
      info.medianChange = changes.sort((a, b) => a - b)[
        Math.floor(changes.length / 2)
      ];
      info.positiveRoiIDs = Object.keys(positives);
      info.negativeRoiIDs = Object.keys(negatives);
      info.positiveRoi = info.positiveRoiIDs.length;
      info.negativeRoi = info.negativeRoiIDs.length;
    }
    return rowsInfo;
  }

  colsInfo() {
    let colsInfo = new Array(this.width);
    let currentCol = 0;
    for (let i = 0; i < this.width; i++) {
      let info = {
        col: currentCol,
        positivePixel: 0,
        negativePixel: 0,
        zeroPixel: 0,
        positiveRoi: 0,
        negativeRoi: 0,
        medianChange: 0,
      };
      colsInfo[currentCol++] = info;
      let positives = {};
      let negatives = {};
      let changes = [];
      let previous = this.data[i];
      let current = 0;
      for (let j = i; j < i + this.data.length; j += this.width) {
        let value = this.data[j];
        if (previous !== value) {
          previous = value;
          changes.push(current);
          current = 0;
        }
        current++;
        if (value > 0) {
          info.positivePixel++;
          if (!positives[value]) {
            positives[value] = true;
          }
        } else if (value < 0) {
          info.negativePixel++;
          if (!negatives[value]) {
            negatives[value] = true;
          }
        } else {
          info.zeroPixel++;
        }
      }
      changes.push(current);
      // TODO use median package
      info.medianChange = changes.sort((a, b) => a - b)[
        Math.floor(changes.length / 2)
      ];
      info.positiveRoiIDs = Object.keys(positives);
      info.negativeRoiIDs = Object.keys(negatives);
      info.positiveRoi = info.positiveRoiIDs.length;
      info.negativeRoi = info.negativeRoiIDs.length;
    }
    return colsInfo;
  }
}
