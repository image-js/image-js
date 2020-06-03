/**
 * Converts a factor value to a number between 0 and 1
 * @private
 * @param {string|number} value
 * @return {number}
 */
export function getFactor(value) {
  if (typeof value === 'string') {
    const last = value[value.length - 1];
    value = parseFloat(value);
    if (last === '%') {
      value /= 100;
    }
  }
  return value;
}

/**
 * We can specify a threshold as "0.4", "40%" or 123
 * @private
 * @param {string|number} value
 * @param {number} maxValue
 * @return {number}
 */
export function getThreshold(value, maxValue) {
  if (!maxValue) {
    throw Error('getThreshold : the maxValue should be specified');
  }
  if (typeof value === 'string') {
    let last = value[value.length - 1];
    if (last !== '%') {
      throw Error(
        'getThreshold : if the value is a string it must finish by %',
      );
    }
    return (parseFloat(value) / 100) * maxValue;
  } else if (typeof value === 'number') {
    if (value < 1) {
      return value * maxValue;
    }
    return value;
  } else {
    throw Error('getThreshold : the value is not valid');
  }
}

export function factorDimensions(factor, width, height) {
  factor = getFactor(factor);
  let newWidth = Math.round(factor * width);
  let newHeight = Math.round(factor * height);

  if (newWidth <= 0) {
    newWidth = 1;
  }
  if (newHeight <= 0) {
    newHeight = 1;
  }
  return {
    width: newWidth,
    height: newHeight,
  };
}
