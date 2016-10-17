/**
 * @private
 * Converts a factor value to a number between 0 and 1
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
 * @private
 * We can specify a threshold as "0.4", "40%" or 123
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
            throw Error('getThreshold : if the value is a string it must finish by %');
        }
        return parseFloat(value) / 100 * maxValue;
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
    return {
        width: Math.round(factor * width),
        height: Math.round(factor * height)
    };
}
