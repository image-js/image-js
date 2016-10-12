/**
 * Returns the median of an histogram
 * @param histogram
 * @returns {number}
 * @private
 */
export function median(histogram) {
    let total = histogram.reduce((sum, x) => sum + x);

    if (total <= 0) {
        return;
    }

    let position = 0;
    let currentTotal = 0;
    let middle = total / 2;
    let previous;

    while (true) {
        if (histogram[position] > 0) {
            if (previous !== undefined) {
                return (previous + position) / 2;
            }
            currentTotal += histogram[position];
            if (currentTotal > middle) {
                return position;
            } else if (currentTotal === middle) {
                previous = position;
            }
        }
        position++;
    }
}

/**
 * Retuns the mean of an histogram
 * @param histogram
 * @returns {number}
 * @private
 */
export function mean(histogram) {
    let total = 0;
    let sum = 0;

    for (let i = 0; i < histogram.length; i++) {
        total += histogram[i];
        sum += histogram[i] * i;
    }

    if (total <= 0) {
        return;
    }

    return sum / total;
}

