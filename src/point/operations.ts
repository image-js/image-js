import type { Point } from '../utils/geometry/points.js';

/**
 * Rotate a point around a center by a given angle.
 * @param point - The point to rotate
 * @param rotationCenter - The center of rotation
 * @param angle - The angle of rotation in radians
 * @returns The rotated point
 */
export function rotatePoint(
  point: Point,
  rotationCenter: Point,
  angle: number,
): Point {
  const angleCos = Math.cos(angle);
  const angleSin = Math.sin(angle);

  const column =
    point.column * angleCos -
    point.row * angleSin +
    (1 - angleCos) * rotationCenter.column +
    rotationCenter.row * angleSin;
  const row =
    point.column * angleSin +
    point.row * angleCos +
    (1 - angleCos) * rotationCenter.row -
    rotationCenter.column * angleSin;
  return { column, row };
}
