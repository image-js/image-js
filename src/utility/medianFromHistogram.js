export default function medianFromHistogram(histogram) {
    let total=histogram.reduce((sum, x) => sum + x);
    // 2 cases, odd or even number

    let position=0;
    let currentTotal=0;
    if (total & 1 === 1) { // odd number
        let middle=(total>>1)+1;
        while(true){
            currentTotal+=histogram[position];
            if (currentTotal>=middle) {
                return position;
            }
            position++;
        }
    } else { // even number
        if (total<1) return undefined
        let middlePlusOne=(total>>1)+1;
        let previous=0;
        while(true){
            if (histogram[position]>0) {
                currentTotal+=histogram[position];
                if (currentTotal===middlePlusOne) {
                    if (histogram[position]===1) {
                        return (previous + position) / 2;
                    } else {
                        return position;
                    }
                } else if (currentTotal>middlePlusOne) {
                    return position;
                }
                previous=position;
            }

            position++;
        }
    }
}

