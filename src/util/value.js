import isArray from 'is-array-type';

import Image from '../image/Image';

export function checkNumberArray(value) {
  if (!isNaN(value)) {
    if (value <= 0) {
      throw new Error('checkNumberArray: the value must be greater than 0');
    }
    return value;
  } else {
    if (value instanceof Image) {
      return value.data;
    }
    if (!isArray(value)) {
      throw new Error('checkNumberArray: the value should be either a number, array or Image');
    }
    return value;
  }
}

