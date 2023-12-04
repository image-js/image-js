import { Point } from '../utils/geometry/points';

export interface Ellipse {
  center: {
    column: number;
    row: number;
  };
  majorAxis: { points: [Point, Point]; length: number; angle: number };

  minorAxis: { points: [Point, Point]; length: number; angle: number };
  surface: number;
}

export interface Border {
  /**
   * Refers  to the roiID of the contiguous ROI.
   */
  connectedID: number;
  /**
   * Length of the border with connectedID.
   */
  length: number;
}
