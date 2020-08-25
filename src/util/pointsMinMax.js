export default function pointsMinMax(points) {
  let result = {
    minX: Number.MAX_SAFE_INTEGER,
    maxX: Number.MIN_SAFE_INTEGER,
    minY: Number.MAX_SAFE_INTEGER,
    maxY: Number.MIN_SAFE_INTEGER,
  };
  for (let point of points) {
    let x = Math.round(point[0]);
    let y = Math.round(point[1]);
    if (x < result.minX) result.minX = x;
    if (x > result.maxX) result.maxX = x;
    if (y < result.minY) result.minY = y;
    if (y > result.maxY) result.maxY = y;
  }
  return result;
}
