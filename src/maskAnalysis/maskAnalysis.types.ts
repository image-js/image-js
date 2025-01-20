import type { Point } from '../utils/geometry/points.js';

export interface FeretDiameter {
  /**
   * Start and end point of the Feret diameter.
   */
  points: Point[];
  /**
   * Length of the diameter.
   */
  length: number;
  /**
   * Angle between the diameter and a horizontal line in degrees.
   */
  angle: number;
  /**
   * Calliper lines that pass by endpoints of Feret diameters.
   */
  calliperLines: [[Point, Point], [Point, Point]];
}
export interface Feret {
  /**
   * Smaller Feret diameter.
   */
  minDiameter: FeretDiameter;
  /**
   * Bigger Feret diameter.
   */
  maxDiameter: FeretDiameter;
  /**
   * Ratio between the smaller and the bigger diameter.
   * Expresses how elongated the shape is. This is a value between 0 and 1.
   */
  aspectRatio: number;
}

/**
 * Minimum bounding rectangle of a mask.
 */
export interface Mbr {
  /**
   * Vertices of the MBR in clockwise order.
   */
  points: Point[];
  /**
   * Perimeter of the MBR.
   */
  perimeter: number;
  /**
   * Surface of the MBR.
   */
  surface: number;
  /**
   * Width of the rectangle.
   */
  width: number;
  /**
   * Height of the rectangle.
   */
  height: number;
  /**
   * Angle between the rectangle and a horizontal line in radians.
   */
  angle: number;
  /**
   * Ratio between width and height.
   */
  aspectRatio: number;
}

export interface GetBorderPointsOptions {
  /**
   * Should the inner borders be returned too?
   * @default `false`
   */
  innerBorders?: boolean;
  /**
   * Consider pixels connected by corners?
   * @default `false`
   */
  allowCorners?: boolean;
}

/**
 * Convex Hull polygon of a mask.
 */
export interface ConvexHull {
  /**
   * Vertices of the convex Hull in clockwise order.
   */
  points: Point[];
  /**
   * Perimeter of the convex Hull.
   */
  perimeter: number;
  /**
   * Surface of the convex Hull.
   */
  surface: number;
}
