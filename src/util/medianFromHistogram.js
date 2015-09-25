export default function medianFromHistogram(histogram) {
    let total = histogram.reduce((sum, x) => sum + x);

    if (total <= 0) return undefined;


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

