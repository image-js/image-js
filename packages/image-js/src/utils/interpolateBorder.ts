import { BorderType } from '../types';

export function interpolateBorder(
  point: number,
  length: number,
  type: BorderType
): number {
  if (point >= 0 && point < length) {
    return point;
  }
  if (type === BorderType.CONSTANT) {
    return -1;
  }
  if (point > 0 - length && point < length + length - 1) {
    if (type === BorderType.REPLICATE) {
      if (point < 0) {
        return 0;
      } else {
        return length - 1;
      }
    }
    if (type === BorderType.REFLECT) {
      if (point < 0) {
        return -1 - point;
      } else {
        return length + length - 1 - point;
      }
    }
    if (type === BorderType.WRAP) {
      if (point < 0) {
        return length + point;
      } else {
        return point - length;
      }
    }
    if (type === BorderType.REFLECT_101) {
      if (point < 0) {
        return 0 - point;
      } else {
        return length + length - 2 - point;
      }
    }
    throw new Error(
      `interpolateBorder cannot be used with border type ${type}`
    );
  } else {
    throw new RangeError(
      'interpolateBorder only supports borders smaller than the original image'
    );
  }
}
