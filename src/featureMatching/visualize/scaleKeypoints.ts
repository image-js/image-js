import { FastKeypoint } from '../keypoints/getFastKeypoints';

/**
 *
 * @param keypoints
 * @param scale
 */
export function scaleKeypoints(
  keypoints: FastKeypoint[],
  scale: number,
): FastKeypoint[] {
  return keypoints.map((kpt) => {
    return {
      origin: {
        row: kpt.origin.row * scale,
        column: kpt.origin.column * scale,
      },
      score: kpt.score,
    };
  });
}
